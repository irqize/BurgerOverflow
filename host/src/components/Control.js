import React, { useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const velocity = 0.1;
const cameraMovementScale = 3;

const Control = ({
  spawn,gyroX,gyroZ
}) => {

  useEffect(()=>{
    setX(gyroX*cameraMovementScale)
  },[gyroX])
  

  useEffect(()=>{
    setZ(gyroZ*cameraMovementScale)
  },[gyroZ])
  const { camera } = useThree();

  const [wPushed, setWPushed] = useState(false);
  const [sPushed, setSPushed] = useState(false);
  const [aPushed, setAPushed] = useState(false);
  const [dPushed, setDPushed] = useState(false);
  
  const [spacePushed, setSpacePushed] = useState(false);

  const [z, setZ] = useState(0);
  const [x, setX] = useState(0);

  const keyPress = e => {
    const { key, code } = e;
    if(key === 'w') setWPushed(true);
    if(key === 's') setSPushed(true);
    if(key === 'a') setAPushed(true);
    if(key === 'd') setDPushed(true);
    if(code === 'Space') setSpacePushed(true);
  }

  const keyUp = e => {
    const { key, code } = e;
    if(key === 'w') setWPushed(false);
    if(key === 's') setSPushed(false);
    if(key === 'a') setAPushed(false);
    if(key === 'd') setDPushed(false);
    if(code === 'Space') setSpacePushed(false);
  }

  useEffect(() => {
    if(spacePushed) spawn(true);
    if(!spacePushed) spawn(false);
  }, [spacePushed])

  useFrame(() => {
    if(wPushed) setZ(z - velocity);
    if(sPushed) setZ(z + velocity);
    if(aPushed) setX(x - velocity);
    if(dPushed) setX(x + velocity);
    camera.position.set(x, 10, z);
  })

  useEffect(() => {
    const tID = setInterval(() => {
      spawn(false);
      spawn(true);
    }, 3000);

    return () => clearInterval(tID);
  }, []);


  useEffect(() => {
    document.onkeydown = keyPress;
    document.onkeyup = keyUp;
  }, [])

  return (
    <mesh position={[x, 5, z]}>
      <sphereGeometry attach="geometry" args={[0.1, 32, 32]} />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  );
};

export default Control;
