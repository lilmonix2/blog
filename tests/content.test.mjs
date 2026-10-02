import test from 'node:test'
import assert from 'node:assert/strict'
import {
  publishedPosts,
  tagsForPosts,
  postsForTag,
  paginatePosts,
  parsePage,
} from '../lib/content-core.mjs'
import { generateRss } from '../lib/rss.mjs'

const input = Array.from({ length: 14 }, (_, i) => ({
  slug: String(i),
  title: `文章 ${i}`,
  date: `2025-01-${String(i + 1).padStart(2, '0')}`,
  tags: ['Vue', 'A&B'],
  draft: i === 4,
}))

test('公开文章排序不修改源数据，翻页无重复或遗漏', () => {
  const original = JSON.stringify(input)
  const posts = publishedPosts(input)
  const output = Array.from(
    { length: paginatePosts(posts).totalPages },
    (_, i) => paginatePosts(posts, i + 1).posts
  ).flat()
  assert.deepEqual(output, posts)
  assert.equal(new Set(output.map((post) => post.slug)).size, 13)
  assert.equal(JSON.stringify(input), original)
  assert.equal(posts[0].slug, '13')
})

test('严格拒绝非法页码', () => {
  for (const value of ['0', '-1', '2abc', '1.5', '01', 'Infinity', '9007199254740993'])
    assert.equal(parsePage(value), null)
  assert.equal(parsePage('2'), 2)
})

test('标签保留展示名称，统计仅包含公开文章', () => {
  const posts = publishedPosts(input)
  assert.equal(tagsForPosts(posts).find((tag) => tag.slug === 'vue').name, 'Vue')
  assert.equal(postsForTag(posts, 'vue').length, 13)
})

test('RSS 转义、过滤草稿、排序并支持空列表', () => {
  const config = {
    title: 'A&B',
    description: '<hello>',
    author: 'A&B',
    email: 'a@example.com',
    siteUrl: 'https://example.com',
    language: 'zh-CN',
  }
  const xml = generateRss(config, input, 'feed.xml', '/notes')
  assert.match(xml, /A&amp;B/)
  assert.match(xml, /&lt;hello&gt;/)
  assert.equal((xml.match(/<item>/g) || []).length, 13)
  assert.ok(xml.indexOf('文章 13') < xml.indexOf('文章 12'))
  assert.match(xml, /https:\/\/example.com\/notes\/feed.xml/)
  assert.doesNotMatch(generateRss(config, []), /Invalid Date|undefined/)
})
