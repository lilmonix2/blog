'use client'

import { ThemeProvider } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'
import { PhotoProvider } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

const preventDefault = (e: Event) => e.preventDefault()
const preventCtrlScroll = (e: WheelEvent) => {
  if (e.ctrlKey) {
    e.preventDefault()
  }
}

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  const handleVisibleChange = (visible: boolean) => {
    if (visible) {
      window.addEventListener('wheel', preventCtrlScroll, { passive: false })
      window.addEventListener('gesturestart', preventDefault)
      window.addEventListener('gesturechange', preventDefault)
      window.addEventListener('gestureend', preventDefault)
    } else {
      window.removeEventListener('wheel', preventCtrlScroll)
      window.removeEventListener('gesturestart', preventDefault)
      window.removeEventListener('gesturechange', preventDefault)
      window.removeEventListener('gestureend', preventDefault)
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
      <PhotoProvider onVisibleChange={handleVisibleChange}>{children}</PhotoProvider>
    </ThemeProvider>
  )
}
