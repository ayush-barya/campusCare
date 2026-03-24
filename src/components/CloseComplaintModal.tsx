"use client";

import { useState } from "react";
import { closeTicket } from "@/actions/close-ticket";

export function CloseComplaintModal({ ticketId, onClose }: { ticketId: number, onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await closeTicket(ticketId);
      onClose();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', background: 'var(--bg-secondary)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--danger)' }}>Confirm Closure</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Are you sure you want to close Complaint #{ticketId}? This action cannot be easily undone.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button 
            type="button" 
            className="btn-primary" 
            style={{ flex: 1, background: 'var(--danger)', boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)' }} 
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Closing...' : 'Yes, Close Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}
