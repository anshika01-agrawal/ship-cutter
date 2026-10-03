import React from 'react';
import ScrollVideoBackground from '../components/home/ScrollVideoBackground';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import ServicesSection from '../components/home/ServicesSection';
import GallerySection from '../components/home/GallerySection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import BlogPreview from '../components/home/BlogPreview';
import ContactSection from '../components/home/ContactSection';

export default function HomePage() {
  return (
    <div className="relative text-white min-h-screen">
      {/* 0. Dynamic Scroll-Linked Video Background (HomePage Exclusive) */}
      <ScrollVideoBackground />

      {/* Main Content Layer */}
      <div className="relative z-10 space-y-16 sm:space-y-24 pb-16">
        {/* 1. Full-screen High-Tech Hero */}
        <HeroSection />

        {/* 2. Company Story & Leadership Team */}
        <AboutSection />

        {/* 3. 4-Step Interactive Process */}
        <HowItWorksSection />

        {/* 4. Robotic Capabilities & Machine Specs */}
        <ServicesSection />

        {/* 5. Filterable Operational Gallery with Lightbox */}
        <GallerySection />

        {/* 6. Client Reviews & Audited Testimonials */}
        <TestimonialsSection />

        {/* 7. Engineering Reports & Research Preview */}
        <BlogPreview />

        {/* 8. Immediate Dispatch & Feasibility Form */}
        <ContactSection />
      </div>
    </div>
  );
}
