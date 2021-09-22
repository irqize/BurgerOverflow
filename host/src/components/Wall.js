import React from "react";

const Wall = () => {
  return (
    <mesh receiveShadow position={[0, -1, -5]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshStandardMaterial attach="material" color="#383D43" />
    </mesh>
  );
};

export default Wall;