import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { submitLead } from '../services/api';

interface ContactPageProps {
  settings: AppSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    state: 'Andhra Pradesh',
    city: '',
    solarFor: 'Home',
    monthlyBill: '₹1000 - ₹5000',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.email) return;

    setLoading(true);
    try {
      await submitLead({
        ...form,
        financeInterest: 'Yes',
        connectionType: 'On-Grid'
      });
      setSubmitted(true);
    } catch (e) {
      alert('Error submitting inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Direct Connect
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-poppins">
          Contact Sarva Solar
        </h1>
        <p className="text-sm text-slate-600">
          Get in touch with our solar EPC engineers for rooftop feasibility, quote calculations, and subsidy filings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Cards & Address */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl">
            <h3 className="text-2xl font-bold font-poppins text-amber-400">Guntur Headquarters</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              SARVA GROUP of Company's<br />
              Brodipet 5/15 Guntur Andhra Pradesh pincode:-522002, India.
            </p>

            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Customer Support Phone</p>
                  <p className="font-bold text-sm text-white">
                    <a href={`tel:${settings.phone1.replace(/\s+/g, '')}`}>{settings.phone1}</a> /{' '}
                    <a href={`tel:${settings.phone2.replace(/\s+/g, '')}`}>{settings.phone2}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Official Email</p>
                  <p className="font-bold text-sm text-white">
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Working Hours</p>
                  <p className="font-bold text-sm text-white">{settings.workingHours}</p>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Sarva%20Solar!%20I%20want%20a%20solar%20quote.`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Instant Chat on WhatsApp</span>
            </a>
          </div>

          {/* Regional Offices */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 font-poppins">Other Regional Hubs</h4>
            <div className="text-xs text-slate-600 space-y-2">
              <p>• <strong>Telangana:</strong> Hyderabad & Warangal Branch Networks</p>
              <p>• <strong>West Bengal:</strong> Kolkata Industrial Belt Branch</p>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 font-poppins">
            Send an Inquiry Form
          </h3>

          {submitted ? (
            <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-xl font-bold text-emerald-800">Thank You!</h4>
              <p className="text-xs text-emerald-700">
                Your message has been assigned to a Sarva Solar technical executive. We will call you back within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Venkatesh"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 8985430100"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900"
                  >
                    <option>Andhra Pradesh</option>
                    <option>Telangana</option>
                    <option>West Bengal</option>
                    <option>Other State</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Solar For</label>
                  <select
                    value={form.solarFor}
                    onChange={(e) => setForm({ ...form, solarFor: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900"
                  >
                    <option>Home</option>
                    <option>Business</option>
                    <option>Agriculture</option>
                    <option>Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Electricity Bill</label>
                  <select
                    value={form.monthlyBill}
                    onChange={(e) => setForm({ ...form, monthlyBill: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900"
                  >
                    <option>Less than ₹1000</option>
                    <option>₹1000 - ₹5000</option>
                    <option>₹5000 - ₹15000</option>
                    <option>More than ₹15000</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message / Roof Details</label>
                <textarea
                  rows={3}
                  placeholder="Describe your rooftop area, power requirement, or query..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting...' : <><Send className="w-4 h-4" /><span>Submit Inquiry</span></>}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl h-96 relative">
        <iframe
          src={settings.googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Sarva Solar Guntur Headquarters"
        />
      </div>
    </div>
  );
};
