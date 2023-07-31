// @ts-nocheck
import React, { useMemo, useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useFrame, useLoader } from '@react-three/fiber'
import {
  useGLTF,
  CubeCamera,
  Caustics,
  MeshRefractionMaterial,
  Text,
  Float
} from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floorOne = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floorTwo = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const goalMaterial = new THREE.MeshStandardMaterial({ color: 'lightblue' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })
const skyMaterial = new THREE.MeshStandardMaterial({ color: '#E5E5E6' })
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float
        position={[0, 1.5, 0]}
        floatIntensity={0.25}
        rotationIntensity={0.25}
      >
        <Text
          font='./bebas-neue-v9-latin-regular.woff'
          scale={0.5}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign='right'
          position={[0.75, 0.65, 0]}
          rotation-y={-0.25}
        >
          Ball Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      {/* floor */}
      <mesh
        geometry={boxGeometry}
        material={floorOne}
        position={(0, -0.1, 0)}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  )
}

export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const [speed] = useState(() =>
    Math.random() + 0.2 * Math.random() < 0.5 ? -1 : 1
  )
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    const rotation = new THREE.Quaternion()
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
    obstacle.current.setNextKinematicRotation(rotation)
  })
  return (
    <group position={position}>
      {/* floor */}
      <mesh
        geometry={boxGeometry}
        material={floorTwo}
        position={(0, -0.1, 0)}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type='kinematicPosition'
        position={[0, 0.3, 0]}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  )
}

export function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    const y = Math.sin(time + timeOffset) + 1.15
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y,
      z: position[2] //須注意Z軸也須跟者往後動
    })
  })
  return (
    <group position={position}>
      {/* floor */}
      <mesh
        geometry={boxGeometry}
        material={floorTwo}
        position={(0, -0.1, 0)}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type='kinematicPosition'
        position={[0, 0.3, 0]}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.7, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  )
}

export function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const [timeOffset] = useState(() => Math.random() * Math.PI)
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime() * 4
    const x = Math.sin(time + timeOffset)
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 1.4,
      z: position[2]
    })
  })
  return (
    <group position={position}>
      {/* floor */}
      <mesh
        geometry={boxGeometry}
        material={floorTwo}
        position={(0, -0.1, 0)}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type='kinematicPosition'
        position={[0, 0.3, 0]}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[2.2, 2.5, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  )
}

export function BlockEnd({ position = [0, 0, 0] }) {
  //todo 加上台階
  return (
    <RigidBody type='fixed'>
      <group position={[position[0], 2, position[2]]}>
        <mesh
          geometry={boxGeometry}
          material={floorOne}
          scale={[4, 4, 4]}
          receiveShadow
        />
      </group>
      <mesh
        position={[position[0] - 1.2, 0.2, position[2] + 2.5]}
        geometry={boxGeometry}
        material={floorOne}
        scale={[1, 0.3, 1]}
        receiveShadow
      />
      <mesh
        position={[position[0], 1.2, position[2] + 2.5]}
        geometry={boxGeometry}
        material={floorOne}
        scale={[1, 0.3, 1]}
        receiveShadow
      />
      <mesh
        position={[position[0] + 1.2, 2, position[2] + 2.5]}
        geometry={boxGeometry}
        material={floorOne}
        scale={[1, 0.3, 1]}
        receiveShadow
      />
      <mesh
        position={[position[0] + 2.6, 2.6, position[2] + 2.5]}
        geometry={boxGeometry}
        material={floorOne}
        scale={[1, 0.3, 1]}
        receiveShadow
      />
      <mesh
        position={[position[0] + 1.8, 3.5, position[2] + 1.45]}
        geometry={boxGeometry}
        material={skyMaterial}
        scale={[1, 0.1, 2]}
        receiveShadow
      />
    </RigidBody>
  )
}

export function BlockTopEnd({ position = [0, 0, 0] }) {
  const group = useRef()
  const ref = useRef()
  const texture = useLoader(
    RGBELoader,
    'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr'
  )
  const { nodes, materials } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/diamond/model.gltf'
  )

  nodes.Scene.children.forEach((mesh) => {
    mesh.castShadow = true
  })

  return (
    <>
      <EffectComposer>
        <Bloom
          luminanceThreshold={1}
          intensity={2}
          levels={9}
          mipmapBlur
        ></Bloom>
      </EffectComposer>
      <group position={position}>
        <mesh
          position={[0, 1, 0]}
          geometry={boxGeometry}
          material={goalMaterial}
          scale={[1, 0.01, 1]}
          receiveShadow
        />
      </group>
      <CubeCamera resolution={256} frames={1} envMap={texture}>
        {(texture) => (
          <RigidBody
            type='fixed'
            colliders='hull'
            restitution={0.2}
            friction={0}
          >
            <Caustics
              backfaces
              color={'white'}
              position={[0, -0.5, 0]}
              lightSource={[5, 5, -10]}
              worldRadius={0.1}
              ior={1.8}
              backfaceIor={1.1}
              intensity={0.1}
            >
              <mesh
                castShadow
                ref={ref}
                geometry={nodes.Diamond.geometry}
                rotation={[0, 0, 0]}
                position={[0, position[1] + 2, position[2]]}
                scale={0.3}
              >
                <MeshRefractionMaterial
                  envMap={texture}
                  toneMapped={false}
                  bounces={3}
                  aberrationStrength={0.01}
                  ior={2.75}
                  fresnel={1}
                  color={'white'}
                  fastChroma={true}
                />
              </mesh>
            </Caustics>
          </RigidBody>
        )}
      </CubeCamera>
    </>
  )
}

function Bounds({ length = 1 }) {
  return (
    <>
      <RigidBody type='fixed' restitution={0.2} friction={0}>
        <mesh
          position={[2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          materials={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
          castShadow
        ></mesh>
        <mesh
          position={[-2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          materials={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
          receiveShadow
        ></mesh>
        <mesh
          position={[0, 2, -(length * 4) + 2]}
          geometry={boxGeometry}
          materials={wallMaterial}
          scale={[4, 5, 0.3]}
          receiveShadow
        ></mesh>
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  )
}

export function Level({
  count = 3,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
  speed = 0
}) {
  const blocks = useMemo(() => {
    const blocks = []
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      blocks.push(type)
    }

    return blocks
  }, [count, types, speed])
  return (
    <>
      <color attach={'background'} args={['#f0f0f0']}></color>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <BlockTopEnd position={[0, 3, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  )
}
