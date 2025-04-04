// pages/login.js
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // This is a placeholder - login functionality would connect to Supabase
    alert("Login functionality coming soon!");
  };

  // Inline styles
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#121212",
      color: "#F5F5F5",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      padding: "1rem",
    },
    headerContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 1rem",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
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
    main: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    },
    formContainer: {
      backgroundColor: "rgba(30, 30, 80, 0.7)",
      padding: "2rem",
      borderRadius: "0.75rem",
      width: "100%",
      maxWidth: "24rem",
    },
    heading: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
      textAlign: "center",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "medium",
      marginBottom: "0.25rem",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      backgroundColor: "#121212",
      border: "1px solid #7D3C98",
      color: "white",
      outline: "none",
    },
    button: {
      width: "100%",
      backgroundColor: "#7D3C98",
      color: "white",
      fontWeight: "bold",
      padding: "0.75rem 1.5rem",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
      marginTop: "0.5rem",
      transition: "background-color 0.2s",
    },
    buttonHover: {
      backgroundColor: "#6A0DAD",
    },
    footer: {
      backgroundColor: "#1E1E50",
      padding: "1.5rem 0",
    },
    footerContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 1rem",
      textAlign: "center",
    },
    toggleText: {
      marginTop: "1.5rem",
      textAlign: "center",
    },
    link: {
      color: "#00D4FF",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Cliply - Log In</title>
        <meta name="description" content="Log in to your Cliply account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <Link href="/" passHref>
            <div style={styles.logo}>
              <span style={styles.logoSymbol}>@</span>
              <span style={styles.logoText}>Cliply</span>
            </div>
          </Link>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.formContainer}>
          <h1 style={styles.heading}>Log in to your account</h1>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Your password"
                required
              />
            </div>

            <button
              type="submit"
              style={{...styles.button, ...styles.buttonHover}}
            >
              Log In
            </button>
          </form>

          <div style={styles.toggleText}>
            <span>Don't have an account? </span>
            <Link href="/signup" passHref>
              <span style={styles.link}>Sign up</span>
            </Link>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <p>© 2025 Cliply. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}