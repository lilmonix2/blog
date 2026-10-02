import { formatDate } from 'pliny/utils/formatDate'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
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
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          aria-label="按标签浏览"
          className="flex flex-wrap content-start gap-2 lg:sticky lg:top-24 lg:block lg:space-y-1 lg:self-start"
        >
          <h2 className="mb-3 hidden text-base font-bold text-gray-900 lg:block dark:text-gray-100">
            标签分类
          </h2>
          <Link
            href="/blog"
            aria-current={!activeTag ? 'page' : undefined}
            className={`group flex items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              !activeTag
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
            }`}
          >
            <span>全部文章</span>
          </Link>
          {tags.map((tag) => {
            const isSelected = activeTag === tag.slug
            return (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                aria-current={isSelected ? 'page' : undefined}
                className={`group flex items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
                }`}
              >
                <span>{tag.name}</span>
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs transition-colors ${
                    isSelected
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200/80 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-gray-700'
                  }`}
                >
                  {tag.count}
                </span>
              </Link>
            )
          })}
        </nav>
        <div className="min-w-0">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {posts.map((post) => (
              <li key={post.path} className="py-4">
                <article className="group relative -mx-3 space-y-2 rounded-2xl p-4 transition-all hover:bg-gray-50/80 dark:hover:bg-gray-900/50">
                  <Link
                    href={`/${post.path}`}
                    className="absolute inset-0 z-0 rounded-2xl"
                    aria-label={post.title}
                  />
                  <time dateTime={post.date} className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(post.date, siteMetadata.locale)}
                  </time>
                  <h2 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 text-2xl leading-8 font-bold text-gray-900 transition-colors dark:text-gray-100">
                    {post.title}
                  </h2>
                  <div className="relative z-10 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                  <p className="line-clamp-2 text-gray-600 dark:text-gray-300">{post.summary}</p>
                </article>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <nav aria-label="文章分页" className="flex items-center justify-between gap-3 py-8">
              {currentPage > 1 ? (
                <Link
                  className="hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 shadow-xs transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  href={pageUrl(currentPage - 1)}
                  rel="prev"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>上一页</span>
                </Link>
              ) : (
                <span
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-400 opacity-50 dark:border-gray-800 dark:text-gray-600"
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
                  className="hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 shadow-xs transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  href={pageUrl(currentPage + 1)}
                  rel="next"
                >
                  <span>下一页</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-400 opacity-50 dark:border-gray-800 dark:text-gray-600"
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
