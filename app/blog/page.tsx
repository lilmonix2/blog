import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { getPostSummaries, getTags, paginatePosts } from '@/lib/content'

export const metadata = genPageMetadata({ title: '文章', path: '/blog' })

export default function BlogPage() {
  const page = paginatePosts(getPostSummaries())
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
