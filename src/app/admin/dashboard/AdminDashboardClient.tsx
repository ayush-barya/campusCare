"use client";

import { useState } from "react";
import { AssignWorkerModal } from "@/components/AssignWorkerModal";
import { CloseComplaintModal } from "@/components/CloseComplaintModal";

type Ticket = any; // simplified for MVP

export function AdminDashboardClient({ initialTickets, workers }: { initialTickets: Ticket[], workers: any[] }) {
  const [filter, setFilter] = useState("ALL");
  const [assigningTicketId, setAssigningTicketId] = useState<number | null>(null);
  const [closingTicketId, setClosingTicketId] = useState<number | null>(null);

  const filteredTickets = filter === "ALL" 
    ? initialTickets 
    : initialTickets.filter(t => t.status === filter);

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {['ALL', 'OPEN', 'ASSIGNED', 'RESOLVED', 'REOPENED', 'WAITING_CONFIRMATION', 'CLOSED'].map(status => (
          <button 
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: filter === status ? 'var(--text-primary)' : 'var(--bg-secondary)',
              color: filter === status ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: `1px solid ${filter === status ? 'var(--text-primary)' : 'var(--border-light)'}`,
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }} className="glass-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Category / Loc</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Student</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Assigned To</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <tr key={ticket.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>#{ticket.id}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`status-badge status-${ticket.status.toLowerCase().replace('_', '-')}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 500 }}>{ticket.category.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ticket.location}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 500 }}>{ticket.creator.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ticket.creator.email}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  {ticket.assignments.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {ticket.assignments.map((assignment: any, index: number) => {
                        const isLatest = index === ticket.assignments.length - 1;
                        return (
                          <div key={assignment.id} style={{ 
                            padding: isLatest ? '0.25rem 0' : '0.25rem 0',
                            opacity: isLatest ? 1 : 0.6
                          }}>
                            <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span>{assignment.worker?.name || "Unknown"}</span>
                              {!isLatest && <span style={{ fontSize: '0.7rem', background: 'var(--border-light)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>Prev</span>}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              {assignment.worker?.department || "General"} &bull; Ph: {assignment.worker?.phone || "N/A"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Unassigned</span>
                  )}
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  {(ticket.status === "OPEN" || ticket.status === "REOPENED") && (
                    <button 
                      onClick={() => setAssigningTicketId(ticket.id)}
                      className="btn-primary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      Assign
                    </button>
                  )}
                  {ticket.status !== "CLOSED" && (
                    <button 
                      onClick={() => setClosingTicketId(ticket.id)}
                      className="btn-secondary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'var(--border-light)' }}
                    >
                      Close
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {assigningTicketId && (
        <AssignWorkerModal 
          ticketId={assigningTicketId} 
          workers={workers}
          onClose={() => setAssigningTicketId(null)} 
        />
      )}

      {closingTicketId && (
        <CloseComplaintModal
          ticketId={closingTicketId}
          onClose={() => setClosingTicketId(null)}
        />
      )}
    </>
  );
}
