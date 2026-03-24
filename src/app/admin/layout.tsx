"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-grid relative">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CampusCare
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Facilities Admin</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'transparent', fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
            &times;
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link 
            href="/admin/dashboard" 
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              background: pathname === '/admin/dashboard' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: pathname === '/admin/dashboard' ? 'var(--accent-primary)' : 'var(--text-primary)',
              fontWeight: pathname === '/admin/dashboard' ? 600 : 500
            }}
          >
            All Complaints Overview
          </Link>
          <Link 
            href="/admin/workers" 
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              background: pathname === '/admin/workers' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: pathname === '/admin/workers' ? 'var(--accent-primary)' : 'var(--text-primary)',
              fontWeight: pathname === '/admin/workers' ? 600 : 500
            }}
          >
            Manage Workers
          </Link>
          <Link 
            href="/admin/analytics" 
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              background: pathname === '/admin/analytics' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: pathname === '/admin/analytics' ? 'var(--accent-primary)' : 'var(--text-primary)',
              fontWeight: pathname === '/admin/analytics' ? 600 : 500
            }}
          >
            Analytics Dashboard
          </Link>
        </nav>

        <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Logged in as</div>
          <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{session?.user?.name || "Admin"}</div>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })} 
            style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'transparent', textAlign: 'left', fontWeight: 500 }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay to close sidebar on mobile/when clicking outside */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="sidebar-overlay"
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      <main className="main-content">
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="hamburger-btn"
            style={{ display: 'flex', gap: '0.5rem' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span style={{ fontWeight: 600 }}>Menu</span>
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
