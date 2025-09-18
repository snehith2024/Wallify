import React, { useState } from 'react';
import type { Page } from '../types';
import { EyeIcon, EyeSlashIcon, GoogleIcon, LogoIcon } from './icons';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  navigate: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoogleLogin, navigate }) => {
  const [email, setEmail] = useState('user@wallify.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    await onLogin(email, password);
    setIsLoggingIn(false);
  };
  
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    await onGoogleLogin();
    setIsLoggingIn(false);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 relative">
        <button onClick={() => navigate('home')} className="absolute top-4 left-4 flex items-center gap-2 text-2xl font-bold text-white transition-opacity hover:opacity-80">
            <LogoIcon />
            <span>Wallify</span>
        </button>
        <div className="w-full max-w-sm bg-[#111] p-8 rounded-lg border border-gray-800">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Login</h1>
                <p className="text-gray-400 text-sm mt-1">Enter your email below to login to your account.</p>
            </div>

            <button 
             onClick={handleGoogleLogin}
             disabled={isLoggingIn}
             className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 rounded-md border border-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <GoogleIcon />
                <span className="text-sm font-medium">Continue with Google</span>
            </button>
            
            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink mx-4 text-xs text-gray-500 uppercase">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-400" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-white"
                            placeholder="user@wallify.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400" htmlFor="password">
                            Password
                        </label>
                         <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-white"
                                required
                            />
                             <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-300"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>
                </div>
                <button type="submit" disabled={isLoggingIn} className="w-full mt-6 py-2.5 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoggingIn ? 'Logging in...' : 'Login'}
                </button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
                Hint: use user@wallify.com / password123 or admin@wallify.com / adminpassword
            </p>

            <p className="text-center text-sm text-gray-400 mt-8">
                Don't have an account? <a href="#" className="font-medium text-white hover:underline">Sign up</a>
            </p>
        </div>
    </div>
  );
};

export default LoginPage;