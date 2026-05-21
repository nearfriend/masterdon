import readline from "readline";
import {
  completeOAuthWithCode,
  getAuthorizationUrl,
  loadOrRegisterApp,
} from "../mastodon/auth";
import { TMP_DIR } from "../config/env";
import path from "path";

const APP_FILE = path.join(TMP_DIR, "mastodon_app.json");

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const app = await loadOrRegisterApp();
  const url = getAuthorizationUrl(app.client_id);

  console.log("\nMastodon one-time authorization\n");
  console.log("1. Open this URL in a browser (logged into your Mastodon account):\n");
  console.log(url);
  console.log("\n2. Approve the application and copy the authorization code shown.\n");

  const code = await prompt("Authorization code: ");
  if (!code) {
    console.error("No code entered.");
    process.exit(1);
  }

  await completeOAuthWithCode(code);
  console.log(`\nSuccess. Access token saved to ${APP_FILE}`);
  console.log("You can start the bot with: npm run dev\n");
}

main().catch((err) => {
  const data = err.response?.data;
  console.error(data ? JSON.stringify(data, null, 2) : err.message);
  process.exit(1);
});
