import React, { useState } from 'react';
import { api } from '../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'Robotic Ship Dismantling Feasibility',
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
      setStatus({ type: 'success', message: res.message || 'Inquiry submitted successfully! Our engineering team will contact you.' });
      setFormData({ name: '', email: '', phone: '', company: '', subject: 'Robotic Ship Dismantling Feasibility', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Submission failed. Please check your network connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Info */}
        <div className="space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">Get In Touch</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">Yard Deployment & Feasibility</h1>
            <p className="text-sm text-text-secondary mt-4 leading-relaxed max-w-lg">
              Whether you are decommissioning a Capesize bulk carrier, an offshore rig, or a chemical tanker, our robotic crawler units can be deployed on-site globally.
            </p>
          </div>

          <div className="space-y-4">
            <div className="card-surface p-4 border border-dark-border flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                <MapPin className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase font-mono text-neutral-300">Shipyard Operations Center</h4>
                <p className="text-xs text-text-secondary mt-1">Deepwater Port Terminal 4B, Maritime Robotics Basin</p>
              </div>
            </div>

            <div className="card-surface p-4 border border-dark-border flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                <Mail className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase font-mono text-neutral-300">Engineering & Inquiries</h4>
                <p className="text-xs text-text-secondary mt-1 font-mono">telemetry@titan-cut.robotics</p>
              </div>
            </div>

            <div className="card-surface p-4 border border-dark-border flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                <Phone className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase font-mono text-neutral-300">24/7 Rapid Response Desk</h4>
                <p className="text-xs text-text-secondary mt-1 font-mono">+1 (800) 555-TITAN-CUT</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-neutral-950 border border-dark-border flex items-center gap-3 text-xs text-neutral-400">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Strict compliance with IMO Hong Kong Convention (SR/CONF/45) and EU Ship Recycling Regulation No 1257/2013.</span>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="card-surface p-8 border border-dark-border bg-dark-card shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-2">Request Feasibility Assessment</h3>
          <p className="text-xs text-text-secondary mb-6">Complete the specifications below for automated cutting yield projections.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-text-secondary mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Capt. Arthur Vance"
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
                  placeholder="arthur@vance-marine.com"
                  className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-text-secondary mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-text-secondary mb-1">Company / Shipyard</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Atlantic Marine Scrappers Ltd."
                  className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-text-secondary mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-text-secondary mb-1">Vessel Specs & Requirements *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Include vessel type, Light Displacement Tonnage (LDT), steel grade, hazardous insulation presence, and required dismantling timeline..."
                className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400 resize-none"
              />
            </div>

            {status && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  status.type === 'success'
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800'
                    : 'bg-red-950/40 text-red-300 border border-red-800'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-xs uppercase font-mono tracking-wider disabled:opacity-50"
            >
              {loading ? (
                'Transmitting Request...'
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Feasibility Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
