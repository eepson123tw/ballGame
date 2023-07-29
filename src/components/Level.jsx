// @ts-nocheck
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  useGLTF,
  CubeCamera,
  Caustics,
  MeshRefractionMaterial,
} from "@react-three/drei";
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floorOne = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floorTwo = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const goalMaterial = new THREE.MeshStandardMaterial({ color: "blue" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* floor */}
      <mesh
        geometry={boxGeometry}
        material={floorOne}
        position={(0, -0.1, 0)}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
}

function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [speed] = useState(() =>
    Math.random() + 0.2 * Math.random() < 0.5 ? -1 : 1
  );
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacle.current.setNextKinematicRotation(rotation);
  });
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
        type="kinematicPosition"
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
  );
}

function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time + timeOffset) + 1.15;
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y,
      z: position[2], //須注意Z軸也須跟者往後動
    });
  });
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
        type="kinematicPosition"
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
  );
}

function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime() * 4;
    const x = Math.sin(time + timeOffset) * 1.25;
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 1.4,
      z: position[2],
    });
  });
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
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[2.5, 2.5, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

function BlockEnd({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floorOne}
        scale={[4, 4, 4]}
        receiveShadow
      />
    </group>
  );
}

function BlockTopEnd({ position = [0, 0, 0] }) {
  const group = useRef();
  const ref = useRef();
  const texture = useLoader(
    RGBELoader,
    "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr"
  );
  const { nodes, materials } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/diamond/model.gltf"
  );

  return (
    <>
      {/* <CubeCamera resolution={256} frames={1}>
        <Caustics
          backfaces
          color={"white"}
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
            geometry={nodes.Diamond_1_0.geometry}
            {...props}
          >
            <MeshRefractionMaterial
              envMap={texture}
              {...config}
              toneMapped={false}
            />
          </mesh>
        </Caustics>
      </CubeCamera> */}
      <CubeCamera resolution={256} frames={1} envMap={texture}>
        {(texture) => (
          <Caustics
            backfaces
            color={"white"}
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
              rotation={[0, 0, 0.715]}
              position={[0, -0.175 + 0.5, 0]}
            >
              <MeshRefractionMaterial envMap={texture} toneMapped={false} />
            </mesh>
          </Caustics>
        )}
        {/* <group position={position}>
          <mesh
            geometry={boxGeometry}
            material={goalMaterial}
            scale={[1, 2, 1]}
            receiveShadow
          />
          {texture && (
            <primitive
              object={nodes.Scene}
              material={materials.Material}
              scale={0.2}
              position={[0, 1, 0]}
            />
          )}
        </group> */}
      </CubeCamera>
    </>
  );
}

export default function Level() {
  return (
    <>
      <BlockStart position={[0, 0, 16]} />
      <BlockSpinner position={[0, 0, 12]} />
      <BlockLimbo position={[0, 0, 8]} />
      <BlockAxe position={[0, 0, 4]} />
      <BlockEnd position={[0, 1.9, 0]} />
      <BlockTopEnd position={[0, 3, 0]} />
    </>
  );
}
