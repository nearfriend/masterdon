export async function humanDelay() {
  const delay = 30000 + Math.random() * 90000;
  return new Promise((r) => setTimeout(r, delay));
}

export function shouldReply(notification: any) {
  // Avoid bots / spam / duplicates
  if (notification.account.bot) return false;

  return Math.random() > 0.4; // randomness = human behavior
}