
import React, { useState } from 'react';
import type { User, Wallpaper, Page } from '../types';
import { CATEGORIES } from '../constants';
import { SearchIcon, LogoutIcon, UserCircleIcon, AdminIcon, LogoIcon } from './icons';
import WallpaperGrid from './WallpaperGrid';

interface HomePageProps {
  wallpapers: Wallpaper[];
  currentUser: User | null;
  navigate: (page: Page) => void;
  handleLogout: () => void;
  onDownload: (wallpaperId: string) => void;
}

interface HeaderProps {
  currentUser: User | null;
  navigate: (page: Page) => void;
  handleLogout: () => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  currentUser,
  navigate,
  handleLogout,
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}) => (
  <header className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-b border-gray-800 z-10">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-8">
          <button onClick={() => navigate('home')} className="flex items-center gap-2 text-2xl font-bold text-white transition-opacity hover:opacity-80">
            <LogoIcon />
            <span>Wallify</span>
          </button>
          <nav className="hidden md:flex space-x-6">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`text-sm font-medium ${
                  category === activeCategory ? 'text-white' : 'text-gray-400'
                } hover:text-white transition-colors`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
          {currentUser && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(currentUser.isAdmin ? 'admin' : 'profile')}
                className="flex items-center space-x-2 text-sm hover:text-white transition-colors text-gray-300"
                title={currentUser.isAdmin ? "Admin Dashboard" : "My Profile"}
              >
                {currentUser.isAdmin ? <AdminIcon /> : <UserCircleIcon />}
                <span>{currentUser.email}</span>
              </button>
              <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors" title="Logout">
                <LogoutIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
);

const HomePage: React.FC<HomePageProps> = ({ wallpapers, currentUser, navigate, handleLogout, onDownload }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWallpapers = wallpapers.filter((wallpaper) => {
    const categoryMatch = activeCategory === 'All' || wallpaper.category === activeCategory;
    const searchMatch =
      searchTerm === '' ||
      wallpaper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallpaper.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-black">
      <Header
        currentUser={currentUser}
        navigate={navigate}
        handleLogout={handleLogout}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <WallpaperGrid wallpapers={filteredWallpapers} currentUser={currentUser} onDelete={() => {}} onDownload={onDownload} />
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-900">
        Wallify © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default HomePage;
