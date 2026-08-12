import React from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Video } from 'lucide-react';
import { HeroSlide } from '../../types';

interface AdminHeroSlidesTabProps {
  slides: HeroSlide[];
  onStartCreate: () => void;
  onStartEdit: (slide: HeroSlide) => void;
  onDeleteRequest: (id: string, title: string) => void;
}

export const AdminHeroSlidesTab: React.FC<AdminHeroSlidesTabProps> = ({
  slides,
  onStartCreate,
  onStartEdit,
  onDeleteRequest
}) => {
  const sortedSlides = [...slides].sort((a, b) => (a.order || 1) - (b.order || 1));

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            Hero Homepage Slideshow Manager ({slides.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Customize the primary hero carousel slides, video backgrounds, headline badges, and call-to-action buttons.
          </p>
        </div>

        <button
          onClick={onStartCreate}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedSlides.map((slide) => (
          <div
            key={slide.id}
            className="rounded-3xl border border-slate-200 bg-slate-50/50 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Media Banner */}
            <div className="relative h-48 bg-slate-950 overflow-hidden">
              {slide.mediaType === 'video' ? (
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 z-10">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-lg">
                      <Video className="w-3.5 h-3.5" /> Video Background
                    </span>
                  </div>
                  {slide.mediaUrl.includes('youtube.com') || slide.mediaUrl.includes('youtu.be') ? (
                    <img
                      src={`https://img.youtube.com/vi/${
                        slide.mediaUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/)?.[2] || ''
                      }/hqdefault.jpg`}
                      alt={slide.title}
                      className="w-full h-full object-cover opacity-60"
                    />
                  ) : (
                    <video src={slide.mediaUrl} className="w-full h-full object-cover opacity-60" />
                  )}
                </div>
              ) : (
                <img
                  src={slide.mediaUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Order Badge */}
              <div className="absolute top-3 left-3 z-20">
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 font-black text-xs border border-amber-500/30">
                  Priority #{slide.order || 1}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                {slide.badge && (
                  <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                    {slide.badge}
                  </span>
                )}
                <h4 className="font-bold text-base text-slate-900 font-poppins leading-snug">
                  {slide.title}
                </h4>
                {slide.subtitle && (
                  <p className="text-xs text-slate-600 line-clamp-2">{slide.subtitle}</p>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">CTA Target:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase text-[10px]">
                    {slide.ctaPrimaryAction}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartEdit(slide)}
                    className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                    title="Edit Slide"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteRequest(slide.id, slide.title)}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {slides.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            No hero slides found. Click "Add New Slide" to create your first hero carousel banner.
          </div>
        )}
      </div>
    </div>
  );
};
