import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── LOADER ───────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
  }, 2800);
});

// ─── MOBILE NAV ───────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
navToggle?.addEventListener('click', () => mobileNav.classList.toggle('open'));
document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', () => mobileNav.classList.remove('open')));

// ─── NAVBAR SCROLL ────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── THREE.JS SETUP ───────────────────────────────────────
const canvas = document.getElementById('threeCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050510, 0.035);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 3, 12);

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── LIGHTS ───────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0x1a1a4e, 1.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x6366f1, 3);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

const pointLight1 = new THREE.PointLight(0x8b5cf6, 4, 30);
pointLight1.position.set(-5, 5, 0);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xec4899, 3, 25);
pointLight2.position.set(5, 3, -5);
scene.add(pointLight2);

const headlightL = new THREE.PointLight(0xffffff, 6, 15);
const headlightR = new THREE.PointLight(0xffffff, 6, 15);
scene.add(headlightL, headlightR);

// ─── ROAD ─────────────────────────────────────────────────
function buildRoad() {
  const geo = new THREE.PlaneGeometry(6, 300, 1, 100);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x111122, roughness: 0.9, metalness: 0.1
  });
  const road = new THREE.Mesh(geo, mat);
  road.rotation.x = -Math.PI / 2;
  road.position.y = -1.5;
  scene.add(road);

  // Dashed white center line
  for (let i = -140; i < 140; i += 4) {
    const dg = new THREE.PlaneGeometry(0.1, 2);
    const dm = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.6, transparent: true });
    const dash = new THREE.Mesh(dg, dm);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, -1.49, i);
    scene.add(dash);
  }

  // Road edges (yellow lines)
  [-2.5, 2.5].forEach(x => {
    const eg = new THREE.PlaneGeometry(0.08, 300);
    const em = new THREE.MeshBasicMaterial({ color: 0xf59e0b, opacity: 0.7, transparent: true });
    const edge = new THREE.Mesh(eg, em);
    edge.rotation.x = -Math.PI / 2;
    edge.position.set(x, -1.49, 0);
    scene.add(edge);
  });
}
buildRoad();

// ─── BLACK MARUTI JIMNY (procedural) ──────────────────────
function buildJimny() {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.25, metalness: 0.8 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x1a3a5c, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.65 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.9 });
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3 });
  const redMat = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 1 });

  // Main body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.6, 2.8), bodyMat);
  body.position.y = 0.1;
  group.add(body);

  // Cabin (upper)
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.75, 1.6), bodyMat);
  cabin.position.set(0, 0.67, -0.1);
  group.add(cabin);

  // Windshield
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.6, 0.06), glassMat);
  windshield.position.set(0, 0.65, 0.72);
  group.add(windshield);

  // Rear window
  const rearWin = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.55, 0.06), glassMat);
  rearWin.position.set(0, 0.65, -0.92);
  group.add(rearWin);

  // Side windows
  [-0.78, 0.78].forEach(x => {
    const sw = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 1.3), glassMat);
    sw.position.set(x, 0.7, -0.1);
    group.add(sw);
  });

  // Hood
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.1, 0.85), bodyMat);
  hood.position.set(0, 0.42, 1.05);
  group.add(hood);

  // Spare wheel on back
  const spareGeo = new THREE.TorusGeometry(0.32, 0.1, 8, 16);
  const spare = new THREE.Mesh(spareGeo, wheelMat);
  spare.position.set(0, 0.2, -1.55);
  group.add(spare);

  // Headlights
  [[-0.55, 0.05, 1.41], [0.55, 0.05, 1.41]].forEach(([x, y, z], i) => {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.06), lightMat);
    hl.position.set(x, y, z);
    group.add(hl);
  });

  // Taillights
  [[-0.55, 0.05, -1.41], [0.55, 0.05, -1.41]].forEach(([x, y, z]) => {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.06), redMat);
    tl.position.set(x, y, z);
    group.add(tl);
  });

  // Wheels
  const wheelPos = [[-0.95, -0.42, 0.95], [0.95, -0.42, 0.95], [-0.95, -0.42, -0.95], [0.95, -0.42, -0.95]];
  const wheels = [];
  wheelPos.forEach(([x, y, z]) => {
    const wg = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 18), wheelMat);
    tire.rotation.z = Math.PI / 2;
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.3, 8), rimMat);
    rim.rotation.z = Math.PI / 2;
    wg.add(tire, rim);
    wg.position.set(x, y, z);
    group.add(wg);
    wheels.push(wg);
  });

  // Roof rack
  const rack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.04, 1.3), rimMat);
  rack.position.set(0, 1.07, -0.1);
  group.add(rack);

  // Snorkel
  const snorkel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6), bodyMat);
  snorkel.position.set(0.79, 0.7, 0.5);
  group.add(snorkel);

  group.position.set(0, -1.05, 2);
  group.rotation.y = Math.PI;
  return { group, wheels };
}

const { group: jimnyGroup, wheels } = buildJimny();
scene.add(jimnyGroup);

// Headlight cone beams
function makeBeam(offset) {
  const cg = new THREE.ConeGeometry(0.5, 6, 8, 1, true);
  const cm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
  const cone = new THREE.Mesh(cg, cm);
  cone.rotation.x = -Math.PI / 2;
  cone.position.set(offset, -0.95, -4);
  return cone;
}
scene.add(makeBeam(-0.55), makeBeam(0.55));

// ─── PARTICLES / ENVIRONMENT ──────────────────────────────
function buildParticleField(count, spread, yRange, color, size) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = Math.random() * yRange.h + yRange.y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200 - 50;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.7, sizeAttenuation: true });
  return new THREE.Points(geo, mat);
}

const stars = buildParticleField(2000, 80, { y: 5, h: 40 }, 0xffffff, 0.08);
scene.add(stars);

const mountainParticles = buildParticleField(600, 30, { y: 0, h: 15 }, 0x9aa5b4, 0.12);
scene.add(mountainParticles);

// ─── TERRAIN MOUNTAINS ────────────────────────────────────
function buildMountains(section, color1, color2) {
  const group = new THREE.Group();
  const count = 12;
  for (let i = 0; i < count; i++) {
    const h = 3 + Math.random() * 8;
    const w = 3 + Math.random() * 6;
    const geo = new THREE.ConeGeometry(w, h, 5 + Math.floor(Math.random() * 4));
    const mat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? color1 : color2,
      roughness: 1, wireframe: Math.random() > 0.7
    });
    const mesh = new THREE.Mesh(geo, mat);
    const side = Math.random() > 0.5 ? 1 : -1;
    mesh.position.set(side * (8 + Math.random() * 12), h / 2 - 1.5, section + (Math.random() - 0.5) * 60);
    group.add(mesh);
  }
  return group;
}

const kashmirMtns = buildMountains(-20, 0x2d3a4a, 0x4a5568);
const coastMtns = buildMountains(-80, 0x1a3a5c, 0x0f766e);
const kanyaMtns = buildMountains(-140, 0x4c1d95, 0x7c3aed);
const neMtns = buildMountains(-200, 0x064e3b, 0x065f46);
scene.add(kashmirMtns, coastMtns, kanyaMtns, neMtns);

// ─── SNOW PARTICLES (Kashmir) ──────────────────────────────
const snowGeo = new THREE.BufferGeometry();
const snowPos = new Float32Array(500 * 3);
for (let i = 0; i < 500; i++) {
  snowPos[i * 3] = (Math.random() - 0.5) * 20;
  snowPos[i * 3 + 1] = Math.random() * 15 - 1;
  snowPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
}
snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
const snow = new THREE.Points(snowGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.8 }));
scene.add(snow);

// ─── SCROLL SYSTEM ────────────────────────────────────────
const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];
let currentSection = 0;

// Road progress bar
const roadFill = document.getElementById('roadFill');
const roadCarIndicator = document.getElementById('roadCarIndicator');
const milestoneDivs = document.querySelectorAll('.milestone');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = Math.min(scrollTop / docHeight, 1);
  roadFill.style.height = (pct * 100) + '%';
  roadCarIndicator.style.top = (pct * 100) + '%';

  // Milestone highlight
  const secIdx = Math.min(Math.floor(pct * 4), 3);
  milestoneDivs.forEach((m, i) => m.classList.toggle('active', i === secIdx));
  currentSection = Math.floor(pct * sections.length);
}
window.addEventListener('scroll', updateProgress);

// ─── CAMERA PATH (scroll-driven) ──────────────────────────
const camPath = [
  { pos: [0, 3, 12], look: [0, 0.5, 0] },        // Kashmir - hero view
  { pos: [4, 2.5, 10], look: [-1, 0.5, 0] },      // Coast - side angle
  { pos: [-3, 4, 11], look: [0, 0, 0] },           // Kanyakumari - wide
  { pos: [2, 2, 9], look: [0, 1, 0] },             // NE - low angle
  { pos: [0, 5, 14], look: [0, 0, 0] },            // Projects - top
  { pos: [0, 2.5, 11], look: [0, 0.5, 0] },        // Contact - return
];

const cameraTarget = new THREE.Vector3();
const cameraLookAt = new THREE.Vector3();

ScrollTrigger.create({
  trigger: 'body',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    const p = self.progress;
    const segCount = camPath.length - 1;
    const seg = Math.min(Math.floor(p * segCount), segCount - 1);
    const t = (p * segCount) - seg;
    const a = camPath[seg];
    const b = camPath[seg + 1] || a;

    cameraTarget.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], t)
    );
    cameraLookAt.set(
      THREE.MathUtils.lerp(a.look[0], b.look[0], t),
      THREE.MathUtils.lerp(a.look[1], b.look[1], t),
      THREE.MathUtils.lerp(a.look[2], b.look[2], t)
    );
  }
});

// ─── REVEAL ON SCROLL ─────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Animate skill bars when visible
      e.target.querySelectorAll('.bar-fill').forEach(b => b.classList.add('animated'));
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Also observe skill bars directly
document.querySelectorAll('.bar-fill').forEach(bar => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('animated'); });
  }, { threshold: 0.5 });
  io.observe(bar);
});

// ─── CONTACT FORM ─────────────────────────────────────────
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.querySelector('.btn-text').style.display = 'none';
  btn.querySelector('.btn-sending').style.display = 'inline';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('formSuccess').style.display = 'block';
    btn.querySelector('.btn-sending').style.display = 'none';
    btn.querySelector('.btn-text').style.display = 'inline';
    btn.disabled = false;
    e.target.reset();
  }, 1800);
});

// ─── MOUSE PARALLAX ───────────────────────────────────────
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ─── ANIMATION LOOP ───────────────────────────────────────
const clock = new THREE.Clock();
let jimnyZ = 2;

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

  // Smooth camera to target
  camera.position.lerp(cameraTarget, 0.04);
  camera.lookAt(cameraLookAt.x + mouseX * 0.3, cameraLookAt.y - mouseY * 0.2, cameraLookAt.z);

  // Drive jimny forward as user scrolls
  const targetZ = 2 - scrollPct * 280;
  jimnyZ += (targetZ - jimnyZ) * 0.05;
  jimnyGroup.position.z = jimnyZ;

  // Wheel rotation based on speed
  const speed = Math.abs(targetZ - jimnyGroup.position.z) * 0.8;
  wheels.forEach(w => { w.rotation.x -= speed * 0.35; });

  // Body bounce (suspension)
  jimnyGroup.position.y = -1.05 + Math.sin(t * 8) * 0.008 + Math.sin(t * 5.3) * 0.005;
  jimnyGroup.rotation.z = Math.sin(t * 3) * 0.008;
  jimnyGroup.rotation.x = Math.sin(t * 4) * 0.006;

  // Headlights follow car
  headlightL.position.set(jimnyGroup.position.x - 0.55, jimnyGroup.position.y + 0.05, jimnyGroup.position.z - 2);
  headlightR.position.set(jimnyGroup.position.x + 0.55, jimnyGroup.position.y + 0.05, jimnyGroup.position.z - 2);

  // Snow animation
  const snowPositions = snowGeo.attributes.position.array;
  for (let i = 1; i < snowPositions.length; i += 3) {
    snowPositions[i] -= 0.015;
    if (snowPositions[i] < -1.5) snowPositions[i] = 14;
  }
  snowGeo.attributes.position.needsUpdate = true;
  snow.position.z = jimnyGroup.position.z;

  // Stars slow rotation
  stars.rotation.y = t * 0.003;

  // Mountain particle drift
  mountainParticles.position.z = Math.sin(t * 0.1) * 2;

  // Light color changes by section
  const sectionColors = [0x6366f1, 0x06b6d4, 0xec4899, 0x22c55e, 0x8b5cf6, 0x6366f1];
  const colorIdx = Math.floor(scrollPct * sectionColors.length);
  const nextColor = sectionColors[Math.min(colorIdx + 1, sectionColors.length - 1)];
  dirLight.color.lerp(new THREE.Color(sectionColors[colorIdx] || 0x6366f1), 0.02);
  pointLight1.color.lerp(new THREE.Color(nextColor), 0.02);

  renderer.render(scene, camera);
}

// Init camera position
cameraTarget.set(0, 3, 12);
cameraLookAt.set(0, 0.5, 0);
camera.position.set(0, 3, 12);
animate();
