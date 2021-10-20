import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export const Meat = ({ ...props }) => {
  const group = useRef();
  const { nodes, materials } = useGLTF("/assets/meat.gltf");
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder001.geometry}
        material={materials['meat.002']}
      />
    </group>
  );
};

export const Bacon = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF("/assets/bacon.gltf");
  return (
    <group ref={group} {...props} >
      <mesh
        castShadow
        receiveShadow
        name="Plane004"
        geometry={nodes.Plane004.geometry}
        material={materials["Material.001"]}
        morphTargetDictionary={nodes.Plane004.morphTargetDictionary}
        morphTargetInfluences={nodes.Plane004.morphTargetInfluences}
        position={[0.27, 0, 0]}
      />
      <mesh
        name="Plane001"
        geometry={nodes.Plane001.geometry}
        material={materials["Material.005"]}
        morphTargetDictionary={nodes.Plane001.morphTargetDictionary}
        morphTargetInfluences={nodes.Plane001.morphTargetInfluences}
        position={[-0.22, 0.04, 0]}
        rotation={[-3.13, 0.06, 3.03]}
      />
    </group>
  );
};

export const BreadDown = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF("/assets/bread_down.gltf");
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder002.geometry}
        material={materials['bread_outside._top.004']}
        position={[0, 0, 0]}
        scale={[1.03, 0.74, 1.03]}
      />
    </group>
  )
    ;
};

export const BreadUp = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF("/assets/bread_up.gltf");

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder001.geometry}
        material={materials['bread_outside._top.002']}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, -1.53, -Math.PI / 2]}
      />
    </group>
  );
};

export const Cheese = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF("/assets/cheese.gltf");
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Cube.geometry} material={materials.Material} />
    </group>
  )
};

export const Lettuce = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF("/assets/lettuce.gltf");
  return (
    <group ref={group} {...props} >
      <mesh
        castShadow
        receiveShadow
        name="Plane002"
        geometry={nodes.Plane002.geometry}
        material={materials["Material.002"]}
        morphTargetDictionary={nodes.Plane002.morphTargetDictionary}
        morphTargetInfluences={nodes.Plane002.morphTargetInfluences}
        scale={[1.04, 1.04, 1.04]}
      />
    </group>
  );
};

export const Tomato = (props) => {
  const group = useRef();
  const { nodes } = useGLTF("/assets/tomato.gltf");
  return (
    <group ref={group} {...props} >
      <group
        position={[0.02, 0.12, -0.01]}
        rotation={[-0.02, -0.38, -0.01]}
        scale={[0.8, 0.8, 0.8]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder007_1.geometry}
          material={nodes.Cylinder007_1.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder007_2.geometry}
          material={nodes.Cylinder007_2.material}
        />
      </group>
      <group position={[-0.1, 0, 0.21]} scale={[0.8, 0.8, 0.8]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder008_1.geometry}
          material={nodes.Cylinder008_1.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder008_2.geometry}
          material={nodes.Cylinder008_2.material}
        />
      </group>
    </group>
  );
};

[
  "bacon",
  "bread_down",
  "bread_up",
  "cheese",
  "lettuce",
  "meat",
  "tomato",
].forEach((name) => useGLTF.preload("/assets/" + name + ".gltf"));
