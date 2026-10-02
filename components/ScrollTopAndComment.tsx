'use client'

import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState } from 'react'
import { ArrowUp, MessageSquare } from 'lucide-react'

const ScrollTopAndComment = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 50) setShow(true)
      else setShow(false)
    }

    handleWindowScroll()
    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleScrollToComment = () => {
    document.getElementById('comment')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      className={`fixed right-5 bottom-6 z-40 flex-col gap-3 transition-opacity duration-200 ${
        show ? 'flex' : 'pointer-events-none hidden'
      }`}
    >
      {siteMetadata.comments?.provider && (
        <button
          aria-label="跳到评论"
          onClick={handleScrollToComment}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200/80 bg-white/80 text-gray-600 shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-gray-900 hover:shadow-lg active:scale-95 dark:border-gray-700/80 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
      <button
        aria-label="返回顶部"
        onClick={handleScrollTop}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200/80 bg-white/80 text-gray-600 shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-gray-900 hover:shadow-lg active:scale-95 dark:border-gray-700/80 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default ScrollTopAndComment
