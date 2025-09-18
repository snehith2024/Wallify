export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  password?: string;
}

export interface Wallpaper {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  tags: string[];
  uploaderId: string;
  downloadCount: number;
  createdAt: any; // Firestore Timestamp
}

export type Page = 'login' | 'home' | 'profile' | 'admin';
