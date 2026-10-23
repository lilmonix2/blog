import Link from '@/components/Link'
import PostCard from '@/components/PostCard'
import type { PostSummary } from '@/lib/content'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type Props = {
  posts: PostSummary[]
  basePath: string
  pagination: { currentPage: number; totalPages: number }
}

export default function ListLayout({ posts, basePath, pagination }: Props) {
  const { currentPage, totalPages } = pagination
  const pageUrl = (page: number) => (page === 1 ? basePath : `${basePath}/page/${page}`)
  return (
    <>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.path}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <nav aria-label="文章分页" className="flex items-center justify-between gap-3 py-8">
          {currentPage > 1 ? (
            <Link className="pill-link" href={pageUrl(currentPage - 1)} rel="prev">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              <span>上一页</span>
            </Link>
          ) : (
            <span className="pill-link" aria-disabled="true">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              <span>上一页</span>
            </span>
          )}
          <span
            aria-live="polite"
            className="text-center text-xs text-gray-500 sm:text-sm dark:text-gray-400"
          >
            第 {currentPage} / {totalPages} 页
          </span>
          {currentPage < totalPages ? (
            <Link className="pill-link" href={pageUrl(currentPage + 1)} rel="next">
              <span>下一页</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : (
            <span className="pill-link" aria-disabled="true">
              <span>下一页</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
          )}
        </nav>
      )}
    </>
  )
}
