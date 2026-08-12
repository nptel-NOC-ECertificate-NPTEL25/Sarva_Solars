import React from 'react';
import { AppSettings } from '../types';
import { Award, ShieldCheck, MapPin, Target, Eye, HeartHandshake, CheckCircle2 } from 'lucide-react';
import ceoImg from '../assets/images/regenerated_image_1784933875727.jpg';

interface AboutPageProps {
  settings: AppSettings;
  onNavigate: (view: string) => void;
  onOpenQuoteModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate, onOpenQuoteModal }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Empowering Clean Energy
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-poppins">
          About Sarva Solar
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {settings.tagline}. We are a premier solar EPC (Engineering, Procurement, Construction) company dedicated to making renewable energy accessible, affordable, and durable for homes and enterprises across India.
        </p>
      </div>

      {/* Founder & CEO Message Section */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 text-center space-y-4">
          <div className="w-48 h-48 rounded-full overflow-hidden mx-auto shadow-2xl border-4 border-amber-500/40">
            <img
              src={ceoImg}
              alt="Jupalli Venkatesh Kumar - Founder & CEO"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-poppins">
              Jupalli Venkatesh Kumar
            </h3>
            <p className="text-xs text-amber-600 font-extrabold uppercase tracking-wider">
              Founder & CEO, Sarva Solar
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Sri A Raghu Vikram Aditya Solar Installation Pvt. Ltd.
            </p>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Leadership Vision
          </span>
          <h3 className="text-2xl font-bold text-slate-900 font-poppins">
            "Solar is not just an alternative energy source; it is the cornerstone of sustainable economic independence."
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Jupalli Venkatesh Kumar, CEO of Sarva Solar, is dedicated to advancing sustainable energy solutions that empower communities and foster environmental stewardship. Under his guidance, Sarva Solar has executed MW-scale rooftop and ground-mounted solar projects across Andhra Pradesh, Telangana, and West Bengal.
          </p>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">Our Vision</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To be India's most trusted rooftop solar EPC brand, powering over 100,000 households and businesses with self-generated clean electricity by 2030.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">Our Mission</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To deliver highest-yield turnkey solar plants, streamline central government subsidy claims, and ensure 25-year trouble-free power generation.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">Our Values</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Integrity in pricing, uncompromising structural safety, complete transparency in Govt subsidy processing, and lifetime customer support.
          </p>
        </div>
      </div>

      {/* Regional Operational Offices */}
      <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            Strategic Footprint
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-poppins mt-1">
            Our Key Operational Hubs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm">
              <MapPin className="w-4 h-4" />
              <span>Headquarters: Andhra Pradesh</span>
            </div>
            <p className="text-xs font-bold text-slate-800">Guntur HQ & Coastal Network</p>
            <p className="text-xs text-slate-600">
              SARVA GROUP of Company's<br />
              Brodipet 5/15 Guntur Andhra Pradesh pincode:-522002, India.<br />
              Also serving Vijayawada, Visakhapatnam, Tirupati, Kurnool, Eluru, Nellore.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-extrabold text-sm">
              <MapPin className="w-4 h-4" />
              <span>State Office: Telangana</span>
            </div>
            <p className="text-xs font-bold text-slate-800">Hyderabad & Warangal Operations</p>
            <p className="text-xs text-slate-600">
              Turnkey residential & corporate solar installations across Greater Hyderabad, Warangal, and Karimnagar.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
              <MapPin className="w-4 h-4" />
              <span>Regional Office: West Bengal</span>
            </div>
            <p className="text-xs font-bold text-slate-800">Kolkata & Industrial Belts</p>
            <p className="text-xs text-slate-600">
              Commercial rooftop solar execution and industrial energy storage solutions in West Bengal.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 text-center text-slate-950 space-y-4 shadow-xl">
        <h3 className="text-2xl font-black font-poppins">Ready to partner with Sarva Solar?</h3>
        <p className="text-xs font-semibold max-w-lg mx-auto">
          Contact our team today for site surveys, custom engineering drawings, or subsidy guidance.
        </p>
        <button
          onClick={onOpenQuoteModal}
          className="bg-slate-950 text-white font-black text-xs py-3 px-8 rounded-full shadow-lg hover:bg-slate-900 transition-transform active:scale-95"
        >
          Request Site Survey Now
        </button>
      </div>
    </div>
  );
};
