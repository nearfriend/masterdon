import { getMasto } from "./client";

export async function replyTo(inReplyToId: string, status: string, mediaIds: string[] = []) {
	const masto = await getMasto();
	return masto.v1.statuses.create({ status, inReplyToId, mediaIds });
}

export default replyTo;
