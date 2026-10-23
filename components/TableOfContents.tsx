'use client'

import { useEffect, useRef, useState } from 'react'

export interface TocItem {
  value: string
  url: string
  depth: number
}

const headingIndent: Record<number, string> = {
  2: 'pl-0',
  3: 'pl-3',
  4: 'pl-6',
  5: 'pl-9',
  6: 'pl-12',
}

export default function TableOfContents({
  toc,
  mobile = false,
}: {
  toc: TocItem[]
  mobile?: boolean
}) {
  const [active, setActive] = useState('')
  const details = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const headings = toc
      .map((item) => document.getElementById(decodeURIComponent(item.url.slice(1))))
      .filter((node): node is HTMLElement => !!node && !!node.closest('#article-content'))
    let frame = 0
    const update = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const scrollMargin = headings[0]
          ? Number.parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || 0
          : 0
        const current =
          headings
            .filter(
              (node) => Math.round(node.getBoundingClientRect().top) <= Math.round(scrollMargin)
            )
            .at(-1) || headings[0]
        setActive(current?.id || '')
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [toc])
  if (!toc.length) return null
  const links = (
    <nav aria-label="文章目录" className="space-y-0.5">
      {toc.map((item) => {
        const isActive = active === decodeURIComponent(item.url.slice(1))
        return (
          <a
            key={item.url}
            href={item.url}
            aria-current={isActive ? 'location' : undefined}
            onClick={() => {
              if (details.current) details.current.open = false
            }}
            className={`flex min-h-11 items-center rounded-xl py-2 pr-2.5 text-sm leading-6 transition-colors ${headingIndent[item.depth] || 'pl-0'} ${
              isActive
                ? 'text-primary-700 dark:text-primary-300 font-medium'
                : 'text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
          >
            <span>{item.value.replace(/[`*_~]/g, '')}</span>
          </a>
        )
      })}
    </nav>
  )
  if (mobile)
    return (
      <details
        ref={details}
        className="my-5 rounded-2xl border border-gray-200/70 bg-gray-50/80 px-4 py-1 xl:hidden dark:border-gray-800 dark:bg-gray-900/60"
      >
        <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-gray-900 dark:text-gray-100">
          文章目录
        </summary>
        <div className="pt-2 pb-3">{links}</div>
      </details>
    )
  return (
    <div className="hidden xl:block">
      <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">文章目录</h2>
      {links}
    </div>
  )
}
