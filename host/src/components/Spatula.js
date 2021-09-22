import React from "react";
import Box from "./Box";

const Spatula = ({ position, color }) => {
    return (
        <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
            <Box position={[0,0,0]} dim={[0.1, 2, 0.1]} color={"#FF5733"} />
            {"the shaft"}
            <Box position={[0,1,0]} dim={[1, 1, 0.1]} color={"#581845"} />
            {"the flat thing"}
        </group>

    );
};

export default Spatula;