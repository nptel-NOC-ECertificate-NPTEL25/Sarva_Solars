import React from 'react';
import { Menu, Key, Folder, CheckCircle2, AlertCircle } from 'lucide-react';
import { User } from '../../types';

interface AdminHeaderProps {
  activeTabTitle: string;
  user: User;
  onOpenMobileMenu: () => void;
  onNavigateToMedia: () => void;
  onOpenCredModal: () => void;
  actionMsg: { text: string; type: 'success' | 'error' } | null;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTabTitle,
  user,
  onOpenMobileMenu,
  onNavigateToMedia,
  onOpenCredModal,
  actionMsg
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-poppins capitalize">
            {activeTabTitle}
          </h2>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Sarva Group Live Management Portal & Central CMS
          </p>
        </div>
      </div>

      {/* Action Msg Toast Display */}
      {actionMsg && (
        <div
          className={`hidden sm:flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full border shadow-sm animate-fadeIn ${
            actionMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {actionMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Top Header Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onNavigateToMedia}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5"
          title="Open Media Asset Manager"
        >
          <Folder className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Media Library</span>
        </button>

        <button
          onClick={onOpenCredModal}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          <Key className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Account Credentials</span>
        </button>
      </div>
    </header>
  );
};
