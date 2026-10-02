import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-dark-card border-t border-dark-border text-text-secondary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white">
                <Cpu className="w-4 h-4 text-accent-cyan" />
              </div>
              <span className="font-bold text-white tracking-wider text-base">TITAN-CUT</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Industrial autonomous robotic platform engineered for green ship dismantling, high-precision thermal plasma cutting, and high-recovery circular steel recycling.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>IMO & Hong Kong Convention Compliant</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/#services" className="hover:text-white transition-colors">Robotic Capabilities</Link></li>
              <li><Link to="/#gallery" className="hover:text-white transition-colors">Before & After Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Field Engineering Logs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Request Yard Feasibility</Link></li>
            </ul>
          </div>

          {/* Col 3: Operations & Dashboard */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Operations Suite</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Real-time Telemetry</Link></li>
              <li><Link to="/dashboard/parts" className="hover:text-white transition-colors">Part & Hull Tracking</Link></li>
              <li><Link to="/dashboard/materials" className="hover:text-white transition-colors">Spectrometry & Metallurgy</Link></li>
              <li><Link to="/dashboard/maintenance" className="hover:text-white transition-colors">Robotic Arm Health</Link></li>
              <li><Link to="/dashboard/chatbot" className="hover:text-white transition-colors">Gemini AI Copilot</Link></li>
            </ul>
          </div>

          {/* Col 4: Systems Specifications */}
          <div className="p-4 rounded-lg bg-black/60 border border-dark-border text-xs space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Robotic Crawler Unit:</span>
              <span className="text-white font-mono">TITAN-X1 PRO</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Torch Power:</span>
              <span className="text-white font-mono">400A High-Def Plasma</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Max Plate Thickness:</span>
              <span className="text-white font-mono">80 mm Marine Steel</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Guidance System:</span>
              <span className="text-white font-mono">3D LiDAR + AI Vision</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} TITAN-CUT Ship Robotics. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Safety Standard ISO 30000:2009</span>
            <span>Zero-Emission Green Ship Breaking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
