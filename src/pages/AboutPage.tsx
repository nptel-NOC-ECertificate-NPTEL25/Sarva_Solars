import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sun,
  Target,
  Zap,
} from 'lucide-react';
import { AppSettings } from '../types';

interface AboutPageProps {
  settings: AppSettings;
  onNavigate: (view: string) => void;
  onOpenQuoteModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  settings,
  onNavigate,
  onOpenQuoteModal,
}) => {
  const capabilities = [
    {
      icon: Sun,
      title: 'Solar EPC Solutions',
      description:
        'End-to-end engineering, procurement and construction support for residential, commercial and institutional solar installations.',
    },
    {
      icon: Zap,
      title: 'Turnkey Execution',
      description:
        'From site assessment and system design to installation, commissioning and customer handover, our approach is built around a single accountable workflow.',
    },
    {
      icon: ShieldCheck,
      title: 'Quality & Safety',
      description:
        'We focus on practical system design, dependable installation practices and long-term operating performance.',
    },
    {
      icon: HeartHandshake,
      title: 'Customer Support',
      description:
        'Clear communication, project guidance and post-installation support are central to the customer experience.',
    },
  ];

  const locations = [
    {
      label: 'Andhra Pradesh',
      title: 'Guntur Headquarters',
      description:
        'SARVA GROUP of Company’s, Brodipet 5/15, Guntur, Andhra Pradesh – 522002, India.',
      detail:
        'Serving customers across Vijayawada, Visakhapatnam, Tirupati, Kurnool, Eluru and Nellore.',
      iconClass: 'text-amber-600',
    },
    {
      label: 'Telangana',
      title: 'Hyderabad & Warangal',
      description:
        'Turnkey solar solutions for residential, commercial and institutional customers across Telangana.',
      detail:
        'Operations focused on Greater Hyderabad, Warangal and Karimnagar.',
      iconClass: 'text-blue-600',
    },
    {
      label: 'West Bengal',
      title: 'Kolkata & Industrial Belts',
      description:
        'Commercial rooftop solar execution and energy-focused solutions for customers across West Bengal.',
      detail:
        'Serving Kolkata and surrounding industrial areas.',
      iconClass: 'text-emerald-600',
    },
  ];

  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_32%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              <Sun className="h-4 w-4" />
              About Sarva Solar
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight font-poppins">
              Building a cleaner energy future,
              <span className="text-amber-400"> one project at a time.</span>
            </h1>

            <p className="mt-6 max-w-3xl text-base sm:text-lg leading-8 text-slate-300">
              {settings.tagline}. Sarva Solar provides end-to-end solar EPC
              solutions designed to help homes, businesses and institutions
              move towards reliable, self-generated clean energy.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpenQuoteModal}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-95"
              >
                Request a Site Survey
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onNavigate('projects')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Explore Our Projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
              Who We Are
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 font-poppins leading-tight">
              A practical approach to solar energy.
            </h2>

            <div className="mt-5 h-1 w-16 rounded-full bg-amber-500" />
          </div>

          <div className="lg:col-span-7 space-y-5 text-sm sm:text-base leading-7 text-slate-600">
            <p>
              Sarva Solar is a solar Engineering, Procurement and Construction
              (EPC) company focused on delivering practical renewable-energy
              solutions for residential, commercial and institutional
              customers.
            </p>

            <p>
              Our work brings together site assessment, system planning,
              equipment procurement, installation and commissioning into a
              coordinated project journey. The objective is simple: help
              customers make a confident transition to solar with systems
              designed around their energy requirements and site conditions.
            </p>

            <p>
              With operational presence across Andhra Pradesh, Telangana and
              West Bengal, Sarva Solar combines local project execution with a
              customer-first approach. We aim to make every stage of the
              solar journey understandable, transparent and professionally
              managed.
            </p>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Values */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
              What Guides Us
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 font-poppins">
              Built around trust, performance and sustainability.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-900 font-poppins">
                Our Vision
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                To contribute to a cleaner and more energy-independent future
                by making dependable solar power accessible to more homes and
                businesses.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-900 font-poppins">
                Our Mission
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                To deliver well-engineered solar projects through disciplined
                execution, transparent communication and dependable customer
                support.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-900 font-poppins">
                Our Values
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Integrity in communication, responsible engineering, quality
                workmanship, customer focus and a long-term commitment to
                clean energy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
            What We Deliver
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 font-poppins">
            From the first site assessment to a commissioned solar system.
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-7 text-slate-600">
            Our EPC approach keeps the major stages of a solar project
            connected, helping customers move from planning to installation
            with greater clarity.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {capabilities.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-amber-400">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-900 font-poppins">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Operating Footprint */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-amber-400">
              Strategic Footprint
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-black font-poppins">
              Local execution. Regional reach.
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-7 text-slate-300">
              Our current operational footprint supports solar customers across
              key markets in Andhra Pradesh, Telangana and West Bengal.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {locations.map((location) => (
              <div
                key={location.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <MapPin className={`h-5 w-5 ${location.iconClass}`} />

                <p className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">
                  {location.label}
                </p>

                <h3 className="mt-2 text-xl font-black font-poppins">
                  {location.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {location.description}
                </p>

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  {location.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sarva */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
              Why Sarva Solar
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 font-poppins leading-tight">
              A solar partner focused on the complete project.
            </h2>

            <p className="mt-5 text-sm sm:text-base leading-7 text-slate-600">
              Choosing solar is a long-term decision. We believe the customer
              experience should therefore extend beyond installation and
              include clear guidance, responsible execution and ongoing
              support.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Site-specific planning and system design',
              'Coordinated procurement and project execution',
              'Clear communication throughout the installation process',
              'Support for customers through commissioning and beyond',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <span className="text-sm font-semibold leading-6 text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-500 to-amber-600 p-8 sm:p-12 text-center text-slate-950 shadow-xl">
          <div className="relative">
            <span className="text-xs font-black uppercase tracking-[0.18em]">
              Start Your Solar Journey
            </span>

            <h2 className="mt-3 text-2xl sm:text-3xl font-black font-poppins">
              Ready to explore solar for your property?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6">
              Talk to the Sarva Solar team about your requirements, site
              assessment and the right solar solution for your property.
            </p>

            <button
              onClick={onOpenQuoteModal}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-slate-900 active:scale-95"
            >
              Request a Site Survey
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};