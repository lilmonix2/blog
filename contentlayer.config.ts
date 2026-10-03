import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer2/source-files'
import { writeFileSync } from 'fs'
import readingTime from 'reading-time'
import { publishedPosts } from './lib/content-core.mjs'
import { existsSync } from 'fs'
import path from 'path'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkAlert } from 'remark-github-blockquote-alert'
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from 'pliny/mdx-plugins/index.js'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeKatexNoTranslate from 'rehype-katex-notranslate'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'
import siteMetadata from './data/siteMetadata'
import type { Blog as BlogDocument, Authors as AuthorDocument } from 'contentlayer/generated'

const root = process.cwd()

// heroicon mini link
const icon = fromHtmlIsomorphic(
  `
  <span class="content-header-link">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 linkicon">
  <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
  <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
  </svg>
  </span>
`,
  { fragment: true }
)

const computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: 'json', resolve: (doc) => extractTocHeadings(doc.body.raw) },
}

function createSearchIndex(allBlogs: BlogDocument[]) {
  const entries = publishedPosts(allBlogs).map(
    ({ title, path, slug, date, summary, tags, body }) => ({
      title,
      path,
      slug,
      date,
      summary,
      tags,
      text: body.raw
        .replace(/```[\s\S]*?```/g, (code) => code.replace(/```[^\n]*\n?/g, ''))
        .replace(/<[^>]*>/g, ' ')
        .replace(/[#*`]/g, ''),
    })
  )
  writeFileSync('public/search.json', JSON.stringify(entries))
}

function validateContent(posts: BlogDocument[], authors: AuthorDocument[]) {
  const errors: string[] = []
  for (const post of posts) {
    const fail = (message: string) => errors.push(`${post.filePath}: ${message}`)
    if (!post.draft && !post.summary?.trim()) fail('公开文章必须提供摘要')
    if (post.layout && post.layout !== 'PostLayout') fail('未知文章布局')
    for (const author of post.authors || ['default'])
      if (!authors.some((entry) => entry.slug === author)) fail(`作者不存在: ${author}`)
    if (!Number.isFinite(Date.parse(post.date))) fail('无效发布日期')
    if (post.lastmod && Date.parse(post.lastmod) < Date.parse(post.date))
      fail('更新日期早于发布日期')
    if (post.canonicalUrl && !/^https?:\/\//.test(post.canonicalUrl))
      fail('canonicalUrl 必须是绝对 HTTP(S) 地址')
    if (
      post.images &&
      (!Array.isArray(post.images) || post.images.some((image) => typeof image !== 'string'))
    )
      fail('images 必须是字符串数组')
    const images = [...post.body.raw.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:[^)]*)\)/g)].map(
      (match) => match[1]
    )
    for (const image of [...images, ...(Array.isArray(post.images) ? post.images : [])]) {
      if (image.startsWith('/') && !existsSync(path.join(root, 'public', image)))
        fail(`图片不存在: ${image}`)
    }
  }
  if (errors.length) throw new Error(errors.join('\n'))
}

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'json' },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'enum', options: ['PostLayout'], default: 'PostLayout' },
    canonicalUrl: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string' },
    occupation: { type: 'string' },
    company: { type: 'string' },
    email: { type: 'string' },
    twitter: { type: 'string' },
    bluesky: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, Authors],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
      remarkAlert,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          properties: { ariaLabel: '跳到本节', className: ['heading-anchor'] },
          headingProperties: {
            className: ['content-header'],
          },
          content: icon,
        },
      ],
      rehypeKatex,
      rehypeKatexNoTranslate,
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    const { allBlogs, allAuthors } = await importData()
    validateContent(allBlogs, allAuthors)
    createSearchIndex(allBlogs)
  },
})
