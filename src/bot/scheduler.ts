import cron from "node-cron";
import { publishArticle } from "./publisher";
import { engage } from "./engager";

export async function startBot() {
  // 2–3 posts per day (not fixed intervals)
  cron.schedule("*/4 * * * *", async () => {
    await publishArticle();
  });

  // engagement loop
  // cron.schedule("*/5 * * * *", async () => {
  //   await engage();
  // });

}