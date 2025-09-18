
import React, { useState } from 'react';
import type { User, Wallpaper, Page } from '../types';
import { LogoutIcon, HomeIcon, UploadIcon, AdminIcon, UserCircleIcon, LogoIcon } from './icons';
import WallpaperGrid from './WallpaperGrid';
import UploadModal from './UploadModal';

interface DashboardPageProps {
  user: User;
  wallpapers: Wallpaper[];
  onUpload: (wallpaperData: Omit<Wallpaper, 'id' | 'downloadCount' | 'imageUrl' | 'createdAt'>, imageFile: File) => Promise<void>;
  onDelete: (wallpaperId: string) => void;
  onDownload: (wallpaperId: string) => void;
  navigate: (page: Page) => void;
  handleLogout: () => void;
}

const Header: React.FC<{
    user: User,
    navigate: (page: Page) => void;
    handleLogout: () => void;
    onUploadClick: () => void;
}> = ({ user, navigate, handleLogout, onUploadClick }) => (
  <header className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-b border-gray-800 z-20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-8">
          <button onClick={() => navigate('home')} className="flex items-center gap-2 text-2xl font-bold text-white transition-opacity hover:opacity-80">
            <LogoIcon />
            <span>Wallify</span>
          </button>
          <div className="flex items-center gap-2 text-gray-300">
            {user.isAdmin ? <AdminIcon /> : <UserCircleIcon />}
            <span className="text-sm font-medium">{user.isAdmin ? 'Admin Dashboard' : 'My Profile'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('home')} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
            <HomeIcon /> Home
          </button>
          <button onClick={onUploadClick} className="flex items-center gap-2 py-2 px-4 bg-white text-black text-sm font-semibold rounded-md hover:bg-gray-200 transition-colors">
            <UploadIcon /> Upload
          </button>
           <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors" title="Logout">
             <LogoutIcon />
           </button>
        </div>
      </div>
    </div>
  </header>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ user, wallpapers, onUpload, onDelete, onDownload, navigate, handleLogout }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const userWallpapers = user.isAdmin ? wallpapers : wallpapers.filter(w => w.uploaderId === user.id);

  const handleUploadSubmit = async (wallpaperData: Omit<Wallpaper, 'id' | 'downloadCount' | 'imageUrl' | 'createdAt'>, imageFile: File) => {
    await onUpload(wallpaperData, imageFile);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header 
        user={user} 
        navigate={navigate} 
        handleLogout={handleLogout} 
        onUploadClick={() => setIsUploadModalOpen(true)} 
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h2 className="text-3xl font-bold mb-8">{user.isAdmin ? 'All Wallpapers' : 'My Uploads'} ({userWallpapers.length})</h2>
        <WallpaperGrid wallpapers={userWallpapers} currentUser={user} onDelete={onDelete} onDownload={onDownload} />
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-900">
        Wallify © {new Date().getFullYear()}
      </footer>
      {isUploadModalOpen && (
        <UploadModal 
          onClose={() => setIsUploadModalOpen(false)} 
          onSubmit={handleUploadSubmit} 
          uploaderId={user.id} 
        />
      )}
    </div>
  );
};

export default DashboardPage;
