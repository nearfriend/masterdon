import { getMasto } from "../mastodon/client";
import { openai } from "../ai/openai";
import { replyTo } from "../mastodon/reply";
import { shouldReply } from "../filters/antiSpam";

export async function engage() {
  const masto = await getMasto();
  const res = await masto.v1.notifications.list();

  for (const n of res) {
    if (n.type !== "mention") continue;
    if (!shouldReply(n)) continue;

    const reply = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are a professional developer replying casually.

Rules:
- No long explanations
- No article format
- Natural, human tone
- Slightly opinionated
          `,
        },
        {
          role: "user",
          content: n.status.content,
        },
      ],
    });

    await replyTo(n.status.id, reply.choices[0].message.content!);
  }
}