import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeCharacterCanvasProps {
  state?: "idle" | "success" | "thinking" | "shake" | "sleep" | "panic";
  mousePos?: { x: number; y: number };
  width?: number;
  height?: number;
  className?: string;
  type?: "hero" | "assistant";
}

function RobotFace({ state = "idle", mousePos = { x: 0, y: 0 } }: { state?: string, mousePos?: {x: number, y: number} }) {
  const group = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);

  useFrame((stateCtx) => {
    if (!group.current) return;
    
    // Look at mouse pointer
    const targetX = (mousePos.x * Math.PI) / 4;
    const targetY = (mousePos.y * Math.PI) / 4;
    
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.1);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 0.1);

    // Idle floating animation inside the head
    const time = stateCtx.clock.getElapsedTime();
    if (state === "thinking") {
      group.current.position.y = Math.sin(time * 5) * 0.1;
      group.current.rotation.z = Math.sin(time * 2) * 0.1;
    } else if (state === "shake") {
      group.current.position.x = Math.sin(time * 20) * 0.1;
    } else {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, 0.1);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1);
    }
    
    // Eye animations
    if (leftEye.current && rightEye.current) {
      if (state === "sleep") {
        leftEye.current.scale.y = THREE.MathUtils.lerp(leftEye.current.scale.y, 0.1, 0.2);
        rightEye.current.scale.y = THREE.MathUtils.lerp(rightEye.current.scale.y, 0.1, 0.2);
      } else if (state === "success") {
        leftEye.current.scale.y = THREE.MathUtils.lerp(leftEye.current.scale.y, 1.2, 0.2);
        rightEye.current.scale.y = THREE.MathUtils.lerp(rightEye.current.scale.y, 1.2, 0.2);
      } else {
        // Blink occasionally
        const blink = Math.random() > 0.99 ? 0.1 : 1;
        leftEye.current.scale.y = THREE.MathUtils.lerp(leftEye.current.scale.y, blink, 0.5);
        rightEye.current.scale.y = THREE.MathUtils.lerp(rightEye.current.scale.y, blink, 0.5);
      }
    }
  });

  return (
    <group ref={group}>
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} />
      </Sphere>
      
      {/* Visor */}
      <Box args={[1.4, 0.6, 0.8]} position={[0, 0.1, 0.6]}>
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </Box>

      {/* Eyes */}
      <Sphere ref={leftEye} args={[0.15, 16, 16]} position={[-0.3, 0.1, 1.05]}>
        <meshBasicMaterial color={state === "panic" ? "#ef4444" : "#22d3ee"} />
      </Sphere>
      <Sphere ref={rightEye} args={[0.15, 16, 16]} position={[0.3, 0.1, 1.05]}>
        <meshBasicMaterial color={state === "panic" ? "#ef4444" : "#22d3ee"} />
      </Sphere>
    </group>
  );
}

export default function ThreeCharacterCanvas({
  state = "idle",
  mousePos = { x: 0, y: 0 },
  width,
  height,
  className = "",
  type = "assistant"
}: ThreeCharacterCanvasProps) {
  
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#0ea5e9" />
        
        {type === "hero" ? (
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <RobotFace state="idle" mousePos={{x: 0, y: 0}} />
          </Float>
        ) : (
          <RobotFace state={state} mousePos={mousePos} />
        )}
      </Canvas>
    </div>
  );
}
