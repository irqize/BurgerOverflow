import { EffectComposer, SSAO } from '@react-three/postprocessing'
import { softShadows } from '@react-three/drei'

const PostEffect = () => {
    return (
        <EffectComposer multisampling={0}>
            <SSAO samples={25} intensity={5} luminanceInfluence={0.4} radius={5} scale={0.3} bias={0.4} />
        </EffectComposer>
    );
}

export default PostEffect;