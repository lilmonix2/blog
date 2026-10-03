'use client'

import React, { useState, useEffect, useRef } from 'react'

const sequenceLength = 31

const AsapOutputDemo = () => {
  const [state, setState] = useState(() => ({
    requestSequence: new Array(sequenceLength).fill(false),
    outputSequence: new Array(sequenceLength).fill('-'),
    nextOutputIndex: 0,
    isRunning: false,
  }))

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  const mockRpcCall = (num: number, callback: (hexNum: string) => void) => {
    const DelayMaxMs = 6000
    const randomDelay = Math.floor(Math.random() * DelayMaxMs)
    timers.current.push(
      setTimeout(() => {
        callback(num.toString(16))
      }, randomDelay)
    )
  }

  const startDemo = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []

    setState({
      requestSequence: new Array(sequenceLength).fill(false),
      outputSequence: new Array(sequenceLength).fill('-'),
      nextOutputIndex: 0,
      isRunning: true,
    })

    Array.from({ length: sequenceLength }).forEach((_, i) => {
      mockRpcCall(i, () => {
        setState((prev) => {
          const newReq = [...prev.requestSequence]
          newReq[i] = true

          const newOut = [...prev.outputSequence]
          let nextIdx = prev.nextOutputIndex

          while (nextIdx < sequenceLength && newReq[nextIdx]) {
            newOut[nextIdx] = nextIdx.toString(16)
            nextIdx++
          }

          return {
            requestSequence: newReq,
            outputSequence: newOut,
            nextOutputIndex: nextIdx,
            isRunning: nextIdx < sequenceLength,
          }
        })
      })
    })
  }

  return (
    <div className="rounded-md bg-gray-100 p-5 font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <button
        onClick={startDemo}
        disabled={state.isRunning}
        className={`mt-1 rounded-lg px-5 py-2 text-lg text-white transition-colors ${state.isRunning ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer bg-primary-500 hover:bg-primary-600'}`}
      >
        {state.isRunning ? '演示中…' : '重新演示'}
      </button>

      <p role="status" className="my-3 text-sm">
        已返回 {state.requestSequence.filter(Boolean).length} / {sequenceLength}，已输出{' '}
        {state.outputSequence.filter((value) => value !== '-').length} / {sequenceLength}
      </p>

      <h3 className="mb-2 text-xl font-bold">请求返回顺序</h3>
      <div className="mb-8">
        {state.requestSequence.map((flag, index) => (
          <div
            key={index}
            className={`item m-2 inline-block min-w-[40px] rounded-md border border-gray-800 px-2 py-2 text-center text-sm transition-all ${flag ? 'bg-orange-700 text-white' : ''}`}
          >
            {index}
            <span className="sr-only">{flag ? '已返回' : '等待返回'}</span>
          </div>
        ))}
      </div>

      <h3 className="mb-2 text-xl font-bold">按序输出</h3>
      <div>
        {state.outputSequence.map((v, index) => (
          <div
            key={index}
            className={`item m-2 inline-block min-w-[40px] rounded-md border border-gray-800 px-2 py-2 text-center text-sm transition-all ${v !== '-' ? 'bg-green-700 text-white' : ''}`}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AsapOutputDemo
