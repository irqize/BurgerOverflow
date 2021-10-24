/* eslint-disable no-extend-native */
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Suspense } from "react";
import { Environment, Html } from "@react-three/drei";

import Floor from "./Floor";
import { Stats } from "@react-three/drei";
import Stacks from "./Stacks";
import Advertisement from "./Advertisement";
import Kitchen from "./Background";
import Camera from "./Camera";
import Control from "./Control";
import Lights from "./Lights";
import "./Advertisement.css";
import Animation from "./Animation";
import CountDownToStart from "./CountDownToStart";

const degreesToRadians = (angle) => (angle * Math.PI) / 180;

export const STAGES = {
    INSTRUCTION1: 1,
    INSTRUCTION2: 2,
    TRY_OUT: 3,
    GAME: 4,
    END_SCREEN: 5,
};

const GameContainer = ({ socket }) => {
    var gameBoundaries = { x1: -12, x2: 12, z1: -4, z2: 6 };

    const [gyroData, setGyroData] = useState(null);
    const [beta, setBeta] = useState(0);
    const [gamma, setGamma] = useState(0);

    const [finishScore, setFinishScore] = useState();

    const [dropTID, setDropTID] = useState(null);

    const [currentStage, setCurrentStage] = useState(STAGES.INSTRUCTION1);

    useEffect(() => {
        socket.on("data", (data) => setGyroData(data));
    }, []);

    useEffect(() => {
        socket.once("reset", () => {
            console.log("reset");
            clearTimeout(dropTID);
            setCurrentStage(STAGES.GAME);
            setFinishScore();
        });
    }, [dropTID]);

    useEffect(() => {
        socket.emit("game stage", currentStage);

        if (currentStage === STAGES.TRY_OUT) {
            setCountDown(2);
        }

        if (currentStage === STAGES.END_SCREEN) {
            const tID = setTimeout(() => {
                socket.emit("drop");
            }, 10000);

            setDropTID(tID);
        }
    }, [currentStage]);

    useEffect(() => {
        // setAlpha(gyroData?.alpha ? gyroData?.alpha : 0);
        setBeta(gyroData?.beta ? gyroData?.beta : 0);
        setGamma(gyroData?.gamma ? gyroData?.gamma : 0);
    }, [gyroData]);

    const [countDown, setCountDown] = useState(10);

    useEffect(() => {
        const tId = setTimeout(() => {
            if (countDown < 0) return;

            setCountDown(countDown - 1);

            if (countDown === 1) {
                setCurrentStage(STAGES.GAME);
                socket.emit("doneOnboarding", true);
                setTimeout(() => {
                    socket.emit("doneOnboarding", false);
                }, 2000);
            }
        }, 1000);

        return () => clearTimeout(tId);
    }, [countDown]);

    return (
        <>
            {(currentStage === STAGES.GAME ||
                currentStage === STAGES.END_SCREEN) && (
                <Canvas
                    shadows
                    // colorManagement={false}
                    // sRGB={true}
                    style={{
                        height: "100vh",
                        width: "100vw",
                        background: "#272727",
                    }}
                    pixelRatio={window.devicePixelRatio}
                >
                    <Stats />
                    <Suspense fallback={null}>
                        <Kitchen />
                        <Environment
                            files={"small_empty_house_2k_new_1.hdr"}
                            path={"./assets/"}
                        />
                        <Animation isEnd={currentStage === STAGES.END_SCREEN} />
                        {currentStage === STAGES.END_SCREEN && (
                            <Html>
                                <div className="doneScreen">
                                    <h1>
                                        {finishScore > 0
                                            ? "Congratulations! Your score is " +
                                              finishScore +
                                              "!"
                                            : "Oops! Try again!"}
                                    </h1>
                                    <h2>
                                        Click reset button on the phone to
                                        restart the game{" "}
                                    </h2>
                                </div>
                            </Html>
                        )}
                    </Suspense>
                    <Lights />
                    <Physics>
                        <Floor />
                        <Stacks
                            gyroX={Math.sin(degreesToRadians(gamma))}
                            gyroZ={Math.sin(degreesToRadians(beta))}
                            stacksXZ={[
                                { x: -5, z: -1 },
                                { x: 0, z: -3 },
                                { x: 5, z: -1 },
                            ]}
                            socket={socket}
                            gameBoundaries={gameBoundaries}
                            setScore={(score) => {
                                setFinishScore(score);
                            }}
                            isOut={currentStage === STAGES.END_SCREEN}
                            setIsOut={(isOut) =>
                                !isOut
                                    ? setCurrentStage(STAGES.GAME)
                                    : setCurrentStage(STAGES.END_SCREEN)
                            }
                            currentStage={currentStage}
                        />
                    </Physics>

                    <Camera />
                </Canvas>
            )}

            {currentStage === STAGES.TRY_OUT && (
                <Canvas
                    style={{
                        height: "100vh",
                        width: "100vw",
                        background: "#272727",
                    }}
                    pixelRatio={window.devicePixelRatio}
                    linear
                >
                    <ambientLight intensity={0.8} />
                    {/* adds ambient light to the canvas */}
                    <spotLight position={[10, 10, 10]} angle={0.5} />
                    <Camera />
                    <mesh rotation={[5, 0, 0]} position={[0, -1, 0]}>
                        <planeBufferGeometry
                            attach="geometry"
                            args={[500, 500]}
                        />
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
                    />

                    <CountDownToStart time={countDown} />
                </Canvas>
            )}

            {(currentStage === STAGES.INSTRUCTION1 ||
                currentStage === STAGES.INSTRUCTION2) && (
                <Advertisement
                    socket={socket}
                    currentStage={currentStage}
                    setNextInstruction={() =>
                        setCurrentStage(STAGES.INSTRUCTION2)
                    }
                    setTryOut={() => {
                        setCurrentStage(STAGES.TRY_OUT);
                    }}
                />
            )}
        </>
    );
};

export default GameContainer;
