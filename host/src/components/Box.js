import React from "react";

const Box = ({ position,color,dim }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={dim} attach="geometry" />
      <meshStandardMaterial color={color} attach="material" />
    </mesh>
  );
};

export default Box;