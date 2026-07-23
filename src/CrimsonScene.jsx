import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroPoster from "./assets/crimson-c-hero.webp";

gsap.registerPlugin(ScrollTrigger);

function disposeObject(object) {
  object.traverse((child) => {
    child.geometry?.dispose();
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material.dispose());
    } else {
      child.material?.dispose();
    }
  });
}

export default function CrimsonScene() {
  const mountRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = window.matchMedia("(max-width: 767px)").matches;
    if (!mount || reduceMotion || !window.WebGLRenderingContext) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 40);
    camera.position.set(0, 0, 6.7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !lowPower,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const objectGroup = new THREE.Group();
    objectGroup.position.set(lowPower ? 0.8 : 1.55, lowPower ? -0.65 : -0.05, 0);
    objectGroup.rotation.set(0.2, -0.38, -0.62);
    scene.add(objectGroup);

    const arc = Math.PI * 1.68;
    const segments = lowPower ? 88 : 180;
    const outerGeometry = new THREE.TorusGeometry(1.42, 0.35, lowPower ? 24 : 48, segments, arc);
    const outerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x303039,
      metalness: 0.74,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x160208,
      emissiveIntensity: 0.45,
      transparent: true,
    });
    const outer = new THREE.Mesh(outerGeometry, outerMaterial);
    objectGroup.add(outer);

    const glowGeometry = new THREE.TorusGeometry(1.42, 0.15, lowPower ? 18 : 32, segments, arc);
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0xd22645,
      emissive: 0xd22645,
      emissiveIntensity: 3.2,
      roughness: 0.28,
      metalness: 0.2,
      transparent: true,
      opacity: 0.92,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = -0.18;
    objectGroup.add(glow);

    const wireGeometry = new THREE.TorusGeometry(1.42, 0.39, 12, lowPower ? 56 : 100, arc);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xd22645,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    objectGroup.add(wire);

    const particleCount = lowPower ? 90 : 220;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.1 + Math.random() * 2.6;
      particlePositions[index * 3] = Math.cos(angle) * radius;
      particlePositions[index * 3 + 1] = Math.sin(angle) * radius * 0.72;
      particlePositions[index * 3 + 2] = (Math.random() - 0.5) * 3.6;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd22645,
      size: lowPower ? 0.014 : 0.018,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    objectGroup.add(particles);

    scene.add(new THREE.AmbientLight(0xd8dae0, 1.75));
    const key = new THREE.DirectionalLight(0xffffff, 5.5);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9ca3af, 2.4);
    fill.position.set(4, -2, 4);
    scene.add(fill);
    const rim = new THREE.PointLight(0xd22645, 42, 14, 2);
    rim.position.set(2.2, -1.3, 2.6);
    scene.add(rim);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const timer = new THREE.Timer();
    let running = true;
    const render = (timestamp) => {
      if (!running) return;
      timer.update(timestamp);
      const elapsed = timer.getElapsed();
      objectGroup.rotation.y += (pointer.x * 0.08 - objectGroup.rotation.y) * 0.025;
      outer.rotation.x += (-pointer.y * 0.035 - outer.rotation.x) * 0.025;
      glowMaterial.emissiveIntensity = 2.7 + Math.sin(elapsed * 1.25) * 0.55;
      particles.rotation.z = elapsed * 0.018;
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(render);

    const onVisibility = () => {
      running = !document.hidden;
      renderer.setAnimationLoop(running ? render : null);
    };
    document.addEventListener("visibilitychange", onVisibility);

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1 : 1.5));
    };
    window.addEventListener("resize", resize, { passive: true });

    const animationContext = gsap.context(() => {
      const heroScale = lowPower ? 0.68 : 1;
      gsap.fromTo(
        objectGroup.scale,
        { x: heroScale * 0.7, y: heroScale * 0.7, z: heroScale * 0.7 },
        { x: heroScale, y: heroScale, z: heroScale, duration: 1.4, ease: "power3.out" },
      );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#process",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        })
        .to(objectGroup.position, { x: lowPower ? 0.7 : 2.35, y: 0.1, z: -0.5 }, 0)
        .to(objectGroup.rotation, { z: 0.4, y: Math.PI * 0.9 }, 0)
        .to(wireMaterial, { opacity: 0.7 }, 0.08)
        .to(outerMaterial, { opacity: 0.25 }, 0.08)
        .to(particleMaterial, { opacity: 0.7 }, 0.08)
        .to(outerMaterial, { opacity: 1 }, 0.58)
        .to(wireMaterial, { opacity: 0.06 }, 0.58)
        .to(particleMaterial, { opacity: 0.18 }, 0.58)
        .to(objectGroup.rotation, { z: -0.7, y: Math.PI * 1.9 }, 0.58);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#work",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        })
        .to(objectGroup.position, { x: -1.8, y: 0.2, z: -2.2 }, 0)
        .to(objectGroup.rotation, { y: Math.PI * 3.1, z: -0.2 }, 0)
        .to(objectGroup.scale, { x: 0.72, y: 0.72, z: 0.72 }, 0);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#systems",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        })
        .to(objectGroup.position, { x: -2.25, y: -0.2, z: -1.2 }, 0)
        .to(objectGroup.rotation, { y: Math.PI * 4.4, z: 0.7 }, 0)
        .to(objectGroup.scale, { x: 0.58, y: 0.58, z: 0.58 }, 0)
        .to(particleMaterial, { opacity: 0.5 }, 0);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#contact",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        })
        .to(objectGroup.position, { x: 1.95, y: 0.35, z: -1.5 }, 0)
        .to(objectGroup.rotation, { y: Math.PI * 5.3, z: -0.55 }, 0)
        .to(objectGroup.scale, { x: 0.92, y: 0.92, z: 0.92 }, 0);
    });

    setReady(true);

    return () => {
      animationContext.revert();
      renderer.setAnimationLoop(null);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      disposeObject(objectGroup);
      particleGeometry.dispose();
      particleMaterial.dispose();
      timer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className={`scene-shell ${ready ? "is-ready" : ""}`} aria-hidden="true">
      <img className="scene-poster" src={heroPoster} alt="" />
      <div ref={mountRef} className="scene-canvas" />
    </div>
  );
}
