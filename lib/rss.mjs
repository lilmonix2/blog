import { publishedPosts } from './content-core.mjs'

export const escapeXml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]
  )

export function generateRss(config, input, page = 'feed.xml', basePath = '') {
  const posts = publishedPosts(input)
  const url = (path) => escapeXml(new URL(`${basePath}/${path}`, `${config.siteUrl}/`).toString())
  const editor = escapeXml(`${config.email} (${config.author})`)
  const lastUpdate = posts.length
    ? new Date(
        Math.max(...posts.map((post) => Date.parse(post.lastmod || post.date)))
      ).toUTCString()
    : null
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${escapeXml(config.title)}</title><link>${url('blog')}</link>
<description>${escapeXml(config.description)}</description><language>${escapeXml(config.language)}</language>
<managingEditor>${editor}</managingEditor><webMaster>${editor}</webMaster>
${lastUpdate ? `<lastBuildDate>${lastUpdate}</lastBuildDate>` : ''}
<atom:link href="${url(page)}" rel="self" type="application/rss+xml"/>
${posts.map((post) => `<item><guid isPermaLink="true">${url(`blog/${post.slug}`)}</guid><title>${escapeXml(post.title)}</title><link>${url(`blog/${post.slug}`)}</link><description>${escapeXml(post.summary)}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate><author>${editor}</author>${(post.tags || []).map((tag) => `<category>${escapeXml(tag)}</category>`).join('')}</item>`).join('')}
</channel></rss>`
}
