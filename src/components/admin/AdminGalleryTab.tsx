import React from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../../types';

interface AdminGalleryTabProps {
  gallery: GalleryItem[];
  onStartCreate: () => void;
  onStartEdit: (item: GalleryItem) => void;
  onDeleteRequest: (id: string, title: string) => void;
}

export const AdminGalleryTab: React.FC<AdminGalleryTabProps> = ({
  gallery,
  onStartCreate,
  onStartEdit,
  onDeleteRequest
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            Installation Gallery Showcase ({gallery.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            High-resolution site photos of residential, commercial, industrial solar structures and inverter setups.
          </p>
        </div>

        <button
          onClick={onStartCreate}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gallery Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-48 rounded-2xl overflow-hidden bg-slate-200 relative">
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-amber-400 font-bold text-[10px] px-2.5 py-1 rounded-full border border-amber-500/30">
                  {item.category}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 font-poppins line-clamp-1">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.caption}</p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end gap-2 text-xs font-bold">
              <button
                onClick={() => onStartEdit(item)}
                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                title="Edit Photo"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteRequest(item.id, item.title)}
                className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                title="Delete Photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
