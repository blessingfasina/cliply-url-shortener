// pages/index.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

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
    <div className="min-h-screen bg-background text-text">
      <Head>
        <title>Cliply - Shorten URLs Instantly</title>
        <meta name="description" content="Fast, branded, and trackable links" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="border-b border-secondary/20">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <span className="text-primary text-3xl mr-2">@</span>
            <span className="text-white text-3xl font-bold">Cliply</span>
          </div>
          <nav className="mt-4 md:mt-0">
            <ul className="flex gap-8">
              <li>
                <Link href="/signup" className="hover:text-primary transition-colors">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Log in
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Shorten URLs with{" "}
            <span className="text-primary">Cliply</span>
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
            Simplify your links, track analytics, and optimize sharing.
          </p>

          {/* URL Input Form */}
          <form onSubmit={shortenUrl} className="flex flex-col md:flex-row max-w-3xl mx-auto mb-6">
            <div className="flex-grow">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter a long URL"
                className="w-full p-4 bg-secondary border-2 border-secondary text-white rounded-t-xl md:rounded-l-xl md:rounded-r-none focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-button-hover text-white font-bold py-4 px-8 rounded-b-xl md:rounded-r-xl md:rounded-l-none transition-colors md:w-auto w-full"
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </button>
          </form>

          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}

          {shortUrl && (
            <div className="bg-secondary rounded-xl p-6 max-w-3xl mx-auto text-left">
              <p className="mb-2 text-accent font-medium">
                Your shortened URL:
              </p>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-grow p-3 bg-background border border-primary text-white rounded-lg"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-cta hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-secondary rounded-2xl p-8 text-center flex flex-col items-center">
              <div className="bg-background rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 13C11.1046 13 12 12.1046 12 11C12 9.89543 11.1046 9 10 9C8.89543 9 8 9.89543 8 11C8 12.1046 8.89543 13 10 13Z" stroke="#7D3C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 19C19.1046 19 20 18.1046 20 17C20 15.8954 19.1046 15 18 15C16.8954 15 16 15.8954 16 17C16 18.1046 16.8954 19 18 19Z" stroke="#7D3C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11L16 17" stroke="#7D3C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">
                Branded Links
              </h2>
              <p className="text-text/80">
                Create custom short links with your own domain.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-secondary rounded-2xl p-8 text-center flex flex-col items-center">
              <div className="bg-background rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 20V10" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 20V4" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 20V14" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">
                Analytics
              </h2>
              <p className="text-text/80">
                Gain insights with detailed click tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-secondary rounded-2xl p-8 text-center flex flex-col items-center">
              <div className="bg-background rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">
                Fast Redirection
              </h2>
              <p className="text-text/80">
                Direct users to their destinations instantly.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-secondary py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Cliply. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}