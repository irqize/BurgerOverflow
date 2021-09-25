import React from "react";
import { usePlane } from "@react-three/cannon";

const Floor = () => {
  const [ref] = usePlane(() => ({position: [0, -1, 0], rotation: [5, 0, 0]}))

  return (
    
    <mesh receiveShadow ref={ref}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshPhysicalMaterial clearcoat={1} attach="material" color="#212529" />
    </mesh>
  );
};

export default Floor;