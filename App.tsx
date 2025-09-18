import React, { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  Unsubscribe,
} from 'firebase/auth';
import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  increment,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

import { auth, db, googleProvider, storage } from './firebase';

import type { User, Wallpaper, Page } from './types';

import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('home');
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    let authUnsubscribe: Unsubscribe | undefined;
    let wallpapersUnsubscribe: Unsubscribe | undefined;

    const initializeApp = async () => {
      try {
        // Health check to detect connection issues early before setting up listeners.
        await getDoc(doc(db, "__healthcheck", "1"));

        // If connection is successful, set up real-time listeners.
        authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              setCurrentUser({ id: userDoc.id, ...userDoc.data() } as User);
              if (page === 'login') {
                setPage('home');
              }
            } else {
              console.warn(`User document not found for uid: ${firebaseUser.uid}`);
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
          setIsLoading(false);
        });

        const q = query(collection(db, "wallpapers"), orderBy("createdAt", "desc"));
        wallpapersUnsubscribe = onSnapshot(q, (querySnapshot) => {
          const wallpapersData: Wallpaper[] = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          } as Wallpaper));
          setWallpapers(wallpapersData);
        }, (error) => {
           console.error("Firestore snapshot error:", error);
           setConnectionError(true);
           setIsLoading(false);
        });

      } catch (error) {
        // This catch block handles the initial connection failure
        console.error("Failed to connect to Firebase. Check Firestore setup and security rules.");
        setConnectionError(true);
        setIsLoading(false);
      }
    };

    initializeApp();

    // Cleanup function to unsubscribe listeners when the component unmounts
    return () => {
      if (authUnsubscribe) authUnsubscribe();
      if (wallpapersUnsubscribe) wallpapersUnsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only once.

  const navigate = (newPage: Page) => {
    if ((newPage === 'profile' || newPage === 'admin') && !currentUser) {
      setPage('login');
    } else {
      setPage(newPage);
    }
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login. Check your credentials.");
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google login error:", error);
      alert("Failed to login with Google.");
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setPage('home');
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout.");
    }
  };

  const handleUpload = async (wallpaperData: Omit<Wallpaper, 'id' | 'downloadCount' | 'imageUrl' | 'createdAt'>, imageFile: File): Promise<void> => {
    if (!currentUser) {
      alert("You must be logged in to upload.");
      return;
    }
    try {
      const storageRef = ref(storage, `wallpapers/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      await addDoc(collection(db, "wallpapers"), {
        ...wallpaperData,
        imageUrl,
        downloadCount: 0,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload wallpaper.");
    }
  };

  const handleDelete = async (wallpaperId: string): Promise<void> => {
    try {
      const wallpaperDocRef = doc(db, "wallpapers", wallpaperId);
      const wallpaperDoc = await getDoc(wallpaperDocRef);

      if (wallpaperDoc.exists()) {
        const imageUrl = wallpaperDoc.data().imageUrl;
        if (imageUrl) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef).catch(err => console.error("Error deleting file from storage:", err));
        }
        await deleteDoc(wallpaperDocRef);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete wallpaper.");
    }
  };

  const handleDownload = async (wallpaperId: string): Promise<void> => {
    try {
      const wallpaperDocRef = doc(db, "wallpapers", wallpaperId);
      await updateDoc(wallpaperDocRef, {
        downloadCount: increment(1),
      });
    } catch (error) {
      console.error("Error updating download count:", error);
    }
  };
  
  if (connectionError) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#111] p-8 rounded-lg border border-red-500/50 text-center">
                <h1 className="text-2xl font-bold text-red-400 mb-4">Connection to Database Failed</h1>
                <p className="text-gray-300 mb-6">This usually happens for one of two reasons in a new Firebase project:</p>
                <div className="text-left space-y-6">
                    <div>
                        <h2 className="font-semibold text-lg text-white mb-2">1. Firestore Database Not Created</h2>
                        <p className="text-gray-400 text-sm mb-3">You need to create a Firestore database in your Firebase project console.</p>
                        <a href="https://console.firebase.google.com/project/wallify-24bff/firestore" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                            Create Firestore Database
                        </a>
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg text-white mb-2">2. Restrictive Security Rules</h2>
                        <p className="text-gray-400 text-sm mb-3">By default, nobody can read/write to your database. For development, go to the "Rules" tab in Firestore and allow access.</p>
                        <pre className="bg-gray-900 p-4 rounded-md text-sm text-left text-yellow-300 overflow-x-auto">
                            <code>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                            </code>
                        </pre>
                         <p className="text-xs text-gray-500 mt-2"><strong>Note:</strong> These rules are for development only. Secure your database before production.</p>
                    </div>
                </div>
                 <button onClick={() => window.location.reload()} className="mt-8 bg-white text-black font-bold py-2 px-6 rounded hover:bg-gray-200 transition-colors">
                    I've fixed it, try again
                </button>
            </div>
        </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold text-xl">
        <div className="flex items-center gap-2">
            Loading Wallify...
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} navigate={navigate} />;
      case 'profile':
      case 'admin':
        if (!currentUser) {
          return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} navigate={navigate} />;
        }
        return (
          <DashboardPage
            user={currentUser}
            wallpapers={wallpapers}
            onUpload={handleUpload}
            onDelete={handleDelete}
            onDownload={handleDownload}
            navigate={navigate}
            handleLogout={handleLogout}
          />
        );
      case 'home':
      default:
        return (
          <HomePage
            wallpapers={wallpapers}
            currentUser={currentUser}
            navigate={navigate}
            handleLogout={handleLogout}
            onDownload={handleDownload}
          />
        );
    }
  };

  return <>{renderPage()}</>;
};

export default App;
