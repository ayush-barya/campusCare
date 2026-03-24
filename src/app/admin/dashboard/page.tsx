import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { AdminDashboardClient } from "./AdminDashboardClient";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all tickets with unverified history initially to list globally.
  const tickets = await prisma.ticket.findMany({
    include: { 
      category: true, 
      creator: true, 
      assignments: {
        include: { worker: true }
      } 
    },
    orderBy: { createdAt: 'desc' }
  });

  const workers = await prisma.worker.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem' }}>All Complaints</h1>

      {tickets.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No active complaints</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Facilities register is completely clean.</p>
        </div>
      ) : (
        <AdminDashboardClient initialTickets={tickets} workers={workers} />
      )}
    </div>
  );
}
