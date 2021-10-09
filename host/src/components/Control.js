import React, { useEffect, useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

//model
export const Machine = ({ x, z }) => {
  // Load machine model (to generate the burger components)
  const group_machine = useRef();
  const material_machine = useRef();
  const { nodes } = useGLTF("./assets/machine.gltf");
  return (
    <group
      ref={group_machine}
      scale={[2,2,2]}
      dispose={null}
      position={[x, 6, z]}
      rotation={[0, Math.PI / 2, 0]}>
      <mesh 
        castShadow
        receiveShadow
        geometry={nodes.Cube017.geometry}>
        <meshBasicMaterial transparent opacity={0.5}/>
        {/* <meshPhysicalMaterial
          ref={material_machine}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={1}
          thickness={1.1}
          roughness={0}
          envMapIntensity={2}/> */}
      </mesh>
    </group>
  );
};
// const velocity = 0.1;

// const cameraMovementScale = 1;
const accelerometerFactor = 0.5;

const Control = ({ spawn, gyroX, gyroZ, gameBoundaries }) => {
  console.log("gameBoundaries", gameBoundaries);
  const { x1, x2, z1, z2 } = gameBoundaries;
  const [vX, setvX] = useState(0);
  const [vZ, setvZ] = useState(0);

  const [controlZPos, setZ] = useState(0);
  const [controlXPos, setX] = useState(0);

  useEffect(() => {
    //used to accelerate X directions
    setvX(gyroX * gyroX * accelerometerFactor);
  }, [gyroX]);

  useEffect(() => {
    //used to accelerate Z directions
    setvZ(gyroZ * gyroZ * accelerometerFactor);
  }, [gyroZ]);

  const between = (x, a, b) => {
    var min = Math.min(a, b),
      max = Math.max(a, b);
    return x >= min && x <= max;
  };

  useFrame(() => {
    if (gyroZ > 0 && between(controlZPos, z1 - 0.5, z2)) {
      //moving forwards
      setZ((prevZ) => prevZ + vZ);
    }
    if (gyroZ < 0 && between(controlZPos, z1, z2 + 0.5)) {
      //moving backwards
      setZ((prevZ) => prevZ - vZ);
    }
    if (gyroX > 0 && between(controlXPos, x1, x2 - 0.5)) {
      //moving right
      setX((prevX) => prevX + vX);
    }
    if (gyroX < 0 && between(controlXPos, x1 + 0.5, x2)) {
      //moving left
      setX((prevX) => prevX - vX);
    }
  });

  useEffect(() => {
    const tID = setInterval(() => {
      spawn(false);
      spawn(true);
    }, 3000);

    return () => clearInterval(tID);
  }, []);

  return (
    <>
      <Machine x={controlXPos} z={controlZPos} />
      <mesh position={[controlXPos, 2.5, controlZPos]}>
        <cylinderGeometry args={[0.1, 0.1, 5, 40]} />
        <meshBasicMaterial color="#C70039" transparent opacity={0.2} />
      </mesh>
    </>
    // <mesh position={[x, 5, z]}>
    //   <sphereGeometry attach="geometry" args={[0.1, 32, 32]} />
    //   <meshLambertMaterial attach="material" color="hotpink" />
    // </mesh>
  );
};

export default Control;
