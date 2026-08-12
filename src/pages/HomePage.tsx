import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sun,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Users,
  Building2,
  Home,
  HelpCircle,
  PhoneCall,
  ArrowRight,
  Sparkles,
  FileCheck,
  Play,
  Pause,
  Video as VideoIcon,
  Image as ImageIcon
} from 'lucide-react';
import { AppSettings, Project, ServiceItem, Testimonial, FAQItem, BlogArticle, HeroSlide } from '../types';
import { SolarCalculator } from '../components/SolarCalculator';

interface HomePageProps {
  settings: AppSettings;
  projects: Project[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  blogs: BlogArticle[];
  heroSlides?: HeroSlide[];
  onNavigate: (view: string) => void;
  onOpenQuoteModal: () => void;
}

const defaultSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    badge: 'PM Surya Ghar Govt Subsidy Assistance up to ₹78,000',
    title: 'Green Power, Bright Future. Clean Solar Energy for Every Roof.',
    subtitle: 'Sarva Solar is a premier EPC solar partner across Andhra Pradesh, Telangana & West Bengal. Eliminate electricity bills with Tier-1 bifacial modules & DISCOM net-metering.',
    mediaType: 'image',
    mediaUrl: '/src/assets/images/regenerated_image_1784933875727.jpg',
    ctaPrimaryText: 'Get Free Instant Quote',
    ctaPrimaryAction: 'quote',
    ctaSecondaryText: 'Calculate Solar Savings',
    ctaSecondaryAction: 'calculators',
    order: 1
  },
  {
    id: 'slide-2',
    badge: 'Industrial & Commercial Rooftop Solar EPC',
    title: 'Slash Commercial Electricity Overhead by up to 80%',
    subtitle: 'High-capacity 50kWp to 1MWp solar installations for factories, cold storages, and commercial complexes with accelerated depreciation tax benefits.',
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-solar-panels-on-a-roof-in-a-sunny-day-41318-large.mp4',
    ctaPrimaryText: 'Request Commercial Audit',
    ctaPrimaryAction: 'quote',
    ctaSecondaryText: 'Explore Commercial Projects',
    ctaSecondaryAction: 'projects',
    order: 2
  },
  {
    id: 'slide-3',
    badge: 'Smart Off-Grid & Hybrid Solar Storage',
    title: 'Uninterrupted Power 24/7 with Hybrid Solar Storage',
    subtitle: 'Intelligent lithium battery back-up solutions ensuring continuous zero-interruption solar power for farms, villas, and sensitive medical/IT setups.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1542336391-ae2936d8eff4?auto=format&fit=crop&w=2000&q=80',
    ctaPrimaryText: 'View Solar Packages',
    ctaPrimaryAction: 'products',
    ctaSecondaryText: 'Talk to Solar Engineer',
    ctaSecondaryAction: 'contact',
    order: 3
  }
];

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  projects,
  services,
  testimonials,
  faqs,
  blogs,
  heroSlides,
  onNavigate,
  onOpenQuoteModal
}) => {
  const [activeFaq, setActiveFaq] = useState<string | null>(faqs[0]?.id || null);

  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : defaultSlides;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // Helper to parse video embed info for YouTube, Vimeo, or direct files
  const getVideoEmbedInfo = (url: string) => {
    if (!url) return { type: 'direct', embedUrl: '' };

    const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    if (ytMatch && ytMatch[2] && ytMatch[2].length === 11) {
      const videoId = ytMatch[2];
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&enablejsapi=1&rel=0`
      };
    }

    const vimeoMatch = url.match(/(?:www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        type: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&background=1`
      };
    }

    return { type: 'direct', embedUrl: url };
  };

  // Reset video playing state when slide changes
  useEffect(() => {
    setIsVideoPlaying(true);
  }, [currentSlideIndex]);

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const activeSlide = slides[currentSlideIndex] || slides[0];
  const activeVideoInfo = activeSlide.mediaType === 'video' ? getVideoEmbedInfo(activeSlide.mediaUrl) : null;

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handleCtaClick = (action?: string) => {
    if (!action || action === 'quote') {
      onOpenQuoteModal();
    } else if (
      action === 'calculators' ||
      action === 'projects' ||
      action === 'products' ||
      action === 'services' ||
      action === 'contact' ||
      action === 'subsidy' ||
      action === 'about' ||
      action === 'blog' ||
      action === 'gallery' ||
      action === 'careers'
    ) {
      onNavigate(action);
    } else if (action.startsWith('http://') || action.startsWith('https://')) {
      window.open(action, '_blank');
    } else {
      onNavigate(action);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section Slider */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden pt-12 pb-20 group"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Background Media (Video or Ambient Overlay) */}
        {activeSlide.mediaType === 'video' && activeVideoInfo ? (
          activeVideoInfo.type === 'youtube' || activeVideoInfo.type === 'vimeo' ? (
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none scale-125 opacity-75">
              <iframe
                key={activeSlide.id}
                src={activeVideoInfo.embedUrl}
                title={activeSlide.title}
                className="w-full h-full object-cover border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              key={activeSlide.id}
              autoPlay
              loop
              muted
              playsInline
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              className="absolute inset-0 w-full h-full object-cover opacity-75 scale-105 transition-all duration-1000"
            >
              <source src={activeSlide.mediaUrl} type="video/mp4" />
              <source src={activeSlide.mediaUrl} type="video/webm" />
            </video>
          )
        ) : null}

        {/* Gradient Overlays - Reduced darkness to 25% */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-slate-950/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/25 via-transparent to-slate-950/25" />

        {/* Slide Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              aria-label="Previous Slide"
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/60 hover:bg-amber-500 hover:text-slate-950 border border-slate-700/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next Slide"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/60 hover:bg-amber-500 hover:text-slate-950 border border-slate-700/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Hero Content Box */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {!(activeSlide.mediaType === 'video' && isVideoPlaying) ? (
            <div className="animate-fadeIn">
              {/* Badge */}
              {activeSlide.badge && (
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-extrabold px-4 py-2 rounded-full mb-6 backdrop-blur-md shadow-lg">
                  {activeSlide.mediaType === 'video' ? (
                    <VideoIcon className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{activeSlide.badge}</span>
                </div>
              )}

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-poppins tracking-tight leading-[1.15] max-w-5xl mx-auto drop-shadow-2xl">
                {activeSlide.title}
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                {activeSlide.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                {activeSlide.ctaPrimaryText && (
                  <button
                    onClick={() => handleCtaClick(activeSlide.ctaPrimaryAction || 'quote')}
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-base px-8 py-4 rounded-full shadow-2xl shadow-amber-500/30 transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    <span>{activeSlide.ctaPrimaryText}</span>
                  </button>
                )}

                {activeSlide.ctaSecondaryText && (
                  <button
                    onClick={() => handleCtaClick(activeSlide.ctaSecondaryAction || 'calculators')}
                    className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-white font-extrabold text-base px-8 py-4 rounded-full border border-slate-700 backdrop-blur-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>{activeSlide.ctaSecondaryText}</span>
                    <ChevronRight className="w-5 h-5 text-amber-400" />
                  </button>
                )}

                {activeSlide.mediaType === 'video' && (
                  <button
                    type="button"
                    onClick={() => setIsVideoPlaying(true)}
                    className="text-xs text-slate-300 hover:text-amber-400 underline font-semibold transition-colors mt-2 sm:mt-0"
                  >
                    Hide Overlay for Video
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-20 flex flex-col items-center justify-center animate-fadeIn">
              <button
                type="button"
                onClick={() => setIsVideoPlaying(false)}
                className="inline-flex items-center gap-2.5 bg-slate-950/25 hover:bg-slate-950/60 border border-amber-400/60 text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-extrabold px-6 py-3 rounded-full backdrop-blur-md transition-all shadow-2xl hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-amber-400/20"
              >
                <Pause className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Video Playing (Content Hidden) — Click to Show Title & CTAs</span>
              </button>
            </div>
          )}

          {/* Slide Indicator Dots & Play Pause Controls */}
          {slides.length > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="p-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                title={isAutoPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <div className="flex items-center gap-2">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === currentSlideIndex
                        ? 'w-8 bg-amber-400'
                        : 'w-2.5 bg-slate-600 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Floating Key Metrics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md text-center shadow-xl">
              <p className="text-2xl sm:text-3xl font-black text-amber-400 font-poppins">10,000+ kWp</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Capacity Installed</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md text-center shadow-xl">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-poppins">₹78,000</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Max Govt Subsidy</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md text-center shadow-xl">
              <p className="text-2xl sm:text-3xl font-black text-blue-400 font-poppins">25 Years</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Panel Warranty</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md text-center shadow-xl">
              <p className="text-2xl sm:text-3xl font-black text-amber-400 font-poppins">4.9 / 5.0</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            Engineering Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-poppins mt-1">
            Why Sarva Solar is the Trusted EPC Choice
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            We deliver end-to-end solar execution with zero compromise on structural safety or electrical precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="p-8 rounded-3xl glass-card glass-card-hover border border-slate-200 shadow-xl space-y-4 hover:border-amber-500/50 transition-all group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-poppins">
              Tier-1 Bifacial Solar Modules
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We install top-ranked ALMM-approved N-Type bifacial solar panels producing up to 25% extra electricity generation from rear reflections.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="p-8 rounded-3xl glass-card glass-card-hover border border-slate-200 shadow-xl space-y-4 hover:border-emerald-500/50 transition-all group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-poppins">
              End-to-End Subsidy Filing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our dedicated liaison team handles all DISCOM net metering documentation, portal filings, and direct subsidy transfer to your bank account.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="p-8 rounded-3xl glass-card glass-card-hover border border-slate-200 shadow-xl space-y-4 hover:border-blue-500/50 transition-all group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-poppins">
              Cyclone-Rated Hot Dip Structures
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-tensile galvanized steel structures engineered to withstand severe coastal wind loads up to 170 km/h across AP and WB.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-slate-50/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                Comprehensive EPC Offerings
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-poppins mt-1">
                Our Solar Cleantech Solutions
              </h2>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="mt-4 md:mt-0 text-sm font-extrabold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <motion.div
                key={service.id}
                onClick={() => onNavigate('services')}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden shadow-lg border border-slate-200 cursor-pointer group hover:shadow-2xl transition-all"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-xs font-black text-white bg-amber-500 px-3 py-1 rounded-full">
                    {service.title}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {service.shortDesc}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-blue-600">
                    <span>Learn More & Pricing</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Embedded Solar Savings Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SolarCalculator />
      </section>

      {/* PM Surya Ghar Government Subsidy Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="bg-emerald-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              PM Surya Ghar: Muft Bijli Yojana
            </span>
            <h3 className="text-3xl sm:text-4xl font-black font-poppins leading-tight">
              Get Up to ₹78,000 Direct Central Government Subsidy
            </h3>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Residential rooftop installations up to 3 kW receive maximum subsidy credited directly to your bank account via DBT. Sarva Solar coordinates complete documentation and DISCOM approval.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('subsidy')}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm py-3 px-6 rounded-full shadow-lg transition-transform active:scale-95"
              >
                Read Complete Subsidy Guide
              </button>
              <button
                onClick={onOpenQuoteModal}
                className="bg-emerald-800/80 hover:bg-emerald-800 text-white font-extrabold text-sm py-3 px-6 rounded-full border border-emerald-600"
              >
                Apply for Subsidy Now
              </button>
            </div>
          </div>

          <div className="w-full lg:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-3 relative z-10">
            <p className="text-xs uppercase font-bold text-emerald-300">Subsidy Slab Matrix</p>
            <div className="space-y-2 text-xs text-left">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>1 kWp Plant:</span>
                <span className="font-extrabold text-amber-300">₹30,000 Subsidy</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>2 kWp Plant:</span>
                <span className="font-extrabold text-amber-300">₹60,000 Subsidy</span>
              </div>
              <div className="flex justify-between">
                <span>3 kWp to 10 kWp:</span>
                <span className="font-black text-emerald-300">₹78,000 Subsidy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
              Proven Track Record
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-poppins mt-1">
              Featured Solar Installations
            </h2>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="mt-4 md:mt-0 text-sm font-extrabold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.slice(0, 2).map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden shadow-xl border border-slate-200 space-y-4 hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-slate-950/80 text-amber-400 text-xs font-black px-3 py-1 rounded-full backdrop-blur-md">
                  {project.capacityKw} kWp {project.category}
                </span>
                <span className="absolute bottom-4 right-4 bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full">
                  Saved ₹{project.annualSavingsRs.toLocaleString('en-IN')}/yr
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold text-slate-900 font-poppins">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-600">
                  📍 {project.location}, {project.state}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {project.description}
                </p>

                {project.clientReview && (
                  <div className="p-4 bg-slate-50/80 rounded-2xl text-xs space-y-1 italic text-slate-700">
                    <p>"{project.clientReview.comment}"</p>
                    <p className="font-bold not-italic text-amber-600">
                      — {project.clientReview.author}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Verified Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-poppins mt-1">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 space-y-4 flex flex-col justify-between hover:border-amber-400/50 transition-colors shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    {'★'.repeat(t.rating)}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <img
                    src={t.photoUrl}
                    alt={t.customerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{t.customerName}</p>
                    <p className="text-[10px] text-slate-300">{t.location} ({t.systemSizeKw}kW System)</p>
                    <p className="text-[10px] text-emerald-400 font-bold">Saved: {t.savedPerYear}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            Clear Answers
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-poppins mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = activeFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  className="w-full text-left p-5 font-bold text-sm text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/80"
                >
                  <span>{faq.question}</span>
                  <span className="text-amber-500 font-extrabold text-lg">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h3 className="text-3xl sm:text-4xl font-black font-poppins max-w-3xl mx-auto">
            Ready to Switch Your Home or Business to Clean Solar Energy?
          </h3>
          <p className="text-sm text-blue-100 max-w-xl mx-auto">
            Book a zero-cost rooftop technical survey with Sarva Solar engineers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <button
              onClick={onOpenQuoteModal}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm py-3.5 px-8 rounded-full shadow-xl transition-transform active:scale-95"
            >
              Request Free Site Survey
            </button>
            <a
              href={`tel:${settings.phone1.replace(/\s+/g, '')}`}
              className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm py-3.5 px-8 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Call +91 8985430100</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
