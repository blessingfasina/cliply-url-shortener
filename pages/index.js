// pages/index.js
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { FaLink, FaChartBar, FaBolt } from 'react-icons/fa';

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const shortenUrl = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to shorten URL");
      }
      
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5]">
      <Head>
        <title>Cliply - Shorten URLs Instantly</title>
        <meta name="description" content="Fast, branded, and trackable links" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-[#7D3C98] text-4xl mr-2">@</span>
          <span className="text-white text-3xl font-bold">Cliply</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-[#7D3C98]">Sign up</a></li>
            <li><a href="#" className="hover:text-[#7D3C98]">Log in</a></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        <section className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Shorten URLs with <span className="text-[#7D3C98]">Cliply</span>
          </h1>
          <p className="text-xl mb-12 max-w-2xl">
            Simplify your links, track analytics, and optimize sharing.
          </p>

          <form onSubmit={shortenUrl} className="w-full max-w-4xl flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter a long URL"
              className="flex-grow p-4 rounded-xl bg-[#1E1E50] border border-[#7D3C98] focus:outline-none focus:ring-2 focus:ring-[#00D4FF] text-white"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#7D3C98] hover:bg-[#6A0DAD] text-white font-bold py-4 px-8 rounded-xl transition-colors"
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </button>
          </form>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {shortUrl && (
            <div className="bg-[#1E1E50] p-6 rounded-xl mb-12 w-full max-w-4xl">
              <p className="mb-2 text-[#00D4FF] font-medium">Your shortened URL:</p>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-grow p-3 rounded-lg bg-[#121212] border border-[#7D3C98] text-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-[#32CD32] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-[#1E1E50]/30 p-8 rounded-xl text-center">
            <div className="bg-[#1E1E50] inline-block p-4 rounded-xl mb-4">
              <FaLink className="text-[#7D3C98] text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Branded Links</h2>
            <p>Create custom short links with your own domain.</p>
          </div>

          <div className="bg-[#1E1E50]/30 p-8 rounded-xl text-center">
            <div className="bg-[#1E1E50] inline-block p-4 rounded-xl mb-4">
              <FaChartBar className="text-[#00D4FF] text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Analytics</h2>
            <p>Gain insights with detailed click tracking.</p>
          </div>

          <div className="bg-[#1E1E50]/30 p-8 rounded-xl text-center">
            <div className="bg-[#1E1E50] inline-block p-4 rounded-xl mb-4">
              <FaBolt className="text-[#00D4FF] text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Fast Redirection</h2>
            <p>Direct users to their destinations instantly.</p>
          </div>
        </section>
      </main>

      <footer className="bg-[#1E1E50] py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Cliply. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}