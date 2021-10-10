import React, { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

const Camera = () => {
  const { camera } = useThree()


  useEffect(() => {
    camera.position.set(0,12,9);
    camera.lookAt(0, 0, 0);
    camera.fov = 50;
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

export default Camera
