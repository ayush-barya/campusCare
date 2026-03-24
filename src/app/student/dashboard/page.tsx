import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const tickets = await prisma.ticket.findMany({
    where: { creatorId: session.user.id },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>My Complaints</h1>
        <Link href="/student/create" className="btn-primary">
          + New Complaint
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No complaints found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You haven't reported any infrastructure issues yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {tickets.map(ticket => (
            <Link href={`/student/ticket/${ticket.id}`} key={ticket.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s ease', cursor: 'pointer', padding: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>#{ticket.id}</span>
                  <span className={`status-badge status-${ticket.status.toLowerCase().replace('_', '-')}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ fontWeight: 500 }}>{ticket.category.name} - {ticket.location}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ticket.description}
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'right' }}>
                {new Date(ticket.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
