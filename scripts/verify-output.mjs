import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { publishedPosts, paginatePosts } from '../lib/content-core.mjs'

const posts = publishedPosts(allBlogs)
const search = JSON.parse(await readFile('public/search.json', 'utf8'))
assert.deepEqual(
  search.map((post) => post.slug),
  posts.map((post) => post.slug),
  '搜索索引必须完整且不含草稿'
)
assert.ok(
  search.every(
    (post) => typeof post.text === 'string' && !('structuredData' in post) && !('toc' in post)
  ),
  '搜索索引只包含需要的字段'
)
await access('public/static/images/social-banner.png')
for (const post of posts) {
  const html = await readFile(`.next/server/app/${post.path}.html`, 'utf8')
  const images = [...html.matchAll(/<meta property="og:image" content="([^"]+)"/g)]
  assert.ok(images.length, `${post.slug}: 缺少分享图`)
  for (const image of images)
    assert.ok(
      /^https?:\/\//.test(image[1]) && !image[1].includes('undefined'),
      `${post.slug}: 无效分享图`
    )
  const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  assert.ok(jsonLd, `${post.slug}: 缺少 JSON-LD`)
  const structured = JSON.parse(jsonLd[1])
  assert.ok(structured.image.length && structured.author.length, `${post.slug}: 缺少图片或作者`)
}
const pages = []
for (let page = 1; page <= paginatePosts(posts).totalPages; page++) {
  const html = await readFile(
    `.next/server/app/blog${page === 1 ? '' : `/page/${page}`}.html`,
    'utf8'
  )
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] || ''
  pages.push(
    ...[...main.matchAll(/<h2[^>]*><a[^>]*href="([^"]+)"/g)].map(
      (match) => match[1].split('/blog/')[1]
    )
  )
}
assert.deepEqual(
  pages,
  posts.map((post) => post.slug),
  '静态列表分页必须无重复、无遗漏'
)
console.log(
  `Build output verified: ${posts.length} articles, ${paginatePosts(posts).totalPages} pages.`
)
