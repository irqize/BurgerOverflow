import React from "react";

const Lane = ({position, args, opacity, color }) => {
  return (
    <mesh receiveShadow position={position}>
      <planeBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" color={color} opacity={opacity}/>
    </mesh>
  );
};

export default Lane;