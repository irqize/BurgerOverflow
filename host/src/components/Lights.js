import { useRef } from "react";

const Lights = () => {
    const lights = useRef();
    return (
        <>
            <directionalLight
                castShadow
                intensity={0.6}
                position={[0, 200, 300]}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
                shadow-bias={-0.0001}
            />
            {/* <spotLight
                penumbra={1}
                position={[0, 200, 400]}
                intensity={1}
                castShadow={true}
                shadow-bias={0}
            /> */}
        </>
    );
};

export default Lights;
