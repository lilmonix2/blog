'use client'
import dynamic from 'next/dynamic'
export default dynamic(() => import('@/data/demos/AsapOutput'), {
  ssr: false,
  loading: () => <p role="status">正在加载演示…</p>,
})
