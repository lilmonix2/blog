'use client'

import { useEffect, useState } from 'react'

export interface TocItem {
  value: string
  url: string
  depth: number
}

interface TableOfContentsProps {
  toc: TocItem[]
}

const TableOfContents = ({ toc }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%' }
    )

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headings.forEach((heading) => observer.observe(heading))

    return () => {
      headings.forEach((heading) => observer.unobserve(heading))
    }
  }, [])

  if (!toc || toc.length === 0) return null

  return (
    <div className="hidden xl:block">
      <div>
        <h2 className="mb-4 text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          目录
        </h2>
        <nav className="space-y-2">
          {toc.map((item) => {
            const id = item.url.replace('#', '')
            const isActive = activeId === id

            return (
              <a
                key={item.url}
                href={item.url}
                className={`hover:text-primary-500 dark:hover:text-primary-400 block text-sm transition-colors ${
                  item.depth === 2 ? 'pl-0' : item.depth === 3 ? 'pl-4' : 'pl-8'
                } ${
                  isActive
                    ? 'text-primary-500 dark:text-primary-400 font-medium'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.value}
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default TableOfContents
