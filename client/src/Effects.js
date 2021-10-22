import { useRef } from "react";
import { EffectComposer, Bloom, SSAO } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";

const Effects = () => {
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
};

export default Effects;
