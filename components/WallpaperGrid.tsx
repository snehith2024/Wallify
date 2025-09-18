
import React from 'react';
import type { User, Wallpaper } from '../types';
import WallpaperCard from './WallpaperCard';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  currentUser: User | null;
  onDelete: (wallpaperId: string) => void;
  onDownload: (wallpaperId: string) => void;
}

const WallpaperGrid: React.FC<WallpaperGridProps> = ({ wallpapers, currentUser, onDelete, onDownload }) => {
  if (wallpapers.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">No wallpapers found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard
          key={wallpaper.id}
          wallpaper={wallpaper}
          currentUser={currentUser}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
};

export default WallpaperGrid;