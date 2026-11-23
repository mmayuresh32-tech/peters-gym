import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap, prefersReducedMotion, scrollState } from "../lib/scroll";

const LIME = 0xc6ff1a;

function knurlTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#6c7075";
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = "#d7dadd";
  g.lineWidth = 2.4;
  for (let i = -128; i < 256; i += 16) {
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i + 128, 128);
    g.stroke();
    g.beginPath();
    g.moveTo(i + 128, 0);
    g.lineTo(i, 128);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(10, 18);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function buildDumbbell(low: boolean) {
  const g = new THREE.Group();
  const seg = low ? 32 : 64;
  const knurl = knurlTexture();

  const chrome = new THREE.MeshStandardMaterial({ color: 0xe4e6e8, metalness: 1, roughness: 0.14 });
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: knurl,
    bumpMap: knurl,
    bumpScale: 1.4,
    metalness: 1,
    roughness: 0.36,
  });
  const headMat = new THREE.MeshStandardMaterial({ color: 0x17181a, metalness: 0.92, roughness: 0.3 });
  const limeMat = new THREE.MeshStandardMaterial({
    color: LIME,
    emissive: LIME,
    emissiveIntensity: 0.55,
    metalness: 0.2,
    roughness: 0.4,
  });

  // handle
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.6, seg, 1), handleMat);
  handle.rotation.z = Math.PI / 2;
  g.add(handle);

  // hex heads
  const R = 0.98;
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 + Math.PI / 6;
    const x = Math.cos(a) * R;
    const y = Math.sin(a) * R;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const headGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.72,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelSegments: low ? 2 : 5,
  });
  headGeo.center();
  headGeo.rotateY(Math.PI / 2);

  // inset lime hex badge
  const badgeShape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 + Math.PI / 6;
    const x = Math.cos(a) * 0.62;
    const y = Math.sin(a) * 0.62;
    if (i === 0) badgeShape.moveTo(x, y);
    else badgeShape.lineTo(x, y);
  }
  badgeShape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.36, 0, Math.PI * 2, true);
  badgeShape.holes.push(hole);
  const badgeGeo = new THREE.ExtrudeGeometry(badgeShape, { depth: 0.025, bevelEnabled: false });
  badgeGeo.center();
  badgeGeo.rotateY(Math.PI / 2);

  const capGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, seg);
  const collarGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.14, seg);

  [-1, 1].forEach((s) => {
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.x = s * 1.5;
    g.add(head);

    const badge = new THREE.Mesh(badgeGeo, limeMat);
    badge.position.x = s * (1.5 + 0.47);
    g.add(badge);

    const cap = new THREE.Mesh(capGeo, chrome);
    cap.rotation.z = Math.PI / 2;
    cap.position.x = s * 2.02;
    g.add(cap);

    const collar = new THREE.Mesh(collarGeo, chrome);
    collar.rotation.z = Math.PI / 2;
    collar.position.x = s * 0.95;
    g.add(collar);
  });

  return g;
}

function buildPlate(low: boolean) {
  const g = new THREE.Group();
  const seg = low ? 48 : 96;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 1.5, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.26, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.2,
    curveSegments: seg,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: low ? 2 : 4,
  });
  geo.center();
  const body = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x1b1c1e, metalness: 0.85, roughness: 0.4 }));
  g.add(body);

  const limeMat = new THREE.MeshStandardMaterial({ color: LIME, emissive: LIME, emissiveIntensity: 0.7, roughness: 0.4 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.028, 12, seg), limeMat);
  ring1.position.z = 0.17;
  g.add(ring1);
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.018, 12, seg),
    new THREE.MeshStandardMaterial({ color: 0xcfd2d6, metalness: 1, roughness: 0.2 })
  );
  ring2.position.z = 0.17;
  g.add(ring2);
  const ring3 = ring2.clone();
  ring3.position.z = -0.17;
  g.add(ring3);
  const ring4 = ring1.clone();
  ring4.position.z = -0.17;
  g.add(ring4);
  return g;
}

export default function HeroScene({ ready }: { ready: boolean }) {
  const mount = useRef<HTMLDivElement>(null);
  const intro = useRef({ v: 0 });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!ready) return;
    gsap.to(intro.current, { v: 1, duration: prefersReducedMotion() ? 0.01 : 2.6, ease: "expo.out" });
  }, [ready]);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    const low = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;
    const reduced = prefersReducedMotion();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !low, alpha: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, low ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.7;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
    camera.position.set(0, 0, 9);

    // lighting — cinematic key + lime/red rims
    scene.add(new THREE.AmbientLight(0xffffff, 0.12));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(3, 4, 6);
    scene.add(key);
    const limeRim = new THREE.DirectionalLight(LIME, 3.2);
    limeRim.position.set(-6, 2, -3);
    scene.add(limeRim);
    const redRim = new THREE.DirectionalLight(0xff2d2d, 2.6);
    redRim.position.set(6, -2, -3);
    scene.add(redRim);

    const dumbbell = buildDumbbell(low);
    scene.add(dumbbell);

    const plateA = buildPlate(low);
    scene.add(plateA);
    const plateB = buildPlate(low);
    scene.add(plateB);

    // dust particles
    const count = low ? 40 : 130;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(
      pg,
      new THREE.PointsMaterial({ color: LIME, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false })
    );
    scene.add(dust);

    const size = { w: 1, h: 1 };
    const resize = () => {
      const r = el.getBoundingClientRect();
      size.w = Math.max(1, r.width);
      size.h = Math.max(1, r.height);
      renderer.setSize(size.w, size.h, false);
      camera.aspect = size.w / size.h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;

    const render = () => {
      raf = requestAnimationFrame(render);
      const t = reduced ? 0 : clock.getElapsedTime();
      const p = scrollState.hero;
      const i = intro.current.v;

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      // visible world size at z = 0
      const vh = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      const vw = vh * camera.aspect;
      const wide = camera.aspect > 1.25;
      const s = THREE.MathUtils.clamp(vw / 8.6, 0.4, 1.08);
      const baseX = wide ? vw * 0.22 : 0;
      const baseY = wide ? -0.1 : vh * 0.2;

      dumbbell.scale.setScalar(s * (0.35 + 0.65 * i) * (1 + p * 1.9));
      dumbbell.position.x = baseX * (1 - p * 0.9);
      dumbbell.position.y = baseY + Math.sin(t * 0.9) * 0.1 + p * 0.5;
      dumbbell.rotation.y = 0.55 + t * 0.28 + p * Math.PI * 1.7 + (1 - i) * Math.PI * 2 + pointer.x * 0.45;
      dumbbell.rotation.x = 0.15 + pointer.y * 0.22 + p * 0.5;
      dumbbell.rotation.z = -0.32 + p * 0.85;

      const ps = s * (0.5 + 0.5 * i);
      plateA.scale.setScalar(ps * 0.95);
      plateA.position.set(wide ? vw * -0.04 : -vw * 0.32, (wide ? 1.55 : vh * 0.34) + p * 3.2, -3.2);
      plateA.rotation.set(0.35 + p * 1.4, -0.5 + t * 0.12 + pointer.x * 0.2, 0.2);

      plateB.scale.setScalar(ps * 0.55);
      plateB.position.set(wide ? vw * 0.42 : vw * 0.34, (wide ? -1.9 : -vh * 0.12) - p * 3, -2.4);
      plateB.rotation.set(-0.4, 0.7 - t * 0.1 - p * 1.6, -0.3 + p);

      dust.rotation.y = t * 0.02 + p * 0.6;
      dust.position.y = p * 1.5;

      camera.position.z = 9 - p * 1.4;
      camera.position.x = pointer.x * 0.2;
      camera.position.y = -pointer.y * 0.12;
      camera.lookAt(0, 0, 0);

      limeRim.intensity = 3.2 + Math.sin(t * 0.7) * 0.6;

      renderer.render(scene, camera);
    };

    const start = () => {
      if (running) return;
      running = true;
      clock.start();
      render();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(el);
    const vis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", vis);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) return <PlateFallback />;
  return <div ref={mount} className="absolute inset-0" aria-hidden="true" />;
}

/** Lightweight CSS/SVG fallback when WebGL is unavailable. */
function PlateFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[10vw]" aria-hidden="true">
      <div className="animate-spin-slow relative h-[min(60vw,520px)] w-[min(60vw,520px)] opacity-90">
        <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
          <defs>
            <radialGradient id="pg" cx="50%" cy="40%" r="70%">
              <stop offset="0" stopColor="#3a3d40" />
              <stop offset="1" stopColor="#101112" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="96" fill="url(#pg)" stroke="#2a2c2e" strokeWidth="2" />
          <circle cx="100" cy="100" r="82" fill="none" stroke="#c6ff1a" strokeWidth="2.5" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#9a9fa5" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="15" fill="#070707" stroke="#9a9fa5" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
