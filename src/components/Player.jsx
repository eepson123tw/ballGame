// @ts-nocheck
import React, { useMemo, useState, useRef, useEffect } from 'react'
import { RigidBody, useRapier } from '@react-three/rapier'
import { useFrame, useLoader } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
export default function Player() {
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const ball = useRef()
  const { rapier, world } = useRapier()
  // 最佳化
  const [smoothCameraPosition] = useState(() => new THREE.Vector3(10, -10, 10))
  const [smoothCameraTarget] = useState(() => new THREE.Vector3())
  useFrame((state, delta) => {
    /**
     * controls
     */
    const { forward, backward, rightward, leftward } = getKeys()
    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.6 * delta // 往前推的力量
    const torqueStrength = 0.2 * delta // x軸旋轉

    if (forward) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }
    if (rightward) {
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }
    if (backward) {
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }
    if (leftward) {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    ball.current.applyImpulse(impulse)
    ball.current.applyTorqueImpulse(torque)

    /**
     * camera
     */

    const ballPosition = ball.current.translation() //抓到球体 目前xyz

    const cameraPosition = new THREE.Vector3()

    cameraPosition.copy(ballPosition)
    cameraPosition.z += 4
    cameraPosition.y += 3

    const cameraTarget = new THREE.Vector3()
    cameraTarget.copy(ballPosition)
    cameraTarget.y += 0.5
    //lerping 有點像追焦
    smoothCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothCameraTarget.lerp(cameraTarget, 5 * delta)

    state.camera.position.copy(smoothCameraPosition)
    state.camera.lookAt(smoothCameraTarget)
  })

  const jump = () => {
    const origin = ball.current.translation()
    origin.y -= 0.31 // 將座標點移到球體下
    const direction = { x: 0, y: -1, z: 0 }
    const ray = new rapier.Ray(origin, direction) //座標系距離
    const hit = world.castRay(ray, 10, true)
    if (hit.toi < 0.6) {
      ball.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
    }
  }
  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      (state) => state.jump, // listen Event
      (value) => {
        if (value) {
          jump()
        }
      }
    )
    return () => {
      unsubscribeJump() //因為 rerender 時 subscribeKeys　會被觸發２次
    }
  }, [])

  return (
    <RigidBody
      ref={ball}
      canSleep={false}
      restitution={0.2}
      friction={1}
      position={[0, 1, 0]}
      colliders='ball'
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color='mediumpurple' />
      </mesh>
    </RigidBody>
  )
}
