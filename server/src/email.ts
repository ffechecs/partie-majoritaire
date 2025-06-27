const SENDER_EMAIL = "developpement@ffechecs.fr";
const SENDER_NAME = "Fédération Française des Échecs";

export async function sendEmail(email: string, code: string) {
  if (process.env.NODE_ENV !== "production") {
    console.log("sendEmail", email, code);
    return;
  }

  const response: Response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY!,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: SENDER_NAME,
        email: SENDER_EMAIL,
      },
      // headers: {
      //   "X-Sib-Sandbox": "drop",
      // },
      to: [
        {
          email: email,
          name: email,
        },
      ],
      htmlContent: `
<!DOCTYPE html>
<html>
  <body>
    <img width="200" src="https://pm.ffechecs.fr/ffe-logo-color.png" />
    <h1>Code d'activation</h1>
    <p>Veuillez entrer le code suivant pour vous connecter à votre compte</p>
    <p style="font-size: 24px">Code : <strong>${code}</strong></p>
  </body>
</html>
      `.trim(),
      subject: "FFE Partie Majoritaire - Code de connexion",
    }),
  });

  if (!response.ok) {
    throw new Error(`Error sending email: ${response.status} - ${response.body}`);
  }
}
