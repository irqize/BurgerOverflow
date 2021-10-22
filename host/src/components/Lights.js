import { useRef } from "react";

const Lights = () => {
    const lights = useRef();
    // const mouse = useLerpedMouse()
    // useFrame((state) => {
    //   lights.current.rotation.x = (mouse.current.x * Math.PI) / 2
    //   lights.current.rotation.y = Math.PI * 0.25 - (mouse.current.y * Math.PI) / 2
    // })
    return (
        <>
            {/* <ambientLight intensity={0.5} /> */}
            <directionalLight
                castShadow
                intensity={0.4}
                position={[0, 20, 10]}
                color="#FFDA7E"
                distance={5}
            />
            {/* <spotLight intensity={2} position={[-5, 10, 2]} angle={0.2} penumbra={1} castShadow shadow-mapSize={[2048, 2048]} /> */}
            <group ref={lights}>
                <rectAreaLight
                    intensity={0.4}
                    position={[20, 20, 10]}
                    width={50}
                    height={50}
                    onUpdate={(self) => self.lookAt(0, 0, 0)}
                />
                <rectAreaLight
                    intensity={0.3}
                    position={[-10, 15, 10]}
                    width={30}
                    height={30}
                    onUpdate={(self) => self.lookAt(0, 0, 0)}
                />
            </group>
        </>
    );
};

export default Lights;
