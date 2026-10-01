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

const PAGE_SIZE = 10;

export default function HelpdeskAdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/helpdesk`, {
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

  // Pagination calculations
  const totalPages = Math.ceil(tickets.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, tickets.length);
  const paginatedTickets = tickets.slice(startIndex, endIndex);

  // Keep currentPage valid when tickets length shrinks
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [tickets.length, totalPages, currentPage]);

  const downloadAttachment = async (ticketId: string, url: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/helpdesk/${ticketId}/attachment`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch attachment');
      }
      
      const blob = await res.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      
      // Extract filename from URL or header
      let fileName = 'attachment';
      try {
        const urlObj = new URL(url);
        fileName = urlObj.pathname.split('/').pop() || 'attachment';
      } catch (e) {
        console.error("Invalid URL format:", e);
      }

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(objectUrl);
      a.remove();
    } catch (error) {
      console.error("Failed to download attachment:", error);
      alert("Failed to download attachment. It may no longer be available.");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/helpdesk/${id}`, {
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
      const res = await fetch(`/api/admin/helpdesk/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setTickets(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  const deleteAllTickets = async () => {
    if (tickets.length === 0) return;
    const confirmed = confirm(
      `⚠️ Warning: Are you sure you want to delete ALL ${tickets.length} tickets?\n\nThis action is permanent and cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setIsDeletingAll(true);
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/helpdesk`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setTickets([]);
        setCurrentPage(1);
      } else {
        alert("Failed to delete all tickets. Please try again.");
      }
    } catch (error) {
      console.error("Failed to delete all tickets:", error);
      alert("An error occurred while deleting all tickets.");
    } finally {
      setIsDeletingAll(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500 py-8">Loading tickets...</div>;
  }

  return (
    <div>
      {/* Header with Title, Count Badge, and Delete All Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Helpdesk Tickets</h1>
          <p className="text-xs text-gray-500 mt-1">Review, manage status, and download user ticket attachments.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold shadow-xs">
            {tickets.length} {tickets.length === 1 ? 'Ticket' : 'Tickets'}
          </span>

          {tickets.length > 0 && (
            <button
              onClick={deleteAllTickets}
              disabled={isDeletingAll}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
              title="Delete all helpdesk tickets permanently"
            >
              <i className={`fas ${isDeletingAll ? 'fa-spinner fa-spin' : 'fa-trash-alt'}`} />
              {isDeletingAll ? 'Deleting All...' : 'Delete All'}
            </button>
          )}
        </div>
      </div>

      {/* Main Tickets Table */}
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
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <i className="fas fa-inbox text-3xl text-gray-300"></i>
                      <span>No helpdesk tickets found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket) => (
                  <tr key={ticket.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
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
                        <button 
                          onClick={() => downloadAttachment(ticket.id, ticket.attachment_url!)}
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium bg-transparent border-none cursor-pointer"
                        >
                          <i className="fas fa-paperclip"></i> View
                        </button>
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
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
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

        {/* Pagination Controls (10 per page) */}
        {tickets.length > 0 && (
          <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div>
              Showing <span className="font-bold text-gray-800">{startIndex + 1}</span> to <span className="font-bold text-gray-800">{endIndex}</span> of <span className="font-bold text-gray-800">{tickets.length}</span> tickets
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white text-gray-700 font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-left text-[10px]" /> Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white text-gray-700 font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                Next <i className="fas fa-chevron-right text-[10px]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
