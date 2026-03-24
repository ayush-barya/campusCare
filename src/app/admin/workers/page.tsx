import { PrismaClient } from "@prisma/client";
import { addWorker, removeWorker } from "@/actions/worker-actions";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export default async function WorkersPage() {
  const workers = await prisma.worker.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem' }}>Manage Workers</h1>
      
      <div className="responsive-grid-workers">
        
        {/* ADD WORKER FORM */}
        <div className="glass-card" style={{ alignSelf: 'start' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            Add New Worker
          </h2>
          <form action={async (formData) => {
            "use server";
            await addWorker(formData);
          }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Worker Name</label>
              <input type="text" name="name" className="input-field" placeholder="e.g. Ramesh" required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Department</label>
              <select name="department" className="input-field" required>
                <option value="Electricity">Electricity</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Cleaning & Housekeeping">Cleaning & Housekeeping</option>
                <option value="IT & Wi-Fi">IT & Wi-Fi</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
               <label>Phone Number</label>
               <input type="tel" name="phone" className="input-field" placeholder="e.g. 9876543210" required />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
              Save Worker
            </button>
          </form>
        </div>

        {/* WORKERS LIST */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            Active Workers ({workers.length})
          </h2>
          {workers.length === 0 ? (
             <p style={{ color: 'var(--text-secondary)' }}>No workers added yet.</p>
          ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {workers.map(worker => (
                 <div key={worker.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                   <div>
                     <div style={{ fontWeight: 600 }}>{worker.name}</div>
                     <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                       {worker.department} &bull; Ph: {worker.phone}
                     </div>
                   </div>
                   <form action={async (formData) => {
                     "use server";
                     await removeWorker(formData);
                   }}>
                     <input type="hidden" name="workerId" value={worker.id} />
                     <button type="submit" style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
                       Remove
                     </button>
                   </form>
                 </div>
               ))}
             </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
