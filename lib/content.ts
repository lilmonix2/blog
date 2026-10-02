import { allBlogs } from 'contentlayer/generated'
import { publishedPosts, tagsForPosts, postsForTag } from './content-core.mjs'

export { POSTS_PER_PAGE, parsePage, paginatePosts } from './content-core.mjs'
export const getPublishedPosts = () => publishedPosts(allBlogs)
export const getPostBySlug = (slug: string) =>
  getPublishedPosts().find((post) => post.slug === slug)
export const getTags = () =>
  tagsForPosts(getPublishedPosts()) as { slug: string; name: string; count: number }[]
export const getPostsByTag = (tag: string) => postsForTag(getPublishedPosts(), tag)
export type PostSummary = Pick<
  (typeof allBlogs)[number],
  'title' | 'path' | 'slug' | 'date' | 'summary' | 'tags'
>
export const getPostSummaries = (tag?: string): PostSummary[] =>
  (tag ? getPostsByTag(tag) : getPublishedPosts()).map(
    ({ title, path, slug, date, summary, tags }) => ({ title, path, slug, date, summary, tags })
  )
