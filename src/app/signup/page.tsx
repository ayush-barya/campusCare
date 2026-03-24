"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerStudent } from "@/actions/auth-actions";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await registerStudent(formData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else if (res.success) {
      router.push("/?registered=true");
    }
  };

  return (
    <main className="auth-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '3rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Student Signup
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Register your CampusCare account
          </p>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>IIML Email Address *</label>
            <input 
              type="email" 
              name="email"
              className="input-field" 
              placeholder="student@iiml.ac.in"
              required 
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Password *</label>
            <input 
              type="password" 
              name="password"
              className="input-field" 
              placeholder="Create a password"
              required 
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Full Name *</label>
            <input 
              type="text" 
              name="name"
              className="input-field" 
              placeholder="Enter your name"
              required 
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Phone Number *</label>
            <input 
              type="tel" 
              name="phone"
              className="input-field" 
              placeholder="e.g. 9876543210"
              required 
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Alternate Phone (Optional)</label>
            <input 
              type="tel" 
              name="altPhone"
              className="input-field" 
              placeholder="Alternate Number"
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Room Number / Hostel *</label>
            <input 
              type="text" 
              name="roomNumber"
              className="input-field" 
              placeholder="e.g. Ganga 203"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', fontSize: '1rem' }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/" className="auth-link">Log in here</Link>
        </p>
      </div>

    </main>
  );
}
