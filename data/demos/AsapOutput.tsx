'use client'

import React, { useState, useEffect, useRef } from 'react'

const sequenceLength = 31
const initialRequestSequence = new Array(sequenceLength).fill(false)
const initialOutputSequence = new Array(sequenceLength).fill('-')

const AsapOutputDemo = () => {
  const [requestSequence, setRequestSequence] = useState(initialRequestSequence)
  const [outputSequence, setOutputSequence] = useState(initialOutputSequence)
  const [isRunning, setIsRunning] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
    },
    []
  )

  const requestSequenceRef = useRef([...initialRequestSequence])
  const outputSequenceRef = useRef([...initialOutputSequence])
  const nextOutputIndexRef = useRef(0)

  const xss_rpc_call = (num: number, callback: (hexNum: string) => void) => {
    const DelayMaxMs = 6000
    const randomDelay = Math.floor(Math.random() * DelayMaxMs)
    const hexadecimalNumber = num.toString(16)
    timers.current.push(
      setTimeout(() => {
        callback(hexadecimalNumber)
      }, randomDelay)
    )
  }

  const performOutput = () => {
    const newOutputSequence = [...outputSequenceRef.current]
    let i = nextOutputIndexRef.current
    while (i < newOutputSequence.length && requestSequenceRef.current[i]) {
      newOutputSequence[i] = i.toString(16)
      i++
    }
    outputSequenceRef.current = [...newOutputSequence]
    nextOutputIndexRef.current = i
    setOutputSequence(outputSequenceRef.current)
  }

  const asapOutput = () => {
    setIsRunning(true)
    Array.from({ length: sequenceLength }).forEach((_, i) => {
      xss_rpc_call(i, () => {
        requestSequenceRef.current[i] = true
        setRequestSequence((prev) => {
          const newSequence = [...prev]
          newSequence[i] = true
          return newSequence
        })
        performOutput()
      })
    })
  }

  const resetAndRun = () => {
    const resetReq = new Array(sequenceLength).fill(false)
    const resetOut = new Array(sequenceLength).fill('-')
    requestSequenceRef.current = [...resetReq]
    outputSequenceRef.current = [...resetOut]
    nextOutputIndexRef.current = 0
    setRequestSequence(resetReq)
    setOutputSequence(resetOut)
    timers.current.forEach(clearTimeout)
    timers.current = []
    asapOutput()
  }

  useEffect(() => {
    if (nextOutputIndexRef.current >= sequenceLength) {
      setIsRunning(false)
    }
  }, [outputSequence])

  return (
    <div className="rounded-md bg-gray-100 p-5 font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <button
        onClick={resetAndRun}
        disabled={isRunning}
        className={`mt-1 rounded-lg px-5 py-2 text-lg text-white transition-colors ${isRunning ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer bg-blue-700 hover:bg-blue-800'}`}
      >
        {isRunning ? '演示中…' : '重新演示'}
      </button>

      <p role="status" className="my-3 text-sm">
        已返回 {requestSequence.filter(Boolean).length} / {sequenceLength}，已输出{' '}
        {outputSequence.filter((value) => value !== '-').length} / {sequenceLength}
      </p>
      <h3 className="mb-2 text-xl font-bold">请求返回顺序</h3>
      <div className="mb-8">
        {requestSequence.map((flag, index) => (
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
        {outputSequence.map((v, index) => (
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
