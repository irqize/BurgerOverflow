import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function damp(target, to, step, delta, v = new THREE.Vector3()) {
    if (target instanceof THREE.Vector3) {
        target.x = THREE.MathUtils.damp(target.x, to[0], step, delta);
        target.y = THREE.MathUtils.damp(target.y, to[1], step, delta);
        target.z = THREE.MathUtils.damp(target.z, to[2], step, delta);
    }
}

function Animation({ isEnd }) {
    useFrame((state, delta) => {
        const step = 4;
        state.camera.fov = THREE.MathUtils.damp(
            state.camera.fov,
            !isEnd ? 50 : 30,
            step,
            delta
        );
        damp(
            state.camera.position,
            [!isEnd ? 0 : -1, !isEnd ? 12 : 2, !isEnd ? 9 : 10],
            step,
            delta
        );
        state.camera.lookAt(0, 0, 0);
        state.camera.updateProjectionMatrix();
    });
    return null;
}

export default Animation;
