import React from "react";
import { usePlane } from "@react-three/cannon";

const Floor = () => {
  const [ref] = usePlane(() => ({position: [0, -1, -2], rotation: [5, 0, 0]}))

  return (
    
    <mesh receiveShadow ref={ref}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshPhysicalMaterial transparent opacity={0.1}/>
    </mesh>
  );
};

export default Floor;