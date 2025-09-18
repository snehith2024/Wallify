
import React from 'react';
import type { User, Wallpaper } from '../types';
import { DownloadIcon, TrashIcon } from './icons';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  currentUser: User | null;
  onDelete: (wallpaperId: string) => void;
  onDownload: (wallpaperId: string) => void;
}

const WallpaperCard: React.FC<WallpaperCardProps> = ({ wallpaper, currentUser, onDelete, onDownload }) => {
  const canDelete = currentUser && (currentUser.isAdmin || currentUser.id === wallpaper.uploaderId);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(wallpaper.id);
    const link = document.createElement('a');
    link.href = wallpaper.imageUrl;
    link.download = `${wallpaper.name.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm(`Are you sure you want to delete "${wallpaper.name}"?`)) {
          onDelete(wallpaper.id);
      }
  }

  return (
    <div
      className="group aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden relative cursor-pointer"
    >
      <img src={wallpaper.imageUrl} alt={wallpaper.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="font-semibold truncate">{wallpaper.name}</h3>
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
                <p className="text-xs text-gray-300">{wallpaper.category}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400" title={`${wallpaper.downloadCount.toLocaleString()} downloads`}>
                    <DownloadIcon className="w-3 h-3" />
                    <span>{wallpaper.downloadCount.toLocaleString()}</span>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={handleDownload} className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm transition-colors" title="Download">
                    <DownloadIcon className="w-4 h-4" />
                </button>
                {canDelete && (
                    <button onClick={handleDelete} className="p-1.5 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 backdrop-blur-sm transition-colors" title="Delete">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperCard;