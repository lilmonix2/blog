'use client'

import dynamic from 'next/dynamic'
import { Component, useEffect, useState, type ReactNode } from 'react'
import { useTheme } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'

const Giscus = dynamic(() => import('@giscus/react'), {
  ssr: false,
  loading: () => <p role="status">正在加载评论…</p>,
})

class CommentsBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function Comments({ slug }: { slug: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [attempt, setAttempt] = useState(0)
  const { resolvedTheme } = useTheme()
  const config = siteMetadata.comments.giscusConfig
  const ready = !!(config.repo && config.repositoryId && config.category && config.categoryId)
  useEffect(() => {
    if (status !== 'loading') return
    const timeout = setTimeout(() => setStatus('error'), 15000)
    return () => clearTimeout(timeout)
  }, [status, attempt])
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      const iframe = document
        .getElementById(`comments-${slug.replace(/[^a-zA-Z0-9_-]/g, '-')}`)
        ?.shadowRoot?.querySelector('iframe')
      if (event.origin !== 'https://giscus.app' || event.source !== iframe?.contentWindow) return
      const data = event.data?.giscus
      if (!data) return
      // An article without comments is a valid empty state; Giscus creates the thread on first submission.
      if (typeof data.error === 'string' && !data.error.includes('Discussion not found'))
        setStatus('error')
      else if (data.resizeHeight || data.discussion || data.error?.includes('Discussion not found'))
        setStatus('ready')
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [slug])
  const retry = () => {
    setAttempt((value) => value + 1)
    setStatus('loading')
  }
  if (!ready) return null
  return (
    <div>
      {status === 'idle' && (
        <button
          type="button"
          className="rounded-md border border-gray-300 px-4 py-3 dark:border-gray-600"
          onClick={retry}
        >
          加载评论
        </button>
      )}
      {status === 'loading' && <p role="status">正在连接评论服务…</p>}
      {status === 'error' && (
        <div role="alert" className="space-y-3">
          <p>评论暂时无法加载。</p>
          <button
            className="rounded-md border border-gray-300 px-4 py-2 dark:border-gray-600"
            onClick={retry}
          >
            重试
          </button>
          <p>
            <a
              className="text-primary-500 dark:text-primary-400"
              href={`${siteMetadata.siteRepo}/discussions`}
              target="_blank"
              rel="noopener noreferrer"
            >
              前往 GitHub 讨论
            </a>
          </p>
        </div>
      )}
      {(status === 'loading' || status === 'ready') && (
        <CommentsBoundary key={attempt} onError={() => setStatus('error')}>
          <Giscus
            key={`${slug}-${attempt}`}
            id={`comments-${slug.replace(/[^a-zA-Z0-9_-]/g, '-')}`}
            repo={config.repo as `${string}/${string}`}
            repoId={config.repositoryId!}
            category={config.category!}
            categoryId={config.categoryId!}
            mapping="pathname"
            reactionsEnabled={config.reactions}
            emitMetadata={config.metadata}
            theme={resolvedTheme === 'dark' ? config.darkTheme : config.theme}
            lang={config.lang}
            loading="eager"
          />
        </CommentsBoundary>
      )}
    </div>
  )
}
