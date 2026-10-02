import { slug } from 'github-slugger'

export const POSTS_PER_PAGE = 6

/** @template {{date: string, draft?: boolean}} T @param {T[]} posts @returns {T[]} */
export function publishedPosts(posts) {
  return posts
    .filter((post) => post.draft !== true)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

/** @param {{tags?: string[]}[]} posts */
export function tagsForPosts(posts) {
  const tags = new Map()
  for (const post of posts) {
    const counted = new Set()
    for (const name of new Set(post.tags || [])) {
      const key = slug(name)
      if (counted.has(key)) continue
      counted.add(key)
      const existing = tags.get(key)
      tags.set(key, { slug: key, name: existing?.name || name, count: (existing?.count || 0) + 1 })
    }
  }
  return [...tags.values()].sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug))
}

/** @template {{tags?: string[]}} T @param {T[]} posts @param {string} tag @returns {T[]} */
export function postsForTag(posts, tag) {
  return posts.filter((post) => post.tags?.some((name) => slug(name) === tag))
}

/** @param {string} value */
export function parsePage(value) {
  if (!/^[1-9]\d*$/.test(value)) return null
  const page = Number(value)
  return Number.isSafeInteger(page) ? page : null
}

/** @template T @param {T[]} posts @param {number} page */
export function paginatePosts(posts, page = 1) {
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  return {
    posts: posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE),
    currentPage: page,
    totalPages,
  }
}
