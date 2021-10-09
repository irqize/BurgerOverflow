import * as THREE from 'three'
import React, { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
// import {softShadows} from '@react-three/drei'

// Soft shadows are expensive, uncomment and refresh when it's too slow
// softShadows()

function damp(target, to, step, delta, v = new THREE.Vector3()) {
  if (target instanceof THREE.Vector3) {
    target.x = THREE.MathUtils.damp(target.x, to[0], step, delta)
    target.y = THREE.MathUtils.damp(target.y, to[1], step, delta)
    target.z = THREE.MathUtils.damp(target.z, to[2], step, delta)
  }
}

function Animation({ v = new THREE.Vector3(), c = new THREE.Color() }) {
  const [active, setActive] = useState(false)
  const [zoom, set] = useState(true)
//   useCursor(active)
  useFrame((state, delta) => {
    const step = 4
    state.camera.fov = THREE.MathUtils.damp(state.camera.fov, zoom ? 50 : 30, step, delta)
    damp(state.camera.position, [zoom ? 0 : -1, zoom ? 12 : 2, zoom ? 9 : 10], step, delta)  
    state.camera.lookAt(0,0,0)
    state.camera.updateProjectionMatrix()
  })
  return (
    // <mesh receiveShadow castShadow onClick={() => set(!zoom)} onPointerOver={() => setActive(true)} onPointerOut={() => setActive(false)}>
    <mesh receiveShadow castShadow onClick={() => set(!zoom)} position={[1,0,0]}>
      <sphereGeometry args={[0.8, 64, 64]} />
      <meshBasicMaterial transparent opacity={0}/>
    </mesh>
  )
}

export default Animation