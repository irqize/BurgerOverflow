import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";
import Floor from "./Floor";
import Wall from "./Wall";
// import Box from "./Box";
// import Spatula from "./Spatula";
// import Lane from "./Lane";
import { Stats } from "@react-three/drei";
import Stack from "./Stack";
import Advertisement from "./Advertisement";

const degreesToRadians = (angle) => (angle * Math.PI) / 180;

const Model = () => {
  const gltf = useLoader(GLTFLoader, "./untitled.gltf");
  return (
    <>
      <primitive
        object={gltf.scene}
        scale={0.4}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </>
  );
};

// const Plane = () => {
//   const [ref] = usePlane(() => ({
//     rotation: [-Math.PI / 2, 0, 0],
//   }));
//   return (
//     <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
//       <planeBufferGeometry attach="geometry" args={[100, 100]} />
//       <meshLambertMaterial attach="material" color="lightblue" />
//     </mesh>
//   );
// };

// function Box() {
//   const [ref, api] = useBox(() => ({ mass: 1, position: [0, 0, 0] }));
//   return (
//     <mesh
//       // onClick={() => {
//       //   api.velocity.set(0, 2, 0);
//       // }}
//       ref={ref}
//       position={[0, 0, 0]}
//     >
//       <boxBufferGeometry attach="geometry" />
//       <meshLambertMaterial attach="material" color="hotpink" />
//     </mesh>
//   );
// }

const GameContainer = ({ socket }) => {
  // const Spatula = () =>{
  //     //the spatula to be
  //     const mesh = useRef();
  //     useFrame(()=>{
  //         mesh.current.rotation.x = mesh.current.rotation.y +=0.01;
  //     })
  //     return (
  //         <mesh ref={mesh}>
  //             <BoxBufferGeometry attach='geometry' args={[1,1,1]}/>
  //             <meshStandardMaterial attach='material' color="lightblue"/>

  //         </mesh>
  //     )
  // }

  const [gyroData, setGyroData] = useState(null);
  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [onBoardingDone, setOnboardingDone] = useState(false);

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

  const chooseLane = (alpha, upper, lower) => {
    var alpha = Math.sin(degreesToRadians(alpha));
    var upper = Math.sin(degreesToRadians(upper));
    var lower = Math.sin(degreesToRadians(lower));
    //   console.log("alpha: ",alpha)
    //  console.log("upper: ",upper)
    //  console.log("lower: ",lower)
    // console.log(alpha.between(lower,upper))
    if (alpha.between(lower, upper)) {
      console.log(
        "alpha=" + alpha + " is between ( " + lower + " , " + upper + " )"
      );
    }
    return alpha.between(lower, upper);
  };
  // chooseLane(60,90,45)

  return (
    <>
      {/* <input type='number' value={alpha.toFixed(2)} onChange={e => setAlpha(e.target.value)} />
    <input type='number' value={beta.toFixed(2)} onChange={e => setBeta(e.target.value)} />
    <input type='number' value={gamma.toFixed(2)} onChange={e => setGamma(e.target.value)} /> */}
    { onBoardingDone ?
      <Canvas
        style={{ height: "100vh", width: "100vw", background: "#272727" }}
        pixelRatio={window.devicePixelRatio}
      >
        {/* <Suspense fallback={null}> */}
        {/* <OrbitControls /> */}
        {/* used for moving the camera */}
        {/* <Stars /> */}
        {/* 3D background */}

        <ambientLight intensity={0.2} />
        {/* adds ambient light to the canvas */}

        <spotLight position={[10, 10, 10]} angle={0.5} />
        {/* <Physics> */}
        {/* <Box />
        <Plane /> */}
        {/* </Physics> */}
        {/* <Box color={"#FFC300"}/> */}
        {/* adds a spotlight towards from a position towards a direction */}
        {
          //<group rotation={[degreesToRadians(beta),degreesToRadians(alpha),degreesToRadians(-gamma),"YXZ"]}>
          //{/* [(gyroData?.alpha ? degreesToRadians(gyroData?.alpha) : 0),(gyroData?.beta ? degreesToRadians(gyroData?.beta) : 0) ,(gyroData?.gamma ? degreesToRadians(gyroData?.gamma) : 0) ] */}
          //  <Model  />
          //</group>
        }
        {/* <group
          rotation={[
            degreesToRadians(beta),
            degreesToRadians(alpha),
            degreesToRadians(-gamma),
            "YXZ",
          ]}
        >
          {[
            gyroData?.alpha ? degreesToRadians(gyroData?.alpha) : 0,
            gyroData?.beta ? degreesToRadians(gyroData?.beta) : 0,
            gyroData?.gamma ? degreesToRadians(gyroData?.gamma) : 0,
          ]}
          <Box position={[0, 0, 0]} color={"#FFC300"} />
          <Spatula position={(0, 0, 0)} />
        </group>
        <Lane
          position={[-1.5, 0, -1]}
          args={[1, 10]}
          opacity={1}
          color={"#FC62FC"}
          active={chooseLane(alpha, 90, 45)}
        />
        position = {[x,y,z]}, args={[width,height]}
        <Lane
          position={[0, 0, -1]}
          args={[1, 10]}
          opacity={1}
          color={"#FCF762"}
          active={chooseLane(alpha, 44, 315)}
        />
        <Lane
          position={[1.5, 0, -1]}
          args={[1, 10]}
          opacity={1}
          color={"#62FCE6"}
          active={chooseLane(alpha, 314, 270)}
        /> */}
        <Stats />
        <Wall />
        <Physics>
          <Floor />
          <Stack x={0} z={-2}/>
          {/* <Stack x={-3} z={1}/>
          <Stack x={3} z={-0.5}/> */}

        </Physics>
        {/* </Suspense> */}
      </Canvas>
      :
      <Advertisement socket={socket} doneOnboarding={() => {setOnboardingDone(true)} }/>
      }
    </>
  );
};

export default GameContainer;