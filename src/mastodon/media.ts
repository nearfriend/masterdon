import fs from "fs";
import { getMasto } from "./client";

export async function uploadMedia(filePath: string) {
  const file = fs.createReadStream(filePath) as any;
  const masto = await getMasto();

  // masto v1 media create
  const res = await masto.v1.mediaAttachments.create({ file });
  return res.id || (res.data && res.data.id);
}