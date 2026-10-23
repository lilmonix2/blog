import Link from '@/components/Link'
import PostCard from '@/components/PostCard'
import type { PostSummary } from '@/lib/content'
import { ArrowRight } from 'lucide-react'

const MAX_DISPLAY = 6

export default function Home({ posts }: { posts: PostSummary[] }) {
  return (
    <div className="w-full">
      <div>
        <div className="space-y-4 pt-8 pb-10 sm:pt-12 sm:pb-12">
          <h1 className="page-heading">最新文章</h1>
          <p className="text-base leading-7 text-gray-500 dark:text-gray-400">
            Nur nicht matt werden, sonst kommt man unters Rad.
            <br />
            别松懈，不然会从轮子上掉下来。
          </p>
        </div>
        <ul className="space-y-4">
          {!posts.length && '暂无文章。'}
          {posts.slice(0, MAX_DISPLAY).map((post) => (
            <li key={post.slug}>
              <PostCard post={post} showReadMore />
            </li>
          ))}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end pt-8 text-base leading-6 font-medium">
          <Link href="/blog" className="pill-link px-5" aria-label="全部文章">
            <span>全部文章</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
