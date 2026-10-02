import ListLayout from '@/layouts/ListLayoutWithTags'
import { getTags, getPostSummaries, paginatePosts } from '@/lib/content'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ tag: string }> }

export async function generateMetadata({ params }: Props) {
  const { tag: rawTag } = await params
  const tag = decodeURI(rawTag)
  const entry = getTags().find((item) => item.slug === tag)
  if (!entry) notFound()
  return genPageMetadata({
    title: entry.name,
    description: `${entry.name} 相关文章`,
    path: `/tags/${tag}`,
  })
}

export const generateStaticParams = () => getTags().map(({ slug: tag }) => ({ tag }))

export default async function TagPage({ params }: Props) {
  const { tag: rawTag } = await params
  const tag = decodeURI(rawTag)
  const entry = getTags().find((item) => item.slug === tag)
  if (!entry) notFound()
  const page = paginatePosts(getPostSummaries(tag))
  return (
    <ListLayout
      posts={page.posts}
      tags={getTags()}
      activeTag={tag}
      pagination={page}
      basePath={`/tags/${tag}`}
      title={entry.name}
    />
  )
}
