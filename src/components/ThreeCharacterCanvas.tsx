import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Html } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';

interface ThreeCharacterCanvasProps {
  state?: "idle" | "success" | "thinking" | "shake" | "sleep" | "panic";
  mousePos?: { x: number; y: number };
  scrollVelocity?: number;
  width?: number;
  height?: number;
  className?: string;
  type?: "hero" | "assistant";
  message?: string;
}

function RobotFace({ state = "idle", mousePos = { x: 0, y: 0 }, scrollVelocity = 0, message }: { state?: string, mousePos?: {x: number, y: number}, scrollVelocity?: number, message?: string }) {
  const innerGroup = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);

  // Apply spring physics to react to scroll velocity (Stage B implementation)
  const { springY, springRotX } = useSpring({
    springY: scrollVelocity * -0.5,
    springRotX: scrollVelocity * 0.5,
    config: config.wobbly,
  });

  useFrame((stateCtx) => {
    if (!innerGroup.current) return;
    
    // Look at mouse pointer (Head rotation)
    // Positive Y turns face to the right (+X)
    // Negative X tilts face upwards (+Y)
    const targetRotY = (mousePos.x * Math.PI) / 3;
    const targetRotX = (-mousePos.y * Math.PI) / 4;
    
    // Smoothly interpolate head rotation
    innerGroup.current.rotation.y = THREE.MathUtils.lerp(innerGroup.current.rotation.y, targetRotY, 0.08);
    innerGroup.current.rotation.x = THREE.MathUtils.lerp(innerGroup.current.rotation.x, targetRotX, 0.08);

    // Idle floating animation inside the head
    const time = stateCtx.clock.getElapsedTime();
    if (state === "thinking") {
      innerGroup.current.position.y = Math.sin(time * 5) * 0.1;
      innerGroup.current.rotation.z = Math.sin(time * 2) * 0.1;
    } else if (state === "shake") {
      innerGroup.current.position.x = Math.sin(time * 20) * 0.1;
    } else {
      innerGroup.current.position.y = THREE.MathUtils.lerp(innerGroup.current.position.y, Math.sin(time * 2) * 0.05, 0.1);
      innerGroup.current.rotation.z = THREE.MathUtils.lerp(innerGroup.current.rotation.z, 0, 0.1);
    }
    
    // Eye tracking and animations
    if (leftEye.current && rightEye.current) {
      // Eyes shift slightly further in the direction of the mouse for a parallax effect
      const eyeTargetX = mousePos.x * 0.08;
      const eyeTargetY = mousePos.y * 0.08;

      // Base eye positions
      const leftBaseX = -0.3;
      const rightBaseX = 0.3;
      const baseY = 0.1;

      leftEye.current.position.x = THREE.MathUtils.lerp(leftEye.current.position.x, leftBaseX + eyeTargetX, 0.15);
      leftEye.current.position.y = THREE.MathUtils.lerp(leftEye.current.position.y, baseY + eyeTargetY, 0.15);
      
      rightEye.current.position.x = THREE.MathUtils.lerp(rightEye.current.position.x, rightBaseX + eyeTargetX, 0.15);
      rightEye.current.position.y = THREE.MathUtils.lerp(rightEye.current.position.y, baseY + eyeTargetY, 0.15);

      if (state === "sleep") {
        leftEye.current.scale.y = THREE.MathUtils.lerp(leftEye.current.scale.y, 0.1, 0.2);
        rightEye.current.scale.y = THREE.MathUtils.lerp(rightEye.current.scale.y, 0.1, 0.2);
      } else if (state === "success") {
        leftEye.current.scale.y = THREE.MathUtils.lerp(leftEye.current.scale.y, 1.2, 0.2);
        rightEye.current.scale.y = THREE.MathUtils.lerp(rightEye.current.scale.y, 1.2, 0.2);
      } else {
        // Blink occasionally
        const blink = Math.random() > 0.992 ? 0.05 : 1;
        leftEye.current.scale.y = THREE.MathUtils.lerp(leftEye.current.scale.y, blink, 0.4);
        rightEye.current.scale.y = THREE.MathUtils.lerp(rightEye.current.scale.y, blink, 0.4);
      }
    }
  });

  // Determine chat bubble text
  const getBubbleText = () => {
    if (message) return message;
    switch (state) {
      case 'thinking': return 'מחשב...';
      case 'success': return 'מעולה! ✓';
      case 'shake': return 'אממ... לא הבנתי';
      case 'panic': return 'שגיאה!';
      case 'idle': 
      case 'sleep':
      default: return null;
    }
  };

  const bubbleText = getBubbleText();

  return (
    <animated.group position-y={springY} rotation-x={springRotX}>
      <group ref={innerGroup}>
        {/* Stage C: HTML Chat Bubble directly tracked in 3D Space */}
        {bubbleText && (
          <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
            <div className="bg-slate-900/95 backdrop-blur-sm text-white text-xs md:text-sm px-3 py-1.5 rounded-2xl whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none animate-bounce">
              {bubbleText}
            </div>
          </Html>
        )}

        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.1} />
        </Sphere>
        
        {/* Visor */}
        <Box args={[1.4, 0.6, 0.8]} position={[0, 0.1, 0.6]}>
          <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} />
        </Box>

        {/* Eyes */}
        <Sphere ref={leftEye} args={[0.15, 16, 16]} position={[-0.3, 0.1, 1.05]}>
          <meshStandardMaterial 
            color={state === "panic" ? "#ef4444" : "#22d3ee"} 
            emissive={state === "panic" ? "#ef4444" : "#22d3ee"}
            emissiveIntensity={2} 
          />
        </Sphere>
        <Sphere ref={rightEye} args={[0.15, 16, 16]} position={[0.3, 0.1, 1.05]}>
          <meshStandardMaterial 
            color={state === "panic" ? "#ef4444" : "#22d3ee"} 
            emissive={state === "panic" ? "#ef4444" : "#22d3ee"}
            emissiveIntensity={2} 
          />
        </Sphere>
      </group>
    </animated.group>
  );
}

export default function ThreeCharacterCanvas({
  state = "idle",
  mousePos = { x: 0, y: 0 },
  scrollVelocity = 0,
  width,
  height,
  className = "",
  type = "assistant",
  message
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
            <RobotFace state="idle" mousePos={{x: 0, y: 0}} scrollVelocity={0} message={message} />
          </Float>
        ) : (
          <RobotFace state={state} mousePos={mousePos} scrollVelocity={scrollVelocity} message={message} />
        )}
      </Canvas>
    </div>
  );
}
