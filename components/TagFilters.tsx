'use client'

import { useId, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import Link from './Link'

type Topic = { slug: string; name: string; count: number }

export default function TagFilters({ tags, activeTag }: { tags: Topic[]; activeTag?: string }) {
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()
  // Keep the selected topic visible even when it isn't one of the popular topics.
  const featured = tags.find((tag) => tag.slug === activeTag) || tags[0]
  const remaining = tags.filter((tag) => tag.slug !== featured?.slug)

  const topicLink = (tag?: Topic) => {
    const selected = tag ? activeTag === tag.slug : !activeTag
    return (
      <Link
        key={tag?.slug || 'all'}
        href={tag ? `/tags/${tag.slug}` : '/blog'}
        aria-current={selected ? 'page' : undefined}
        onClick={() => setExpanded(false)}
        className={`flex min-h-11 min-w-0 items-center gap-2 rounded-lg px-3 text-sm transition-colors ${
          selected
            ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-200 font-semibold'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
        }`}
      >
        {selected && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
        <span className="break-words">{tag?.name || '全部文章'}</span>
        {tag && (
          <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {tag.count}
          </span>
        )}
      </Link>
    )
  }

  return (
    <div className="lg:sticky lg:top-8 lg:self-start">
      <nav aria-label="按标签浏览" className="hidden space-y-1 lg:block">
        <h2 className="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">标签分类</h2>
        {topicLink()}
        {tags.map((tag) => topicLink(tag))}
      </nav>
      <nav aria-label="手机标签筛选" className="lg:hidden">
        <div className="flex flex-wrap items-center gap-2">
          {topicLink()}
          {featured && topicLink(featured)}
          {remaining.length > 0 && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setExpanded((value) => !value)}
              className="flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {expanded ? '收起标签' : '更多标签'}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
        <div
          id={panelId}
          hidden={!expanded}
          className="mt-3 rounded-xl border border-gray-200 p-2 dark:border-gray-800"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {remaining.map((tag) => topicLink(tag))}
          </div>
        </div>
      </nav>
    </div>
  )
}
