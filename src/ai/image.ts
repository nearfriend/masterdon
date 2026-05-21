import OpenAI from "openai";
import fs from "fs";
import { TMP_DIR, OPENAI_API_KEY } from "../config/env";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function generateImage(prompt: string) {
  const res = await client.images.generate({
    model: "gpt-image-1",
    prompt: `Modern tech illustration: ${prompt}`,
    size: "1024x1024",
  });

  const b64 = res.data && res.data[0] && (res.data[0] as any).b64_json;
  if (!b64) throw new Error("Image generation failed: no data returned");

  const buffer = Buffer.from(b64, "base64");

  const dir = TMP_DIR || "./tmp";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = `${dir}/${Date.now()}.png`;
  fs.writeFileSync(filePath, buffer);

  return filePath;
}