"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("registered=true")) {
      setShowSuccess(true);
      // Clean up the URL without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Auto-hide after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    if (role === "STUDENT") {
      if (!email.endsWith("@iiml.ac.in")) {
        setError("Students must use an @iiml.ac.in domain address.");
        setLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        role: "STUDENT",
        redirect: false,
      });

      if (res?.error) {
        setError(res?.error === "CredentialsSignin" ? "Invalid student credentials." : res.error);
        setLoading(false);
      } else {
        router.push("/student/dashboard");
      }
    } else {
      // Trigger Admin Credentials flow
      const res = await signIn("credentials", {
        email,
        password,
        role: "ADMIN",
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid admin credentials.");
        setLoading(false);
      } else {
        router.push("/admin/dashboard");
      }
    }
  };

  return (
    <main className="auth-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', position: 'relative' }}>
      
      {showSuccess && (
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'var(--success)', color: 'white', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'slideIn 0.3s ease-out' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Account created successfully. Please login with your credentials now.
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}} />
        </div>
      )}

      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '3rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CampusCare
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Sign in to access the complaint portal
          </p>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Select Role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
              <button 
                type="button"
                onClick={() => setRole("STUDENT")}
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-sm)', 
                  background: role === "STUDENT" ? 'var(--bg-secondary)' : 'transparent',
                  color: role === "STUDENT" ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: role === "STUDENT" ? 600 : 500,
                  boxShadow: role === "STUDENT" ? 'var(--shadow-sm)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Student
              </button>
              <button 
                type="button"
                onClick={() => setRole("ADMIN")}
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-sm)', 
                  background: role === "ADMIN" ? 'var(--bg-secondary)' : 'transparent',
                  color: role === "ADMIN" ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: role === "ADMIN" ? 600 : 500,
                  boxShadow: role === "ADMIN" ? 'var(--shadow-sm)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Facilities Admin
              </button>
            </div>
          </div>

          {role === "ADMIN" ? (
            <>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Admin Email</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="ayush@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', fontSize: '1rem' }}
              >
                {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>
            </>
          ) : (
            <>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>IIML Email</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="student@iiml.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', fontSize: '1rem' }}
              >
                {loading ? 'Signing in...' : 'Sign In as Student'}
              </button>
            </>
          )}
        </form>

        {role === 'STUDENT' && (
          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            First time logging a complaint? <Link href="/signup" className="auth-link">Sign up here</Link>
          </p>
        )}
      </div>

    </main>
  );
}
