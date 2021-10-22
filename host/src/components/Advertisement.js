import React, { useEffect } from "react";
import "./Advertisement.css";
import { STAGES } from "./GameContainer";

const Advertisement = ({
    socket,
    currentStage,
    setTryOut,
    setNextInstruction,
}) => {
    useEffect(() => {
        socket.off("skipAhead");

        const listener = () => {
            if (currentStage === STAGES.INSTRUCTION2) {
                setTryOut();
            }
            if (currentStage === STAGES.INSTRUCTION1) {
                setNextInstruction();
            }
        };

        socket.once("skipAhead", listener);

        return () => socket.off("skipAhead", listener);
    }, [currentStage]);

    return (
        <div className="advertisement">
            {currentStage === STAGES.INSTRUCTION1 && (
                <div className="advertisement-0">
                    Your mission is to build 2 burgers as high as possible. You
                    steer with your phone's gyroscope.
                    <br />
                    <br />
                    For each 100 points you score, you get a 10 SEK discount!
                    <br />
                    <br />
                    Click the button "Next".
                </div>
            )}
            {currentStage === STAGES.INSTRUCTION2 && (
                <div className="advertisement-0">
                    Ready to try the controls for 10 seconds? Click "Next"!
                </div>
            )}
        </div>
    );
};

export default Advertisement;
