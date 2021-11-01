import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { useCylinder } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import {
    Bacon,
    BreadDown,
    BreadUp,
    Cheese,
    Lettuce,
    Meat,
    Tomato,
} from "./Ingredients";
import Plate from "./Plate";
import { STAGES } from "./GameContainer";
import UseSound from "./UseSound";
import { Tube } from "@react-three/drei";

const items = [
    "bacon",
    "bread_down",
    "bread_up",
    "cheese",
    "lettuce",
    "meat",
    "tomato",
];

const ingredients = {
    meat: { name: "Meat", r: 1, height: 0.25, Component: Meat },
    bacon: { name: "Bacon", r: 1.02, height: 0.15, Component: Bacon },
    bread_up: { name: "Bread up", r: 1, height: 0.71, Component: BreadUp },
    bread_down: { name: "Bread down", r: 1, height: 0.2, Component: BreadDown },
    cheese: { name: "Cheese", r: 1, height: 0.25, Component: Cheese },
    lettuce: { name: "Lettuce", r: 1.152, height: 0.25, Component: Lettuce },
    tomato: { name: "Tomato", r: 1, height: 0.295, Component: Tomato },
};

const ItemModel = ({ Component, position }) => {
    return (
        <group position={position}>
            <Component />
        </group>
    );
};

const Item = ({
    attrs: { mass, Component, height, r },
    position,
    setItemPosition,
}) => {
    // const gltf = useGLTF('/assets/bread_down.gltf');
    // const box = new Box3().setFromObject(gltf.scene);
    // const height = box.max.y - box.min.y;
    // const r = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) / 2;
    // console.log(height, r)

    const args = [r, r, height, 8];

    const [lastUpdate, setLastUpdate] = useState();
    const [actualPosition, setActualPosition] = useState();

    // Calculate sound playback rate with different height

    useEffect(() => {
        setLastUpdate(Date.now());
    }, []);

    useEffect(() => {
        if (actualPosition) setItemPosition(actualPosition);
    }, [actualPosition]);

    const [playDropSound, setDropSound] = useState(false);

    const [ref] = useCylinder(() => {
        return {
            mass,
            material: { friction: 50, restitution: 0 },
            position,
            args,
            onCollide: (e) => {
                // Update the position every 100ms
                if (!lastUpdate || lastUpdate + 100 < Date.now()) {
                    // Calculate the items position
                    const target = new Vector3();
                    e.target.getWorldPosition(target);
                    setActualPosition([target.x, target.y, target.z]);
                }

                // Set drop sound flag
                setDropSound(true);
            },
        };
    });

    return (
        <group ref={ref}>
            <UseSound isPlaying={playDropSound} sound={"toned"} />
            <Component />
            <mesh>
                <cylinderBufferGeometry args={args} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </group>
    );
};

// Check if point is further from the origin than the radius
const checkIfOut = (radius, x, z) => Math.sqrt(x * x + z * z) > radius;

const generateStackItem = () => ({
    mass: 0.3 + Math.random() * 0.3,
    id: v4(),
    ...ingredients[items[Math.floor(Math.random() * items.length)]],
});

const Stack = ({ x, z, isOut }) => {
    return (
        <>
            <mesh position={[x, 0, z]}>
                <cylinderGeometry args={[1.1, 1.1, 15, 40]} />
                <meshBasicMaterial
                    color={isOut ? 0xff0000 : 0x00ff00}
                    transparent
                    opacity={0.2}
                />
            </mesh>
            <Plate x={x} y={-2.2} z={z} />
        </>
    );
};

const Stacks = ({
    stacksXZ,
    socket,
    gyroX,
    gyroZ,
    gameBoundaries,
    setScore,
    isOut,
    setIsOut,
    currentStage,
}) => {
    const { x1, x2, z1, z2 } = gameBoundaries;

    const [positions, setPositions] = useState([]);
    const [items, setItems] = useState([]);
    const [nextItem, setNextItem] = useState(generateStackItem());

    // const [isOut, setIsOut] = useState(false);
    const [maxScores, setMaxScores] = useState(
        new Array(stacksXZ.length).fill(0)
    );

    const [spawnTID, setSpawnTID] = useState(null);

    ////// Control spawning position
    // how much the position is changed, based on gyro data.
    const [vX, setvX] = useState(0);
    const [vZ, setvZ] = useState(0);

    // the position to spawn an ingredient
    const [spawnPosX, setspawnPosX] = useState(0);
    const [spawnPosZ, setspawnPosZ] = useState(0);

    // check if user is over the drop zone
    const [isOver, setIsOver] = useState(false);

    const accelerometerFactor = 0.5;

    useEffect(() => {
        setvX(gyroX * gyroX * accelerometerFactor);
    }, [gyroX]);

    useEffect(() => {
        setvZ(gyroZ * gyroZ * accelerometerFactor);
    }, [gyroZ]);

    const between = (x, a, b) => {
        var min = Math.min(a, b),
            max = Math.max(a, b);
        return x > min && x < max;
    };

    useFrame(() => {
        setIsOver(
            stacksXZ.reduce(
                (prev, { x, z }) =>
                    prev || !checkIfOut(1.1, spawnPosX - x, spawnPosZ - z),
                false
            )
        );

        if (gyroZ > 0 && between(spawnPosZ, z1 - 0.5, z2)) {
            //moving forwards
            setspawnPosZ((prevZ) => prevZ + vZ);
        }
        if (gyroZ < 0 && between(spawnPosZ, z1, z2 + 0.5)) {
            //moving backwards
            setspawnPosZ((prevZ) => prevZ - vZ);
        }
        if (gyroX > 0 && between(spawnPosX, x1, x2 - 0.5)) {
            //moving right
            setspawnPosX((prevX) => prevX + vX);
        }
        if (gyroX < 0 && between(spawnPosX, x1 + 0.5, x2)) {
            //moving left
            setspawnPosX((prevX) => prevX - vX);
        }
    });

    useEffect(() => {
        socket.off("dismiss");
        socket.on("dismiss", () => {
            setNextItem(generateStackItem());
            clearTimeout(spawnTID);
        });
    }, [socket]);

    useEffect(() => {
        socket.emit("dismiss available", nextItem.name);
    }, [nextItem]);

    const setItemPosition = (p) => {
        stacksXZ.forEach(({ x, z }, i) => {
            if (!checkIfOut(1.1, p[0] - x, p[2] - z)) {
                const newMaxScores = [...maxScores];
                newMaxScores[i] = p[1] + 2;
                setMaxScores(newMaxScores);
            }
        });

        if (
            !stacksXZ.reduce(
                (prev, { x, z }) => prev && checkIfOut(1.1, p[0] - x, p[2] - z),
                true
            )
        )
            return;
        setIsOut(true);
        clearTimeout(spawnTID);
        setPositions([...positions, p]);
    };

    // Restart the stack when item is out of bounds
    useEffect(() => {
        if (!isOut) return;
        setPositions([]);

        const score = Math.max(
            Math.round(
                (2 * (100 * maxScores.reduce((a, b) => a + b, 0))) /
                    maxScores.length
            ),
            0
        );

        console.log("Score:", score);
        socket.emit("finishScore", score);

        setScore(score);
        setMaxScores(new Array(stacksXZ.length).fill(0));
    }, [isOut]);

    useEffect(() => {
        if (currentStage !== STAGES.GAME) return;
        setItems([]);
        setIsOut(false);

        setvX(0);
        setvZ(0);

        setspawnPosX(0);
        setspawnPosZ(0);
    }, [currentStage]);

    useEffect(() => {
        const tID = setTimeout(() => {
            setItems([...items, nextItem]);
        }, 3000);

        setSpawnTID(tID);

        return () => clearTimeout(tID);
    }, [nextItem]);

    useEffect(() => {
        if (currentStage !== STAGES.GAME) return;
        const next = generateStackItem();
        setNextItem(next);
        console.log("Next up: " + next.name);
    }, [items]);

    return (
        <>
            {items.map((attrs) => (
                <>
                    <UseSound
                        sound={"sweep"}
                        isPlaying={true}
                        playbackRate={2}
                    />
                    <Item
                        attrs={attrs}
                        key={attrs.id}
                        position={[spawnPosX, 5, spawnPosZ]}
                        setItemPosition={setItemPosition}
                    />
                </>
            ))}
            <ItemModel
                Component={nextItem.Component}
                position={[spawnPosX, 5, spawnPosZ]}
            />
            {currentStage === STAGES.GAME && (
                <mesh position={[spawnPosX, 0, spawnPosZ]}>
                    <cylinderGeometry args={[0.1, 0.1, 10, 40]} />
                    <meshBasicMaterial color={isOver ? 0x00ff00 : 0xc70039} />
                </mesh>
            )}
            {/* Draw points that are out of bounds */}
            {/* {positions.map((p, i) => (
                <mesh position={p} key={i}>
                    <sphereGeometry args={[0.1, 10, 10]} />
                    <meshNormalMaterial />
                </mesh>
            ))} */}
            {stacksXZ.map(({ x, z }, i) => {
                return <Stack x={x} z={z} key={i} isOut={isOut} />;
            })}
        </>
    );
};

export default Stacks;
