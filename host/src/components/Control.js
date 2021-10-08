import React, { useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

// const velocity = 0.1;

// const cameraMovementScale = 1;
const accelerometerFactor = 0.5

const Control = ({
  spawn, gyroX, gyroZ
}) => {

  useEffect(() => {
    //used to accelerate X directions
    setvX(gyroX * gyroX * accelerometerFactor)

    // console.log("velocity vX:",vX)

  }, [gyroX])


  useEffect(() => {
    //used to accelerate Z directions
    setvZ(gyroZ * gyroZ * accelerometerFactor)
    // console.log("velocity vZ:",vZ)

  }, [gyroZ])
  const { camera } = useThree();
  const [vX, setvX] = useState(0)
  const [vZ, setvZ] = useState(0)
  // const [wPushed, setWPushed] = useState(false);
  // const [sPushed, setSPushed] = useState(false);
  // const [aPushed, setAPushed] = useState(false);
  // const [dPushed, setDPushed] = useState(false);

  // const [spacePushed, setSpacePushed] = useState(false);

  const [z, setZ] = useState(0);
  const [x, setX] = useState(0);

  // console.log("_____x: ", x)
  // console.log("_____z: ", z)
  // const keyPress = e => {
  //   const { key, code } = e;
  //   if(key === 'w') setWPushed(true);
  //   if(key === 's') setSPushed(true);
  //   if(key === 'a') setAPushed(true);
  //   if(key === 'd') setDPushed(true);
  //   if(code === 'Space') setSpacePushed(true);
  // }

  // const keyUp = e => {
  //   const { key, code } = e;
  //   if(key === 'w') setWPushed(false);
  //   if(key === 's') setSPushed(false);
  //   if(key === 'a') setAPushed(false);
  //   if(key === 'd') setDPushed(false);
  //   if(code === 'Space') setSpacePushed(false);
  // }

  // useEffect(() => {
  //   if(spacePushed) spawn(true);
  //   if(!spacePushed) spawn(false);
  // }, [spacePushed])

  // useFrame(() => {
  //   if(wPushed) setZ(z - vZ);
  //   if(sPushed) setZ(z + vZ);
  //   if(aPushed) setX(x - vX);
  //   if(dPushed) setX(x + vX);
  //   camera.position.set(x, 10, z);
  // },)

  useFrame(() => {
    if (gyroZ > 0) {
      setZ(prevZ => prevZ + vZ)
    }
    if (gyroZ < 0) {
      setZ(prevZ => prevZ - vZ)
    }
    if (gyroX > 0) {
      setX(prevX => prevX + vX)
    }
    if (gyroX < 0) {
      setX(prevX => prevX - vX)
    }
  })

  useEffect(() => {
    const tID = setInterval(() => {
      spawn(false);
      spawn(true);
    }, 3000);

    return () => clearInterval(tID);
  }, []);


  return (
    <mesh position={[x, 5, z]}>
      <sphereGeometry attach="geometry" args={[0.1, 32, 32]} />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  );
};

export default Control;
