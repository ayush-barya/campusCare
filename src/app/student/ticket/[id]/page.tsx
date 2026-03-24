import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { reopenTicket } from "@/actions/reopen-ticket";

const prisma = new PrismaClient();

export default async function TicketDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const ticketId = parseInt(id, 10);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { category: true, assignments: true, statusHistory: { orderBy: { changedAt: 'desc' } } }
  });

  if (!ticket || ticket.creatorId !== session.user.id) {
    return (
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2>Ticket Not Found</h2>
        <Link href="/student/dashboard" className="btn-secondary" style={{ marginTop: '1rem' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/student/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block' }}>
            &larr; Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            Ticket #{ticket.id}
            <span className={`status-badge status-${ticket.status.toLowerCase().replace('_', '-')}`} style={{ fontSize: '0.875rem' }}>
              {ticket.status.replace('_', ' ')}
            </span>
          </h1>
        </div>
        
        {(ticket.status === "RESOLVED" || ticket.status === "WAITING_CONFIRMATION") && (
          <form action={async () => {
            "use server";
            await reopenTicket(ticket.id);
          }}>
            <button type="submit" className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
              Reopen Ticket
            </button>
          </form>
        )}
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div className="responsive-grid-ticket" style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Category</div>
            <div style={{ fontWeight: 500 }}>{ticket.category.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Location</div>
            <div style={{ fontWeight: 500 }}>{ticket.location}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Submitted On</div>
            <div style={{ fontWeight: 500 }}>{ticket.createdAt.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Last Updated</div>
            <div style={{ fontWeight: 500 }}>{ticket.updatedAt.toLocaleString()}</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Description</div>
          <p style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Status History</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {ticket.statusHistory.map((history, idx) => (
            <div key={history.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '12px', height: '12px', borderRadius: '50%', 
                background: idx === 0 ? 'var(--accent-primary)' : 'var(--border-light)',
                marginTop: '0.35rem', flexShrink: 0
              }} />
              <div>
                <div style={{ fontWeight: 500 }}>Changed to {history.status.replace('_', ' ')}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  By {history.changedBy} on {history.changedAt.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
