import React, { useState, useEffect } from "react";
import "./Advertisement.css";

const Advertisement = ({ socket, doneOnboarding, setTryOut }) => {
    const [screenNumber, setScreenNumber] = useState(0);

    useEffect(() => {
        var newScreenNumber = screenNumber + 1;
        socket.on("skipAhead", (skip) => {
            if (screenNumber == 1) {
                setTryOut();
            } else {
                setScreenNumber(newScreenNumber);
            }
        });
    }, [screenNumber]);

    return (
        <div className="advertisement">
            {screenNumber == 0 && (
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
            {screenNumber == 1 && (
                <div className="advertisement-0">
                    Ready to try the controls for 10 seconds? Click "Next"!
                </div>
            )}
        </div>
    );
};

export default Advertisement;
