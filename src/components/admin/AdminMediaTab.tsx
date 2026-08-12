import React, { useState, useEffect } from 'react';
import { Upload, Folder, Copy, Trash2, Check, Image as ImageIcon, ExternalLink, RefreshCw } from 'lucide-react';
import { uploadMediaFile, fetchMediaList, deleteMediaFile, notifyDataUpdated } from '../../services/api';

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  uploadedAt: string;
}

interface AdminMediaTabProps {
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const AdminMediaTab: React.FC<AdminMediaTabProps> = ({ showToast }) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await fetchMediaList();
      setAssets(data.map((item, index) => ({
        id: item.name || `media-${index}`,
        name: item.name,
        url: item.url,
        sizeBytes: item.size || 0,
        uploadedAt: item.createdAt || new Date().toISOString()
      })));
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch media assets', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm(`CONFIRMATION: Are you sure you want to upload media file "${file.name}"?`)) {
      return;
    }

    setUploading(true);
    try {
      await uploadMediaFile(file);
      showToast(`Media file ${file.name} uploaded successfully!`);
      notifyDataUpdated();
      loadAssets();
    } catch (err: any) {
      showToast(err.message || 'Failed to upload media asset', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (filename: string) => {
    if (!window.confirm(`CONFIRMATION: Are you sure you want to permanently delete media asset "${filename}"?`)) {
      return;
    }
    try {
      await deleteMediaFile(filename);
      showToast(`Media asset ${filename} deleted.`);
      notifyDataUpdated();
      loadAssets();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete asset', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins flex items-center gap-2">
            <Folder className="w-6 h-6 text-emerald-500" />
            Media & Asset Library ({assets.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Upload and copy CDN image URLs for hero slides, services, solar products, and blog posts.
          </p>
        </div>

        <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading Asset...' : 'Upload New Asset'}</span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="rounded-3xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-40 rounded-2xl overflow-hidden bg-slate-200 relative group">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <ExternalLink className="w-6 h-6" />
                </a>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-900 truncate font-mono">
                  {asset.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {(asset.sizeBytes / 1024).toFixed(1)} KB • {new Date(asset.uploadedAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopyUrl(asset.url, asset.id)}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedId === asset.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDelete(asset.name)}
                className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                title="Delete Media Asset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {assets.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            No media assets uploaded yet. Click "Upload New Asset" to upload pictures.
          </div>
        )}
      </div>
    </div>
  );
};
