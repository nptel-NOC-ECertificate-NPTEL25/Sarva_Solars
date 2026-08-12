import React from 'react';
import { Plus, Edit2, Trash2, BookOpen, Calendar, Clock, User } from 'lucide-react';
import { BlogArticle } from '../../types';

interface AdminBlogsTabProps {
  blogs: BlogArticle[];
  onStartCreate: () => void;
  onStartEdit: (blog: BlogArticle) => void;
  onDeleteRequest: (id: string, title: string) => void;
}

export const AdminBlogsTab: React.FC<AdminBlogsTabProps> = ({
  blogs,
  onStartCreate,
  onStartEdit,
  onDeleteRequest
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            Solar Blog & Knowledge Guides ({blogs.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Articles on PM Surya Ghar guidelines, net metering procedures in AP/TS, solar ROI calculations, and maintenance tips.
          </p>
        </div>

        <button
          onClick={onStartCreate}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-40 rounded-2xl overflow-hidden bg-slate-200 relative">
                <img
                  src={blog.imageUrl || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80'}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-amber-400 font-bold text-[10px] px-2.5 py-1 rounded-full border border-amber-500/30">
                  {blog.category}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-base text-slate-900 font-poppins line-clamp-2">
                  {blog.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{blog.excerpt}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-amber-500" /> {blog.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {blog.readTime}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
              <span className="text-[11px] text-slate-400 font-mono">{blog.publishedAt}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartEdit(blog)}
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                  title="Edit Blog"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteRequest(blog.id, blog.title)}
                  className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                  title="Delete Blog"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
