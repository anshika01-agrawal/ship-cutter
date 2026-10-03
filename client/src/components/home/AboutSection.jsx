import React from 'react';
import { ShieldCheck, Cpu, Award, Users, Anchor, ChevronRight, Zap } from 'lucide-react';
import AnimatedSection from '../common/AnimatedSection';

export default function AboutSection() {
  const team = [
    {
      name: 'Anurag Tiwari',
      role: 'Embedded Systems & IoT',
      photo: '/images/anurag_tiwari.jpg',
      bio: 'ESP32 microcontroller interfacing, gas sensing logic, and IoT telemetry.',
    },
    {
      name: 'Anshika Agrawal',
      role: 'Full Stack & AI Vision',
      photo: '/images/anshika_agrawal.jpg',
      bio: 'Web platform architecture, live dashboard, and AI vision cut tracking.',
    },
    {
      name: 'Daksh Jain',
      role: '3D Simulation & Sensors',
      photo: '/images/daksh_jain.jpg',
      bio: '3D robotic arm simulation, ultrasonic standoff, and distance calibration.',
    },
    {
      name: 'Priyanshu Arya',
      role: 'Robotics Hardware & Kinematics',
      photo: '/images/priyanshu_arya.jpg',
      bio: 'Hardware design, crawler chassis mechanics, and robotic arm assembly.',
    },
  ];

  const pillars = [
    {
      title: 'Human-Free Hazard Zones',
      desc: 'Confined spaces, oil residue fumes, and shifting structural bulkheads are tackled 100% by autonomous magnetic crawlers—eliminating dangerous human exposure.',
      image: '/images/manual_hull_cutting_torch.jpg',
      imageCaption: 'Legacy Hazard: Manual flame cutting under towering hulls with extreme fall & crush risks',
      icon: ShieldCheck,
    },
    {
      title: 'Active Neural Seam Tracking',
      desc: 'Dual optical and ultrasonic sensors continuously adjust torch height and travel velocity to maintain consistent kerf width.',
      icon: Cpu,
    },
    {
      title: 'Closed-Loop Environmental Shield',
      desc: 'Direct-mount vacuum extraction traps heavy metal slag and vaporized toxic coatings before they reach tidal dock waters.',
      icon: Zap,
    },
  ];

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-24">
      {/* Header */}
      <AnimatedSection>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">Our Mission & Engineering</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            Pioneering The Robotic Revolution In Maritime Scrapping
          </h2>
          <p className="text-sm text-text-secondary mt-4 leading-relaxed">
            For over a century, ship breaking has been one of the world's most perilous industrial occupations.
            TITAN-CUT is committed to ending manual torch casualties worldwide through industrial robotics and AI.
          </p>
        </div>
      </AnimatedSection>

      {/* Story & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
        <AnimatedSection>
          <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              From Manual Flame Torches to Cyber-Physical Precision
            </h3>
            <p>
              When massive commercial vessels reach the end of their 25-30 year lifespans, dismantling them generates millions of tons of reusable structural steel. However, conventional manual cutting exposes human laborers to extreme falls, toxic lead/asbestos fumes, and catastrophic structural collapses.
            </p>
            <p>
              Our multidisciplinary team of marine roboticists, naval architects, and software engineers developed the <strong className="text-white">TITAN Crawler System</strong>. Equipped with rare-earth magnetic drive assemblies, 3D LiDAR surface mapping, and 400A plasma torches, our units traverse vertical ship hulls with total stability.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
                <div className="text-3xl font-extrabold font-mono text-cyan-400">400%</div>
                <div className="text-xs text-white font-medium mt-1">Faster Scrapping Cycles</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Versus manual oxy-fuel torches</div>
              </div>

              <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
                <div className="text-3xl font-extrabold font-mono text-emerald-400">0</div>
                <div className="text-xs text-white font-medium mt-1">Lost-Time Worker Injuries</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Across 14 shipyard projects</div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* 3 Engineering Pillars */}
        <div className="space-y-4">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon;
            return (
              <AnimatedSection key={pil.title} delay={idx * 0.15}>
                <div className="card-surface p-6 border border-dark-border bg-dark-card hover:bg-neutral-900/60 transition-all flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-300 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-white">{pil.title}</h4>
                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{pil.desc}</p>
                    {pil.image && (
                      <div className="mt-3.5 flex items-center gap-3 p-2.5 rounded-xl bg-black/80 border border-neutral-800">
                        <img
                          src={pil.image}
                          alt="Manual hazard"
                          className="w-14 h-14 object-cover rounded-lg border border-neutral-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-red-400 font-bold block uppercase tracking-wider">
                            ⚠️ Manual Human Hazard
                          </span>
                          <span className="text-xs text-neutral-300 block font-medium line-clamp-2 mt-0.5">
                            {pil.imageCaption}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>

      {/* Leadership & Engineering Team */}
      <AnimatedSection>
        <div className="border-t border-dark-border pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">Team</span>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white mt-1">RoboFest 6.0</h3>
            <p className="text-xs text-text-secondary mt-2">
              Student innovators & developers presenting autonomous ship-dismantling robotics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {team.map((member, idx) => (
              <AnimatedSection key={member.name} delay={idx * 0.1} className="h-full flex flex-col">
                <div className="card-surface h-full border border-dark-border bg-dark-card rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-xl">
                  {/* Fixed Uniform Photo Frame */}
                  <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-950 relative shrink-0">
                    <img
                      src={member.photo}
                      alt={member.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/anurag_tiwari.jpg';
                      }}
                      className="w-full h-full object-cover object-top filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Card Content with Uniform Height */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {member.name}
                      </h4>
                      <div className="text-xs font-mono text-cyan-400 mt-1 font-semibold">{member.role}</div>
                      <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
