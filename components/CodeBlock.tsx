'use client'

import { isValidElement, useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react'
import { Copy, Check } from 'lucide-react'

const COPY_FEEDBACK_DURATION_MS = 2_000

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
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
    },
    []
  )
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pre.current?.textContent || '')
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopyState('idle'), COPY_FEEDBACK_DURATION_MS)
  }

  const lang = getLanguage(children)

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
      {/* Header bar */}
      <div className="not-prose flex min-h-12 items-center justify-between border-b border-gray-700 px-4 text-xs text-gray-300">
        <span className="font-mono select-none">{lang || 'code'}</span>
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-300 transition-colors hover:text-white"
          onClick={copy}
          aria-label="复制代码"
        >
          <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
            <Copy
              className={`absolute inset-0 h-4 w-4 transition duration-200 ${copyState === 'copied' ? 'scale-75 -rotate-12 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
            />
            <Check
              className={`absolute inset-0 h-4 w-4 text-green-400 transition duration-200 ${copyState === 'copied' ? 'scale-100 rotate-0 opacity-100' : 'scale-75 rotate-12 opacity-0'}`}
            />
          </span>
          <span role="status" className="sr-only">
            {copyState === 'copied' ? '已复制' : copyState === 'error' ? '复制失败' : '复制代码'}
          </span>
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
