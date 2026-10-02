'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import Link from './Link'
import { assetPath } from '@/lib/assets'

type SearchPost = { title: string; path: string; summary?: string; tags: string[]; text: string }

export default function SearchButton() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<SearchPost[] | null>(null)
  const [error, setError] = useState(false)
  const [retry, setRetry] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])
  useEffect(() => {
    if (!open || posts) return
    const controller = new AbortController()
    let disposed = false
    const timeout = setTimeout(() => controller.abort(), 15000)
    setError(false)
    fetch(String(assetPath('/search.json')), { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Search unavailable')
        const data: unknown = await response.json()
        if (
          !Array.isArray(data) ||
          data.some(
            (entry) =>
              typeof entry.title !== 'string' ||
              typeof entry.path !== 'string' ||
              !entry.path.startsWith('blog/') ||
              !Array.isArray(entry.tags) ||
              typeof entry.text !== 'string'
          )
        )
          throw new Error('Invalid search index')
        setPosts(data)
      })
      .catch(() => {
        if (!disposed) setError(true)
      })
      .finally(() => clearTimeout(timeout))
    return () => {
      disposed = true
      controller.abort()
      clearTimeout(timeout)
    }
  }, [open, posts, retry])
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  const results = (posts || []).filter((post) =>
    terms.every((term) =>
      `${post.title} ${post.summary || ''} ${post.tags.join(' ')} ${post.text}`
        .toLocaleLowerCase()
        .includes(term)
    )
  )
  const close = () => {
    setOpen(false)
    setQuery('')
  }
  return (
    <>
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-95 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        aria-label="搜索文章"
        aria-keyshortcuts="Control+k Meta+k"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" aria-hidden="true" />
      </button>
      <Dialog open={open} onClose={close} initialFocus={input} className="relative z-70">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
        <div className="fixed inset-0 overflow-y-auto p-4 sm:pt-24">
          <DialogPanel className="mx-auto max-w-2xl rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                搜索文章
              </DialogTitle>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 active:scale-95 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                onClick={close}
                aria-label="关闭搜索"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label htmlFor="blog-search" className="sr-only">
              搜索关键词
            </label>
            <div className="relative flex items-center">
              <Search
                className="pointer-events-none absolute left-3.5 h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              <input
                ref={input}
                id="blog-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索标题、标签或正文…"
                className="focus:border-primary-500 focus:ring-primary-500/20 dark:focus:border-primary-400 w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pr-4 pl-10 text-sm transition-all focus:bg-white focus:ring-2 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:bg-gray-900"
              />
            </div>
            <div role="status" className="py-3 text-sm text-gray-500 dark:text-gray-400">
              {error
                ? '搜索暂时不可用，请重试。'
                : !posts
                  ? '正在加载搜索内容…'
                  : terms.length
                    ? `找到 ${results.length} 篇文章`
                    : '输入关键词搜索，按 Esc 关闭。'}
            </div>
            {error && (
              <button
                className="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                onClick={() => setRetry((value) => value + 1)}
              >
                重试
              </button>
            )}
            <ul className="max-h-[55dvh] overflow-y-auto">
              {!error &&
                results.slice(0, 30).map((post) => (
                  <li key={post.path}>
                    <Link
                      href={`/${post.path}`}
                      onClick={close}
                      className="block rounded-lg p-3 hover:bg-gray-100 focus-visible:bg-gray-100 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
                    >
                      <span className="font-semibold">{post.title}</span>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {post.summary}
                      </p>
                    </Link>
                  </li>
                ))}
            </ul>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
