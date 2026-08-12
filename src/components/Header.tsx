import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Phone,
  Menu,
  X,
  ShieldCheck,
  Calculator,
  ChevronDown,
  UserCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { AppSettings, User } from '../types';

interface HeaderProps {
  settings: AppSettings;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenQuoteModal: () => void;
  user: User | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentView,
  onNavigate,
  onOpenQuoteModal,
  user,
  darkMode,
  onToggleDarkMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services', hasDropdown: true },
    { id: 'projects', label: 'Projects' },
    { id: 'products', label: 'Products' },
    { id: 'subsidy', label: 'Govt Subsidy', highlight: true },
    { id: 'calculators', label: 'Calculators' },
    { id: 'blog', label: 'Blog' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      {/* Top Announcement Bar */}
      {settings.showAnnouncementBar && (
        <div className="bg-gradient-to-r from-blue-700 via-emerald-600 to-amber-500 text-white text-xs md:text-sm py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
          <span>{settings.announcementBarText}</span>
          <button
            onClick={() => onNavigate('subsidy')}
            className="ml-2 underline font-bold hover:text-amber-200 transition-colors hidden sm:inline"
          >
            Check Eligibility →
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0 mr-2 xl:mr-4"
          >
            <img
              src="/assets/.aistudio/logo.png"
              alt="SARVA GROUP Logo"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="shrink-0">
              <div className="flex items-center gap-1 whitespace-nowrap">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-poppins">
                  SARVA<span className="text-amber-500">GROUP</span>
                </span>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-600 block -mt-1 whitespace-nowrap">
                OF COMPANIES
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-2 shrink-0">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <div key={item.id} className="relative group shrink-0">
                  <button
                    onClick={() => {
                      if (item.hasDropdown) {
                        setServicesDropdown(!servicesDropdown);
                      } else {
                        onNavigate(item.id);
                        setServicesDropdown(false);
                      }
                    }}
                    className={`px-2.5 py-2 rounded-lg text-xs 2xl:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : item.highlight
                        ? 'text-emerald-600 font-bold hover:bg-emerald-50'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                    {item.highlight && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    )}
                    {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Services Dropdown Submenu */}
                  {item.hasDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 hidden group-hover:block transition-all z-50">
                      <button
                        onClick={() => {
                          onNavigate('services');
                          setServicesDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 rounded-lg"
                      >
                        All Services Overview
                      </button>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        onClick={() => {
                          onNavigate('services');
                          setServicesDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg"
                      >
                        Residential Rooftop Solar
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('services');
                          setServicesDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg"
                      >
                        Commercial & Corporate Solar
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('services');
                          setServicesDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg"
                      >
                        Industrial Mega Projects
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('services');
                          setServicesDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg"
                      >
                        Agriculture Solar Pumps
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('services');
                          setServicesDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg"
                      >
                        ⚡ Battery Energy Storage (BESS)
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action Buttons & Quick Tools */}
          <div className="hidden xl:flex items-center gap-2 2xl:gap-3 shrink-0">
            {/* Phone Link */}
            <a
              href={`tel:${settings.phone1.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 text-xs 2xl:text-sm font-bold py-2 px-2.5 2xl:px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/80 transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{settings.phone1}</span>
            </a>

            {/* Get Free Quote Button */}
            <button
              onClick={onOpenQuoteModal}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs 2xl:text-sm px-4 2xl:px-5 py-2.5 rounded-full shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <Calculator className="w-4 h-4 shrink-0" />
              Get Free Quote
            </button>
          </div>

          {/* Mobile/Tablet Menu Button */}
          <div className="flex items-center gap-2 xl:hidden shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{item.label}</span>
              {item.highlight && (
                <span className="text-xs bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full">
                  Govt Subsidy
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 border-t border-slate-200 space-y-3">
            <a
              href={`tel:${settings.phone1.replace(/\s+/g, '')}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-slate-800 font-bold text-sm"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              Call {settings.phone1}
            </a>

            <button
              onClick={() => {
                onOpenQuoteModal();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm py-3 rounded-xl shadow-md text-center"
            >
              Request Free Instant Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
