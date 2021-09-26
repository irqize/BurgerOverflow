import React, { useState, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useCylinder } from "@react-three/cannon";
import { Vector3 } from "three";

const items = [
  "bacon",
  "bread_down",
  "bread_up",
  "cheese",
  "lettuce",
  "meat",
  "tomato",
];

const Item = ({
  attrs: { color, shininess, mass, height },
  position,
  setItemPosition,
}) => {
  // const gltf = useLoader(GLTFLoader, "./assets/" + name + ".gltf");
  // const [ref] = useBox(() => ({mass: 1, position}))
  // return <primitive object={gltf.scene} ref={ref}/>;
  const args = [0.5, 0.5, height, 32];

  const [lastUpdate, setLastUpdate] = useState();
  const [actualPosition, setActualPosition] = useState();

  useEffect(() => {
    setLastUpdate(Date.now());
  }, []);

  useEffect(() => {
    if (actualPosition) setItemPosition(actualPosition);
  }, [actualPosition]);

  const [ref] = useCylinder(() => {
    return {
      mass,
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
      },
    };
  });

  return (
    <mesh ref={ref}>
      <cylinderBufferGeometry attach="geometry" args={args} />
      <meshPhongMaterial
        attach="material"
        color={color}
        shininess={shininess}
      />
    </mesh>
  );
};

// Check if point is further from the origin than the radius
const checkIfOut = (radius, x, z) => Math.sqrt(x * x + z * z) > radius;

const generateStackItem = () => ({
  color: Math.floor(Math.random() * 16777215),
  shininess: Math.round(Math.random() * 100),
  mass: 0.3 + Math.random() * 0.3,
  height: 0.1 + Math.random() * 0.3,
});

const Stack = ({ x, z }) => {
  const [positions, setPositions] = useState([]);
  const [items, setItems] = useState([]);

  const [isOut, setIsOut] = useState(false);

  const setItemPosition = (p) => {
    if (!checkIfOut(0.7, p[0] - x, p[2] - z)) return;
    setIsOut(true);
    setPositions([...positions, p]);
  };

  // Restart the stack when item is out of bounds
  useEffect(() => {
    if (!isOut) return;

    const id = setTimeout(() => {
      setPositions([]);
      setItems([]);
      setIsOut(false);
    }, 1000);

    return () => clearTimeout(id);
  }, [isOut]);

  useEffect(() => {
    const id = setTimeout(() => {
      setItems([...items, generateStackItem()]);
    }, 1000);
    return () => clearTimeout(id);
  }, [items]);

  return (
    <>
      {items.map((attrs, i) => (
        <Item
          attrs={attrs}
          key={i}
          position={[x, 5, z]}
          setItemPosition={setItemPosition}
        />
      ))}
      {/* Draw points that are out of bounds */}
      {positions.map((p, i) => (
        <mesh position={p} key={i}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshNormalMaterial />
        </mesh>
      ))}
      <mesh position={[x, 0, z]}>
        <cylinderGeometry args={[0.7, 0.7, 10, 32]} />
        <meshBasicMaterial
          color={isOut ? 0xff0000 : 0xffffff}
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );
};

export default Stack;
