import { createTicket } from "@/actions/create-ticket";

export default function CreateComplaintPage() {
  return (
    <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem' }}>New Complaint</h1>
      
      <form action={createTicket} className="glass-card">
        <div className="input-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" className="input-field" required>
            <option value="Electricity">Electricity</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Cleaning">Cleaning & Housekeeping</option>
            <option value="IT/Wi-Fi">IT & Wi-Fi</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="location">Location</label>
          <input 
            type="text" 
            id="location" 
            name="location" 
            className="input-field" 
            placeholder="e.g. Ganga Hostel Room 203" 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="description">Issue Description</label>
          <textarea 
            id="description" 
            name="description" 
            className="input-field" 
            rows={4}
            placeholder="Describe the problem in detail..." 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="photo">Photo Upload (Optional)</label>
          <input 
            type="file" 
            id="photo" 
            name="photo" 
            accept="image/*"
            style={{ padding: '0.5rem 0' }}
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
             *Photo upload is mocked for MVP
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          Submit Ticket
        </button>
      </form>
    </div>
  );
}
