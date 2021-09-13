import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame  } from "react-three-fiber";
import { OrbitControls, Stars }   from "@react-three/drei";
import { Physics, usePlane, useBox, } from "@react-three/cannon";



const GameContainer = () =>{
    
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
      }

      const Box = ({ color, ...props })=> {
        const {position} = props;
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
            <meshLambertMaterial attach="material" color={color}/>
          </mesh>
        );
      }



  return (
   <Canvas style={{ height: "50vh", width: "50vw", background:"#272727"}}> 
  
      <OrbitControls />
      {/* used for moving the camera */}
      <Stars />
      {/* 3D background */}

      <ambientLight intensity={0.1} />
      {/* adds ambient light to the canvas */}

      <spotLight position={[15, 15, 15]} angle={0.5} />
      {/* adds a spotlight towards from a position towards a direction */}

      <Physics>
          {/* adds physic motor (gravity etc) */}

        <Box position={[0,0,5]} color={"red"}/>
        {/* position=[x,y,z] */}
        <Box position={[1,1,0]} color= {"green"}/>
        <Box position={[5,5,5]} color= {"blue"}/>
        
        
        <Plane />
      </Physics>

   </Canvas>
  );
}

export default GameContainer;
