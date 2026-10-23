import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { getPostSummaries, paginatePosts } from '@/lib/content'

export const metadata = genPageMetadata({ title: '文章', path: '/blog' })

export default function BlogPage() {
  const page = paginatePosts(getPostSummaries())
  return <ListLayout posts={page.posts} pagination={page} basePath="/blog" />
}
