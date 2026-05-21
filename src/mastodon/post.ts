import { getMasto } from "./client";

export async function createPost(status: string, mediaIds: string[] = []) {
  const masto = await getMasto();
  console.log("Creating post:", { masto });
  return masto.v1.statuses.create({ status, mediaIds });
}

export default createPost;