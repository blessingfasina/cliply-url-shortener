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

  // Inline styles as a fallback for Tailwind
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#121212",
      color: "#F5F5F5",
    },
    header: {
      padding: "1rem",
    },
    headerContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 1rem",
    },
    logo: {
      display: "flex",
      alignItems: "center",
    },
    logoSymbol: {
      color: "#7D3C98",
      fontSize: "1.875rem",
      marginRight: "0.5rem",
    },
    logoText: {
      color: "white",
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    nav: {
      display: "flex",
    },
    navItem: {
      marginLeft: "1.5rem",
      cursor: "pointer",
      transition: "color 0.2s",
    },
    main: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 1rem",
    },
    hero: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "5rem 0",
      textAlign: "center",
    },
    heading: {
      fontSize: "3rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
    },
    subheading: {
      fontSize: "1.25rem",
      marginBottom: "3rem",
      maxWidth: "36rem",
    },
    highlight: {
      color: "#7D3C98",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      maxWidth: "36rem",
      marginBottom: "2rem",
    },
    inputContainer: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "0.5rem",
    },
    input: {
      padding: "1rem",
      borderRadius: "0.75rem",
      backgroundColor: "#1E1E50",
      border: "1px solid #7D3C98",
      color: "white",
      marginBottom: "1rem",
      width: "100%",
    },
    button: {
      backgroundColor: "#7D3C98",
      color: "white",
      fontWeight: "bold",
      padding: "1rem 2rem",
      borderRadius: "0.75rem",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    buttonHover: {
      backgroundColor: "#6A0DAD",
    },
    errorMessage: {
      color: "#ff4444",
      marginBottom: "1rem",
    },
    resultContainer: {
      backgroundColor: "#1E1E50",
      padding: "1.5rem",
      borderRadius: "0.75rem",
      marginBottom: "3rem",
      width: "100%",
      maxWidth: "36rem",
    },
    resultLabel: {
      marginBottom: "0.5rem",
      color: "#00D4FF",
      fontWeight: "500",
    },
    resultDisplay: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: "1rem",
    },
    resultInput: {
      flexGrow: "1",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      backgroundColor: "#121212",
      border: "1px solid #7D3C98",
      color: "white",
    },
    copyButton: {
      backgroundColor: "#32CD32",
      color: "white",
      fontWeight: "bold",
      padding: "0.75rem 1.5rem",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    features: {
      display: "grid",
      gridTemplateColumns: "repeat(1, 1fr)",
      gap: "2rem",
      marginBottom: "5rem",
    },
    featureCard: {
      backgroundColor: "rgba(30, 30, 80, 0.3)",
      padding: "2rem",
      borderRadius: "0.75rem",
      textAlign: "center",
    },
    featureIcon: {
      backgroundColor: "#1E1E50",
      display: "inline-block",
      padding: "1rem",
      borderRadius: "0.75rem",
      marginBottom: "1rem",
    },
    featureTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "0.75rem",
    },
    footer: {
      backgroundColor: "#1E1E50",
      padding: "2rem 0",
    },
    footerContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 1rem",
      textAlign: "center",
    },
  };

  // Media query for larger screens
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  if (isDesktop) {
    styles.features.gridTemplateColumns = "repeat(3, 1fr)";
    styles.form.flexDirection = "row";
    styles.form.gap = "1rem";
    styles.inputContainer.flexGrow = "1";
    styles.input.marginBottom = "0";
    styles.resultDisplay.flexDirection = "row";
  }

  return (
    <div style={styles.container}>
      <Head>
        <title>Cliply - Shorten URLs Instantly</title>
        <meta name="description" content="Fast, branded, and trackable links" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.logo}>
            <span style={styles.logoSymbol}>@</span>
            <span style={styles.logoText}>Cliply</span>
          </div>
          <nav style={styles.nav}>
            <Link href="/signup" passHref>
              <div style={styles.navItem}>Sign up</div>
            </Link>
            <Link href="/login" passHref>
              <div style={styles.navItem}>Log in</div>
            </Link>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.heading}>
            Shorten URLs with <span style={styles.highlight}>Cliply</span>
          </h1>
          <p style={styles.subheading}>
            Simplify your links, track analytics, and optimize sharing.
          </p>

          <form onSubmit={shortenUrl} style={styles.form}>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter a long URL"
                style={styles.input}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.button,
                ...(isLoading ? {} : styles.buttonHover),
              }}
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </button>
          </form>

          {error && <p style={styles.errorMessage}>{error}</p>}

          {shortUrl && (
            <div style={styles.resultContainer}>
              <p style={styles.resultLabel}>Your shortened URL:</p>
              <div style={styles.resultDisplay}>
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  style={styles.resultInput}
                />
                <button
                  onClick={copyToClipboard}
                  style={styles.copyButton}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </section>

        <section style={styles.features}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <span style={{ color: "#7D3C98", fontSize: "1.5rem" }}>🔗</span>
            </div>
            <h2 style={styles.featureTitle}>Branded Links</h2>
            <p>Create custom short links with your own domain.</p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <span style={{ color: "#00D4FF", fontSize: "1.5rem" }}>📊</span>
            </div>
            <h2 style={styles.featureTitle}>Analytics</h2>
            <p>Gain insights with detailed click tracking.</p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <span style={{ color: "#00D4FF", fontSize: "1.5rem" }}>⚡</span>
            </div>
            <h2 style={styles.featureTitle}>Fast Redirection</h2>
            <p>Direct users to their destinations instantly.</p>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <p>© 2025 Cliply. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}