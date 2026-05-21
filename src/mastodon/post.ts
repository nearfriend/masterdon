import { getMasto } from "./client";

export async function createPost(status: string, mediaIds: string[] = []) {
  const masto = await getMasto();
  return masto.v1.statuses.create({ status, mediaIds });
}

export default createPost;