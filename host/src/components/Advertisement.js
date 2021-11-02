import React, { useEffect } from "react";
import "./Advertisement.css";
import { STAGES } from "./GameContainer";
import Instruction from "./images/Instruction.png";

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
                    Your mission is to build 3 burgers as high as possible. You
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
                <div className="advertisement-2">
                    Your task for trying out the controls will be to move a ball over 5 platforms.
                    <br />
                    You are supposed to have your phone parallel to the ground.
                    <br />
                    Ready to try it out? Click "Next" on your phone.
                    <span>
                        <img className="InstructionImage" src={Instruction} />
                    </span>
                </div>
            )}
        </div>
    );
};

export default Advertisement;
