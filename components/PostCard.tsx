import { ArrowRight } from 'lucide-react'
import { formatDate } from 'pliny/utils/formatDate'
import type { PostSummary } from '@/lib/content'
import siteMetadata from '@/data/siteMetadata'
import Link from './Link'
import Tag from './Tag'

export default function PostCard({
  post,
  showReadMore = false,
}: {
  post: PostSummary
  showReadMore?: boolean
}) {
  return (
    <article className="article-card group relative space-y-4 p-5 sm:p-7">
      <h2 className="text-xl leading-snug font-semibold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">
        <Link
          href={`/${post.path}`}
          className="group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors after:absolute after:inset-0 after:rounded-3xl"
        >
          {post.title}
        </Link>
      </h2>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <time dateTime={post.date} className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(post.date, siteMetadata.locale)}
        </time>
        <div className="relative z-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
      </div>
      <p className="line-clamp-3 max-w-5xl text-sm leading-7 text-gray-600 sm:line-clamp-2 sm:text-base dark:text-gray-300">
        {post.summary}
      </p>
      {showReadMore && (
        <span
          className="text-primary-500 inline-flex items-center gap-1.5 text-sm font-medium"
          aria-hidden="true"
        >
          阅读全文
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      )}
    </article>
  )
}
