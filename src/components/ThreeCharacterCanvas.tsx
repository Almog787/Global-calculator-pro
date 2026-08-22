import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeCharacterCanvasProps {
  state?: "idle" | "success" | "thinking" | "shake";
  mousePos?: { x: number; y: number };
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
}

export default function ThreeCharacterCanvas({
  state = "idle",
  mousePos = { x: 0, y: 0 },
  width = 80,
  height = 80,
  className = "",
  onClick,
}: ThreeCharacterCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  const mousePosRef = useRef(mousePos);

  // Keep refs up to date without re-instantiating scene
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    mousePosRef.current = mousePos;
  }, [mousePos]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const backLight = new THREE.PointLight(0x00f5d4, 2.5, 10);
    backLight.position.set(-3, -2, 3);
    scene.add(backLight);

    // 3. Character Root Group
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    // Head / Main Body - High visibility vibrant cyan-blue metallic body
    const headGeo = new THREE.SphereGeometry(1.0, 36, 36);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Deep vibrant cyan-blue
      roughness: 0.18,
      metalness: 0.45,
      emissive: 0x0369a1,
      emissiveIntensity: 0.2,
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    characterGroup.add(headMesh);

    // Outer Protective Glass Sheen (Futuristic Helmet Halo)
    const glassGeo = new THREE.SphereGeometry(1.05, 32, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.2,
      clearcoat: 1.0,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    characterGroup.add(glassMesh);

    // Visor / Screen Face - Glossy dark slate screen
    const visorGeo = new THREE.SphereGeometry(0.82, 32, 32);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16, // Obsidian glass screen
      roughness: 0.05,
      metalness: 0.9,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0, 0.25);
    visorMesh.scale.set(1.0, 0.72, 0.9);
    characterGroup.add(visorMesh);

    // Cute LED Blush cheeks on visor
    const cheekGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const cheekMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e }); // Soft rosy pink LED
    
    const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
    leftCheek.position.set(-0.48, -0.16, 0.88);
    leftCheek.scale.set(1.2, 0.6, 0.5);
    characterGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
    rightCheek.position.set(0.48, -0.16, 0.88);
    rightCheek.scale.set(1.2, 0.6, 0.5);
    characterGroup.add(rightCheek);

    // Eyes Group
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 0.08, 0.95);
    characterGroup.add(eyesGroup);

    const eyeGeo = new THREE.SphereGeometry(0.19, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Crisp pure white

    const pupilGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 }); // Glowing cyan

    // Catchlight (White shine reflection dot for expressive eyes)
    const catchlightGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Left Eye & Pupil & Catchlight
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.35, 0, 0);
    const leftEyeBg = new THREE.Mesh(eyeGeo, eyeMat);
    leftEyeGroup.add(leftEyeBg);
    
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(0, 0, 0.1);
    
    const leftShine = new THREE.Mesh(catchlightGeo, catchlightMat);
    leftShine.position.set(0.04, 0.04, 0.11);
    leftPupil.add(leftShine);
    
    leftEyeGroup.add(leftPupil);
    eyesGroup.add(leftEyeGroup);

    // Right Eye & Pupil & Catchlight
    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.35, 0, 0);
    const rightEyeBg = new THREE.Mesh(eyeGeo, eyeMat);
    rightEyeGroup.add(rightEyeBg);
    
    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0, 0, 0.1);
    
    const rightShine = new THREE.Mesh(catchlightGeo, catchlightMat);
    rightShine.position.set(0.04, 0.04, 0.11);
    rightPupil.add(rightShine);
    
    rightEyeGroup.add(rightPupil);
    eyesGroup.add(rightEyeGroup);

    // Eyebrows
    const eyebrowGeo = new THREE.BoxGeometry(0.26, 0.04, 0.04);
    const eyebrowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 }); // Sky blue eyebrows

    const leftEyebrow = new THREE.Mesh(eyebrowGeo, eyebrowMat);
    leftEyebrow.position.set(-0.35, 0.28, 0.98);
    characterGroup.add(leftEyebrow);

    const rightEyebrow = new THREE.Mesh(eyebrowGeo, eyebrowMat);
    rightEyebrow.position.set(0.35, 0.28, 0.98);
    characterGroup.add(rightEyebrow);

    // Antenna
    const antennaStemGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.38, 8);
    const antennaStemMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.1 }); // Gold metallic stem
    const antennaStem = new THREE.Mesh(antennaStemGeo, antennaStemMat);
    antennaStem.position.set(0, 1.15, 0);
    characterGroup.add(antennaStem);

    const antennaBulbGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const antennaBulbMat = new THREE.MeshBasicMaterial({ color: 0xff007a }); // Glowing neon pink bulb
    const antennaBulb = new THREE.Mesh(antennaBulbGeo, antennaBulbMat);
    antennaBulb.position.set(0, 1.38, 0);
    characterGroup.add(antennaBulb);

    // Ears / Side Pods
    const podGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16);
    const podMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 }); // Metallic cyan pods
    
    const leftPod = new THREE.Mesh(podGeo, podMat);
    leftPod.rotation.z = Math.PI / 2;
    leftPod.position.set(-1.02, 0, 0);
    characterGroup.add(leftPod);

    const rightPod = new THREE.Mesh(podGeo, podMat);
    rightPod.rotation.z = Math.PI / 2;
    rightPod.position.set(1.02, 0, 0);
    characterGroup.add(rightPod);

    // Ring Collar
    const ringGeo = new THREE.TorusGeometry(0.85, 0.05, 12, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 }); // Gold glowing ring
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(0, -0.85, 0);
    characterGroup.add(ringMesh);

    // 4. Animation Variables & States
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let blinkTimer = 0;
    let isBlinking = false;
    let blinkProgress = 0;

    // Reaction Animation Progress Timers
    let successStartTime = 0;
    let shakeStartTime = 0;
    let prevActionState = "idle";

    // 5. Render Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      const currentState = stateRef.current;
      const mouse = mousePosRef.current;

      // Handle action trigger detection
      if (currentState === "success" && prevActionState !== "success") {
        successStartTime = elapsedTime;
      }
      if (currentState === "shake" && prevActionState !== "shake") {
        shakeStartTime = elapsedTime;
      }
      prevActionState = currentState;

      // --- A. IDLE FLOATING & SWAY ---
      if (!prefersReducedMotion) {
        characterGroup.position.y = Math.sin(elapsedTime * 2.2) * 0.12;
        characterGroup.rotation.z = Math.sin(elapsedTime * 1.5) * 0.04;
      } else {
        characterGroup.position.y = 0;
        characterGroup.rotation.z = 0;
      }

      // Antenna bulb pulsing
      const bulbPulse = 1 + Math.sin(elapsedTime * 4.5) * 0.18;
      antennaBulb.scale.set(bulbPulse, bulbPulse, bulbPulse);

      // --- B. MOUSE TRACKING (EYES & HEAD TILT) ---
      // Clamp mouse coordinates
      const clampedMouseX = Math.max(-1, Math.min(1, mouse.x));
      const clampedMouseY = Math.max(-1, Math.min(1, mouse.y));

      // Pupils tracking
      const targetPupilX = clampedMouseX * 0.07;
      const targetPupilY = -clampedMouseY * 0.06;

      leftPupil.position.x += (targetPupilX - leftPupil.position.x) * 0.15;
      leftPupil.position.y += (targetPupilY - leftPupil.position.y) * 0.15;
      rightPupil.position.x += (targetPupilX - rightPupil.position.x) * 0.15;
      rightPupil.position.y += (targetPupilY - rightPupil.position.y) * 0.15;

      // Head Tilt tracking
      const targetHeadRotY = clampedMouseX * 0.32;
      const baseRotX = -clampedMouseY * 0.22;

      // Combine head tilt with state animations
      let baseRotY = targetHeadRotY;
      let baseRotZ = 0;

      // --- C. BLINKING LOGIC ---
      blinkTimer += 0.016;
      if (blinkTimer > 3.8 + Math.random() * 2.2) {
        isBlinking = true;
        blinkTimer = 0;
        blinkProgress = 0;
      }

      if (isBlinking) {
        blinkProgress += 0.12;
        const blinkScale = Math.max(0.1, Math.abs(Math.cos(blinkProgress * Math.PI)));
        eyesGroup.scale.y = blinkScale;
        if (blinkProgress >= 1) {
          isBlinking = false;
          eyesGroup.scale.y = 1;
        }
      }

      // --- D. REACTIVE ANIMATIONS ---
      if (currentState === "success" && !prefersReducedMotion) {
        // "Success Jump" - 360 degree spin & jump
        const duration = 0.8;
        const progress = Math.min((elapsedTime - successStartTime) / duration, 1);
        if (progress < 1) {
          const jumpHeight = Math.sin(progress * Math.PI) * 0.65;
          characterGroup.position.y += jumpHeight;
          baseRotY += progress * Math.PI * 2;
        }
      } else if (currentState === "thinking") {
        // "Thinking State" - Eyebrows wiggle & head tilts curiously
        const wiggle = Math.sin(elapsedTime * 14) * 0.05;
        leftEyebrow.position.y = 0.28 + wiggle;
        rightEyebrow.position.y = 0.28 - wiggle;
        baseRotZ = Math.sin(elapsedTime * 6) * 0.12;
      } else if (currentState === "shake" && !prefersReducedMotion) {
        // "No Results Shake" - Head shakes no
        const duration = 0.6;
        const progress = Math.min((elapsedTime - shakeStartTime) / duration, 1);
        if (progress < 1) {
          baseRotY += Math.sin(progress * Math.PI * 6) * 0.35;
        }
      } else {
        // Reset eyebrows
        leftEyebrow.position.y = 0.28;
        rightEyebrow.position.y = 0.28;
      }

      // Apply rotations smoothly
      characterGroup.rotation.x += (baseRotX - characterGroup.rotation.x) * 0.1;
      characterGroup.rotation.y += (baseRotY - characterGroup.rotation.y) * 0.1;
      if (currentState !== "idle" || prefersReducedMotion) {
        characterGroup.rotation.z += (baseRotZ - characterGroup.rotation.z) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      headGeo.dispose();
      headMat.dispose();
      visorGeo.dispose();
      visorMat.dispose();
      eyeGeo.dispose();
      eyeMat.dispose();
      pupilGeo.dispose();
      pupilMat.dispose();
      eyebrowGeo.dispose();
      eyebrowMat.dispose();
      antennaStemGeo.dispose();
      antennaStemMat.dispose();
      antennaBulbGeo.dispose();
      antennaBulbMat.dispose();
      podGeo.dispose();
      podMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, [width, height]);

  return (
    <div
      ref={mountRef}
      onClick={onClick}
      className={`relative inline-block cursor-pointer select-none ${className}`}
      style={{ width, height }}
    />
  );
}
