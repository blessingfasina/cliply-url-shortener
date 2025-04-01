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

  // Media query detection for responsive fallback
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#121212",
      color: "#F5F5F5",
      fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
    }}>
      <Head>
        <title>Cliply - Shorten URLs Instantly</title>
        <meta name="description" content="Fast, branded, and trackable links" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header style={{
        padding: "1.5rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }} className="header-container">
        <div style={{
          display: "flex",
          alignItems: "center",
        }}>
          <span style={{
            color: "#7D3C98",
            fontSize: "2rem",
            marginRight: "0.5rem",
            fontWeight: "bold",
          }}>@</span>
          <span style={{
            color: "white",
            fontSize: "2rem",
            fontWeight: "bold",
          }}>Cliply</span>
        </div>
        <nav className="nav-container">
          <ul style={{
            display: "flex",
            gap: "2rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}>
            <li>
              <Link href="/signup" style={{
                color: "white",
                textDecoration: "none",
                fontSize: "1rem",
              }}>
                Sign up
              </Link>
            </li>
            <li>
              <Link href="/login" style={{
                color: "white",
                textDecoration: "none",
                fontSize: "1rem",
              }}>
                Log in
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "3rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: "center",
          marginBottom: "4rem",
          maxWidth: "800px",
        }}>
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }} className="hero-title">
            Shorten URLs with{" "}
            <span style={{ color: "#7D3C98" }}>Cliply</span>
          </h1>
          <p style={{
            fontSize: "1.25rem",
            marginBottom: "3rem",
            opacity: 0.9,
          }}>
            Simplify your links, track analytics, and optimize sharing.
          </p>

          {/* URL Input Form */}
          <form onSubmit={shortenUrl} style={{
            display: "flex",
            maxWidth: "100%",
            margin: "0 auto",
            marginBottom: "1.5rem",
          }} className="url-form">
            <div style={{
              position: "relative",
              flexGrow: 1,
              display: "flex",
            }}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter a long URL"
                style={{
                  width: "100%",
                  padding: "1rem 1.5rem",
                  borderRadius: "0.75rem 0 0 0.75rem",
                  className: "url-input",
                  backgroundColor: "#1E1E50",
                  border: "2px solid #1E1E50",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: "#7D3C98",
                color: "white",
                fontWeight: "bold",
                padding: "1rem 2rem",
                border: "none",
                borderRadius: "0 0.75rem 0.75rem 0",
                fontSize: "1rem",
                cursor: "pointer",
                minWidth: "140px",
                className: "url-button",
              }}
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </button>
          </form>

          {error && (
            <p style={{ color: "#ff4d4d", marginBottom: "1rem" }}>{error}</p>
          )}

          {shortUrl && (
            <div style={{
              backgroundColor: "#1E1E50",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginTop: "1.5rem",
              textAlign: "left",
            }}>
              <p style={{ 
                marginBottom: "0.75rem", 
                color: "#00D4FF", 
                fontWeight: "500" 
              }}>
                Your shortened URL:
              </p>
              <div style={{
                display: "flex",
                gap: "0.75rem",
              }} className="result-container">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  style={{
                    flexGrow: 1,
                    padding: "0.75rem",
                    backgroundColor: "#121212",
                    border: "1px solid #7D3C98",
                    color: "white",
                    borderRadius: "0.5rem",
                  }}
                />
                <button
                  onClick={copyToClipboard}
                  style={{
                    backgroundColor: "#32CD32",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0 1.5rem",
                    cursor: "pointer",
                    fontWeight: "bold",
                    className: "copy-button",
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem",
          width: "100%",
          marginTop: "2rem",
        }} className="feature-grid">
          {/* Feature 1 */}
          <div style={{
            backgroundColor: "#1E1E50",
            borderRadius: "1rem",
            padding: "2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            <div style={{
              backgroundColor: "#121212",
              borderRadius: "0.75rem",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 13C11.1046 13 12 12.1046 12 11C12 9.89543 11.1046 9 10 9C8.89543 9 8 9.89543 8 11C8 12.1046 8.89543 13 10 13Z" stroke="#7D3C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 19C19.1046 19 20 18.1046 20 17C20 15.8954 19.1046 15 18 15C16.8954 15 16 15.8954 16 17C16 18.1046 16.8954 19 18 19Z" stroke="#7D3C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11L16 17" stroke="#7D3C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 5H16L14 9H10L8 5Z" stroke="#7D3C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
            }}>
              Branded Links
            </h2>
            <p style={{
              color: "#F5F5F5",
              opacity: 0.8,
            }}>
              Create custom short links with your own domain.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{
            backgroundColor: "#1E1E50",
            borderRadius: "1rem",
            padding: "2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            <div style={{
              backgroundColor: "#121212",
              borderRadius: "0.75rem",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 20V10" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20V4" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 20V14" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
            }}>
              Analytics
            </h2>
            <p style={{
              color: "#F5F5F5",
              opacity: 0.8,
            }}>
              Gain insights with detailed click tracking.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{
            backgroundColor: "#1E1E50",
            borderRadius: "1rem",
            padding: "2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            <div style={{
              backgroundColor: "#121212",
              borderRadius: "0.75rem",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
            }}>
              Fast Redirection
            </h2>
            <p style={{
              color: "#F5F5F5",
              opacity: 0.8,
            }}>
              Direct users to their destinations instantly.
            </p>
          </div>
        </div>
      </main>

      <footer style={{
        backgroundColor: "#1E1E50",
        padding: "2rem 0",
        textAlign: "center",
        marginTop: "4rem",
      }}>
        <p>© 2025 Cliply. All rights reserved.</p>
      </footer>
    </div>
  );
}