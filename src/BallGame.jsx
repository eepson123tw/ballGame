// @ts-nocheck

import Lights from './Lights.jsx'
import React from 'react'
import { Level } from './components/Level.jsx'
import { Physics } from '@react-three/rapier'
import Player from './components/Player.jsx'
export default function Experience() {
  return (
    <>
      <Physics debug={false}>
        <Lights />
        <Level />
        <Player />
      </Physics>
    </>
  )
}
