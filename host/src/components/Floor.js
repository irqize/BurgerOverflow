import React from "react";

const Floor = () => {
  return (
    <mesh receiveShadow rotation={[5, 0, 0]} position={[0, -1, 0]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshPhysicalMaterial clearcoat={1} attach="material" color="#212529" />
    </mesh>
  );
};

export default Floor;