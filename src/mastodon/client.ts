import { createRestAPIClient } from "masto";
import { MASTODON_API_URL } from "../config/env";
import { getAccessToken } from "./auth";

let mastoInstance: any = null;

export async function getMasto() {
	if (mastoInstance) return mastoInstance;
	const token = await getAccessToken();
	mastoInstance = createRestAPIClient({
		url: MASTODON_API_URL.replace(/\/$/, ""),
		accessToken: token,
	});
	return mastoInstance;
}

export default getMasto;
