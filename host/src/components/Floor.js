import React from "react";
import { usePlane } from "@react-three/cannon";

const Floor = () => {
  const [ref] = usePlane(() => ({position: [0, -2, -2], rotation: [4.7, 0, 0]}))

  return (
    
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshPhysicalMaterial transparent opacity={0.0}/>
    </mesh>
  );
};

export default Floor;