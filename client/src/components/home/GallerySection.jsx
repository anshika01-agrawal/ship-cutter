import React, { useState, useEffect } from 'react';
import { Maximize2, X, Filter, ArrowRight, ShieldCheck, Tag, Plus, UploadCloud, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../common/AnimatedSection';
import ImageUpload from '../common/ImageUpload';
import { api } from '../../services/api';

const BASE_GALLERY = [
  {
    id: 'base-1',
    title: 'Magnetic Crawler Vertical Hull Plasma Arc',
    category: 'robot',
    categoryLabel: 'Crawler Robotics',
    img: '/images/crawler_hull_cut.jpg',
    specs: '850kg Traction • 400A Hypertherm Plasma • Vertical Drydock Cut',
    location: 'Alang Dry Dock Berth 12',
  },
  {
    id: 'base-2',
    title: 'LiDAR Drone Cargo Hold 3D Spatial Scan',
    category: 'drone',
    categoryLabel: 'Aerial LiDAR Robotics',
    img: '/images/drone_ship_scan.jpg',
    specs: 'Dense Laser Grid • Millimeter Hull Geometry Mapping',
    location: 'Bulk Carrier Hold #3',
  },
  {
    id: 'base-3',
    title: 'Quadruped Engine Room Hazard Patrol Robot',
    category: 'robot',
    categoryLabel: 'Quadruped Robotics',
    img: '/images/quadruped_ship_robot.jpg',
    specs: 'FLIR Thermal Camera • Combustible Gas Sniffer • 360° LiDAR',
    location: 'Engine Room Gangway 3A',
  },
  {
    id: 'base-4',
    title: 'High-Power Hydraulic Demolition Shear Robot',
    category: 'machine',
    categoryLabel: 'Hydraulic Demolition',
    img: '/images/heavy_robotic_shear.jpg',
    specs: '600-Ton Hydraulic Bite • Naval Armor Steel Dismantling',
    location: 'Scrap Processing Yard Alpha',
  },
  {
    id: 'base-5',
    title: 'Automated CNC Gantry Multi-Torch Deck Cutter',
    category: 'machine',
    categoryLabel: 'CNC Plasma Machinery',
    img: '/images/gantry_plasma_cutter.jpg',
    specs: 'Multi-Torch Gantry • Water-Mist Cooling • Heavy Plate Contouring',
    location: 'Fabrication & Slicing Bay 2',
  },
  {
    id: 'base-6',
    title: '6-Axis Articulated Arm with Thermal Standoff Torch',
    category: 'machine',
    categoryLabel: 'Articulated Robotics',
    img: '/images/robot_arm_torch.jpg',
    specs: 'Continuous Ultrasonic Standoff • Frame Warpage < 1.5mm',
    location: 'Mobile Deployment Unit Alpha',
  },
  {
    id: 'base-7',
    title: 'KRAN-VULCAN Neodymium Magnetic Chassis',
    category: 'robot',
    categoryLabel: 'Crawler Blueprint',
    img: '/images/kran_vulcan_crawler.jpg',
    specs: 'Raspberry Pi 5 + ESP32 Telemetry • OAK-D Lite Vision',
    location: 'Autonomous Systems Lab',
  },
  {
    id: 'base-8',
    title: 'High-Precision Automated Plasma Kerf Standoff Head',
    category: 'machine',
    categoryLabel: 'Plasma Machinery',
    img: '/images/plasma_cut_hull.jpg',
    specs: '32mm AH36 Steel • 142 cm/min Cutting Speed • Clean Kerf',
    location: 'Dry Dock Berth 4B',
  },
];

export default function GallerySection() {
  const [filter, setFilter] = useState('all');
  const [activePhoto, setActivePhoto] = useState(null);
  const [userUploadedPhotos, setUserUploadedPhotos] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    async function loadUserUploads() {
      try {
        const photos = await api.getPhotos();
        if (Array.isArray(photos)) {
          // Identify base image filenames to never duplicate them
          const baseFileNames = BASE_GALLERY.map((b) => b.img.split('/').pop());

          const customOnly = photos
            .filter((p) => {
              const fileName = (p.url || '').split('/').pop();
              return fileName && !baseFileNames.includes(fileName);
            })
            .map((p) => {
              const rawUrl = p.url || '';
              const resolvedImg = rawUrl.startsWith('/uploads')
                ? rawUrl.replace('/uploads', '/images')
                : rawUrl || '/images/crawler_hull_cut.jpg';

              let cat = p.category || 'robot';
              let catLabel = 'Robotic System';
              if (cat === 'machine' || cat === 'cutting') {
                cat = 'machine';
                catLabel = 'Machinery & Cutting';
              } else if (cat === 'drone') {
                cat = 'drone';
                catLabel = 'Aerial Drone';
              }

              return {
                id: p._id || p.id || String(Math.random()),
                title: p.title || 'Field Robotics Asset',
                category: cat,
                categoryLabel: catLabel,
                img: resolvedImg,
                specs: p.description || 'Verified Field Asset',
                location: p.tags?.length ? p.tags.join(' • ') : 'User Uploaded Asset',
                isUserUpload: true,
              };
            });

          setUserUploadedPhotos(customOnly);
        }
      } catch (err) {
        console.error('Failed to load user gallery photos:', err);
      }
    }
    loadUserUploads();
  }, []);

  const handlePhotoUploaded = (newPhoto) => {
    const rawUrl = newPhoto.url || '';
    const resolvedImg = rawUrl.startsWith('/uploads')
      ? rawUrl.replace('/uploads', '/images')
      : rawUrl || '/images/crawler_hull_cut.jpg';

    let cat = newPhoto.category || 'robot';
    let catLabel = 'Robotic System';
    if (cat === 'machine' || cat === 'cutting') {
      cat = 'machine';
      catLabel = 'Machinery & Cutting';
    } else if (cat === 'drone') {
      cat = 'drone';
      catLabel = 'Aerial Drone';
    }

    const newItem = {
      id: newPhoto._id || String(Date.now()),
      title: newPhoto.title || 'Uploaded Robot / Machine Asset',
      category: cat,
      categoryLabel: catLabel,
      img: resolvedImg,
      specs: newPhoto.description || 'User-uploaded machinery asset',
      location: 'Custom Uploaded Asset',
      isUserUpload: true,
    };

    setUserUploadedPhotos((prev) => [newItem, ...prev]);
    setShowUploadModal(false);
    setActivePhoto(newItem);
  };

  // Combine unique user uploaded photos at top + base distinct gallery items
  const allItems = [...userUploadedPhotos, ...BASE_GALLERY];

  const categories = [
    { id: 'all', label: 'All Operations' },
    { id: 'robot', label: 'Crawler & Quadruped Robots' },
    { id: 'drone', label: 'Aerial LiDAR Drones' },
    { id: 'machine', label: 'Plasma & Demolition Machinery' },
  ];

  const filteredItems = allItems.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">Visual Evidence</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
                {allItems.length} Unique Photos
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
              Operational Field Gallery
            </h2>
            <p className="text-sm text-text-secondary mt-2 max-w-2xl">
              Authentic high-resolution imagery of magnetic hull crawlers, aerial LiDAR scanning drones, quadruped inspection robots, hydraulic demolition shears, and CNC plasma systems.
            </p>
          </div>

          {/* Action and Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary text-xs flex items-center gap-2 py-2 px-3.5 shadow-glow-sm"
            >
              <UploadCloud className="w-4 h-4 text-black" />
              <span>Upload Machine / Robot Photo</span>
            </button>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
                    e.currentTarget.src = '/images/crawler_hull_cut.jpg';
                  }}
                  className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {item.isUserUpload && (
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-700 text-[9px] font-mono text-cyan-300">
                    USER UPLOAD
                  </div>
                )}

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

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div
            onClick={() => setShowUploadModal(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-xl w-full bg-dark-card border border-neutral-700 rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="p-4 sm:p-6 border-b border-dark-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-accent-cyan" />
                    <span>Upload Machine or Robot Photo</span>
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Add new visual assets of your crawler robots, plasma machinery, or shipyard cuts.
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <ImageUpload
                  onUploaded={handlePhotoUploaded}
                  defaultCategory="robot"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/crawler_hull_cut.jpg';
                  }}
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
                    <span>Location / Tag: <strong className="text-neutral-200">{activePhoto.location}</strong></span>
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
