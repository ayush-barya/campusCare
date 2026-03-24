import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { updateProfile } from "@/actions/update-profile";

const prisma = new PrismaClient();

export default async function StudentProfile() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem' }}>My Profile</h1>

      <div className="glass-card">
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
          <div style={{ color: 'var(--text-secondary)' }}>{user.email}</div>
          <div style={{ 
            display: 'inline-block', 
            marginTop: '0.75rem', 
            fontSize: '0.75rem', 
            padding: '0.2rem 0.6rem', 
            background: 'rgba(99, 102, 241, 0.1)', 
            color: 'var(--accent-primary)', 
            borderRadius: 'var(--radius-full)', 
            fontWeight: 600 
          }}>
            Verified IIML Student
          </div>
        </div>

        <form action={async (formData) => {
          "use server";
          await updateProfile(formData);
        }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Phone Number *</label>
            <input 
              type="tel" 
              name="phone"
              className="input-field" 
              defaultValue={user.phone || ""}
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
              defaultValue={user.altPhone || ""}
              placeholder="Alternate Number"
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Room Number / Hostel *</label>
            <input 
              type="text" 
              name="roomNumber"
              className="input-field" 
              defaultValue={user.roomNumber || ""}
              placeholder="e.g. Ganga 203"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', fontSize: '1rem' }}
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
