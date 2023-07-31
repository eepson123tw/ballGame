// @ts-nocheck

import Lights from './Lights.jsx'
import React from 'react'
import { Level } from './components/Level.jsx'
import { Physics } from '@react-three/rapier'
import Player from './components/Player.jsx'
import useGame from './stores/useGame.jsx'
export default function BallGame() {
  const blocksCount = useGame((state) => {
    return state.blocksCount
  })
  const blocksSeed = useGame((state) => {
    return state.blocksSeed
  })
  return (
    <>
      <Physics debug={false}>
        <Lights />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>
    </>
  )
}
