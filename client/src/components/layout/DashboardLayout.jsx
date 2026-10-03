import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, Wifi, Clock, Ship, User } from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return 'Real-Time Cutting Telemetry';
      case '/dashboard/ship-cutting-simulations':
        return 'Ship Cutting Simulations & Multi-Sensor Suite';
      case '/dashboard/sensors':
        return 'ESP32 & Adafruit IO Live Sensor Stream';
      case '/dashboard/simulation':
        return 'Robot Cutting Simulation & Safety Signal Bridge';
      case '/dashboard/database':
        return 'Database Status & Collection Explorer';
      case '/dashboard/parts':
        return 'Part Tracking & Classification';
      case '/dashboard/materials':
        return 'Material Spectrometry & Metallurgy';
      case '/dashboard/maintenance':
        return 'Robot Component Maintenance';
      case '/dashboard/feasibility':
        return 'Scrap Feasibility & Yield Analysis';
      case '/dashboard/history':
        return 'Historical Cut Operations';
      case '/dashboard/photos':
        return 'Field Photos & Inspection Media';
      case '/dashboard/ships':
        return 'Vessel Fleet Management';
      case '/dashboard/chatbot':
        return 'AI Cutting Copilot (Gemini)';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-dark-card/90 backdrop-blur-md border-b border-dark-border px-4 sm:px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-semibold text-white">
                {getPageTitle(location.pathname)}
              </h1>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Autonomous Ship Dismantling & Metallurgy Telemetry
              </p>
            </div>
          </div>

          {/* Right Top Status Widgets */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Active Ship Pill */}
            <div className="hidden md:flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-lg border border-dark-border text-xs text-neutral-300">
              <Ship className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Vessel:</span>
              <span className="font-semibold text-white">MV Ocean Voyager</span>
            </div>

            {/* Signal & Clock */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900/60 px-2.5 py-1.5 rounded-lg border border-dark-border">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] text-emerald-400 hidden sm:inline">99.8% LINK</span>
            </div>

            {/* Operator Badge */}
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-mono text-neutral-300">
              <User className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
