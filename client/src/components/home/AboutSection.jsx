import React from 'react';
import { ShieldCheck, Cpu, Award, Users, Anchor, ChevronRight, Zap } from 'lucide-react';
import AnimatedSection from '../common/AnimatedSection';

export default function AboutSection() {
  const team = [
    {
      name: 'Dr. Aris Thorne',
      role: 'Chief Robotics Architect',
      credentials: 'Ph.D. Robotics, MIT Marine Automation Lab',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'Pioneered 6-axis magnetic crawler kinematics and high-temp plasma torch dampening for vertical marine plating.',
    },
    {
      name: 'Elena Rostova',
      role: 'VP of Metallurgy & Scrap Yield',
      credentials: 'M.Sc. Materials Engineering, RWTH Aachen',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      bio: 'Directs on-site spectrometry and alloy sorting pipelines, achieving record 94%+ pure AH36 secondary re-roll certification.',
    },
    {
      name: 'Capt. Marcus Vance',
      role: 'Head of Shipyard Field Deployments',
      credentials: 'Master Mariner • 24 Years Deepwater Demolition',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      bio: 'Oversees safety interlocks, dry dock umbilical hookups, and hazardous compartment degassing procedures.',
    },
    {
      name: 'Dr. Sarah Lindqvist',
      role: 'Lead AI Vision & Path Planning',
      credentials: 'Ph.D. Computer Vision, ETH Zurich',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      bio: 'Created neural kerf optimization algorithms that predict structural stress relief and prevent plate pinch during cuts.',
    },
  ];

  const pillars = [
    {
      title: 'Human-Free Hazard Zones',
      desc: 'Confined spaces, oil residue fumes, and shifting structural bulkheads are tackled 100% by autonomous magnetic crawlers.',
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
                  <div>
                    <h4 className="text-base font-semibold text-white">{pil.title}</h4>
                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{pil.desc}</p>
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
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">World-Class Robotics & Marine Experts</h3>
            <p className="text-xs text-text-secondary mt-2">
              Combining decades of deepwater salvage mastery with breakthrough AI perception.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <AnimatedSection key={member.name} delay={idx * 0.1}>
                <div className="card-surface border border-dark-border bg-dark-card rounded-xl overflow-hidden hover:border-neutral-500 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {member.name}
                      </h4>
                      <div className="text-xs font-mono text-cyan-400 mt-0.5">{member.role}</div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-1">{member.credentials}</div>
                      <p className="text-xs text-text-secondary mt-3 leading-relaxed">
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
