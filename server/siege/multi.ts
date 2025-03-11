import { edenTreaty } from "@elysiajs/eden";
import { App } from "../src/index";
import { Chess, Move } from "chess.js";
import { addPlayer } from "../src/methods";

const api = edenTreaty<App>("http://localhost:3001");
// const api = edenTreaty<App>("https://api.pm.ffechecs.fr");

type BestMoves = {
  move: string;
  score: number;
}[];

const cache = new Map<string, BestMoves>();

async function getBestMoves(fen: string) {
  if (cache.has(fen)) {
    return cache.get(fen)!;
  }

  const res = await fetch("http://127.0.0.1:8000/get_best_moves/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fen,
      depth: 10,
      multipv: 10,
    }),
  });
  const data: any = await res.json();
  const bestMoves = data["best_moves"] as BestMoves;

  cache.set(fen, bestMoves);
  return bestMoves;
}
async function selectNextMove(fen: string) {
  const moves = await getBestMoves(fen);
  if (moves.length === 0) {
    throw new Error("No moves available");
  }

  // Calculate cumulative probabilities
  const cumulativeProbabilities = [];
  let cumulativeSum = 0;
  for (let i = 0; i < moves.length; i++) {
    cumulativeSum += 1 / (i + 2); // Probability decreases as 1/2, 1/3, 1/4, etc.
    cumulativeProbabilities.push(cumulativeSum);
  }

  // Normalize cumulative probabilities to sum to 1
  const totalSum = cumulativeProbabilities[cumulativeProbabilities.length - 1]!;
  for (let i = 0; i < cumulativeProbabilities.length; i++) {
    cumulativeProbabilities[i] /= totalSum;
  }

  // Select a move based on the calculated probabilities
  const randomValue = Math.random();
  for (let i = 0; i < cumulativeProbabilities.length; i++) {
    if (randomValue < cumulativeProbabilities[i]!) {
      return moves[i]!.move;
    }
  }

  // Fallback in case of rounding errors
  return moves[moves.length - 1]!.move;
}

const majorityIds = [
  {
    id: "bc92581b-b6da-4920-9b07-c90261474ea8",
    name: "AUTOMATED TEST 0",
    createdAt: "2024-06-16T14:29:00.575Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "213b3e5f-9844-4292-bf69-2ee4519643ae",
    name: "AUTOMATED TEST 1",
    createdAt: "2024-06-16T14:29:00.768Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "bef650c9-5bd6-4293-bdae-a94ade51e8e2",
    name: "AUTOMATED TEST 2",
    createdAt: "2024-06-16T14:29:00.790Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "e037556a-662d-4199-b3a5-0bfc16fb4ca7",
    name: "AUTOMATED TEST 3",
    createdAt: "2024-06-16T14:29:00.812Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "3e1d056c-d482-446c-a37a-dcb09b5ea1b9",
    name: "AUTOMATED TEST 4",
    createdAt: "2024-06-16T14:29:00.837Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "1bd2ccd6-3e11-4210-a89f-6edddd1cca01",
    name: "AUTOMATED TEST 5",
    createdAt: "2024-06-16T14:29:00.859Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "e7efa651-0337-4a8b-a45a-86d0a50860d9",
    name: "AUTOMATED TEST 6",
    createdAt: "2024-06-16T14:29:00.881Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "6de015e0-fc2a-406c-999a-973c3cbbc3c0",
    name: "AUTOMATED TEST 7",
    createdAt: "2024-06-16T14:29:00.902Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "3ac84e80-8021-4f18-89ff-61d1ea66db43",
    name: "AUTOMATED TEST 8",
    createdAt: "2024-06-16T14:29:00.923Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "2a292c97-bb6c-4dbb-bcc8-6f5a28377cf0",
    name: "AUTOMATED TEST 9",
    createdAt: "2024-06-16T14:29:00.943Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "e2aa4fb1-53cc-4534-a04d-a7972ed9e89f",
    name: "AUTOMATED TEST 10",
    createdAt: "2024-06-16T14:29:00.961Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "5d6c84fc-c404-425f-a061-902582945bbb",
    name: "AUTOMATED TEST 11",
    createdAt: "2024-06-16T14:29:00.983Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "92a02c14-0cc1-44c2-906f-13c25ab78728",
    name: "AUTOMATED TEST 12",
    createdAt: "2024-06-16T14:29:01.003Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "ffd09a8a-9e38-46ba-bde9-779280e6fbe1",
    name: "AUTOMATED TEST 13",
    createdAt: "2024-06-16T14:29:01.026Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "3404bc6b-24f3-4f04-ad46-66a9b84060fc",
    name: "AUTOMATED TEST 14",
    createdAt: "2024-06-16T14:29:01.052Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "ddddd1d8-0213-485d-b2cf-b53ae44bb1de",
    name: "AUTOMATED TEST 15",
    createdAt: "2024-06-16T14:29:01.075Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "cd3360c9-8c18-48d7-921e-5bddbfb9c9a9",
    name: "AUTOMATED TEST 16",
    createdAt: "2024-06-16T14:29:01.095Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "141bf720-3e4a-4741-a162-f0a8324bf5ad",
    name: "AUTOMATED TEST 17",
    createdAt: "2024-06-16T14:29:01.123Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "db965fe9-d64f-41a7-8b3c-1fe8b92546ff",
    name: "AUTOMATED TEST 18",
    createdAt: "2024-06-16T14:29:01.146Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "61d1ad41-42a3-48b9-a11d-aa378486baf6",
    name: "AUTOMATED TEST 19",
    createdAt: "2024-06-16T14:29:01.172Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "ada8be07-75b6-42bb-80c2-c3321558d020",
    name: "AUTOMATED TEST 20",
    createdAt: "2024-06-16T14:29:01.193Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "6f60dee2-845b-4b41-8c4b-ca08638a8800",
    name: "AUTOMATED TEST 21",
    createdAt: "2024-06-16T14:29:01.215Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "d1a92544-3157-4a3e-b272-357d71a9257d",
    name: "AUTOMATED TEST 22",
    createdAt: "2024-06-16T14:29:01.240Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "417a3f9b-2b29-45c7-a52b-5b5bf4e7245d",
    name: "AUTOMATED TEST 23",
    createdAt: "2024-06-16T14:29:01.260Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "31ba9059-64bd-4316-bdd7-baa2323e3068",
    name: "AUTOMATED TEST 24",
    createdAt: "2024-06-16T14:29:01.279Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "bd4a1a1a-872e-4aec-8329-aeb006c52c93",
    name: "AUTOMATED TEST 25",
    createdAt: "2024-06-16T14:29:01.300Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "47787b87-c958-4f30-9bfc-48b89d57b399",
    name: "AUTOMATED TEST 26",
    createdAt: "2024-06-16T14:29:01.323Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "d99f26c0-9404-4f3f-9d4d-9edca84d7bd0",
    name: "AUTOMATED TEST 27",
    createdAt: "2024-06-16T14:29:01.344Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "0d31facc-8fd1-4232-96dd-37feacd6d0de",
    name: "AUTOMATED TEST 28",
    createdAt: "2024-06-16T14:29:01.368Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "4b8e29f7-6354-4d48-b934-a19e1e7e0e9e",
    name: "AUTOMATED TEST 29",
    createdAt: "2024-06-16T14:29:01.390Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "8bd3be8c-08b7-4240-8372-38e3d49724bb",
    name: "AUTOMATED TEST 30",
    createdAt: "2024-06-16T14:29:01.410Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "71fe082e-ff9e-4248-852e-a8a72dd6d2f9",
    name: "AUTOMATED TEST 31",
    createdAt: "2024-06-16T14:29:01.435Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "c14dbc6f-5721-4b9a-92b5-d3f183fc01b6",
    name: "AUTOMATED TEST 32",
    createdAt: "2024-06-16T14:29:01.458Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "7b25abd6-301f-4519-aefe-3f2a20a92afe",
    name: "AUTOMATED TEST 33",
    createdAt: "2024-06-16T14:29:01.482Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "9251ba72-c0a1-49ff-84d1-e8309cac3b5e",
    name: "AUTOMATED TEST 34",
    createdAt: "2024-06-16T14:29:01.508Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "da2e3a75-78fc-4835-8ce0-e29efaead3b8",
    name: "AUTOMATED TEST 35",
    createdAt: "2024-06-16T14:29:01.533Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "4dfeb9ee-3037-44ee-8dc3-44239b64511e",
    name: "AUTOMATED TEST 36",
    createdAt: "2024-06-16T14:29:01.558Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "fb8b45bb-88e0-493a-b6c0-4fa43c5b184c",
    name: "AUTOMATED TEST 37",
    createdAt: "2024-06-16T14:29:01.582Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "98e64b1a-fe77-4948-939d-cbdb4f0a357e",
    name: "AUTOMATED TEST 38",
    createdAt: "2024-06-16T14:29:01.603Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "db9070d3-ac8b-46f7-84d8-d874951bdb80",
    name: "AUTOMATED TEST 39",
    createdAt: "2024-06-16T14:29:01.624Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "3df79331-4c21-4f4a-8223-eb6622833396",
    name: "AUTOMATED TEST 40",
    createdAt: "2024-06-16T14:29:01.645Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "89efc7d5-4883-4acf-94c1-5a237dabdf5f",
    name: "AUTOMATED TEST 41",
    createdAt: "2024-06-16T14:29:01.668Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "230e5726-0633-4329-96f1-c6f5542a6367",
    name: "AUTOMATED TEST 42",
    createdAt: "2024-06-16T14:29:01.689Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "d4531140-627e-4aac-be65-8dcca720d3d2",
    name: "AUTOMATED TEST 43",
    createdAt: "2024-06-16T14:29:01.708Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "e360f1d2-ab58-41c1-8905-3caf031c5fc1",
    name: "AUTOMATED TEST 44",
    createdAt: "2024-06-16T14:29:01.728Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "ea627eb3-d3e3-45b0-8065-6466d5e7661b",
    name: "AUTOMATED TEST 45",
    createdAt: "2024-06-16T14:29:01.747Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "ef50ab75-7783-49cc-8353-ec145ed1f308",
    name: "AUTOMATED TEST 46",
    createdAt: "2024-06-16T14:29:01.771Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "6c0ccf7e-2c4f-4a58-9ec2-7c2d2bbd299a",
    name: "AUTOMATED TEST 47",
    createdAt: "2024-06-16T14:29:01.800Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "26f92600-a222-4493-b72b-38ed9c13dd6e",
    name: "AUTOMATED TEST 48",
    createdAt: "2024-06-16T14:29:01.823Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "509ccf26-2a0d-43b5-b8bb-080c7850c973",
    name: "AUTOMATED TEST 49",
    createdAt: "2024-06-16T14:29:01.844Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "f5537766-10b8-4a55-9d67-d97e53b7c2f9",
    name: "AUTOMATED TEST 50",
    createdAt: "2024-06-16T14:29:01.869Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "1a65db60-fca2-4940-94fe-9ac958753ffa",
    name: "AUTOMATED TEST 51",
    createdAt: "2024-06-16T14:29:01.889Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "a1c1db14-5aaa-4dfe-8e14-812106ddeecf",
    name: "AUTOMATED TEST 52",
    createdAt: "2024-06-16T14:29:01.908Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "9f6b07ac-156a-4020-8a81-1e056ce3eade",
    name: "AUTOMATED TEST 53",
    createdAt: "2024-06-16T14:29:01.928Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "87569fc2-b8e0-407c-9c29-1bb0f3974656",
    name: "AUTOMATED TEST 54",
    createdAt: "2024-06-16T14:29:01.958Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "69841ea8-d1b4-414a-830f-10079de3c0e8",
    name: "AUTOMATED TEST 55",
    createdAt: "2024-06-16T14:29:01.979Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "99cf2bb6-ca34-4711-99f1-4e93bc2a9465",
    name: "AUTOMATED TEST 56",
    createdAt: "2024-06-16T14:29:02.001Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "e11fd3dd-5466-4d4c-9420-c70709c3a5b7",
    name: "AUTOMATED TEST 57",
    createdAt: "2024-06-16T14:29:02.023Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "891213c1-97dc-4ee4-ab2a-1063301d41aa",
    name: "AUTOMATED TEST 58",
    createdAt: "2024-06-16T14:29:02.096Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "6e0871c9-b60a-49b8-905d-b1ea07d22d78",
    name: "AUTOMATED TEST 59",
    createdAt: "2024-06-16T14:29:02.129Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "ef17557e-9bda-4bd7-88df-b52c652f7708",
    name: "AUTOMATED TEST 60",
    createdAt: "2024-06-16T14:29:02.152Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "58e103f1-62b5-4c02-b36f-b03c3fbe27d1",
    name: "AUTOMATED TEST 61",
    createdAt: "2024-06-16T14:29:02.175Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "f75406fb-b98c-419f-8f1a-5796e07283e4",
    name: "AUTOMATED TEST 62",
    createdAt: "2024-06-16T14:29:02.202Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "a8e5b7d6-19a3-4474-bcbf-d0104f8c066c",
    name: "AUTOMATED TEST 63",
    createdAt: "2024-06-16T14:29:02.221Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "984a2184-ca4f-441f-b9ea-315651d38748",
    name: "AUTOMATED TEST 64",
    createdAt: "2024-06-16T14:29:02.243Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "d8c0e218-f050-4668-84fa-0fcbf2cc0bee",
    name: "AUTOMATED TEST 65",
    createdAt: "2024-06-16T14:29:02.270Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "35e9f00b-4c3d-499e-9a29-0c0cfaa6d599",
    name: "AUTOMATED TEST 66",
    createdAt: "2024-06-16T14:29:02.293Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "b8c52369-ef22-488f-acd1-5ce260bb7623",
    name: "AUTOMATED TEST 67",
    createdAt: "2024-06-16T14:29:02.315Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "ad13c6ec-b641-421d-b137-d0793e3e50b5",
    name: "AUTOMATED TEST 68",
    createdAt: "2024-06-16T14:29:02.335Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "64178cdd-16a5-4e37-853a-fe3de2d00147",
    name: "AUTOMATED TEST 69",
    createdAt: "2024-06-16T14:29:02.359Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "9d7418b4-623e-4ab6-a45c-77db01da3c16",
    name: "AUTOMATED TEST 70",
    createdAt: "2024-06-16T14:29:02.382Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "ad45e140-b724-47fd-ae32-5bdf1741da09",
    name: "AUTOMATED TEST 71",
    createdAt: "2024-06-16T14:29:02.402Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "c2bb65d7-fa13-4404-9037-b4621c25dc58",
    name: "AUTOMATED TEST 72",
    createdAt: "2024-06-16T14:29:02.423Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "b6325448-e6ee-4d9c-94b5-41ca998e2e9c",
    name: "AUTOMATED TEST 73",
    createdAt: "2024-06-16T14:29:02.443Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "7e1abb92-26e0-4eae-9a07-4520c97dc9bd",
    name: "AUTOMATED TEST 74",
    createdAt: "2024-06-16T14:29:02.475Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "186b8e7b-22b0-47cb-8d62-e5952587b2f9",
    name: "AUTOMATED TEST 75",
    createdAt: "2024-06-16T14:29:02.495Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "4fbbc477-b972-4b28-ae38-2c76ea67cd24",
    name: "AUTOMATED TEST 76",
    createdAt: "2024-06-16T14:29:02.519Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "66a1247c-39aa-4d44-af25-444fa6ed629f",
    name: "AUTOMATED TEST 77",
    createdAt: "2024-06-16T14:29:02.541Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "a691da79-ac00-4017-89d7-c6924778718b",
    name: "AUTOMATED TEST 78",
    createdAt: "2024-06-16T14:29:02.561Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "9acc7144-cb2b-436a-b698-54c96ec885b7",
    name: "AUTOMATED TEST 79",
    createdAt: "2024-06-16T14:29:02.584Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "963671c6-bf4d-43cc-8842-31a481b89ebe",
    name: "AUTOMATED TEST 80",
    createdAt: "2024-06-16T14:29:02.616Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "f57a5be6-03ca-41af-8d95-f81077bf5bd3",
    name: "AUTOMATED TEST 81",
    createdAt: "2024-06-16T14:29:02.639Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "91efb959-92b3-42ea-8ef5-e2e1c3526400",
    name: "AUTOMATED TEST 82",
    createdAt: "2024-06-16T14:29:02.660Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "9f5e4750-a869-44be-9828-0f128f7c3a51",
    name: "AUTOMATED TEST 83",
    createdAt: "2024-06-16T14:29:02.684Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "f4b1f7bb-3265-4a99-8a59-b29212905827",
    name: "AUTOMATED TEST 84",
    createdAt: "2024-06-16T14:29:02.708Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "64bbe724-0293-4791-8782-29f924251242",
    name: "AUTOMATED TEST 85",
    createdAt: "2024-06-16T14:29:02.733Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "7cb20f12-a09f-49a6-8274-c05c581fb25c",
    name: "AUTOMATED TEST 86",
    createdAt: "2024-06-16T14:29:02.758Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "3cdf7367-0f8f-4ec5-88ba-2cb13c6fa0c1",
    name: "AUTOMATED TEST 87",
    createdAt: "2024-06-16T14:29:02.786Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "e135fc53-494b-43ba-b7ee-820245421514",
    name: "AUTOMATED TEST 88",
    createdAt: "2024-06-16T14:29:02.808Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "3a447322-3146-43a0-8f92-7bbd94d540d5",
    name: "AUTOMATED TEST 89",
    createdAt: "2024-06-16T14:29:02.828Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "c76c7ffd-f0c7-4204-b231-2f97492771c6",
    name: "AUTOMATED TEST 90",
    createdAt: "2024-06-16T14:29:02.849Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "3fed295d-c97c-437f-ab3d-1644c26da11d",
    name: "AUTOMATED TEST 91",
    createdAt: "2024-06-16T14:29:02.884Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "7d47b822-a960-4bb0-8f41-3a9cb38d8806",
    name: "AUTOMATED TEST 92",
    createdAt: "2024-06-16T14:29:02.904Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "7a0b5631-7c71-4ed0-9baa-de2745ce0f3c",
    name: "AUTOMATED TEST 93",
    createdAt: "2024-06-16T14:29:02.937Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "c2ad6256-27cd-416a-bd3c-8e1ad2d5d831",
    name: "AUTOMATED TEST 94",
    createdAt: "2024-06-16T14:29:02.963Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "f8bff9a9-8b2d-44d5-9e04-61ecabe4d74f",
    name: "AUTOMATED TEST 95",
    createdAt: "2024-06-16T14:29:02.989Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "d7ef0f13-f0e0-4c83-9067-edcbd74d483f",
    name: "AUTOMATED TEST 96",
    createdAt: "2024-06-16T14:29:03.011Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "44e42071-c62a-470a-abee-667674d59980",
    name: "AUTOMATED TEST 97",
    createdAt: "2024-06-16T14:29:03.034Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "2f386a58-bd97-4540-b60c-14e7aad375b0",
    name: "AUTOMATED TEST 98",
    createdAt: "2024-06-16T14:29:03.055Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
  {
    id: "24da9cf2-8457-4fd3-bb18-8edf9c1f8893",
    name: "AUTOMATED TEST 99",
    createdAt: "2024-06-16T14:29:03.080Z",
    userId: "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed",
  },
];

type EdenAppSubscription = ReturnType<(typeof api)["ws"]["subscribe"]>;
type WsBodyResType = App["_routes"]["ws"]["subscribe"]["body"];
type WsBodyReqType = App["_routes"]["ws"]["subscribe"]["response"];

const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createGame() {
  const res = await api.games.post({
    name: "AUTOMATED TEST",
    settings: {
      challengerColor: "white",
      challengerTime: 10,
      majorityTime: 10,
      isGameForSchools: false,
    },
  });
  if (res.error || !res.data) throw new Error(res.error?.message);
  return res.data;
}

function handleChallenger({ gameId }: { gameId: string }) {
  const ws = api.ws.subscribe({
    $query: {
      gameId,
      playerId: "undefined",
    },
  });

  ws.on("open", () => {
    console.log(`open: challenger`);
  });

  ws.on("close", () => {
    console.log("close");
  });

  ws.on("error", () => {
    console.log("error");
  });

  ws.on("message", ({ data }) => {
    const message = data as WsBodyReqType;
    console.log("message", message.type);
    if (message.type === "connect") {
      console.log(message.data);
    } else if (message.type === "gameOver") {
      ws.close();
    } else if (message.type === "move") {
      console.log(message.move);
    }
  });
}

function handleMajority({
  gameId,
  playerId,
}: {
  gameId: string;
  playerId: string;
}) {
  const playerColor = "black";
  if (!playerId) {
    throw new Error("playerId is undefined");
  }

  const ws: EdenAppSubscription = api.ws.subscribe({
    $query: {
      gameId,
      playerId,
    },
  });

  function mySend(data: WsBodyResType) {
    ws.send(data);
  }

  const currentGameState = {
    fen: startFen,
    moveNumber: 0,
  };

  async function voteNextMove() {
    const chess = new Chess(currentGameState.fen);
    if (chess.isGameOver()) {
      console.log("game over");
      return;
    }
    // const possibleMoves = chess.moves({ verbose: true });

    // const isMoveOfLength2Possible = possibleMoves.some(
    //   (move) => move.san.length === 2
    // );

    // const filtered = isMoveOfLength2Possible
    //   ? possibleMoves.filter((move) => move.san.length === 2)
    //   : possibleMoves;

    // // random
    // const move: Move = filtered[Math.floor(Math.random() * filtered.length)]!;

    // chess.move(move);
    // console.log("vote for move", move);

    const nextMove = await selectNextMove(currentGameState.fen);
    const move = chess.move(nextMove);

    mySend({
      type: "vote",
      data: {
        color: playerColor,
        fen: chess.fen(),
        endSquare: move.to,
        startSquare: move.from,
        gameId,
        moveNumber: currentGameState.moveNumber + 1,
        moveSan: move.san,
        playerId: playerId!,
      },
    });
  }

  ws.on("open", () => {
    console.log(`open: majority (${playerId})`);
  });

  ws.on("close", () => {
    console.log("close");
  });

  ws.on("error", () => {
    console.log("error");
  });

  ws.on("message", async ({ data }) => {
    const message = data as WsBodyReqType;
    console.log("message", message.type);
    if (message.type === "connect") {
      console.log(message.data);
    } else if (message.type === "gameOver") {
      ws.close();
    } else if (message.type === "move") {
      console.log("received move", message.move.moveSan);
      currentGameState.moveNumber = message.move.moveNumber;
      currentGameState.fen = message.move.fen;

      if (message.move.color != playerColor) {
        // vote with a delay between 1s and 11s
        const delay = Math.random() * 10 + 1;
        await sleep(delay * 1000);
        await voteNextMove();
      }
    }
  });
}

async function main() {
  const automatedUserId = "4d6467ae-8ed1-4eaf-84c5-9ecaed3f07ed";
  const players = [];

  // const NUMBER_OF_PLAYERS_TO_CREATE = 100;
  // for (let i = 0; i < NUMBER_OF_PLAYERS_TO_CREATE; i++) {
  //   const player = await addPlayer({
  //     name: `AUTOMATED TEST ${i}`,
  //     userId: automatedUserId,
  //   });
  //   players.push(player);
  // }
  // console.log(JSON.stringify(players, null, 2));

  const gameId = "e0b4b445-777d-4c75-8538-29e57bb511ff";
  const game = {
    id: gameId,
  };

  // const game = await createGame();
  console.log("game", game);
  // const challengerUrl = `http://localhost:3000/game/${game.id}/challenger`;
  const challengerUrl = `https://pm.ffechecs.fr/game/${game.id}/challenger`;
  console.log("challengerUrl", challengerUrl);

  const NUMBER_OF_MAJORITY_PLAYERS = majorityIds.length;
  console.log("NUMBER_OF_MAJORITY_PLAYERS", NUMBER_OF_MAJORITY_PLAYERS);
  await sleep(5 * 1000);

  for (const playerId of majorityIds.slice(0, NUMBER_OF_MAJORITY_PLAYERS)) {
    handleMajority({ gameId: game.id, playerId: playerId.id });
  }
}
// for (let i = 0; i < 100; i++) {
//   await selectNextMove(startFen).then((move) => console.log(move));
// }

main();
