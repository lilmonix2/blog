import { writeFile, mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { publishedPosts, tagsForPosts, postsForTag } from '../lib/content-core.mjs'
import { generateRss } from '../lib/rss.mjs'

export default async function rss() {
  const output = process.env.EXPORT ? 'out' : 'public'
  const posts = publishedPosts(allBlogs)
  const tags = tagsForPosts(posts)
  const tagRoot = path.join(output, 'tags')
  // Remove obsolete generated feeds when a tag disappears or becomes draft-only.
  for (const entry of await readdir(tagRoot, { withFileTypes: true }).catch(() => [])) {
    if (entry.isDirectory() && !tags.some((tag) => tag.slug === entry.name))
      await rm(path.join(tagRoot, entry.name, 'feed.xml'), { force: true })
  }
  const writeFeed = async (posts, relative) => {
    const file = path.join(output, relative)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, generateRss(siteMetadata, posts, relative, process.env.BASE_PATH || ''))
  }
  await writeFeed(posts, 'feed.xml')
  for (const tag of tags) await writeFeed(postsForTag(posts, tag.slug), `tags/${tag.slug}/feed.xml`)
  console.log('RSS feeds generated.')
}
