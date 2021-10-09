import { useRef, useState, useEffect } from "react";
import { Canvas, extend } from "react-three-fiber";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";
import Floor from "./Floor";
import { Stats } from "@react-three/drei";
import Stacks from "./Stacks";
import Advertisement from "./Advertisement";
import Kitchen from "./Background";
import Camera from "./Camera";
import Control from "./Control";
import Box from "./Box";
import { Html } from "@react-three/drei";
import './Advertisement.css'

const degreesToRadians = (angle) => (angle * Math.PI) / 180;

const GameContainer = ({ socket }) => {
  const [gyroData, setGyroData] = useState(null);
  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [onBoardingDone, setOnboardingDone] = useState(false);

  const [spawn, setSpawn] = useState(false);
  const [tryOut, setTryOut] = useState(false);
  const [countDown, setCountDown] = useState(10);

  ;
  useEffect(() => {
    socket.on("data", (data) => setGyroData(data));
  }, []);

  useEffect(() => {
    setAlpha(gyroData?.alpha ? gyroData?.alpha : 0);
    setBeta(gyroData?.beta ? gyroData?.beta : 0);
    setGamma(gyroData?.gamma ? gyroData?.gamma : 0);
  }, [gyroData]);

  //function to compare if a value is in between two other values.
  Number.prototype.between = function (a, b) {
    var min = Math.min(a, b),
      max = Math.max(a, b);
    return this > min && this < max;
  };

  if (tryOut) {
    setTimeout(()=> {
      setCountDown(countDown-1)
    }, 1000)
  }

  if (countDown==0) {
    setCountDown(10);
    setTryOut(false);
    setOnboardingDone(true);
    socket.emit("doneOnboarding", true);
  }



  return (
    <>
      {/* <input type='number' value={alpha.toFixed(2)} onChange={e => setAlpha(e.target.value)} />
    <input type='number' value={beta.toFixed(2)} onChange={e => setBeta(e.target.value)} />
    <input type='number' value={gamma.toFixed(2)} onChange={e => setGamma(e.target.value)} /> */}
      {onBoardingDone ?
        <Canvas
          style={{ height: "100vh", width: "100vw", background: "#272727" }}
          pixelRatio={window.devicePixelRatio}
          linear
        >


          <ambientLight intensity={0.8} />
          {/* adds ambient light to the canvas */}

          <spotLight position={[10, 10, 10]} angle={0.5} />
          <Stats />
          <Suspense fallback={null}>
            <Kitchen />
          </Suspense>
          <Physics>
            <Floor />
            <Stacks stacksXZ={[{ x: 0, z: -2 }, { x: 5, z: -2 }]} spawn={spawn} />
            {/* <Stack x={-3} z={1}/>
          <Stack x={3} z={-0.5}/> */}
          </Physics>
          <Camera />
          <Control gyroX={Math.sin(degreesToRadians(gamma))} gyroZ={Math.sin(degreesToRadians(beta))} spawn={(v) => setSpawn(v)} />
        </Canvas>
        :
        <>
        {tryOut ? <>
        <Canvas
                  style={{ height: "100vh", width: "100vw", background: "#272727" }}
                  pixelRatio={window.devicePixelRatio}
                  linear
        >
          <ambientLight intensity={0.8} />
          {/* adds ambient light to the canvas */}

          <spotLight position={[10, 10, 10]} angle={0.5} />

          <Camera />
              <mesh receiveShadow rotation={[5, 0, 0]} position={[0, -1, 0]}>
              <planeBufferGeometry attach="geometry" args={[500, 500]} />
              <meshPhysicalMaterial clearcoat={1} attach="material" color="#212529" />
              </mesh>
            
          <Control gyroX={Math.sin(degreesToRadians(gamma))} gyroZ={Math.sin(degreesToRadians(beta))} spawn={(v) => setSpawn(v)} />
          <Html>
					<h1 className="countDown">{countDown}</h1>
          </Html>
        </Canvas>
        </>:<Advertisement socket={socket} doneOnboarding={() => { setOnboardingDone(true) }} setTryOut={() => {setTryOut(true)}}/>}
        </>
      }
    </>
  );
};

export default GameContainer;