import { createRestAPIClient } from "masto";
import { MASTODON_API_URL } from "../config/env";
import { getAccessToken } from "./auth";

let mastoInstance: any = null;

export async function getMasto() {
	if (mastoInstance) return mastoInstance;
	const token = await getAccessToken();
	console.log("Creating Mastodon client with token:", { token });
	mastoInstance = createRestAPIClient({
		url: MASTODON_API_URL.replace(/\/$/, ""),
		accessToken: token,
	});
	console.log("Mastodon client created:", { mastoInstance });
	return mastoInstance;
}

export default getMasto;
