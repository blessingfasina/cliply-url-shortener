// pages/login.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isLogin) {
        // Handle login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        router.push('/dashboard');
      } else {
        // Handle signup
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        
        if (error) throw error;
        
        setIsLogin(true);
        setError('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex flex-col">
      <Head>
        <title>Cliply - {isLogin ? 'Log In' : 'Sign Up'}</title>
      </Head>
      
      <header className="p-4">
        <div className="container mx-auto">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <span className="text-[#7D3C98] text-3xl mr-2">@</span>
              <span className="text-white text-2xl font-bold">Cliply</span>
            </div>
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-[#1E1E50]/70 p-8 rounded-xl w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? 'Log in to your account' : 'Create a new account'}
          </h1>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-white p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#121212] border border-[#7D3C98] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#121212] border border-[#7D3C98] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                placeholder="Your password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7D3C98] hover:bg-[#6A0DAD] text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#00D4FF] hover:underline"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </main>
      
      <footer className="bg-[#1E1E50] py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Cliply. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}