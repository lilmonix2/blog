'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export default function ArticleSidebar({ children }: { children: ReactNode }) {
  const sidebar = useRef<HTMLElement>(null)
  const inset = useRef<HTMLSpanElement>(null)
  const [stickyTop, setStickyTop] = useState<number>()

  useEffect(() => {
    const element = sidebar.current
    const spacing = inset.current
    if (!element || !spacing) return

    const update = () => {
      const gap = spacing.offsetHeight
      // Tall sidebars scroll fully into view before sticking at the viewport's lower edge.
      setStickyTop(Math.min(gap, window.innerHeight - element.offsetHeight - gap))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    observer.observe(spacing)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <footer
      ref={sidebar}
      className="xl:sticky xl:top-6 xl:col-start-1 xl:row-start-2 xl:self-start"
      style={{ top: stickyTop }}
    >
      <span
        ref={inset}
        aria-hidden="true"
        className="pointer-events-none invisible absolute h-6 w-0"
      />
      {children}
    </footer>
  )
}
