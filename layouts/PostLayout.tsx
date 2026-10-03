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
          <header className="pt-6 pb-4 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:pb-8">
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
            <dl className="pt-2 pb-4 xl:border-b xl:border-gray-200 xl:pt-8 xl:pb-8 xl:dark:border-gray-700">
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
                className="prose reading-prose dark:prose-invert pt-4 pb-8 sm:pt-8"
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
            <footer className="xl:sticky xl:top-6 xl:col-start-1 xl:row-start-2 xl:self-start">
              <div className="divide-y divide-gray-200 text-sm leading-5 font-medium dark:divide-gray-700">
                {toc && (
                  <div className="py-4 xl:py-8">
                    <TableOfContents key={slug} toc={toc} />
                  </div>
                )}
                {tags && (
                  <div className="py-4 xl:py-8">
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
                  <div className="flex flex-col gap-4 py-4 sm:flex-row sm:justify-between xl:block xl:space-y-8 xl:py-8">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                          上一篇
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div>
                        <h2 className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                          下一篇
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="返回文章列表"
                >
                  &larr; 返回文章列表
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </>
  )
}
