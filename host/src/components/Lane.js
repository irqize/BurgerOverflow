import React from "react";

const Lane = ({position, args, opacity, color, active }) => {
  return (
    <mesh receiveShadow position={position}>
      <planeBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" color={active ? color : '#5F6060'} opacity={opacity}/>
    </mesh>
  );
};

export default Lane;