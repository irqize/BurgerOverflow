import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";

const degreesToRadians = angle => (angle*Math.PI)/180

const Model = () => {
  const gltf = useLoader(GLTFLoader, "./untitled.gltf");
  return (
    <>
      <primitive object={gltf.scene} scale={0.4} rotation={[0, -Math.PI / 2, 0]} />
    </>
  );
};

const Plane = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshLambertMaterial attach="material" color="lightblue" />
    </mesh>
  );
};  

const Box = ({ color, ...props }) => {
  const { position } = props;
  const [ref, api] = useBox(() => ({ mass: 1, position: position }));
  return (
    <mesh
      onClick={() => {
        api.velocity.set(0, 2, 0);
      }}
      ref={ref}
      position={position}
    >
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  );
};

const GameContainer = ({socket}) => {
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
console.log(gyroData);

const [x, setX] = useState(0)
const [y, setY] = useState(0)
const [z, setZ] = useState(0)

  useEffect(() => {
    socket.on("data", (data) => setGyroData(data));

  }, [])

  useEffect(() => {
    setX(gyroData?.alpha ? gyroData?.alpha : 0);
    setY(gyroData?.beta ? gyroData?.beta : 0)
    setZ(gyroData?.gamma ? gyroData?.gamma : 0)
  }, [gyroData])
  


  return (<>
    {/* <input type='number' value={x} onChange={e => setX(e.target.value)} />
    <input type='number' value={y} onChange={e => setY(e.target.value)} />
    <input type='number' value={z} onChange={e => setZ(e.target.value)} /> */}
    <Canvas style={{ height: "100vh", width: "100vw", background: "#272727" }}>
      <Suspense fallback={null}>
        <OrbitControls />
        {/* used for moving the camera */}
        <Stars />
        {/* 3D background */}

        <ambientLight intensity={0.1} />
        {/* adds ambient light to the canvas */}

        <spotLight position={[15, 15, 15]} angle={0.5} />
        {/* adds a spotlight towards from a position towards a direction */}
        <group rotation={[degreesToRadians(x),degreesToRadians(y),degreesToRadians(z)]}>
        {/* [(gyroData?.alpha ? degreesToRadians(gyroData?.alpha) : 0),(gyroData?.beta ? degreesToRadians(gyroData?.beta) : 0) ,(gyroData?.gamma ? degreesToRadians(gyroData?.gamma) : 0) ] */}
          <Model  />
        </group>
      </Suspense>
    </Canvas></>
  );
};

export default GameContainer;
