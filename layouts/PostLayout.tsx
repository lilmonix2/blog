import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TableOfContents, { TocItem } from '@/components/TableOfContents'
import ArticleSidebar from '@/components/ArticleSidebar'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  toc?: TocItem[]
  children: ReactNode
}

export default function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  toc,
  children,
}: LayoutProps) {
  const { path, slug, date, title, tags, readingTime, lastmod } = content
  const basePath = path.split('/')[0]

  return (
    <>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 pb-4 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:pb-4">
            <div className="mx-auto w-full max-w-[46rem] xl:col-span-3 xl:col-start-2">
              <PageTitle>{title}</PageTitle>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                <time dateTime={date}>
                  {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                </time>
                <span>约 {Math.max(1, Math.ceil(readingTime.minutes))} 分钟阅读</span>
                {lastmod && lastmod !== date && (
                  <span>更新于 {new Date(lastmod).toLocaleDateString(siteMetadata.locale)}</span>
                )}
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
            <dl className="pt-2 pb-4 xl:border-b xl:border-gray-200 xl:pt-4 xl:pb-4 xl:dark:border-gray-700">
              <dt className="sr-only">作者</dt>
              <dd>
                <ul className="flex flex-wrap gap-4 xl:block xl:space-y-8">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt={`${author.name} 的头像`}
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="text-sm leading-5 font-medium">
                        <dt className="sr-only">姓名</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                        <dt className="sr-only">Twitter</dt>
                        <dd className="overflow-hidden text-ellipsis">
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {author.twitter
                                .replace('https://twitter.com/', '@')
                                .replace('https://x.com/', '@')}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            <div className="min-w-0 divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              {toc && <TableOfContents key={`${slug}-mobile`} toc={toc} mobile />}
              <div
                id="article-content"
                className="prose reading-prose dark:prose-invert pt-4 pb-4 sm:pt-4"
              >
                {children}
              </div>

              {siteMetadata.comments && (
                <div
                  className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments key={slug} slug={slug} />
                </div>
              )}
            </div>
            <ArticleSidebar>
              <div className="divide-y divide-gray-200 text-sm leading-5 font-medium dark:divide-gray-700">
                {toc && (
                  <div className="py-4 xl:py-4">
                    <TableOfContents key={slug} toc={toc} />
                  </div>
                )}
                {tags && (
                  <div className="py-4 xl:py-4">
                    <h2 className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      标签
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <nav
                    aria-label="文章翻页"
                    className="grid gap-4 py-4 sm:grid-cols-2 xl:grid-cols-1"
                  >
                    {prev && prev.path && (
                      <Link
                        href={`/${prev.path}`}
                        rel="prev"
                        className="article-card group block min-w-0 rounded-2xl p-4"
                      >
                        <span className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          上一篇
                        </span>
                        <span className="group-hover:text-primary-600 dark:group-hover:text-primary-300 block text-sm leading-6 font-semibold text-gray-900 transition-colors dark:text-gray-100">
                          {prev.title}
                        </span>
                      </Link>
                    )}
                    {next && next.path && (
                      <Link
                        href={`/${next.path}`}
                        rel="next"
                        className="article-card group block min-w-0 rounded-2xl p-4"
                      >
                        <span className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          下一篇
                        </span>
                        <span className="group-hover:text-primary-600 dark:group-hover:text-primary-300 block text-sm leading-6 font-semibold text-gray-900 transition-colors dark:text-gray-100">
                          {next.title}
                        </span>
                      </Link>
                    )}
                  </nav>
                )}
              </div>
              <div className="pt-4">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="返回文章列表"
                >
                  &larr; 返回文章列表
                </Link>
              </div>
            </ArticleSidebar>
          </div>
        </div>
      </article>
    </>
  )
}
