'use client';
import { Cloud, Sky, Text } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense } from 'react';

function Rig() {
    const camera = useThree((state) => state.camera)
    return useFrame((state) => {
      camera.position.z = Math.sin(state.clock.elapsedTime) * 12
    })
}

const PageContent = () => {
    return (
        <Canvas>
            <ambientLight intensity={0.8} />
            <pointLight intensity={2} position={[0, 0, -1000]} />
            <Suspense fallback={null}>
                <Cloud position={[0, 16, -15]} speed={0.4} opacity={0.5} />
                <Cloud position={[15, 16, -10]} speed={0.4} opacity={0.5} />
                <Cloud position={[6, 2, -5]} speed={0.4} opacity={1} />
                <Cloud position={[17, 15, -8]} speed={0.4} opacity={.6} />
                <Cloud position={[10, 10, -7]} speed={0.4} opacity={1} />
                <Cloud position={[-4, -5, -4]} speed={0.4} opacity={.5} />
                <Cloud position={[-8, -8, 0]} speed={0.4} opacity={.6} />
                <Cloud position={[-10, 0, -5]} speed={0.4} opacity={.75} />
                <Cloud position={[-10, 10, -5]} speed={0.3} opacity={.5} />
                <Cloud position={[8, 2, -30]} speed={0.3} opacity={1} />
                <Cloud position={[-8, 0, -20]} speed={0.3} opacity={1} />
                <Cloud position={[10, -6, 0]} speed={0.2} opacity={.5} />
                <Cloud position={[15, -2, -1]} speed={0.2} opacity={.75} />
                <Cloud position={[0, 7, -20]} speed={0.2} opacity={1} />
                <Cloud position={[-10, 10, -15]} speed={0.2} opacity={.5} />
                <Cloud position={[8, -10, -20]} speed={0.2} opacity={1} />
                <Text position={[0, 0, -20]} fontSize={5}>7th Sky</Text>
            </Suspense>
            <Sky azimuth={0.1} turbidity={1} rayleigh={0.5} inclination={0.6} distance={1000} />
            <Rig />
        </Canvas>
    );
}

export default PageContent;