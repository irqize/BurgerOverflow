import { useRef, useState, useEffect } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";
import { Environment, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing'
import { KernelSize, BlendFunction } from 'postprocessing'

import Floor from "./Floor";
import { Stats } from "@react-three/drei";
import Stacks from "./Stacks";
import Advertisement from "./Advertisement";
import Kitchen from "./Background";
import Camera from "./Camera";
import Control from "./Control";
import Animation from "./Animation"

const degreesToRadians = (angle) => (angle * Math.PI) / 180;

function Effects() {
  const ref = useRef()
  // useFrame((state) => {
  //   // Disable SSAO on regress
  //   ref.current.blendMode.setBlendFunction(state.performance.current < 1 ? BlendFunction.SKIP : BlendFunction.MULTIPLY)
  // }, [])
  return (
    <EffectComposer >
      <SSAO ref={ref}
          intensity={10}
          // blendFunction={BlendFunction.MULTIPLY} // blend mode
          samples={30} // amount of samples per pixel (shouldn't be a multiple of the ring count)
          // rings={4} // amount of rings in the occlusion sampling pattern
          // distanceThreshold={1.0} // global distance threshold at which the occlusion effect starts to fade out. min: 0, max: 1
          // distanceFalloff={0.0} // distance falloff. min: 0, max: 1
          // rangeThreshold={0.5} // local occlusion range threshold at which the occlusion starts to fade out. min: 0, max: 1
          // rangeFalloff={0.1} // occlusion range falloff. min: 0, max: 1
          luminanceInfluence={0.5} // how much the luminance of the scene influences the ambient occlusion
          radius={15} // occlusion sampling radius
          // scale={0.5} // scale of the ambient occlusion
          bias={0.035} // occlusion bias
        />      
      {/* <SSAO ref={ref} intensity={15} radius={10} luminanceInfluence={0} bias={0.035} /> */}

      <Bloom kernelSize={KernelSize.LARGE} luminanceThreshold={0.9} luminanceSmoothing={0.2} />
    </EffectComposer>
  )
}
const Lights = () => {
  const lights = useRef()
  // const mouse = useLerpedMouse()
  // useFrame((state) => {
  //   lights.current.rotation.x = (mouse.current.x * Math.PI) / 2
  //   lights.current.rotation.y = Math.PI * 0.25 - (mouse.current.y * Math.PI) / 2
  // })
  return (
    <>
      {/* <ambientLight intensity={0.5} /> */}
      <directionalLight castShadow intensity={0.4} position={[0, 20, 10]} color="#FFDA7E" distance={5} />
      {/* <spotLight intensity={2} position={[-5, 10, 2]} angle={0.2} penumbra={1} castShadow shadow-mapSize={[2048, 2048]} /> */}
      <group ref={lights}>
        <rectAreaLight intensity={0.4} position={[20, 20, 10]} width={50} height={50} onUpdate={(self) => self.lookAt(0, 0, 0)} />
        <rectAreaLight intensity={0.3} position={[-10, 15, 10]} width={30} height={30} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </group>
    </>
  )
}

const GameContainer = ({ socket }) => {
  const [gyroData, setGyroData] = useState(null);
  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [onBoardingDone, setOnboardingDone] = useState(false);

  const [spawn, setSpawn] = useState(false);

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



  return (
    <>
    {/* <input type='number' value={alpha.toFixed(2)} onChange={e => setAlpha(e.target.value)} />
    <input type='number' value={beta.toFixed(2)} onChange={e => setBeta(e.target.value)} />
    <input type='number' value={gamma.toFixed(2)} onChange={e => setGamma(e.target.value)} /> */}
    { !onBoardingDone ?
      <Canvas
        // shadows
        // colorManagement={false}
        // sRGB={true}
        style={{ height: "100vh", width: "100vw", background: "#272727" }}
        pixelRatio={window.devicePixelRatio}
      >

        <OrbitControls />
        <Stats />
        <Suspense fallback={null}>
          <Kitchen />
          <Environment files={'small_empty_house_2k.hdr'} path={'./assets/'}/>
          <Animation/>
          <Control gyroX={Math.sin(degreesToRadians(gamma))} gyroZ={Math.sin(degreesToRadians(beta))} spawn={(v) => setSpawn(v)} />

        </Suspense>
        <Effects />
        <Lights />
        <Physics>
          <Floor />
          <Stacks gyroX={Math.sin(degreesToRadians(gamma))} gyroZ={Math.sin(degreesToRadians(beta))} stacksXZ={[{x: 0, z: -2}, {x: 5, z:-2}]} spawn={spawn}/>
          {/* <Stack x={-3} z={1}/>
          <Stack x={3} z={-0.5}/>*/}

        </Physics>
        <Camera />
      </Canvas>
      :
      <Advertisement socket={socket} doneOnboarding={() => {setOnboardingDone(true)} }/>
      }
    </>
  );
};

export default GameContainer;