import { generateArticle, generateArticleFromAI } from "../ai/article";
import { generateImage } from "../ai/image";
import { uploadMedia } from "../mastodon/media";
import { createPost } from "../mastodon/post";
import { humanDelay } from "../filters/antiSpam";

export async function publishArticle() {
  // const article = await generateArticleFromAI();
  const article = await generateArticle();

  // const imagePath = await generateImage(article);

  // const mediaId = await uploadMedia(imagePath);

  // await humanDelay();

  // await createPost(article, [mediaId]);
  await createPost(article, []);
}