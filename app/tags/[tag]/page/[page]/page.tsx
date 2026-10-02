import ListLayout from '@/layouts/ListLayoutWithTags'
import { getTags, getPostSummaries, paginatePosts, parsePage } from '@/lib/content'
import { notFound, permanentRedirect } from 'next/navigation'
import { genPageMetadata } from 'app/seo'

type Props = { params: Promise<{ tag: string; page: string }> }

function resolvePage(rawTag: string, value: string) {
  const tag = decodeURI(rawTag)
  const entry = getTags().find((item) => item.slug === tag)
  const page = parsePage(value)
  const posts = getPostSummaries(tag)
  if (!entry || !page || page > paginatePosts(posts).totalPages) notFound()
  return { entry, tag, ...paginatePosts(posts, page) }
}

export async function generateMetadata({ params }: Props) {
  const { tag: rawTag, page } = await params
  const result = resolvePage(rawTag, page)
  return genPageMetadata({
    title: `${result.entry.name} · 第 ${result.currentPage} 页`,
    path: `/tags/${result.tag}/page/${result.currentPage}`,
  })
}

export function generateStaticParams() {
  return getTags().flatMap(({ slug: tag }) => {
    const { totalPages } = paginatePosts(getPostSummaries(tag))
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      tag,
      page: String(i + 2),
    }))
  })
}

export default async function TagPage({ params }: Props) {
  const { tag: rawTag, page } = await params
  const result = resolvePage(rawTag, page)
  if (result.currentPage === 1) permanentRedirect(`/tags/${result.tag}`)
  return (
    <ListLayout
      posts={result.posts}
      tags={getTags()}
      activeTag={result.tag}
      pagination={result}
      basePath={`/tags/${result.tag}`}
      title={result.entry.name}
    />
  )
}
