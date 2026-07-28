import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * A rotating Bloch sphere with a state vector at (theta, phi). Used inline in
 * chapters to make the geometry of a qubit tangible. Auto-rotates gently.
 */
export function BlochSphere({
  theta = Math.PI / 3,
  phi = Math.PI / 4,
  precess = true,
  size = 260,
  label = '|ψ⟩',
}: {
  theta?: number;
  phi?: number;
  precess?: boolean;
  size?: number;
  label?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(2.4, 1.7, 2.7);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // sphere
    group.add(
      new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.SphereGeometry(1, 18, 12)),
        new THREE.LineBasicMaterial({ color: '#1e2d47', transparent: true, opacity: 0.6 }),
      ),
    );
    // equator + meridian
    const ringMat = new THREE.LineBasicMaterial({ color: '#2a3d5c' });
    const ringGeo = new THREE.TorusGeometry(1, 0.004, 8, 96);
    const eq = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: '#2a3d5c' }));
    eq.rotation.x = Math.PI / 2;
    group.add(eq);

    // axes
    const axis = (dir: THREE.Vector3, color: string) => {
      const m = new THREE.LineBasicMaterial({ color });
      const g = new THREE.BufferGeometry().setFromPoints([dir.clone().multiplyScalar(-1.25), dir.clone().multiplyScalar(1.25)]);
      group.add(new THREE.Line(g, m));
    };
    axis(new THREE.Vector3(1, 0, 0), '#334966');
    axis(new THREE.Vector3(0, 1, 0), '#334966');
    axis(new THREE.Vector3(0, 0, 1), '#334966');
    void ringMat;

    // |0> and |1> poles
    const poleTop = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), new THREE.MeshBasicMaterial({ color: '#2dd4bf' }));
    poleTop.position.set(0, 1, 0);
    const poleBot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), new THREE.MeshBasicMaterial({ color: '#ec4899' }));
    poleBot.position.set(0, -1, 0);
    group.add(poleTop, poleBot);

    // state vector
    const vec = new THREE.Group();
    group.add(vec);
    const dir = new THREE.Vector3();
    const setDir = (th: number, ph: number) => {
      dir.set(Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph));
    };
    setDir(theta, phi);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), dir.clone()]),
      new THREE.LineBasicMaterial({ color: '#22b8f0', linewidth: 2 }),
    );
    vec.add(line);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 20), new THREE.MeshBasicMaterial({ color: '#22b8f0' }));
    vec.add(tip);
    const tipGlow = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), new THREE.MeshBasicMaterial({ color: '#22b8f0', transparent: true, opacity: 0.25 }));
    vec.add(tipGlow);

    group.rotation.x = 0.1;

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      if (!reduce) group.rotation.y = t * 0.35;
      const ph = precess && !reduce ? phi + t * 0.8 : phi;
      setDir(theta, ph);
      (line.geometry as THREE.BufferGeometry).setFromPoints([new THREE.Vector3(0, 0, 0), dir.clone()]);
      tip.position.copy(dir);
      tipGlow.position.copy(dir);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [theta, phi, precess, size]);

  return (
    <div className="my-6 flex flex-col items-center">
      <div ref={mountRef} style={{ width: size, height: size }} />
      <div className="mt-1 flex items-center gap-4 text-xs text-muted">
        <span><span className="text-quantum-teal">●</span> |0⟩</span>
        <span className="font-mono text-primary">{label}</span>
        <span><span className="text-quantum-pink">●</span> |1⟩</span>
      </div>
    </div>
  );
}
