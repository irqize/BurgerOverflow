import { useRef, useState, useEffect } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, SSAO } from "@react-three/postprocessing";
import { KernelSize, BlendFunction } from "postprocessing";

import Floor from "./Floor";
import { Stats } from "@react-three/drei";
import Stacks from "./Stacks";
import Advertisement from "./Advertisement";
import Kitchen from "./Background";
import Camera from "./Camera";
import Control from "./Control";
import Box from "./Box";
import { Html } from "@react-three/drei";
import "./Advertisement.css";
import Animation from "./Animation";

const degreesToRadians = (angle) => (angle * Math.PI) / 180;

function Effects() {
    const ref = useRef();
    // useFrame((state) => {
    //   // Disable SSAO on regress
    //   ref.current.blendMode.setBlendFunction(state.performance.current < 1 ? BlendFunction.SKIP : BlendFunction.MULTIPLY)
    // }, [])
    return (
        <EffectComposer>
            <SSAO
                ref={ref}
                intensity={10}
                // blendFunction={BlendFunction.MULTIPLY} // blend mode
                samples={30} // amount of samples per pixel (shouldn't be a multiple of the ring count)
                // rings={4} // amount of rings in the occlusion sampling pattern
                // distanceThreshold={1.0} // global distance threshold at which the occlusion effect starts to fade out. min: 0, max: 1
                // distanceFalloff={0.0} // distance falloff. min: 0, max: 1
                // rangeThreshold={0.5} // local occlusion range threshold at which the occlusion starts to fade out. min: 0, max: 1
                // rangeFalloff={0.1} // occlusion range falloff. min: 0, max: 1
                luminanceInfluence={0.5} // how much the luminance of the scene influences the ambient occlusion
                radius={15} // occlusion sampling radius
                // scale={0.5} // scale of the ambient occlusion
                bias={0.035} // occlusion bias
            />
            {/* <SSAO ref={ref} intensity={15} radius={10} luminanceInfluence={0} bias={0.035} /> */}

            <Bloom
                kernelSize={KernelSize.LARGE}
                luminanceThreshold={0.9}
                luminanceSmoothing={0.2}
            />
        </EffectComposer>
    );
}
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

const GameContainer = ({ socket }) => {
    var gameBoundaries = { x1: -12, x2: 12, z1: -2, z2: 6 };

    const [gyroData, setGyroData] = useState(null);
    // const [alpha, setAlpha] = useState(0);
    const [beta, setBeta] = useState(0);
    const [gamma, setGamma] = useState(0);
    const [onBoardingDone, setOnboardingDone] = useState(false);

    const [spawn, setSpawn] = useState(false);
    const [tryOut, setTryOut] = useState(false);
    const [countDown, setCountDown] = useState(10);
    const [finishScore, setFinishScore] = useState(undefined);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        socket.on("data", (data) => setGyroData(data));
    }, []);

    useEffect(() => {
        // setAlpha(gyroData?.alpha ? gyroData?.alpha : 0);
        setBeta(gyroData?.beta ? gyroData?.beta : 0);
        setGamma(gyroData?.gamma ? gyroData?.gamma : 0);
    }, [gyroData]);

    useEffect(() => {
        socket.on("finishScore", (finishScore) => {
            setTimeout(() => setFinishScore(finishScore), 3000);
        });
    }, []);

    //function to compare if a value is in between two other values.
    Number.prototype.between = function (a, b) {
        var min = Math.min(a, b),
            max = Math.max(a, b);
        return this > min && this < max;
    };

    if (tryOut) {
        setTimeout(() => {
            setCountDown(countDown - 1);
        }, 1000);
    }

    if (countDown == 0) {
        setCountDown(10);
        setTryOut(false);
        setOnboardingDone(true);
        socket.emit("doneOnboarding", true);
        setTimeout(() => {
            socket.emit("doneOnboarding", false);
        }, 2000);
    }

    return (
        <>
            {/* <input type='number' value={alpha.toFixed(2)} onChange={e => setAlpha(e.target.value)} />
    <input type='number' value={beta.toFixed(2)} onChange={e => setBeta(e.target.value)} />
    <input type='number' value={gamma.toFixed(2)} onChange={e => setGamma(e.target.value)} /> */}
            {onBoardingDone ? (
                // finishScore == undefined ? (
                <Canvas
                    // shadows
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
                        <mesh
                            receiveShadow
                            castShadow
                            onClick={() => setIsEnd(!isEnd)}
                            position={[1, 0, 0]}
                        >
                            <sphereGeometry args={[0.8, 64, 64]} />
                            <meshBasicMaterial transparent opacity={0.1} />
                        </mesh>
                        <Kitchen />
                        <Environment
                            files={"small_empty_house_2k.hdr"}
                            path={"./assets/"}
                        />
                        <Animation isEnd={isEnd} />
                        {finishScore !== undefined ? (
                            <Html>
                                <h1 className="doneScreen">
                                    Contgratulations to your score of{" "}
                                    {finishScore}!
                                </h1>
                            </Html>
                        ) : (
                            <></>
                        )}

                        <Control
                            gyroX={Math.sin(degreesToRadians(gamma))}
                            gyroZ={Math.sin(degreesToRadians(beta))}
                            spawn={(v) => setSpawn(v)}
                            gameBoundaries={gameBoundaries}
                        />
                    </Suspense>
                    {/* <Effects /> */}
                    <Lights />

                    <Physics>
                        <Floor />
                        <Stacks
                            gyroX={Math.sin(degreesToRadians(gamma))}
                            gyroZ={Math.sin(degreesToRadians(beta))}
                            stacksXZ={[
                                { x: 0, z: -2 },
                                { x: 5, z: -2 },
                            ]}
                            spawn={spawn}
                            socket={socket}
                            gameBoundaries={gameBoundaries}
                            setScore={(score) => {
                                setFinishScore(score);
                            }}
                            isOut={isEnd}
                            setIsOut={setIsEnd}
                        />
                    </Physics>

                    <Camera />
                </Canvas>
            ) : (
                // )
                // :
                // (
                //     <div className="advertisement">
                //         <div className="advertisement-0">
                //             Congratulations! You scored {finishScore} points,
                //             which means {finishScore / 10} SEK off your next
                //             order!
                //         </div>
                //     </div>
                // )
                <>
                    {tryOut ? (
                        <>
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
                                <spotLight
                                    position={[10, 10, 10]}
                                    angle={0.5}
                                />
                                <Camera />
                                <mesh
                                    receiveShadow
                                    rotation={[5, 0, 0]}
                                    position={[0, -1, 0]}
                                >
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
                                    spawn={(v) => setSpawn(v)}
                                    gameBoundaries={gameBoundaries}
                                />
                                <Html>
                                    <h1 className="countDown">{countDown}</h1>
                                </Html>
                            </Canvas>
                        </>
                    ) : (
                        <Advertisement
                            socket={socket}
                            doneOnboarding={() => {
                                setOnboardingDone(true);
                            }}
                            setTryOut={() => {
                                setTryOut(true);
                            }}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default GameContainer;
