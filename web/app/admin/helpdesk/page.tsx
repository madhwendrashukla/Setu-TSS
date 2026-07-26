"use client";
import React, { useState, useEffect } from 'react';

type Ticket = {
  id: string;
  email: string | null;
  message: string;
  attachment_url: string | null;
  status: string;
  created_at: string;
};

export default function HelpdeskAdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/helpdesk`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/helpdesk/${id}`, {
        method: 'PUT',
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchTickets();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteTicket = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/helpdesk/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setTickets(tickets.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading tickets...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Helpdesk Tickets</h1>
        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
          {tickets.length} Tickets
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">Date</th>
                <th scope="col" className="px-6 py-4 font-bold">Email</th>
                <th scope="col" className="px-6 py-4 font-bold">Message</th>
                <th scope="col" className="px-6 py-4 font-bold">Attachment</th>
                <th scope="col" className="px-6 py-4 font-bold">Status</th>
                <th scope="col" className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No helpdesk tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {ticket.email || <span className="text-gray-400 italic">Anonymous</span>}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={ticket.message}>
                      {ticket.message}
                    </td>
                    <td className="px-6 py-4">
                      {ticket.attachment_url ? (
                        <a 
                          href={ticket.attachment_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent-blue hover:underline flex items-center gap-1 font-medium"
                        >
                          <i className="fas fa-paperclip"></i> View
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={ticket.status} 
                        onChange={(e) => updateStatus(ticket.id, e.target.value)}
                        className={`text-xs font-bold rounded-full px-3 py-1 border outline-none cursor-pointer appearance-none ${
                          ticket.status === 'new' ? 'bg-green-100 text-green-800 border-green-200' :
                          ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteTicket(ticket.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Ticket"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
