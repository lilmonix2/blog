import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import type { PostSummary } from '@/lib/content'
import { ArrowRight } from 'lucide-react'

const MAX_DISPLAY = 6

export default function Home({ posts }: { posts: PostSummary[] }) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            最新文章
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Nur nicht matt werden, sonst kommt man unters Rad.
            <br />
            别松懈，不然会从轮子上掉下来。
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {!posts.length && '暂无文章。'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-8">
                <article className="group relative -mx-4 rounded-2xl p-6 transition-all hover:bg-gray-50/80 dark:hover:bg-gray-900/50">
                  <Link
                    href={`/blog/${slug}`}
                    className="absolute inset-0 z-0 rounded-2xl"
                    aria-label={title}
                  />
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">发布于</dt>
                      <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-4">
                        <div>
                          <h2 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 text-2xl leading-8 font-bold tracking-tight text-gray-900 transition-colors dark:text-gray-100">
                            {title}
                          </h2>
                          <div className="relative z-10 mt-2 flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-600 dark:text-gray-300">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base leading-6 font-medium">
                        <span className="text-primary-500 group-hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-1.5 transition-colors">
                          <span>阅读全文</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end pt-8 text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="hover:border-primary-500 hover:text-primary-600 dark:hover:border-primary-400 dark:hover:text-primary-400 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-xs transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
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
