'use client'

import { isValidElement, useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react'
import { Copy, Check } from 'lucide-react'

/** Extract the language name from the code element's className (e.g. "language-bash" → "bash"). */
function getLanguage(children: React.ReactNode): string | undefined {
  if (
    isValidElement<{ className?: string }>(children) &&
    typeof children.props?.className === 'string'
  ) {
    const match = children.props.className.match(/language-(\S+)/)
    if (match) return match[1]
  }
  return undefined
}

export default function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const pre = useRef<HTMLPreElement>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [copied, setCopied] = useState(false)
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
    },
    []
  )
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pre.current?.textContent || '')
      setCopied(true)
    } catch {
      /* no-op */
    }
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopied(false), 2000)
  }

  const lang = getLanguage(children)

  return (
    <div className="group relative my-6 overflow-hidden rounded-md bg-gray-800 shadow-md">
      {/* Header bar */}
      <div className="not-prose flex items-center justify-between border-b border-gray-700/50 px-4 py-2 text-xs text-gray-400">
        <span className="font-mono select-none">{lang || 'code'}</span>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-gray-700 hover:text-gray-200"
          onClick={copy}
          aria-label="复制代码"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-400" aria-hidden="true" />
              <span className="text-green-400">已复制</span>
            </>
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {/* Code content */}
      <pre
        ref={pre}
        {...props}
        className={`${props.className || ''} !mt-0 !mb-0 !rounded-none !bg-gray-800 !text-gray-200`}
      >
        {children}
      </pre>
    </div>
  )
}
