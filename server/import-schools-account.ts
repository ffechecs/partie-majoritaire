import { db } from "./src/db/db";

import { parse } from "papaparse";

const csvPath = "./schools.csv";

import { readFileSync } from "fs";
import { TableUser, UserInsert } from "./src/db/schema/auth";

const content = readFileSync(csvPath, "utf8");

const { data, errors, meta } = parse(content, { header: true });
if (errors.length) {
  console.log(errors);
}

interface CsvRow {
  "Souhaitez-vous participer au Défi Marc Llari 2024": string;
  Prénom: string;
  "Nom de famille": string;
  "Numéro de téléphone": string;
  "Adresse Mail": string;
  "Nom de l'école": string;
  "Code Postal": string;
  "Participez-vous encore au programme Class'Échecs ?": string;
  "Souhaitez-vous toujours recevoir des communications de la FFE au sujet de Class'échecs ?": string;
}
const rows: CsvRow[] = data as any[];

console.log(data);

const users: UserInsert[] = rows.map((row) => {
  const uuid = crypto.randomUUID();
  const data: UserInsert = {
    id: uuid,
    role: "user",
    email: row["Adresse Mail"],
    emailVerified: false,
    userInfo: {
      username: row["Prénom"] + " " + row["Nom de famille"],
      isSchool: true,
      schoolName: row["Nom de l'école"],
      schoolZipCode: row["Code Postal"],
    },
  };
  return data;
});

await db.insert(TableUser).values(users).run();
