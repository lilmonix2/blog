'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { POSTS_PER_PAGE, parsePage } from '@/lib/content-core.mjs'
import TagFilters from './TagFilters'

type Props = {
  children: ReactNode
  tags: { slug: string; name: string; count: number }[]
  totalPosts: number
}

/** Keep the filters mounted while list pages change underneath the shared root layout. */
export default function ArticleListShell({ children, tags, totalPosts }: Props) {
  const pathname = usePathname()
  const blogRoute = pathname.match(/^\/blog(?:\/page\/([^/]+))?$/)
  const tagRoute = pathname.match(/^\/tags\/([^/]+)(?:\/page\/([^/]+))?$/)
  if (!blogRoute && !tagRoute) return children

  const activeTag = tagRoute ? decodeURIComponent(tagRoute[1]) : undefined
  const selected = tags.find((tag) => tag.slug === activeTag)
  const page = parsePage((tagRoute ? tagRoute[2] : blogRoute?.[1]) || '1')
  const totalPages = Math.max(1, Math.ceil((selected?.count ?? totalPosts) / POSTS_PER_PAGE))
  if (!page || page > totalPages || (tagRoute && !selected)) return children

  return (
    <div className="py-8 sm:py-12">
      <h1 className="page-heading mb-6">{selected?.name || '全部文章'}</h1>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <TagFilters tags={tags} activeTag={activeTag} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
