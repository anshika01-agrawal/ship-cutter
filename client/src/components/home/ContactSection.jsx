import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, ShieldCheck, Anchor } from 'lucide-react';
import { api } from '../../services/api';
import AnimatedSection from '../common/AnimatedSection';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'Autonomous Ship Cutting Feasibility Inquiry',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await api.submitContact(formData);
      setStatus({
        type: 'success',
        message: res.message || 'Feasibility request submitted! Our marine robotics team will contact you within 24 hours.',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: 'Autonomous Ship Cutting Feasibility Inquiry',
        message: '',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Transmission failed. Please check network connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
      {/* Header */}
      <AnimatedSection>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">Immediate Dispatch</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            Deploy Robotic Cutting Units To Your Yard
          </h2>
          <p className="text-sm text-text-secondary mt-3">
            Our containerized crawler units can be shipped and mobilized to dry docks, shipyards, and beaching berths worldwide.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 cols: Yard Info & Direct Channels */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-surface p-6 border border-dark-border bg-dark-card space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Anchor className="w-4 h-4 text-cyan-400" />
              <span>Global Demolition Headquarters</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-300 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 uppercase font-mono text-[10px] block">Global Basin Facility</span>
                  <span className="text-white font-medium">Deepwater Marine Robotics Complex 4B, Rotterdam Port Terminal</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-300 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 uppercase font-mono text-[10px] block">Operations Desk</span>
                  <span className="text-white font-mono">telemetry@titan-cut.robotics</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-300 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 uppercase font-mono text-[10px] block">24/7 Rapid Emergency Interlock</span>
                  <span className="text-white font-mono">+1 (800) 555-TITAN-CUT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Standards Card */}
          <div className="card-surface p-5 border border-dark-border bg-neutral-950/80 text-xs space-y-2">
            <div className="flex items-center gap-2 font-mono text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>REGULATORY CERTIFICATIONS</span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Certified for hazardous lead abatement and closed-loop scrap recovery under IMO Resolution MEPC.210(63) and ISO 30000:2009 Ship Recycling Management.
            </p>
          </div>
        </div>

        {/* Right 7 cols: Contact & Feasibility Form */}
        <div className="lg:col-span-7 card-surface p-6 sm:p-8 border border-dark-border bg-dark-card shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-1">Request Rapid Yard Feasibility & Yield Projections</h3>
          <p className="text-xs text-text-secondary mb-6">Submit vessel specifications for automated cut duration and secondary scrap value analysis.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-text-secondary mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Capt. Henrik Vance"
                  className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-secondary mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="vance@marine-salvage.com"
                  className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-text-secondary mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+31 10 555 0192"
                  className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-secondary mb-1">Shipyard / Vessel Owner</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="North Sea Decommissioning NV"
                  className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-text-secondary mb-1">Vessel Specs & Scrapping Timeline *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Include vessel class (e.g. Capesize, VLCC, Post-Panamax), Light Displacement Tonnage (LDT), berth location, and target completion date..."
                className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400 resize-none"
              />
            </div>

            {status && (
              <div
                className={`p-3.5 rounded-lg text-xs flex items-center gap-2.5 ${
                  status.type === 'success'
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                    : 'bg-red-950/60 text-red-300 border border-red-800'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-xs uppercase font-mono tracking-wider font-semibold disabled:opacity-50"
            >
              {loading ? (
                'Transmitting to Shipyard Desk...'
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span>Transmit Feasibility Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
