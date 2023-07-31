// @ts-nocheck
import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import useGame from '../stores/useGame'
import { addEffect } from '@react-three/fiber'
export default function Interface() {
  const forward = useKeyboardControls((state) => state.forward)
  const backward = useKeyboardControls((state) => state.backward)
  const leftward = useKeyboardControls((state) => state.leftward)
  const rightward = useKeyboardControls((state) => state.rightward)
  const jump = useKeyboardControls((state) => state.jump)

  const restart = useGame((state) => state.restart)
  const phase = useGame((state) => state.phase)
  const time = useRef()
  useEffect(() => {
    //requestAnimationFrame，並且可以在 React 中做到這一點。然而，R3F 已經通過 addEffect 鉤子為我們解決了這個問題，該鉤子可以在 <Canvas> 之外使用，並且將與 useFrame 同步執行。
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState()

      let elapsedTime = 0

      if (state.phase === 'playing') elapsedTime = Date.now() - state.startTime
      else if (state.phase === 'ended')
        elapsedTime = state.endTime - state.startTime
      elapsedTime /= 1000
      elapsedTime = elapsedTime.toFixed(2)
      if (time.current) time.current.textContent = elapsedTime
    })

    return () => {
      unsubscribeEffect()
    }
  }, [])

  return (
    <>
      <div className='interface'>
        {/* Time */}
        <div ref={time} className='time'>
          0.00
        </div>
        {phase === 'ended' && (
          <div className='restart' onClick={restart}>
            Restart
          </div>
        )}
        {/* Controls */}
        <div className='controls'>
          <div className='raw'>
            <div className={`key ${forward ? 'active' : ''}`}>w</div>
          </div>
          <div className='raw'>
            <div className={`key ${leftward ? 'active' : ''}`}>a</div>
            <div className={`key ${rightward ? 'active' : ''}`}>s</div>
            <div className={`key ${backward ? 'active' : ''}`}>d</div>
          </div>
          <div className='raw'>
            <div className={`key large ${jump ? 'active' : ''}`}>space</div>
          </div>
        </div>
      </div>
    </>
  )
}
