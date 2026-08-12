import React, { useState } from 'react';
import {
  Sun,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Send,
  MessageCircle,
  ArrowUpRight
} from 'lucide-react';
import { AppSettings } from '../types';

interface FooterProps {
  settings: AppSettings;
  onNavigate: (view: string) => void;
  onOpenQuoteModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenQuoteModal }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-16 pb-12 overflow-hidden">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Company Profile & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <img
                src="/assets/.aistudio/logo.png"
                alt="SARVA GROUP Logo"
                className="w-12 h-12 rounded-2xl object-cover shadow-lg hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-2xl font-black text-white font-poppins tracking-tight">
                  SARVA<span className="text-amber-500">GROUP</span>
                </span>
                <p className="text-[10px] text-emerald-400 uppercase font-semibold tracking-widest -mt-1">
                  OF COMPANIES
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              {settings.tagline}. Leading solar engineering, procurement, and construction (EPC) partner across Andhra Pradesh, Telangana, and West Bengal.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="font-medium text-slate-200 leading-relaxed">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex gap-3">
                  <a href={`tel:${settings.phone1.replace(/\s+/g, '')}`} className="hover:text-amber-400 font-medium">
                    {settings.phone1}
                  </a>
                  <span>/</span>
                  <a href={`tel:${settings.phone2.replace(/\s+/g, '')}`} className="hover:text-amber-400 font-medium">
                    {settings.phone2}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-400">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider font-poppins">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {['home', 'about', 'services', 'projects', 'products', 'subsidy', 'calculators', 'blog', 'careers', 'contact'].map((view) => (
                <li key={view}>
                  <button
                    onClick={() => onNavigate(view)}
                    className="capitalize text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 group"
                  >
                    <span>→ {view.replace('-', ' ')}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Regional Presence & Certifications */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider font-poppins">
              Service Regions
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <p className="font-bold text-slate-200">Andhra Pradesh</p>
                <p className="text-[11px] text-slate-400">Guntur HQ, Vijayawada, Visakhapatnam, Tirupati, Eluru, Nellore, Kurnool</p>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <p className="font-bold text-slate-200">Telangana</p>
                <p className="text-[11px] text-slate-400">Hyderabad, Warangal, Karimnagar</p>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <p className="font-bold text-slate-200">West Bengal</p>
                <p className="text-[11px] text-slate-400">Kolkata & Industrial Belts</p>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter & PM Surya Ghar CTA */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider font-poppins">
              Solar Newsletter
            </h4>
            <p className="text-xs text-slate-400">
              Get monthly updates on government subsidies, net metering policies, and energy saving tips.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-amber-500 text-slate-950 p-1.5 rounded-lg hover:bg-amber-400 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-medium">
                  ✓ Thank you for subscribing to Sarva Solar!
                </p>
              )}
            </form>

            <div className="pt-2">
              <button
                onClick={onOpenQuoteModal}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-95"
              >
                <span>Request Custom Quote</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Sarva Solar. All Rights Reserved. Empowering clean energy future.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => onNavigate('subsidy')}>
              PM Surya Ghar Portal
            </span>
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => onNavigate('calculators')}>
              Solar ROI Calculator
            </span>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-amber-400 text-slate-400 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Staff & Management Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Sarva%20Solar!%20I%20am%20interested%20in%20a%20solar%20rooftop%20quote.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center gap-2 border-2 border-white/20"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline font-extrabold text-xs pr-1">Chat on WhatsApp</span>
      </a>
    </footer>
  );
};
