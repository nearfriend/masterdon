import dotenv from "dotenv";

dotenv.config();

export const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN || "";
export const MASTODON_API_URL = process.env.MASTODON_API_URL || "https://mastodon.social";
export const MASTODON_EMAIL = process.env.MASTODON_EMAIL || "";
export const MASTODON_PASSWORD = process.env.MASTODON_PASSWORD || "";

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

export const TMP_DIR = process.env.TMP_DIR || "./tmp";
export const MAX_POST_LENGTH = 500