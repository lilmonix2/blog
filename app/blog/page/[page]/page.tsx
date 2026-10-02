import ListLayout from '@/layouts/ListLayoutWithTags'
import { getPostSummaries, getTags, paginatePosts, parsePage } from '@/lib/content'
import { notFound, permanentRedirect } from 'next/navigation'
import { genPageMetadata } from 'app/seo'

type Props = { params: Promise<{ page: string }> }

function resolvePage(value: string) {
  const page = parsePage(value)
  const posts = getPostSummaries()
  if (!page || page > paginatePosts(posts).totalPages) notFound()
  return paginatePosts(posts, page)
}

export async function generateMetadata({ params }: Props) {
  const { currentPage } = resolvePage((await params).page)
  return genPageMetadata({
    title: `文章 · 第 ${currentPage} 页`,
    path: `/blog/page/${currentPage}`,
  })
}

export function generateStaticParams() {
  const { totalPages } = paginatePosts(getPostSummaries())
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ page: String(i + 2) }))
}

export default async function Page({ params }: Props) {
  const page = resolvePage((await params).page)
  if (page.currentPage === 1) permanentRedirect('/blog')
  return (
    <ListLayout
      posts={page.posts}
      tags={getTags()}
      pagination={page}
      basePath="/blog"
      title="全部文章"
    />
  )
}
