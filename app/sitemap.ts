import type { MetadataRoute } from 'next'
import { getPublishedPosts, getTags, paginatePosts, POSTS_PER_PAGE } from '@/lib/content'
import { siteUrl } from './seo'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts()
  const routes: MetadataRoute.Sitemap = ['', '/blog', '/tags', '/about'].map((path) => ({
    url: siteUrl(path || '/'),
  }))
  for (let page = 2; page <= paginatePosts(posts).totalPages; page++)
    routes.push({ url: siteUrl(`/blog/page/${page}`) })
  for (const tag of getTags()) {
    routes.push({ url: siteUrl(`/tags/${tag.slug}`) })
    for (let page = 2; page <= Math.ceil(tag.count / POSTS_PER_PAGE); page++)
      routes.push({ url: siteUrl(`/tags/${tag.slug}/page/${page}`) })
  }
  return [
    ...routes,
    ...posts.map((post) => ({
      url: siteUrl(`/${post.path}`),
      lastModified: post.lastmod || post.date,
    })),
  ]
}
