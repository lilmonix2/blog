'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PhotoProvider } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

export default function ArticleImages({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false)
  const opener = useRef<HTMLElement | null>(null)
  const close = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!visible) return
    const frame = requestAnimationFrame(() => {
      const dialog = document.querySelector('.article-photo-viewer[role="dialog"]')
      dialog?.setAttribute('aria-label', '图片预览')
      dialog?.setAttribute('aria-modal', 'true')
      close.current?.focus()
    })
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const buttons = Array.from(
        document.querySelectorAll<HTMLButtonElement>('.article-photo-viewer button:not(:disabled)')
      )
      const first = buttons[0]
      const last = buttons.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', trapFocus)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', trapFocus)
    }
  }, [visible])
  return (
    <PhotoProvider
      className="article-photo-viewer"
      onVisibleChange={(value) => {
        if (value)
          opener.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null
        else opener.current?.focus()
        setVisible(value)
      }}
      loadingElement={
        <p role="status" className="text-white">
          正在加载图片…
        </p>
      }
      brokenElement={({ src }: { src?: string }) => (
        <div role="alert" className="text-center text-white">
          <p>图片暂时无法加载。</p>
          <a href={src} target="_blank" rel="noopener noreferrer" className="underline">
            在新窗口重试
          </a>
        </div>
      )}
      toolbarRender={({ index, images, onIndexChange, onScale, scale, onClose }) => (
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="上一张图片"
            disabled={index === 0}
            onClick={() => onIndexChange(index - 1)}
            className="h-11 w-11 rounded text-xl text-white disabled:opacity-40"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="下一张图片"
            disabled={index === images.length - 1}
            onClick={() => onIndexChange(index + 1)}
            className="h-11 w-11 rounded text-xl text-white disabled:opacity-40"
          >
            →
          </button>
          <button
            type="button"
            aria-label="缩小图片"
            onClick={() => onScale(Math.max(0.5, scale - 0.5))}
            className="h-11 w-11 rounded text-xl text-white"
          >
            −
          </button>
          <button
            type="button"
            aria-label="放大图片"
            onClick={() => onScale(Math.min(5, scale + 0.5))}
            className="h-11 w-11 rounded text-xl text-white"
          >
            +
          </button>
          <button
            ref={close}
            type="button"
            aria-label="关闭图片预览"
            onClick={onClose}
            className="h-11 w-11 rounded text-xl text-white"
          >
            ×
          </button>
        </div>
      )}
    >
      {children}
    </PhotoProvider>
  )
}
