"use client";

import { useState } from "react";
import { assignTicket } from "@/actions/assign-ticket";

export function AssignWorkerModal({ ticketId, workers, onClose }: { ticketId: number, workers?: any[], onClose: () => void }) {
  const [workerId, setWorkerId] = useState(workers && workers.length > 0 ? workers[0].id : "");
  const [priority, setPriority] = useState("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("ticketId", ticketId.toString());
      formData.append("workerId", workerId);
      formData.append("priority", priority);
      
      await assignTicket(formData);
      onClose();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', background: 'var(--bg-secondary)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Assign Worker to Ticket #{ticketId}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Priority</label>
            <select className="input-field" value={priority} onChange={e => setPriority(e.target.value)} required>
               <option value="LOW">Low</option>
               <option value="MEDIUM">Medium</option>
               <option value="HIGH">High</option>
            </select>
          </div>
          <div className="input-group">
            <label>Assigned Worker</label>
            <select className="input-field" value={workerId} onChange={e => setWorkerId(e.target.value)} required>
               {!workers || workers.length === 0 ? (
                 <option value="" disabled>No workers available. Add them in settings.</option>
               ) : (
                 workers.map(w => (
                   <option key={w.id} value={w.id}>{w.name} - {w.department} ({w.phone})</option>
                 ))
               )}
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? 'Assigning...' : 'Assign & SMS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
