import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

// Place the plate model at the position of the lane
export default function Plate(props) {
    const group = useRef()
    const { nodes, materials } = useGLTF('./assets/plate.gltf')
    return (
        <group ref={group}
            scale={[1,1,1]}
            position={[props.x, props.y, props.z]}
            dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Plate_Square_Large001.geometry}
                material={materials['Ceramic_001.001']}
                scale={[0.15, 0.08, 0.15]}
            />
        </group>
    )
}

useGLTF.preload('./assets/plate.gltf')
