import { openai } from "./openai";
import { promises as fs } from 'fs'
import path from 'path'
import { pickRandom } from '../utils/random'
import { MAX_POST_LENGTH } from "../config/env";

type PostEntry = {
  title: string
  content: string
}

const postsJsonPath = path.resolve(process.cwd(), 'src', 'posts.json')
const postedPostsPath = path.resolve(process.cwd(), 'src', 'postedPosts.json')
let cachedPosts: PostEntry[] | null = null

function trimToLength(text: string, maxLength: number) {
  const trimmed = text.trim()
  if (trimmed.length <= maxLength) {
    return trimmed
  }
  return trimmed.slice(0, maxLength).replace(/\s+$/u, '')
}

async function loadPosts() {
  if (cachedPosts) {
    return cachedPosts
  }

  const file = await fs.readFile(postsJsonPath, 'utf-8')
  cachedPosts = JSON.parse(file) as PostEntry[]
  return cachedPosts
}

async function loadPostedPosts() {
  try {
    const file = await fs.readFile(postedPostsPath, 'utf-8')
    const items = JSON.parse(file) as string[]
    return new Set(items)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return new Set<string>()
    }
    throw error
  }
}

async function savePostedPosts(postedSet: Set<string>) {
  const items = Array.from(postedSet)
  await fs.writeFile(postedPostsPath, JSON.stringify(items, null, 2), 'utf-8')
}

export async function generateArticle() {
  const posts = await loadPosts()
  if (!posts.length) {
    throw new Error('No posts available in posts.json')
  }

  const postedSet = await loadPostedPosts()
  const unusedPosts = posts.filter((post) => {
    const text = `${post.title}: ${post.content}`
    return !postedSet.has(text)
  })

  if (!unusedPosts.length) {
    throw new Error('All posts in posts.json have already been published')
  }

  const selected = pickRandom(unusedPosts)
  const text = `${selected.title}: ${selected.content}`

  postedSet.add(text)
  await savePostedPosts(postedSet)

  return trimToLength(text, MAX_POST_LENGTH)
}

export async function generateArticleFromAI() {
  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.8,
    messages: [
      {
        role: "system",
        content: `
      You are a senior software engineer writing short Mastodon posts.

      Rules:
      - Max 500 characters
      - Must include a clear title (first line)
      - Content must feel human, not AI
      - Do not repeat topics, sentences, or examples; avoid redundant phrasing
      - Choose one specific topic from the IT domain and focus on it (examples: a programming language, framework, AI technique, robotics, blockchain/Ethereum/smart contracts, software development practice, backend/frontend architecture, cloud, DevOps, security, data engineering)
      - Do not use vague, generic topics like just "AI"—be specific
      - No hashtags spam
      - No emojis overload
      - Insightful, concise, slightly opinionated

      Output format:
      Title
      Content
          `,
      },
      {
        role: "user",
        content: "Generate one high-quality IT article on a single, focused topic. Do not be repetitive; pick a specific IT topic from the allowed domains.",
      },
    ],
  });

  return res.choices[0].message.content!;
}