import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Building2, MapPin, Phone, Mail, HelpCircle } from 'lucide-react';
import { AppSettings } from '../../types';
import { updateSettings, notifyDataUpdated } from '../../services/api';

interface AdminSettingsTabProps {
  settings: AppSettings | null;
  setSettingsState: (s: AppSettings) => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  setSettingsState,
  showToast
}) => {
  if (!settings) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
        Loading site settings...
      </div>
    );
  }

  const [formData, setFormData] = useState<AppSettings>(settings);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to save and update company & website settings?')) {
      return;
    }
    try {
      await updateSettings(formData);
      setSettingsState(formData);
      showToast('Website Settings & Company Info updated successfully!');
      notifyDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-amber-500" />
            Website Info & Company Settings
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Update company branding, contact numbers, address, DISCOM coverage, announcement bar, and SEO settings.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Branding & Headline */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-amber-500" />
            Company Branding & Meta Titles
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Trade Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">SEO Title Tag</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">SEO Meta Description</label>
              <input
                type="text"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Numbers & Emails */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Phone className="w-4 h-4 text-emerald-500" />
            Official Contact Numbers & Channels
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Phone 1</label>
              <input
                type="text"
                value={formData.phone1}
                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Secondary Phone 2</label>
              <input
                type="text"
                value={formData.phone2}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Number (Digits Only)</label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-mono text-emerald-600 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Working Operating Hours</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Headquarters Address & Google Maps Embed */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            Headquarters Address & Map Location
          </h4>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Postal Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Google Maps iFrame Embed URL</label>
            <input
              type="text"
              value={formData.googleMapsEmbedUrl}
              onChange={(e) => setFormData({ ...formData, googleMapsEmbedUrl: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Section 4: Announcement Bar */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            Top Announcement Banner Bar
          </h4>

          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <input
              type="checkbox"
              id="showAnnouncementBar"
              checked={formData.showAnnouncementBar}
              onChange={(e) => setFormData({ ...formData, showAnnouncementBar: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="showAnnouncementBar" className="font-bold text-slate-900 cursor-pointer select-none">
              Display Announcement Banner Bar on Top Header
            </label>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Banner Announcement Text</label>
            <input
              type="text"
              value={formData.announcementBarText}
              onChange={(e) => setFormData({ ...formData, announcementBarText: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
