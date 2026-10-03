import Link from '@/components/Link'
import PostCard from '@/components/PostCard'
import type { PostSummary } from '@/lib/content'
import { ArrowRight } from 'lucide-react'

const MAX_DISPLAY = 6

export default function Home({ posts }: { posts: PostSummary[] }) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        <div className="space-y-3 pt-6 pb-6">
          <h1 className="page-heading">最新文章</h1>
          <p className="text-base leading-7 text-gray-500 dark:text-gray-400">
            Nur nicht matt werden, sonst kommt man unters Rad.
            <br />
            别松懈，不然会从轮子上掉下来。
          </p>
        </div>
        <ul className="space-y-2">
          {!posts.length && '暂无文章。'}
          {posts.slice(0, MAX_DISPLAY).map((post) => (
            <li key={post.slug} className="py-3">
              <PostCard post={post} showReadMore />
            </li>
          ))}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end pt-8 text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="hover:border-primary-500 hover:text-primary-600 dark:hover:border-primary-400 dark:hover:text-primary-400 inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-xs transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="全部文章"
          >
            <span>全部文章</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </>
  )
}
