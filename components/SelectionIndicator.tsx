'use client'

import { useEffect, useRef, useState } from 'react'

/** Highlight bounds come from the rendered link, whose spacing uses Tailwind utilities. */
export default function SelectionIndicator({ activeKey }: { activeKey: string }) {
  const indicator = useRef<HTMLSpanElement>(null)
  const [bounds, setBounds] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)

  useEffect(() => {
    const container = indicator.current?.parentElement
    if (!container) return
    const selected = container.querySelector<HTMLElement>(':scope > a[aria-current="page"]')
    const update = () => {
      if (!selected || !selected.offsetWidth) {
        setBounds(null)
        return
      }
      setBounds({
        x: selected.offsetLeft,
        y: selected.offsetTop,
        width: selected.offsetWidth,
        height: selected.offsetHeight,
      })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(container)
    if (selected) observer.observe(selected)
    return () => observer.disconnect()
  }, [activeKey])

  return (
    <span
      ref={indicator}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 rounded-full bg-white ring-1 shadow-xs ring-gray-200/70 transition-all duration-200 ease-out dark:bg-gray-800 dark:ring-gray-700/70"
      style={{
        transform: `translate(${bounds?.x || 0}px, ${bounds?.y || 0}px)`,
        width: bounds?.width || 0,
        height: bounds?.height || 0,
        opacity: bounds ? 1 : 0,
      }}
    />
  )
}
