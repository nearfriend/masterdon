import fs from "fs";
import path from "path";
import axios from "axios";
import {
  MASTODON_API_URL,
  MASTODON_EMAIL,
  MASTODON_PASSWORD,
  TMP_DIR,
  MASTODON_ACCESS_TOKEN,
} from "../config/env";

const APP_FILE = path.join(TMP_DIR, "mastodon_app.json");

async function registerApp() {
  const url = `${MASTODON_API_URL.replace(/\/$/, "")}/api/v1/apps`;
  const res = await axios.post(url, {
    client_name: "mastodon-it-bot",
    redirect_uris: "urn:ietf:wg:oauth:2.0:oob",
    scopes: "read write follow",
    website: "https://example.com",
  });
  return res.data;
}

async function getToken(client_id: string, client_secret: string) {
  const url = `${MASTODON_API_URL.replace(/\/$/, "")}/oauth/token`;
  const res = await axios.post(url, new URLSearchParams({
    grant_type: "password",
    client_id,
    client_secret,
    username: MASTODON_EMAIL,
    password: MASTODON_PASSWORD,
    scope: "read write follow",
  }).toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data.access_token;
}

export async function getAccessToken() {
  if (MASTODON_ACCESS_TOKEN) return MASTODON_ACCESS_TOKEN;

  if (!MASTODON_EMAIL || !MASTODON_PASSWORD) {
    throw new Error("No Mastodon credentials provided. Set MASTODON_ACCESS_TOKEN or MASTODON_EMAIL/MASTODON_PASSWORD in .env");
  }

  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

  let app: any = null;
  if (fs.existsSync(APP_FILE)) {
    try {
      app = JSON.parse(fs.readFileSync(APP_FILE, "utf8"));
    } catch (e) {
      app = null;
    }
  }

  if (!app) {
    app = await registerApp();
    fs.writeFileSync(APP_FILE, JSON.stringify(app, null, 2));
  }

  const token = await getToken(app.client_id, app.client_secret);
  // store token alongside app for reuse
  app.access_token = token;
  fs.writeFileSync(APP_FILE, JSON.stringify(app, null, 2));

  return token;
}

export default getAccessToken;
