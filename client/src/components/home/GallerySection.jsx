import React, { useState } from 'react';
import { Maximize2, X, Filter, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../common/AnimatedSection';

export default function GallerySection() {
  const [filter, setFilter] = useState('all');
  const [activePhoto, setActivePhoto] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: 'Transverse Bulkhead Plasma Cut',
      category: 'plasma',
      categoryLabel: 'Plasma Cutting',
      img: '/images/plasma_cut_hull.jpg',
      specs: '32mm AH36 Plate • 142 cm/min • Clean Kerf',
      location: 'Alang Dry Dock 4B',
    },
    {
      id: 2,
      title: 'Stern Segment Detachment Before/After',
      category: 'before_after',
      categoryLabel: 'Before & After',
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      specs: '540 Metric Tons Extracted • Crane Staged',
      location: 'Chittagong Green Yard Berth 2',
    },
    {
      id: 3,
      title: 'KRAN-VULCAN Magnetic Vertical Grip',
      category: 'robot',
      categoryLabel: 'Crawler Robotics',
      img: '/images/kran_vulcan_crawler.jpg',
      specs: '850kg Traction • Neodymium Continuous Tracks',
      location: 'Alang Shipyard Berth 12',
    },
    {
      id: 4,
      title: 'Extracted Heavy Hull Plates & Stringers',
      category: 'parts',
      categoryLabel: 'Harvested Parts',
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      specs: '94.8% Clean Secondary Scrap • 0% Lead Spill',
      location: 'Aliaga Recyclers Terminal',
    },
    {
      id: 5,
      title: 'Container Vessel Forward Section Scrapping',
      category: 'before_after',
      categoryLabel: 'Before & After',
      img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
      specs: '19,200 LDT Vessel • Completed in 32 Days',
      location: 'Port of Brest Marine Facility',
    },
    {
      id: 6,
      title: 'Articulated Arm with Thermal Cutting Torch',
      category: 'plasma',
      categoryLabel: 'Plasma Cutting',
      img: '/images/robot_arm_torch.jpg',
      specs: 'Continuous Ultrasonic Standoff • Frame Warpage < 1.5mm',
      location: 'Mobile Deployment Unit Alpha',
    },
    {
      id: 7,
      title: 'Double Bottom Keel Longitudinal Segment',
      category: 'parts',
      categoryLabel: 'Harvested Parts',
      img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      specs: '45mm Grade E High-Tensile Marine Steel',
      location: 'Deepwater Berth 9',
    },
    {
      id: 8,
      title: 'Autonomous Crawler Umbilical Station',
      category: 'robot',
      categoryLabel: 'Crawler Robotics',
      img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      specs: '120kW Hybrid Plasma Power & Gas Manifold',
      location: 'Mobile Support Trailer',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Operations' },
    { id: 'plasma', label: 'Plasma Cutting' },
    { id: 'before_after', label: 'Before & After' },
    { id: 'robot', label: 'Crawler Robotics' },
    { id: 'parts', label: 'Harvested Parts' },
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">Visual Evidence</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
              Operational Field Gallery
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              High-resolution imagery of robotic cuts, crawler mounts, and dismantled superstructures.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                  filter === cat.id
                    ? 'bg-neutral-800 text-white border border-neutral-600 font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              onClick={() => setActivePhoto(item)}
              className="group card-surface border border-dark-border bg-dark-card rounded-xl overflow-hidden cursor-pointer hover:border-neutral-500 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/plasma_cut_hull.jpg';
                  }}
                  className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="badge bg-black/80 text-cyan-300 border border-neutral-700 text-[9px] font-mono uppercase">
                    {item.categoryLabel}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors truncate">
                    {item.title}
                  </h4>
                </div>
              </div>

              <div className="p-3 bg-neutral-950/70 border-t border-dark-border flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="truncate">{item.location}</span>
                <span className="text-cyan-400 font-bold shrink-0">VIEW</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <div
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full bg-dark-card border border-neutral-700 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="relative bg-black flex items-center justify-center max-h-[65vh]">
                <img
                  src={activePhoto.img}
                  alt={activePhoto.title}
                  className="max-h-[65vh] w-auto object-contain"
                />
                <button
                  onClick={() => setActivePhoto(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/80 text-white hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 border-t border-dark-border bg-neutral-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="badge bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono uppercase">
                    {activePhoto.categoryLabel}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{activePhoto.title}</h3>
                  <div className="text-xs font-mono text-neutral-400 mt-1 flex flex-wrap gap-3">
                    <span>Location: <strong className="text-neutral-200">{activePhoto.location}</strong></span>
                    <span>•</span>
                    <span>Parameters: <strong className="text-emerald-400">{activePhoto.specs}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => setActivePhoto(null)}
                  className="btn-primary text-xs px-5 py-2 font-mono"
                >
                  Close Lightbox
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
