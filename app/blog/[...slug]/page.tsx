import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import { getPublishedPosts, getPostBySlug } from '@/lib/content'
import { genPageMetadata, siteUrl } from 'app/seo'
import { allAuthors } from 'contentlayer/generated'
import ArticleImages from '@/components/ArticleImages'
import PostLayout from '@/layouts/PostLayout'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const post = getPostBySlug((await props.params).slug.join('/'))
  if (!post) notFound()
  const images: string[] =
    Array.isArray(post.images) && post.images.length ? post.images : [siteMetadata.socialBanner]
  const canonical = post.canonicalUrl || siteUrl(`/${post.path}`)
  const metadata = genPageMetadata({
    title: post.title,
    description: post.summary,
    image: images[0],
    path: `/${post.path}`,
    alternates: { canonical },
  })
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      url: canonical,
      images: images.map(siteUrl),
      publishedTime: post.date,
      modifiedTime: post.lastmod || post.date,
      authors: (post.authors || ['default']).map(
        (slug) => allAuthors.find((author) => author.slug === slug)?.name || siteMetadata.author
      ),
    },
    twitter: { ...metadata.twitter, images: images.map(siteUrl) },
  }
}

export const generateStaticParams = async () => {
  return getPublishedPosts().map((p) => ({ slug: p.slug.split('/') }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = params.slug.join('/')
  // Filter out drafts in production
  const sortedCoreContents = getPublishedPosts()
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = getPostBySlug(slug)!
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    if (!authorResults) throw new Error(`Unknown author: ${author}`)
    return coreContent(authorResults)
  })
  const mainContent = coreContent(post)
  const jsonLd = {
    ...post.structuredData,
    image: (Array.isArray(post.images) && post.images.length
      ? post.images
      : [siteMetadata.socialBanner]
    ).map(siteUrl),
    url: post.canonicalUrl || siteUrl(`/${post.path}`),
  }
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  const Layout = PostLayout

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ArticleImages>
        <Layout
          content={mainContent}
          authorDetails={authorDetails}
          next={next}
          prev={prev}
          toc={post.toc}
        >
          <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
        </Layout>
      </ArticleImages>
    </>
  )
}
