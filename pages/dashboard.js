// pages/dashboard.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FaLink, FaTrash, FaCopy, FaChartLine } from 'react-icons/fa';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      setUser(session.user);
      fetchUrls(session.user.id);
    };
    
    checkUser();
  }, [router]);

  const fetchUrls = async (userId) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('urls')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setUrls(data || []);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  const shortenUrl = async (e) => {
    e.preventDefault();
    
    if (!newUrl) return;
    
    try {
      const { data, error } = await supabase.rpc('create_short_url', {
        url: newUrl,
        user_id: user.id
      });
      
      if (error) throw error;
      
      fetchUrls(user.id);
      setNewUrl('');
    } catch (error) {
      console.error('Error shortening URL:', error);
      alert('Failed to shorten URL');
    }
  };

  const deleteUrl = async (id) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;
    
    try {
      const { error } = await supabase
        .from('urls')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      fetchUrls(user.id);
      if (selectedUrl && selectedUrl.id === id) {
        setSelectedUrl(null);
        setAnalyticsData([]);
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
      alert('Failed to delete URL');
    }
  };

  const copyToClipboard = (shortId) => {
    const baseUrl = window.location.origin;
    const shortUrl = `${baseUrl}/${shortId}`;
    
    navigator.clipboard.writeText(shortUrl);
    alert('Copied to clipboard!');
  };

  const viewAnalytics = async (url) => {
    setSelectedUrl(url);
    
    try {
      // Fetch click data for this URL
      const { data, error } = await supabase
        .from('clicks')
        .select('*')
        .eq('url_id', url.id)
        .order('clicked_at', { ascending: true });
        
      if (error) throw error;
      
      // Process data for charts
      const clicksByDay = {};
      const clicksByCountry = {};
      
      data.forEach(click => {
        // Format date to YYYY-MM-DD
        const date = new Date(click.clicked_at).toISOString().split('T')[0];
        clicksByDay[date] = (clicksByDay[date] || 0) + 1;
        
        // Count by country
        const country = click.country || 'Unknown';
        clicksByCountry[country] = (clicksByCountry[country] || 0) + 1;
      });
      
      // Convert to array format for charts
      const dailyData = Object.keys(clicksByDay).map(date => ({
        date,
        clicks: clicksByDay[date]
      }));
      
      const countryData = Object.keys(clicksByCountry).map(country => ({
        country,
        clicks: clicksByCountry[country]
      }));
      
      setAnalyticsData({
        daily: dailyData,
        country: countryData,
        totalClicks: data.length
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      alert('Failed to load analytics');
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5]">
      <Head>
        <title>Cliply - Dashboard</title>
      </Head>

      <header className="bg-[#1E1E50] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-[#7D3C98] text-3xl mr-2">@</span>
            <span className="text-white text-2xl font-bold">Cliply</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">{user?.email}</span>
            <button 
              onClick={signOut}
              className="text-white hover:text-[#00D4FF]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        
        {/* URL Shortener Form */}
        <div className="bg-[#1E1E50]/30 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Short URL</h2>
          <form onSubmit={shortenUrl} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Enter a long URL"
              className="flex-grow p-3 rounded-lg bg-[#1E1E50] border border-[#7D3C98] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
            />
            <button
              type="submit"
              className="bg-[#7D3C98] hover:bg-[#6A0DAD] text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Shorten
            </button>
          </form>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* URLs List */}
          <div className="md:col-span-1 bg-[#1E1E50]/30 p-6 rounded-xl h-[600px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Your URLs</h2>
            
            {loading ? (
              <p>Loading...</p>
            ) : urls.length === 0 ? (
              <p>You haven't created any short URLs yet.</p>
            ) : (
              <ul className="space-y-4">
                {urls.map(url => (
                  <li key={url.id} className="bg-[#1E1E50] p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-[#00D4FF]">/{url.short_id}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(url.short_id)}
                          className="text-gray-300 hover:text-white"
                          title="Copy URL"
                        >
                          <FaCopy />
                        </button>
                        <button
                          onClick={() => viewAnalytics(url)}
                          className="text-gray-300 hover:text-white"
                          title="View Analytics"
                        >
                          <FaChartLine />
                        </button>
                        <button
                          onClick={() => deleteUrl(url.id)}
                          className="text-gray-300 hover:text-red-500"
                          title="Delete URL"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{url.original_url}</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{url.click_count} clicks</span>
                      <span>{new Date(url.created_at).toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Analytics */}
          <div className="md:col-span-2 bg-[#1E1E50]/30 p-6 rounded-xl h-[600px] overflow-y-auto">
            {selectedUrl ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Analytics for /{selectedUrl.short_id}</h2>
                  <button
                    onClick={() => setSelectedUrl(null)}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-1">Original URL:</p>
                  <p className="text-[#00D4FF] break-all">{selectedUrl.original_url}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#1E1E50] p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Total Clicks</p>
                    <p className="text-3xl font-bold text-white">{selectedUrl.click_count}</p>
                  </div>
                  <div className="bg-[#1E1E50] p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Creation Date</p>
                    <p className="text-xl font-bold text-white">{new Date(selectedUrl.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-[#1E1E50] p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Last Clicked</p>
                    <p className="text-xl font-bold text-white">
                      {selectedUrl.last_clicked_at 
                        ? new Date(selectedUrl.last_clicked_at).toLocaleDateString() 
                        : 'Never'}
                    </p>
                  </div>
                </div>
                
                {analyticsData.daily && analyticsData.daily.length > 0 ? (
                  <>
                    <h3 className="font-bold mb-3">Clicks Over Time</h3>
                    <div className="h-64 mb-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.daily}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="date" stroke="#F5F5F5" />
                          <YAxis stroke="#F5F5F5" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1E1E50', borderColor: '#7D3C98' }} 
                            labelStyle={{ color: '#F5F5F5' }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="clicks" 
                            stroke="#7D3C98" 
                            activeDot={{ r: 8 }} 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <h3 className="font-bold mb-3">Clicks by Country</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.country}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="country" stroke="#F5F5F5" />
                          <YAxis stroke="#F5F5F5" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1E1E50', borderColor: '#00D4FF' }} 
                            labelStyle={{ color: '#F5F5F5' }}
                          />
                          <Legend />
                          <Bar dataKey="clicks" fill="#00D4FF" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <p>No click data available yet.</p>
                    <p className="text-sm mt-2">Statistics will appear after your link gets some clicks.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FaChartLine className="text-[#7D3C98] text-5xl mb-4" />
                <h2 className="text-xl font-bold mb-2">Analytics Dashboard</h2>
                <p className="text-gray-400 max-w-md">
                  Select a URL from the list to view detailed analytics including click counts, geographic distribution, and more.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#1E1E50] py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Cliply. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-1">Premium URL shortening service</p>
        </div>
      </footer>
    </div>
  );
}