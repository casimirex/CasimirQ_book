import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * The hero backdrop: a slowly turning spiral galaxy of stars with a glowing
 * qubit at its heart, orbited by electrons on tilted rings. Pure Three.js so
 * there are no framework version constraints. Respects prefers-reduced-motion.
 */
export function QuantumUniverse({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 1.6, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ---- Spiral galaxy of stars ----
    const COUNT = 7000;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const inside = new THREE.Color('#7dd3fc');
    const outside = new THREE.Color('#8b5cf6');
    const arms = 3;
    for (let i = 0; i < COUNT; i++) {
      const radius = Math.pow(Math.random(), 0.7) * 5.5;
      const branch = ((i % arms) / arms) * Math.PI * 2;
      const spin = radius * 0.85;
      const scatter = (r: number) => (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * r);
      const x = Math.cos(branch + spin) * radius + scatter(0.5 + radius * 0.06);
      const y = scatter(0.35);
      const z = Math.sin(branch + spin) * radius + scatter(0.5 + radius * 0.06);
      positions.set([x, y, z], i * 3);
      const c = inside.clone().lerp(outside, Math.min(radius / 5.5, 1));
      colors.set([c.r, c.g, c.b], i * 3);
    }
    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const galaxyMat = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
    galaxy.rotation.x = 0.42;
    scene.add(galaxy);

    // ---- Distant faint starfield ----
    const starCount = 900;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos.set(
        [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
        ],
        i * 3,
      );
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ size: 0.06, color: '#cbd5e1', transparent: true, opacity: 0.5, depthWrite: false }),
    );
    scene.add(stars);

    // ---- Central qubit ----
    const core = new THREE.Group();
    scene.add(core);

    const nucleus = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.62, 1),
      new THREE.MeshBasicMaterial({ color: '#22b8f0', wireframe: true, transparent: true, opacity: 0.85 }),
    );
    core.add(nucleus);
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 32),
      new THREE.MeshBasicMaterial({ color: '#22b8f0', transparent: true, opacity: 0.12 }),
    );
    core.add(glow);

    // orbit rings + electrons
    const electrons: { mesh: THREE.Mesh; ring: THREE.Group; speed: number; radius: number; phase: number }[] = [];
    const ringColors = ['#38bdf8', '#8b5cf6', '#2dd4bf'];
    for (let k = 0; k < 3; k++) {
      const ring = new THREE.Group();
      ring.rotation.x = (k * Math.PI) / 3.2;
      ring.rotation.y = (k * Math.PI) / 2.5;
      const R = 1.25 + k * 0.36;
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(R, 0.008, 8, 128),
        new THREE.MeshBasicMaterial({ color: ringColors[k], transparent: true, opacity: 0.35 }),
      );
      ring.add(torus);
      const e = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 16, 16),
        new THREE.MeshBasicMaterial({ color: ringColors[k] }),
      );
      ring.add(e);
      core.add(ring);
      electrons.push({ mesh: e, ring, speed: 0.9 - k * 0.18, radius: R, phase: k * 2.1 });
    }

    // ---- Interaction: gentle parallax ----
    const target = { x: 0, y: 0 };
    const onMove = (ev: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      target.x = ((ev.clientX - r.left) / r.width - 0.5) * 0.5;
      target.y = ((ev.clientY - r.top) / r.height - 0.5) * 0.3;
    };
    window.addEventListener('pointermove', onMove);

    // ---- Resize ----
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---- Animate ----
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      const t = clock.getElapsedTime();
      const dt = reduce ? 0 : 1;
      galaxy.rotation.y = t * 0.045 * (reduce ? 0 : 1) + (reduce ? 0.6 : 0);
      stars.rotation.y = t * 0.01 * dt;
      core.rotation.y = t * 0.25 * dt;
      nucleus.rotation.x = t * 0.4 * dt;
      const s = 1 + Math.sin(t * 2) * 0.05 * dt;
      glow.scale.setScalar(s);
      electrons.forEach((el) => {
        const a = t * el.speed * dt + el.phase;
        el.mesh.position.set(Math.cos(a) * el.radius, 0, Math.sin(a) * el.radius);
      });
      // parallax easing
      scene.rotation.y += (target.x - scene.rotation.y) * 0.03;
      scene.rotation.x += (target.y - scene.rotation.x) * 0.03;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      renderer.dispose();
      galaxyGeo.dispose();
      galaxyMat.dispose();
      starGeo.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden />;
}
