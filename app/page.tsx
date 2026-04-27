import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, Loader } from "@react-three/drei";

import { RoadTripScene } from "../components/road-trip-scene";

const stops = [
  {
    region: "Kashmir",
    title: "Mahender Bhambhu | AI/ML Engineer",
    body: "Translating complex, data-driven research into impactful, high-performance technology. Currently completing an M.Eng in AI/ML, bridging deep learning research with scalable full-stack deployment.",
  },
  {
    region: "Western Coastal Region",
    title: "Full-Stack & MLOps Foundation",
    body: "Extensive experience architecting robust web applications. Built scalable MERN-stack and Next.js platforms, integrated cloud deployments via AWS, and optimized transaction efficiency for real-world enterprise solutions.",
  },
  {
    region: "Kanyakumari",
    title: "Precision Agriculture & AI Research",
    body: "Architect of Clim YieldNet. Engineered a novel multimodal AI model fusing drone imagery and IoT sensor data to predict crop yields and soil fertility, achieving a 6.38 q/ha RMSE. Authored research on spatial-temporal deep learning and data fusion.",
  },
  {
    region: "North East",
    title: "Engineering Products from Scratch",
    body: "Founder and engineer of RentMyExtras, a comprehensive peer-to-peer equipment rental platform. Managed the full development lifecycle using Next.js and Firebase.",
    cta: true,
  },
];

export default function Page() {
  return (
    <main className="relative min-h-[400vh] bg-neutral-950 text-white">
      <div className="fixed inset-0">
        <Canvas
          camera={{ position: [0, 6, 14], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={["#020617"]} />
          <fog attach="fog" args={["#020617", 30, 90]} />

          <ambientLight intensity={1.1} />
          <directionalLight
            castShadow
            intensity={2.5}
            position={[10, 14, 8]}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <hemisphereLight
            intensity={0.8}
            color="#ffffff"
            groundColor="#1e293b"
          />

          <Suspense fallback={<Html center>Loading scene...</Html>}>
            <RoadTripScene />
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10">
        {stops.map((stop) => (
          <section
            key={stop.region}
            className="flex min-h-screen items-center justify-center px-6 py-24 md:px-12"
          >
            <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-md md:p-10">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                {stop.region}
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
                {stop.title}
              </h2>
              <p className="mt-6 text-base leading-7 text-white/80 md:text-lg">
                {stop.body}
              </p>

              {stop.cta ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium transition hover:bg-white/20"
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                  <a
                    className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium transition hover:bg-white/20"
                    href="https://www.linkedin.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                  <a
                    className="rounded-full border border-cyan-300/50 bg-cyan-300/15 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/25"
                    href="#contact"
                  >
                    Contact
                  </a>
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <Loader />
    </main>
  );
}
