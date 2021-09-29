import React, { useState, useEffect } from "react";
import { useCylinder } from "@react-three/cannon";
import { Vector3, Box3 } from "three";
import { Bacon, BreadDown, BreadUp, Cheese, Lettuce, Meat, Tomato } from "./Ingredients";

const items = [
  "bacon", "bread_down", "bread_up", "cheese", "lettuce", "meat", "tomato",
];

const ingredients = {
  meat: {r: 1, height: 0.25, Component: Meat},
  bacon: {r: 1.02, height: 0.15, Component: Bacon},
  bread_up: {r: 1, height: 0.71, Component: BreadUp},
  bread_down: {r: 1, height: 0.2, Component: BreadDown},
  cheese: {r: 1, height: 0.25, Component: Cheese},
  lettuce: {r: 1.152, height: 0.25, Component: Lettuce},
  tomato: {r: 1, height: 0.295, Component: Tomato}
};

const Item = ({
  attrs: {  mass, Component, height, r },
  position,
  setItemPosition,
}) => {
  // const gltf = useGLTF('/assets/bread_down.gltf');
  // const box = new Box3().setFromObject(gltf.scene);
  // const height = box.max.y - box.min.y;
  // const r = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) / 2;
  // console.log(height, r)

  const args = [r, r, height, 16];

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
    <group ref={ref}>
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
  // ...ingredients[items[1]]
  ...ingredients[items[Math.floor(Math.random() * items.length)]]
});

const Stack = ({ x, z }) => {
  const [positions, setPositions] = useState([]);
  const [items, setItems] = useState([]);

  const [isOut, setIsOut] = useState(false);

  const setItemPosition = (p) => {
    if (!checkIfOut(1.1, p[0] - x, p[2] - z)) return;
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
        <cylinderGeometry args={[1.1, 1.1, 10, 32]} />
        <meshBasicMaterial
          color={isOut ? 0xff0000 : 0xffffff}
          transparent
          opacity={0.1}
        />
      </mesh>
    </>
  );
};



export default Stack;
