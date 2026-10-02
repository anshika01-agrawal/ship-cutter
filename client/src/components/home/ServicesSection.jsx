import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Settings
} from 'lucide-react';
import AnimatedSection from '../common/AnimatedSection';

export default function ServicesSection() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const services = [
    {
      icon: Flame,
      title: 'Autonomous Ship Dismantling & Hull Scrapping',
      subtitle: 'Heavy Marine Plate Thermal Penetration',
      desc: 'Eliminate human scaffolding on towering hull sides. Our magnetic crawler tractors navigate sheer curved hulls, transverse bulkheads, and engine rooms, cutting continuous passes at speeds exceeding 140 cm/min.',
      badge: 'Core Technology',
      features: [
        'Up to 80mm single-pass high-definition plasma penetration',
        '850kg magnetic adhesion for inverted and vertical plate traversal',
        'Real-time ultrasonic wall thickness compensation',
        'Automated crane rigging detachment release points',
      ],
      specs: {
        torchType: '400A Hypertherm HD Plasma',
        maxPlate: '80 mm AH36 Marine Steel',
        speed: '120 - 180 cm/min',
        personnel: '0 humans in danger perimeter',
      },
    },
    {
      icon: Layers,
      title: 'Precision Kerf Cutting & AI Path Optimization',
      subtitle: 'Neural Seam & Bevel Trajectory Control',
      desc: 'Traditional manual torch cuts cause massive kerf metal oxidation loss and dangerous plate pinching. Our AI vision system tracks the seam trajectory in real-time, maintaining a narrow 2.8mm kerf and precision weld bevel angles.',
      badge: 'High Yield',
      features: [
        'Proprietary stress-relief cut sequencing avoids plate spring-back',
        'Multi-axis articulated wrist bevels edges for immediate secondary fabrication',
        'Continuous thermal infrared feedback eliminates frame warping',
        'Digital kerf tracking exported directly into CAD/CAM archives',
      ],
      specs: {
        torchType: '6-Axis Articulated Kinematic Wrist',
        maxPlate: 'Bevel angles ±45°',
        speed: 'Seam tracking at 50 Hz optical scan',
        personnel: 'Remote operator oversight tablet',
      },
    },
    {
      icon: Zap,
      title: 'Circular Material Recovery & Metallurgy Sorting',
      subtitle: 'Spectrometry Purity Verification',
      desc: 'Maximize scrap resale value by preventing cross-contamination. Integrated optical emission spectrometry (OES) tags each cut plate with certified chemical composition for direct delivery to electric arc furnace (EAF) mills.',
      badge: 'Premium Scrap Resale',
      features: [
        'Instant segregation of AH36 high-tensile steel, mild steel, and aluminum',
        'Copper ballast manifolds and nickel-bronze propeller extraction',
        'Automated QR/RFID plate tagging with metallurgical test data',
        '94.8% secondary metal yield recovery certified by third-party auditors',
      ],
      specs: {
        torchType: 'Optical Emission Spectrometer (OES)',
        maxPlate: 'Full chemical alloy breakdown (Fe, C, Mn, Cu, Al)',
        speed: 'Real-time test in under 12 seconds',
        personnel: 'Automated mill certification printout',
      },
    },
    {
      icon: ShieldCheck,
      title: 'Green Yard Hong Kong Convention Compliance',
      desc: 'Modern international maritime law mandates zero-spill dry docks. Our robots integrate active vacuum collection shrouds that capture vaporized toxic lead coatings, asbestos fibers, and hot cutting slag before it touches the soil or tide.',
      subtitle: 'Zero Toxic Runoff & Fume Filtration',
      badge: 'IMO & EU Certified',
      features: [
        'Closed-loop vacuum shroud extracts 99.2% of vaporized airborne particulates',
        'Four-stage filtration: Cyclonic separator, water scrubber, and HEPA-14',
        'Full compliance with IMO Hong Kong Convention (SR/CONF/45)',
        'Qualifies shipowners for EU Ship Recycling Regulation No 1257/2013 subsidies',
      ],
      specs: {
        torchType: 'Closed-Loop Auxiliary Vacuum Shroud',
        maxPlate: 'Traps lead, chromium & TBT paint residues',
        speed: 'Air exchange rate 1,200 CFM',
        personnel: 'Zero human toxic particulate exposure',
      },
    },
  ];

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
      {/* Header */}
      <AnimatedSection>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">Capabilities</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            Industrial Robotics Built For Harsh Shipbreaking
          </h2>
          <p className="text-sm text-text-secondary mt-3">
            High-temperature plasma torches, heavy-duty magnetic locomotion, and closed-loop filtration tailored for maritime decommissioning.
          </p>
        </div>
      </AnimatedSection>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          const isExpanded = expandedIndex === idx;

          return (
            <AnimatedSection key={srv.title} delay={idx * 0.1}>
              <div className="card-surface p-7 border border-dark-border bg-dark-card hover:bg-neutral-900/60 transition-all flex flex-col justify-between group h-full">
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-300 group-hover:border-neutral-600 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="badge font-mono text-[10px] uppercase bg-neutral-900 text-neutral-300 border border-neutral-800">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {srv.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400/90 mt-1 mb-3">
                    {srv.subtitle}
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed mb-6">
                    {srv.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 mb-6">
                    {srv.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Technical Specs Drawer */}
                  {isExpanded && (
                    <div className="p-4 rounded-xl bg-black border border-dark-border mb-6 space-y-2 text-xs font-mono">
                      <div className="text-[10px] uppercase text-cyan-400 font-bold border-b border-neutral-800 pb-1.5 flex items-center gap-1.5">
                        <Settings className="w-3.5 h-3.5" />
                        <span>ENGINEERING SPECIFICATIONS</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Equipment:</span>
                        <span className="text-white">{srv.specs.torchType}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Capacity:</span>
                        <span className="text-white">{srv.specs.maxPlate}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Cycle/Speed:</span>
                        <span className="text-white">{srv.specs.speed}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Safety Boundary:</span>
                        <span className="text-emerald-400">{srv.specs.personnel}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Row */}
                <div className="pt-4 border-t border-dark-border flex items-center justify-between text-xs">
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span>{isExpanded ? 'Hide Specs' : 'View Machine Specs'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <Link
                    to="/dashboard"
                    className="text-white hover:text-cyan-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Operations Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
}
