// @ts-nocheck
import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import BallGame from './BallGame.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
  <Canvas
    shadows
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [2.5, 4, 6]
    }}
  >
    <BallGame />
  </Canvas>
)
