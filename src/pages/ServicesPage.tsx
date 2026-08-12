import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ServiceItem } from '../types';
import { CheckCircle2, ChevronRight, Zap, ShieldCheck, HelpCircle } from 'lucide-react';

interface ServicesPageProps {
  services: ServiceItem[];
  onOpenQuoteModal: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ services, onOpenQuoteModal }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem>(services[0] || {} as any);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Turnkey Cleantech EPC
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-poppins">
          Our Solar Energy Services
        </h1>
        <p className="text-sm text-slate-600">
          From residential rooftops to MW-scale industrial plants, Sarva Solar provides engineering, procurement, net metering, and maintenance services.
        </p>
      </div>

      {/* Main Grid + Detail Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Service Selector Cards */}
        <div className="lg:col-span-4 space-y-3">
          {services.map((s) => {
            const isSelected = selectedService.id === s.id;
            return (
              <motion.div
                key={s.id}
                onClick={() => setSelectedService(s)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xl'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-amber-500/50'
                }`}
              >
                <div>
                  <h4 className="font-extrabold text-sm font-poppins">{s.title}</h4>
                  <p className={`text-xs mt-0.5 line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {s.shortDesc}
                  </p>
                </div>
                <ChevronRight className={`w-5 h-5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Selected Service Deep Dive */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6">
          <div className="h-64 rounded-2xl overflow-hidden relative">
            <img
              src={selectedService.imageUrl}
              alt={selectedService.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
            <div className="absolute bottom-4 left-6 text-white space-y-1">
              <span className="text-xs bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-full uppercase">
                EPC Feature Service
              </span>
              <h3 className="text-2xl font-black font-poppins">{selectedService.title}</h3>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {selectedService.fullDesc}
          </p>

          {/* Benefits Bullet Points */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-poppins">
              Key Engineering Benefits
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedService.benefits.map((b, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs font-medium text-slate-800 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQs for Service */}
          {selectedService.faqs && selectedService.faqs.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-poppins flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                Service FAQs
              </h4>
              <div className="space-y-2">
                {selectedService.faqs.map((f, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-slate-900">Q: {f.question}</p>
                    <p className="text-slate-600">A: {f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTA */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={onOpenQuoteModal}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm py-3 px-6 rounded-full shadow-lg transition-transform active:scale-95"
            >
              Request Quote for {selectedService.title}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
