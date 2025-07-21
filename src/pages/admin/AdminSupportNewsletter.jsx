import React, { useState } from "react";

const mockTickets = [
  {
    id: "TCK-001",
    name: "Darius Popescu",
    email: "darius@edgeprop.com",
    type: "Payout Issue",
    message: "I haven’t received my payout yet.",
    status: "Open",
    createdAt: "2025-06-17 10:02",
    reply: "",
  },
  {
    id: "TCK-002",
    name: "Maria Vasilescu",
    email: "maria@edgeprop.com",
    type: "Platform Access",
    message: "My ATAS license is not working.",
    status: "Pending",
    createdAt: "2025-06-18 09:30",
    reply: "We’re checking your license status.",
  },
];

const registeredUsers = [
  "trader1@edgeprop.com",
  "trader2@edgeprop.com",
  "trader3@edgeprop.com",
];

const AdminSupportNewsletter = () => {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [status, setStatus] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReply, setTicketReply] = useState("");
  const [tickets, setTickets] = useState(mockTickets);
  const [emailLog, setEmailLog] = useState([]);

  const sendNewsletter = () => {
    if (!emailSubject || !emailBody) {
      setStatus("❗ Please fill out subject and body.");
      return;
    }
    const logEntry = {
      date: new Date().toLocaleString(),
      subject: emailSubject,
      body: emailBody,
      recipients: registeredUsers.length,
    };
    setEmailLog([logEntry, ...emailLog]);
    setStatus(`✅ Newsletter sent to ${registeredUsers.length} users.`);
    setEmailSubject("");
    setEmailBody("");
  };

  const sendTicketReply = () => {
    if (!selectedTicket || !ticketReply) {
      setStatus("❗ Please select a ticket and write a reply.");
      return;
    }

    const updated = tickets.map((t) =>
      t.id === selectedTicket.id
        ? { ...t, reply: ticketReply, status: "Resolved" }
        : t
    );

    setTickets(updated);
    setSelectedTicket({
      ...selectedTicket,
      reply: ticketReply,
      status: "Resolved",
    });
    setStatus(
      `✅ Reply sent to ${selectedTicket.name}, ticket marked as Resolved.`
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-blue-700">
        📣 Admin – Newsletter & Support
      </h1>

      {/* Newsletter Section */}
      <section className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">Send Newsletter</h2>
        <p className="text-sm text-gray-500 mb-4">
          Total registered users: <strong>{registeredUsers.length}</strong>
        </p>
        <input
          className="w-full border px-4 py-2 mb-3 rounded text-sm"
          placeholder="Subject..."
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
        />
        <textarea
          className="w-full border px-4 py-2 mb-3 rounded text-sm"
          placeholder="Body message..."
          rows={6}
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm"
          onClick={sendNewsletter}
        >
          📤 Send Newsletter
        </button>
      </section>

      {/* Newsletter Log */}
      {emailLog.length > 0 && (
        <section className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-3">📬 Newsletter Log</h2>
          <ul className="text-sm space-y-3">
            {emailLog.map((log, index) => (
              <li key={index} className="border-b pb-2">
                <p>
                  <strong>{log.date}</strong> – Sent to{" "}
                  <strong>{log.recipients}</strong> users
                </p>
                <p className="text-gray-700">Subject: {log.subject}</p>
                <p className="text-gray-600 italic">
                  {log.body.slice(0, 80)}...
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Support Tickets */}
      <section className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">🎫 Support Tickets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Ticket ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-blue-700">{ticket.id}</td>
                  <td className="p-3">{ticket.name}</td>
                  <td className="p-3">{ticket.email}</td>
                  <td className="p-3">{ticket.type}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        ticket.status === "Open"
                          ? "bg-red-100 text-red-700"
                          : ticket.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-3">{ticket.createdAt}</td>
                  <td className="p-3">
                    <button
                      className="text-blue-600 underline text-xs"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setTicketReply(ticket.reply);
                      }}
                    >
                      View & Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ticket Reply Box */}
        {selectedTicket && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Replying to: {selectedTicket.id} – {selectedTicket.type}
            </h3>
            <p className="text-sm mb-2">
              <strong>From:</strong> {selectedTicket.name} (
              {selectedTicket.email})
            </p>
            <p className="text-sm italic mb-4">"{selectedTicket.message}"</p>
            <textarea
              className="w-full border px-4 py-2 mb-3 rounded text-sm"
              placeholder="Write your reply..."
              rows={4}
              value={ticketReply}
              onChange={(e) => setTicketReply(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 text-sm"
              onClick={sendTicketReply}
            >
              ✅ Send Reply & Mark Resolved
            </button>
          </div>
        )}
      </section>

      {/* Status Bar */}
      {status && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded text-sm border border-yellow-300">
          {status}
        </div>
      )}
    </div>
  );
};

export default AdminSupportNewsletter;
