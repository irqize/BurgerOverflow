import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const degreesToRadians = (angle) => (angle * Math.PI) / 180;

export default function Kitchen(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('./assets/kitchen.gltf')
  return (
    <group position={[-2, -12.5, 7]} 
            scale={[8, 8, 8]}
            rotation={[degreesToRadians(16), degreesToRadians(0), degreesToRadians(0)]}
            ref={group} 
            {...props} 
            dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Plane_1.geometry} material={materials.wall} />
      <mesh castShadow receiveShadow geometry={nodes.Plane_2.geometry} material={materials.glass} />
      <mesh castShadow receiveShadow geometry={nodes.Plane_3.geometry} material={materials.wood} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_4.geometry}
        material={materials['metal shine']}
      />
      <mesh castShadow receiveShadow geometry={nodes.Plane_5.geometry} material={materials.metal} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_6.geometry}
        material={materials.marble}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_7.geometry}
        material={materials.emision}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_8.geometry}
        material={materials.ground}
      />
      <mesh castShadow receiveShadow geometry={nodes.Plane_9.geometry} material={materials.glaay} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_10.geometry}
        material={materials['dark glass']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_11.geometry}
        material={materials['metal mat.001']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_12.geometry}
        material={materials.plane}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_13.geometry}
        material={materials['metal mat.002']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_14.geometry}
        material={materials['metal golde']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_15.geometry}
        material={materials.ceramik}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_16.geometry}
        material={materials['marble.001']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_17.geometry}
        material={materials['Material.001']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_18.geometry}
        material={materials['wood.001']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_19.geometry}
        material={materials['wood.002']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_20.geometry}
        material={materials['Material.003']}
      />
    </group>
  )
}

useGLTF.preload('./assets//kitchen.gltf')