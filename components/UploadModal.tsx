import React, { useState } from 'react';
import { Wallpaper } from '../types';
import { CATEGORIES } from '../constants';
import { CloseIcon } from './icons';

interface UploadModalProps {
  onClose: () => void;
  onSubmit: (wallpaperData: Omit<Wallpaper, 'id' | 'downloadCount' | 'imageUrl' | 'createdAt'>, imageFile: File) => Promise<void>;
  uploaderId: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onSubmit, uploaderId }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]); // Default to 'Nature'
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !imageFile) {
      alert('Please fill all fields and select an image.');
      return;
    }
    setIsUploading(true);
    try {
      await onSubmit({
        name,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        uploaderId,
      }, imageFile);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#111] border border-gray-800 rounded-lg shadow-lg p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors" disabled={isUploading}>
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white">Upload Wallpaper</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400">Image File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
                ) : (
                  <svg className="mx-auto h-12 w-12 text-gray-600" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <div className="flex text-sm text-gray-500">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-white hover:text-gray-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-white px-2">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={isUploading} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-400">Name</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-white" disabled={isUploading} />
          </div>

          <div>
            <label htmlFor="category" className="text-sm font-medium text-gray-400">Category</label>
            <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-white" disabled={isUploading}>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="text-sm font-medium text-gray-400">Tags (comma separated)</label>
            <input id="tags" type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-white" disabled={isUploading} />
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors" disabled={isUploading}>
              Cancel
            </button>
            <button type="submit" className="py-2 px-4 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;