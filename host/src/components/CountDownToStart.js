import React from "react";
import { Html } from "@react-three/drei";

const CountDownToStart = ({ time }) => {
    return (
        <Html>
            <h1 className="countDown">{time}</h1>
        </Html>
    );
};

export default CountDownToStart;
