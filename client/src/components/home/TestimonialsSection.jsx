import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../common/AnimatedSection';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote:
        'Deploying TITAN-CUT autonomous magnetic crawlers transformed our dry dock safety record overnight. Scrapping an entire 28,000 LDT bulk carrier without a single worker suspended on vertical staging gave us full compliance with the European Ship Recycling Regulation.',
      author: 'Henrik Van Der Meer',
      role: 'Managing Director, North Sea Marine Decommissioning BV',
      project: 'MV Atlantic Pioneer (28,400 LDT Bulk Carrier)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      metric: '42 Days Saved vs Planned Schedule',
    },
    {
      id: 2,
      quote:
        'The precision kerf path planning reduced our plate oxidation and slag waste to just 5.2%. Furthermore, the integrated spectrometry verification allowed us to sell directly to electric arc furnace steel mills at a 16% price premium over unclassified scrap.',
      author: 'Rajesh Patel',
      role: 'Chief Technical Officer, Alang Green Ship Recycling Yard',
      project: 'St. Horizon Container Fleet (3 Vessels Dismantled)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      metric: '+18.4% Net Scrap Margin Yield',
    },
    {
      id: 3,
      quote:
        'From an environmental audit perspective, the closed-loop vacuum shroud is an absolute gamechanger. Capturing 99% of heavy metal fumes and lead paint dust at the point of the plasma arc ensures our tidal waters remain completely unpolluted.',
      author: 'Dr. Charlotte Dubois',
      role: 'Lead Maritime Environmental Inspector, IMO Hong Kong Convention Auditor',
      project: 'Port of Brest Supertanker Abatement Project',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      metric: '100% Certified Zero-Spill Standard',
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const active = testimonials[currentIndex];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <AnimatedSection>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">Third-Party Verification</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            Trusted By Global Shipyard Operators
          </h2>
          <p className="text-sm text-text-secondary mt-2">
            See how major marine salvors and steel mills rely on our robotic cutting systems.
          </p>
        </div>
      </AnimatedSection>

      {/* Carousel Card */}
      <div className="card-surface border border-dark-border bg-dark-card rounded-2xl p-6 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-6 right-6 opacity-10 text-white pointer-events-none">
          <Quote className="w-24 h-24" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 relative z-10"
          >
            {/* Stars & Metric Pill */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(active.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="text-xs font-mono text-neutral-400 ml-2">5.0 AUDITED</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800 text-xs font-mono text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{active.metric}</span>
              </div>
            </div>

            {/* Main Quote */}
            <blockquote className="text-lg sm:text-2xl text-white font-medium leading-relaxed italic">
              "{active.quote}"
            </blockquote>

            {/* Author info */}
            <div className="pt-6 border-t border-dark-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={active.avatar}
                  alt={active.author}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-700 filter grayscale contrast-125"
                />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {active.author}
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  </h4>
                  <p className="text-xs text-text-secondary">{active.role}</p>
                  <p className="text-[11px] font-mono text-cyan-400 mt-0.5">Project: {active.project}</p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-lg bg-neutral-900 border border-dark-border text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                  aria-label="Previous quote"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-neutral-500 px-2">
                  0{currentIndex + 1} / 0{testimonials.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-lg bg-neutral-900 border border-dark-border text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                  aria-label="Next quote"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
