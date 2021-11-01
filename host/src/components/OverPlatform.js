import React, { useState, useEffect } from "react";

const platformsWidth = 3;
const platformsHeight = 0.25;

const OverPlatform = ({ x, z, curX, curZ, onVisit }) => {
    const [visited, setVisited] = useState(false);
    useEffect(() => {
        if (
            !visited &&
            curZ < z + platformsWidth / 2 &&
            curZ > z - platformsWidth / 2 &&
            curX < x + platformsWidth / 2 &&
            curX > x - platformsWidth / 2
        ) {
            onVisit();
            setVisited(true);
        }
    }, [curX, curZ]);

    return (
        <mesh position={[x, 1, z]}>
            <boxGeometry
                args={[platformsWidth, platformsHeight, platformsWidth]}
            />
            <meshStandardMaterial color={visited ? "green" : "gray"} />
        </mesh>
    );
};

export default OverPlatform;
