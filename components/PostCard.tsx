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
    <article className="group relative -mx-4 space-y-3 rounded-2xl p-4 transition-colors focus-within:bg-gray-50 hover:bg-gray-50 dark:focus-within:bg-gray-900/60 dark:hover:bg-gray-900/60">
      <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
        <Link
          href={`/${post.path}`}
          className="group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors after:absolute after:inset-0 after:rounded-2xl"
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
      <p className="line-clamp-2 text-base leading-7 text-gray-600 dark:text-gray-300">
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
