import { PrismaClient } from "@prisma/client";
import { processReopenToken } from "@/actions/reopen-from-token";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function ReopenTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  
  const ticket = await prisma.ticket.findUnique({
    where: { reopenToken: token },
    include: { category: true }
  });

  if (!ticket) {
    return (
      <div className="auth-container">
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h2>Invalid or Expired Link</h2>
          <p>This reopening link is no longer valid. The ticket may have already been reopened or closed.</p>
          <Link href="/" style={{ color: 'var(--primary)', marginTop: '1rem', display: 'inline-block' }}>Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ padding: '1rem' }}>
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--danger)' }}>
          Reopen Complaint #{ticket.id}
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Issue: <strong>{ticket.category.name}</strong> - <em>{ticket.description}</em><br/><br/>
          If the issue was not satisfactorily resolved by the worker, click the button below to formally reopen the ticket and alert the Facilities Admin.
        </p>

        {ticket.status === "REOPENED" ? (
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--info)', fontWeight: 500 }}>
            Ticket successfully reopened! The Facilities Admin has been notified.
            <div style={{ marginTop: '1rem' }}>
              <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Return Home</Link>
            </div>
          </div>
        ) : (
          <form action={async () => {
            "use server";
            await processReopenToken(token);
          }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', backgroundColor: 'var(--danger)' }}>
              Yes, Reopen this Complaint
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
