import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  Cpu,
  Flame,
  Layers,
  CheckCircle2,
  ArrowRight,
  Shield,
  Gauge,
  Sparkles
} from 'lucide-react';
import AnimatedSection from '../common/AnimatedSection';

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: '3D LiDAR & Ultrasound Scan',
      badge: 'Perception Phase',
      icon: Scan,
      headline: 'Non-Destructive Hull & Internal Void Mapping',
      desc: 'Before any thermal ignition occurs, autonomous crawler drones sweep the vessel structure with multi-beam LiDAR and high-frequency ultrasonic transducers. This detects exact plate thickness, hidden piping runs, fuel oil residue pockets, and structural stress concentration points.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      specs: [
        { label: 'Scanning Resolution', value: '0.5 mm spatial mesh' },
        { label: 'Thickness Range', value: '6 mm - 120 mm steel' },
        { label: 'Hazard Detection', value: 'Combustible vapor sensor array' },
        { label: 'Time Required', value: '45 mins per 50m section' },
      ],
    },
    {
      num: '02',
      title: 'AI Path & Stress Planning',
      badge: 'Computational Geometry',
      icon: Cpu,
      headline: 'Predictive Neural Stress-Relief Path Optimization',
      desc: 'Our proprietary finite-element planning software models the residual tension in the ship frame. It calculates the exact cut sequence to prevent sudden structural warping, blade pinching, or accidental premature collapse of heavy crane-supported panels.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      specs: [
        { label: 'Kerf Loss Target', value: '< 2.2% steel reduction' },
        { label: 'Thermal Distortion Prevention', value: 'Multi-pass cooling delay' },
        { label: 'Toolpath Standard', value: 'Automated 6-Axis G-Code' },
        { label: 'Real-time Adaptation', value: '50 Hz laser seam correction' },
      ],
    },
    {
      num: '03',
      title: 'Robotic Plasma Cut Execution',
      badge: 'Autonomous Cutting',
      icon: Flame,
      headline: '400A High-Definition Plasma Thermal Arc Traversal',
      desc: 'Heavy-duty magnetic crawler tractors latch onto vertical and inverted steel hulls with 850kg adhesion force. The water-mist shrouded torch penetrates up to 80mm marine steel, cutting at 142 cm/min while vacuum hoods collect 99% of molten slag and toxic paint particulates.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      specs: [
        { label: 'Torch Arc Amperage', value: '400A Hypertherm Plasma' },
        { label: 'Cutting Speed', value: '120 - 180 cm / minute' },
        { label: 'Magnetic Adhesion', value: 'Dual rare-earth track drive' },
        { label: 'Fume Filtration', value: 'HEPA + Activated Carbon Hood' },
      ],
    },
    {
      num: '04',
      title: 'Spectrometry & Part Sorting',
      badge: 'Circular Metallurgy',
      icon: Layers,
      headline: 'Automated Classification & High-Purity Smelter Yield',
      desc: 'As hull plates and deck beams are cleanly separated, integrated optical emission spectrometers analyze chemical composition. Secondary structural steel is segregated from copper, bronze, and aluminum components, generating certified quality certificates for electric arc furnace recycling.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      specs: [
        { label: 'Secondary Recovery Rate', value: '94.8% net clean scrap' },
        { label: 'Alloy Verification', value: 'OES real-time elemental scan' },
        { label: 'Traceability', value: 'RFID / QR Plate Stamping' },
        { label: 'Logistics Staging', value: 'Direct EAF mill load-out' },
      ],
    },
  ];

  const current = steps[activeStep];

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
      {/* Header */}
      <AnimatedSection>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">Step-By-Step Process</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            How The Autonomous Cutting Robot Works
          </h2>
          <p className="text-sm text-text-secondary mt-3">
            An uninterrupted, cyber-physical pipeline engineered to convert retired supertankers and bulk carriers into ultra-pure recycled steel.
          </p>
        </div>
      </AnimatedSection>

      {/* 4 Interactive Step Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={st.num}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-neutral-900 border-neutral-500 shadow-glow-sm scale-[1.02]'
                  : 'bg-dark-card border-dark-border hover:border-neutral-700 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <span className={`text-base font-bold font-mono ${isActive ? 'text-cyan-400' : 'text-neutral-500'}`}>
                  {st.num}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-neutral-500'}`} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">
                  {st.badge}
                </span>
                <span className="text-xs font-bold text-white block">
                  {st.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step Detail Card (Framer Motion Animated) */}
      <div className="card-surface border border-dark-border bg-dark-card rounded-2xl p-6 sm:p-10 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left 7 cols: Explanations & Specs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  STEP {current.num} OF 04
                </span>
                <span className="text-xs font-mono text-neutral-400 uppercase">
                  {current.badge}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {current.headline}
              </h3>

              <p className="text-sm text-text-secondary leading-relaxed">
                {current.desc}
              </p>

              {/* Technical Parameters Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {current.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-3.5 rounded-lg bg-neutral-950/80 border border-dark-border"
                  >
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                      {spec.label}
                    </span>
                    <span className="text-xs font-bold font-mono text-white mt-0.5 block">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-4 text-xs font-mono">
                <button
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className="btn-primary flex items-center gap-2 text-xs py-2.5 px-5"
                >
                  <span>{activeStep === steps.length - 1 ? 'Back to Step 01' : 'Next Workflow Step'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
                <span className="text-neutral-500">Autonomous Execution Standard ISO 30000</span>
              </div>
            </div>

            {/* Right 5 cols: High-Res Step Image with HUD overlay */}
            <div className="lg:col-span-5">
              <div className="relative aspect-square sm:aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden border border-neutral-700 bg-black group shadow-glow-sm">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                {/* Technical HUD Overlay on Image */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-neutral-700 text-[10px] font-mono text-cyan-300">
                  FEED: ACTIVE • SENSORS OK
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[11px] font-mono text-neutral-400">STAGE VERIFICATION</div>
                  <div className="text-sm font-bold text-white mt-0.5">{current.title}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
