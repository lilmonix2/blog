'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from './Link'
import SelectionIndicator from './SelectionIndicator'

type Topic = { slug: string; name: string; count: number }

export default function TagFilters({ tags, activeTag }: { tags: Topic[]; activeTag?: string }) {
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()
  // Keep the selected topic visible even when it isn't one of the popular topics.
  const featured = tags.find((tag) => tag.slug === activeTag) || tags[0]
  const strip = useRef<HTMLDivElement>(null)
  const measurements = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const [visibleSlugs, setVisibleSlugs] = useState<string[] | null>(null)
  const visibleTags = tags.filter((tag) =>
    visibleSlugs !== null
      ? visibleSlugs.includes(tag.slug) || tag.slug === activeTag
      : tag === featured
  )

  useEffect(() => {
    const row = strip.current
    const measure = measurements.current
    const button = toggle.current
    if (!row || !measure || !button) return
    const update = () => {
      if (!row.clientWidth) return
      const style = getComputedStyle(row)
      const gap = Number.parseFloat(style.columnGap) || 0
      const links = Array.from(measure.querySelectorAll<HTMLAnchorElement>('a'))
      const widths = new Map(
        links.map((link) => [link.dataset.topic, link.getBoundingClientRect().width])
      )
      let available =
        row.clientWidth -
        Number.parseFloat(style.paddingLeft) -
        Number.parseFloat(style.paddingRight) -
        (widths.get('all') || 0) -
        button.getBoundingClientRect().width -
        gap
      const selected = tags.find((tag) => tag.slug === activeTag)
      const priority = selected ? [selected, ...tags.filter((tag) => tag !== selected)] : tags
      const next: string[] = []
      for (const tag of priority) {
        const width = (widths.get(tag.slug) || 0) + gap
        if (available >= width || tag === selected) {
          next.push(tag.slug)
          available -= width
        }
      }
      setVisibleSlugs((previous) => (previous?.join() === next.join() ? previous : next))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(row)
    observer.observe(measure)
    observer.observe(button)
    return () => observer.disconnect()
  }, [tags, activeTag])

  const topicLink = (tag?: Topic, sliding = false) => {
    const selected = tag ? activeTag === tag.slug : !activeTag
    return (
      <Link
        key={tag?.slug || 'all'}
        data-topic={tag?.slug || 'all'}
        href={tag ? `/tags/${tag.slug}` : '/blog'}
        aria-current={selected ? 'page' : undefined}
        onClick={() => setExpanded(false)}
        className={`relative flex ${sliding ? 'shrink-0 whitespace-nowrap' : ''} min-h-11 min-w-0 items-center gap-2 rounded-full px-3.5 text-sm transition-colors ${
          selected
            ? `text-primary-700 dark:text-primary-200 font-semibold ${sliding ? '' : 'bg-white shadow-xs dark:bg-gray-800'}`
            : 'text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-100'
        }`}
      >
        <span className="break-words">{tag?.name || '全部文章'}</span>
        {tag && (
          <span className="ml-auto min-w-5 text-right text-xs font-normal text-gray-500 tabular-nums dark:text-gray-400">
            {tag.count}
          </span>
        )}
      </Link>
    )
  }

  return (
    <div className="lg:sticky lg:top-8 lg:w-56 lg:shrink-0 lg:self-start">
      <h2 className="mb-4 hidden px-3 text-sm font-semibold text-gray-700 lg:block dark:text-gray-300">
        标签分类
      </h2>
      <nav
        aria-label="按标签浏览"
        className="relative isolate hidden space-y-1 rounded-3xl bg-gray-100/80 p-2 lg:block dark:bg-gray-900/70"
      >
        <SelectionIndicator activeKey={activeTag || 'all'} />
        {topicLink(undefined, true)}
        {tags.map((tag) => topicLink(tag, true))}
      </nav>
      <nav aria-label="手机标签筛选" className="relative lg:hidden">
        <div
          aria-hidden="true"
          inert
          className="pointer-events-none invisible absolute inset-x-0 top-0 h-0 overflow-hidden"
        >
          <div ref={measurements} className="flex w-max">
            {topicLink(undefined, true)}
            {tags.map((tag) => topicLink(tag, true))}
          </div>
        </div>
        <div
          ref={strip}
          className="relative isolate flex flex-wrap items-center gap-1 rounded-3xl bg-gray-100/80 p-1.5 dark:bg-gray-900/70"
        >
          <SelectionIndicator activeKey={activeTag || 'all'} />
          {topicLink(undefined, true)}
          {visibleTags.map((tag) => topicLink(tag, true))}
          {tags.length > 0 && (
            <button
              ref={toggle}
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setExpanded((value) => !value)}
              className="relative flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-white/70 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              所有标签
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ease-out ${expanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
        <div
          id={panelId}
          inert={!expanded}
          aria-hidden={!expanded}
          className={`grid transition-all duration-200 ease-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mt-3 rounded-3xl border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900/70">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {tags.map((tag) => topicLink(tag))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
