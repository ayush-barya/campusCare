import { PrismaClient } from "@prisma/client";
import { submitWorkerResolution } from "@/actions/resolve-ticket";

const prisma = new PrismaClient();

export default async function WorkerResolvePage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const token = params.token;
  
  const ticket = await prisma.ticket.findUnique({
    where: { workerToken: token },
    include: { category: true, creator: true }
  });

  if (!ticket) {
    return (
      <div className="auth-container">
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h2>Invalid Link</h2>
          <p>Ticket not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ padding: '1rem' }}>
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
          IIML Maintenance Task
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ticket ID</div>
              <div style={{ fontWeight: 600 }}>#{ticket.id}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Issue</div>
              <div style={{ fontWeight: 500 }}>{ticket.category.name}: {ticket.description}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Location</div>
              <div style={{ fontWeight: 500, color: 'var(--accent-secondary)' }}>{ticket.location}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Student Contact</div>
              <div style={{ fontWeight: 500 }}>{ticket.creator.name} / {ticket.creator.email}</div>
            </div>
          </div>
        </div>

        {ticket.status === "ASSIGNED" ? (
          <form action={async () => {
            "use server";
            await submitWorkerResolution(token);
          }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
              Mark as Fixed
            </button>
          </form>
        ) : (
          <div style={{ padding: '1rem', background: ticket.status === "RESOLVED" || ticket.status === "WAITING_CONFIRMATION" || ticket.status === "CLOSED" ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <h3 style={{ color: ticket.status === "RESOLVED" || ticket.status === "WAITING_CONFIRMATION" || ticket.status === "CLOSED" ? 'var(--success)' : 'inherit' }}>
              {ticket.status === "WAITING_CONFIRMATION" ? "Complaint is in closing phase waiting for approval from complainant" : `Current Status: ${ticket.status.replace('_', ' ')}`}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              No action required.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
