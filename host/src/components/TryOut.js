import React, { useState, useEffect } from "react";
import Camera from "./Camera";
import Control from "./Control";
import OverPlatform from "./OverPlatform";

const degreesToRadians = (angle) => (angle * Math.PI) / 180;

const platformsPositions = [
    {
        x: 0,
        z: -5,
    },
    {
        x: -4,
        z: 0,
    },
    {
        x: 4,
        z: 0,
    },
];

const TryOut = ({ gameBoundaries, gamma, beta, onEnd }) => {
    const [pos, setPos] = useState({ curX: 0, curZ: 0 });
    const [visited, setVisited] = useState(0);
    useEffect(() => {
        if (visited === platformsPositions.length) onEnd();
    }, [visited]);

    return (
        <>
            <ambientLight intensity={0.8} />
            {/* adds ambient light to the canvas */}
            <spotLight position={[10, 10, 10]} angle={0.5} />
            <Camera />
            <mesh rotation={[5, 0, 0]} position={[0, -1, 0]}>
                <planeBufferGeometry attach="geometry" args={[500, 500]} />
                <meshPhysicalMaterial
                    clearcoat={1}
                    attach="material"
                    color="#212529"
                />
            </mesh>
            <Control
                gyroX={Math.sin(degreesToRadians(gamma))}
                gyroZ={Math.sin(degreesToRadians(beta))}
                gameBoundaries={gameBoundaries}
                onPositionChange={(x, z) => setPos({ curX: x, curZ: z })}
            />
            {/* <Kitchen hidden /> */}

            {platformsPositions.map((props, i) => (
                <OverPlatform
                    {...props}
                    {...pos}
                    onVisit={() => setVisited(visited + 1)}
                    key={i}
                />
            ))}
        </>
    );
};

export default TryOut;
