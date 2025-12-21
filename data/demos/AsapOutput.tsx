'use client'

import React, { useState, useEffect, useRef } from 'react'

const sequenceLength = 31
const initialRequestSequence = new Array(sequenceLength).fill(false)
const initialOutputSequence = new Array(sequenceLength).fill('-')

const AsapOutputDemo = () => {
  const [requestSequence, setRequestSequence] = useState(initialRequestSequence)
  const [outputSequence, setOutputSequence] = useState(initialOutputSequence)
  const [isRunning, setIsRunning] = useState(false)
  const process1Ref = useRef<HTMLDivElement>(null)
  const process2Ref = useRef<HTMLDivElement>(null)

  const requestSequenceRef = useRef([...initialRequestSequence])
  const outputSequenceRef = useRef([...initialOutputSequence])
  const nextOutputIndexRef = useRef(0)

  const xss_rpc_call = (num: number, callback: (hexNum: string) => void) => {
    const DelayMaxMs = 6000
    const randomDelay = Math.floor(Math.random() * DelayMaxMs)
    const hexadecimalNumber = num.toString(16)
    setTimeout(() => {
      callback(hexadecimalNumber)
    }, randomDelay)
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
    setIsRunning(false)
    setTimeout(() => asapOutput(), 0)
  }

  useEffect(() => {
    if (nextOutputIndexRef.current >= sequenceLength) {
      setIsRunning(false)
    }
  }, [outputSequence])

  return (
    <div className="rounded-md bg-gray-200 p-5 font-sans">
      <button
        onClick={resetAndRun}
        disabled={isRunning}
        className={`mt-1 rounded-lg px-5 py-2 text-lg text-white transition-colors ${isRunning ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer bg-blue-500 hover:bg-blue-700'}`}
      >
        {isRunning ? '演示中…' : '重新演示'}
      </button>

      <h2 className="mb-2 text-xl font-bold">Request Sequence</h2>
      <div ref={process1Ref} className="mb-8">
        {requestSequence.map((flag, index) => (
          <div
            key={index}
            className={`item m-2 inline-block min-w-[40px] rounded-md border border-gray-800 px-2 py-2 text-center text-sm transition-all ${flag ? 'bg-orange-500 text-white' : ''}`}
          >
            {index}
          </div>
        ))}
      </div>

      <h2 className="mb-2 text-xl font-bold">Output Sequence</h2>
      <div ref={process2Ref}>
        {outputSequence.map((v, index) => (
          <div
            key={index}
            className={`item m-2 inline-block min-w-[40px] rounded-md border border-gray-800 px-2 py-2 text-center text-sm transition-all ${v !== '-' ? 'bg-green-500 text-white' : ''}`}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AsapOutputDemo
