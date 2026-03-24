import { PrismaClient } from "@prisma/client";
import { AnalyticsDashboardClient } from "./AnalyticsDashboardClient";

const prisma = new PrismaClient();

export default async function AnalyticsPage() {
  const tickets = await prisma.ticket.findMany({
    include: { category: true }
  });

  // Calculate high level stats
  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length;
  const open = tickets.filter(t => t.status === "OPEN" || t.status === "REOPENED").length;
  const assigned = tickets.filter(t => t.status === "ASSIGNED").length;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem' }}>Analytics & Reporting</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Complaints</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{total}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Open / Reopened</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--danger)' }}>{open}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Currently Assigned</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--warning)' }}>{assigned}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Resolved / Closed</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)' }}>{resolved}</div>
        </div>
      </div>

      <AnalyticsDashboardClient tickets={tickets} />
    </div>
  );
}
