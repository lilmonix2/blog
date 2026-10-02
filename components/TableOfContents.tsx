'use client'

import { useEffect, useRef, useState } from 'react'

export interface TocItem {
  value: string
  url: string
  depth: number
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
        const current =
          headings.filter((node) => node.getBoundingClientRect().top <= 130).at(-1) || headings[0]
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
    <nav aria-label="文章目录" className="space-y-2">
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
            className={`block rounded-lg py-1.5 pr-2.5 text-sm transition-colors ${
              isActive
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 font-medium'
                : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
            }`}
            style={{ paddingLeft: `${Math.max(0, item.depth - 2) * 12 + 10}px` }}
          >
            {item.value.replace(/[`*_~]/g, '')}
          </a>
        )
      })}
    </nav>
  )
  if (mobile)
    return (
      <details
        ref={details}
        className="my-5 rounded-xl border border-gray-200/80 p-4 xl:hidden dark:border-gray-800"
      >
        <summary className="cursor-pointer text-sm font-bold text-gray-900 dark:text-gray-100">
          文章目录
        </summary>
        <div className="pt-4">{links}</div>
      </details>
    )
  return (
    <div className="hidden max-h-[calc(100dvh-8rem)] overflow-y-auto xl:block">
      <h2 className="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">文章目录</h2>
      {links}
    </div>
  )
}
