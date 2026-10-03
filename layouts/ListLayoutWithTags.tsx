import Link from '@/components/Link'
import PostCard from '@/components/PostCard'
import TagFilters from '@/components/TagFilters'
import type { PostSummary } from '@/lib/content'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  posts: PostSummary[]
  title: string
  tags: { slug: string; name: string; count: number }[]
  activeTag?: string
  basePath: string
  pagination: { currentPage: number; totalPages: number }
}

export default function ListLayout({ posts, title, tags, activeTag, basePath, pagination }: Props) {
  const { currentPage, totalPages } = pagination
  const pageUrl = (page: number) => (page === 1 ? basePath : `${basePath}/page/${page}`)
  return (
    <div className="py-6">
      <h1 className="page-heading mb-6">{title}</h1>
      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <TagFilters key={activeTag || 'all'} tags={tags} activeTag={activeTag} />
        <div className="min-w-0">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {posts.map((post) => (
              <li key={post.path} className="py-3">
                <PostCard post={post} />
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <nav aria-label="文章分页" className="flex items-center justify-between gap-3 py-8">
              {currentPage > 1 ? (
                <Link
                  className="hover:text-primary-600 dark:hover:text-primary-400 inline-flex min-h-11 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 shadow-xs transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  href={pageUrl(currentPage - 1)}
                  rel="prev"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>上一页</span>
                </Link>
              ) : (
                <span
                  className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-400 opacity-50 dark:border-gray-800 dark:text-gray-600"
                  aria-disabled="true"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>上一页</span>
                </span>
              )}
              <span aria-live="polite" className="text-sm text-gray-500 dark:text-gray-400">
                第 {currentPage} / {totalPages} 页
              </span>
              {currentPage < totalPages ? (
                <Link
                  className="hover:text-primary-600 dark:hover:text-primary-400 inline-flex min-h-11 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 shadow-xs transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  href={pageUrl(currentPage + 1)}
                  rel="next"
                >
                  <span>下一页</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span
                  className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-400 opacity-50 dark:border-gray-800 dark:text-gray-600"
                  aria-disabled="true"
                >
                  <span>下一页</span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}
