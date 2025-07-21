// Admin Panel – Payout Requests Page (Full React File)

import React, { useState, useMemo, useEffect } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const sampleRequests = [
  {
    id: 1,
    name: "Darius Popescu",
    account: "Eval_50K_RTH1",
    amount: 1200,
    method: "Bank Transfer",
    date: "2025-06-17",
    status: "Pending",
    profit: 5100,
    target: 5000,
    days: 7,
    kyc: true,
    notes: "",
    bankDetails: {
      iban: "RO49AAAA1B31007593840000",
      name: "Darius Popescu",
      bank: "Banca Transilvania",
      swift: "BTRLRO22",
      address: "Str. Republicii 45, Cluj-Napoca, Romania",
      document: "https://example.com/darius-bank.pdf",
    },
    history: [
      {
        date: "2025-05-10",
        amount: 950,
        method: "Bank Transfer",
        status: "Approved",
      },
      {
        date: "2025-04-08",
        amount: 1100,
        method: "Bank Transfer",
        status: "Approved",
      },
    ],
  },
  {
    id: 2,
    name: "Maria Vasilescu",
    account: "Funded_75K_RTH2",
    amount: 850,
    method: "Crypto (USDT)",
    date: "2025-06-16",
    status: "In Review",
    profit: 8700,
    target: 7500,
    days: 9,
    kyc: false,
    notes: "",
    cryptoWallet: "0x8392F3aF40b5dAA553798Da0bE7Eb4Fa24554D",
    history: [],
  },
  {
    id: 3,
    name: "Alex Enache",
    account: "Funded_100K_RTH3",
    amount: 950,
    method: "PayPal",
    date: "2025-06-15",
    status: "Approved",
    profit: 7200,
    target: 7000,
    days: 8,
    kyc: true,
    notes: "",
    paypalEmail: "alex.enache@example.com",
    history: [
      { date: "2025-03-02", amount: 700, method: "PayPal", status: "Approved" },
    ],
  },
];

const exportCSV = (data) => {
  const headers = [
    "Name",
    "Account",
    "Amount",
    "Method",
    "Status",
    "Date",
    "KYC",
    "Profit",
    "Target",
    "Trading Days",
  ];
  const rows = data.map((r) => [
    r.name,
    r.account,
    r.amount,
    r.method,
    r.status,
    r.date,
    r.kyc ? "Verified" : "Not Verified",
    r.profit,
    r.target,
    r.days,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, "payout_requests.csv");
};

const Payouts = () => {
  const [requests, setRequests] = useState(sampleRequests);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalData, setModalData] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const exportPDF = (elementId, fileName) => {
    const input = document.getElementById(elementId);
    if (!input) return;

    // Scroll aur width temporarily hata de
    const originalOverflow = input.style.overflow;
    const originalWidth = input.style.width;
    input.style.overflow = "visible";
    input.style.width = "max-content";

    html2canvas(input, {
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);

      // Style wapas restore kar de
      input.style.overflow = originalOverflow;
      input.style.width = originalWidth;
    });
  };

  const updateStatus = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              history: [
                ...(r.history || []),
                {
                  // date: new Date().toISOString().slice(0, 10),
                  date: new Date().toLocaleString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),

                  amount: r.amount,
                  method: r.method,
                  status: newStatus,
                },
              ],
            }
          : r
      )
    );
    setNotification(`Payout for request #${id} marked as '${newStatus}'.`);
  };

  const updateNote = (id, note) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, notes: note } : r))
    );
  };

  const isEligible = (r) => r.profit >= r.target && r.days >= 7;
  const isSuspicious = (r) => r.amount > r.profit || !r.kyc;

  const filteredRequests = useMemo(() => {
    return requests.filter(
      (r) =>
        (r.name.toLowerCase().includes(filter.toLowerCase()) ||
          r.account.toLowerCase().includes(filter.toLowerCase())) &&
        (statusFilter === "All" || r.status === statusFilter)
    );
  }, [requests, filter, statusFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-gray-800">Payout Requests</h1>
        <div>
          <button
            onClick={() => exportCSV(filteredRequests)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow mr-2"
          >
            Export CSV
          </button>
          <button
            onClick={() =>
              exportPDF("payout-requests-table", "Payout_Requests.pdf")
            }
            className="bg-purple-600 text-white px-4 py-2 rounded shadow"
          >
            Export PDF
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Previous Payout History
      </h2>
      <button
        onClick={() => exportPDF("payout-history-table", "Payout_History.pdf")}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded shadow text-sm"
      >
        Export Payout History PDF
      </button>

      {/* <div className="overflow-auto mb-10">
        <table
          id="payout-history-table"
          className="min-w-full bg-white text-sm shadow rounded"
        >
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">Trader</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.flatMap(
              (r) =>
                r.history?.map((h, i) => (
                  <tr
                    key={`${r.id}-hist-${i}`}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium text-gray-800">{r.name}</td>
                    <td className="p-3">{h.date}</td>
                    <td className="p-3 text-green-700 font-semibold">
                      ${h.amount}
                    </td>
                    <td className="p-3">{h.method}</td>
                    <td className="p-3">{h.status}</td>
                  </tr>
                )) || []
            )}
          </tbody>
        </table>
      </div> */}

      <div
        id="payout-history-table"
        style={{
          backgroundColor: "#ffffff",
          color: "#000000",
          padding: "1rem",
        }}
        className="overflow-auto mb-10 rounded shadow"
      >
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {["Trader", "Date", "Amount", "Method", "Status"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 border border-gray-300 font-medium"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {requests.flatMap(
              (r) =>
                r.history?.map((h, i) => (
                  <tr
                    key={`${r.id}-hist-${i}`}
                    className="hover:bg-blue-50 transition duration-200"
                  >
                    <td className="px-4 py-3 border border-gray-300 font-medium text-gray-800">
                      {r.name}
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      {h.date}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-green-700 font-semibold">
                      ${h.amount}
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      {h.method}
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      {h.status}
                    </td>
                  </tr>
                )) || []
            )}

            {requests.every((r) => !r.history?.length) && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500 border border-gray-300"
                >
                  No payout history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-gray-800">Payout Requests</h1>

      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-6 shadow">
          {notification}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          className="border px-4 py-2 rounded shadow w-full"
          placeholder="Search by name or account..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded shadow w-full md:w-48"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Review">In Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="rounded shadow-lg">
        <div id="payout-requests-table" className="overflow-auto w-full">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {[
                  "#",
                  "Name",
                  "Account",
                  "Profit",
                  "Days",
                  "KYC",
                  "Method",
                  "Status",
                  "Ready?",
                  "Flags",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 border border-gray-300 font-medium"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((req, i) => (
                <tr
                  key={req.id}
                  className="hover:bg-blue-50 transition duration-200"
                >
                  <td className="px-4 py-3 border border-gray-300">{i + 1}</td>
                  <td className="px-4 py-3 border border-gray-300 font-medium text-gray-800">
                    {req.name}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {req.account}
                  </td>
                  <td className="px-4 py-3 border border-gray-300 text-green-700 font-semibold">
                    ${req.profit}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {req.days}
                  </td>
                  <td
                    className={`px-4 py-3 border border-gray-300 font-bold ${
                      req.kyc ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {req.kyc ? "✅" : "❌"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {req.method}
                  </td>
                  <td className="px-4 py-3 border border-gray-300 font-semibold text-blue-600">
                    {req.status}
                  </td>
                  <td
                    className={`px-4 py-3 border border-gray-300 text-xs font-bold ${
                      isEligible(req) ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isEligible(req) ? "✅" : "❌"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300 text-xs font-semibold">
                    {isSuspicious(req) ? "⚠️" : ""}
                  </td>
                  <td className="px-4 py-3 border border-gray-300 space-x-1">
                    <button
                      onClick={() => setModalData(req)}
                      className="bg-gray-600 text-white px-3 py-1 rounded shadow text-xs"
                    >
                      View
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, "Approved")}
                      className="bg-green-600 text-white px-3 py-1 rounded shadow text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, "Rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded shadow text-xs"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, "In Review")}
                      className="bg-yellow-500 text-white px-3 py-1 rounded shadow text-xs"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-4 text-gray-500 border border-gray-300"
                  >
                    No payout requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl space-y-4 relative shadow-xl">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-2 right-2 text-lg font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Details for {modalData.name}
            </h2>
            <p>
              <strong>Account:</strong> {modalData.account}
            </p>
            <p>
              <strong>Profit:</strong> ${modalData.profit} / Target: $
              {modalData.target}
            </p>
            <p>
              <strong>Trading Days:</strong> {modalData.days}
            </p>
            <p>
              <strong>Status:</strong> {modalData.status}
            </p>
            <p>
              <strong>KYC:</strong>{" "}
              {modalData.kyc ? "✅ Verified" : "❌ Not Verified"}
            </p>
            <p>
              <strong>Payout Method:</strong> {modalData.method}
            </p>

            {modalData.notes !== undefined && (
              <div className="mt-4">
                <label className="block font-semibold mb-1">
                  Internal Note:
                </label>
                <textarea
                  value={modalData.notes}
                  onChange={(e) => updateNote(modalData.id, e.target.value)}
                  className="w-full p-2 border rounded bg-gray-50"
                  placeholder="Write admin notes here..."
                />
              </div>
            )}

            {modalData.method === "Bank Transfer" && modalData.bankDetails && (
              <div className="bg-gray-100 p-3 rounded">
                <p>
                  <strong>Bank Name:</strong> {modalData.bankDetails.bank}
                </p>
                <p>
                  <strong>Account Holder:</strong> {modalData.bankDetails.name}
                </p>
                <p>
                  <strong>IBAN:</strong> {modalData.bankDetails.iban}
                </p>
                <p>
                  <strong>SWIFT:</strong> {modalData.bankDetails.swift}
                </p>
                <p>
                  <strong>Bank Address:</strong> {modalData.bankDetails.address}
                </p>
                <a
                  href={modalData.bankDetails.document}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  View Document
                </a>
              </div>
            )}

            {modalData.method.includes("Crypto") && modalData.cryptoWallet && (
              <p>
                <strong>Wallet Address:</strong> {modalData.cryptoWallet}
              </p>
            )}

            {modalData.method === "PayPal" && modalData.paypalEmail && (
              <p>
                <strong>PayPal Email:</strong> {modalData.paypalEmail}
              </p>
            )}

            {modalData.history && modalData.history.length > 0 && (
              <div>
                <h3 className="font-semibold mt-4">Comment Log:</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {modalData.history.map((h, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{h.status}</span> — $
                      {h.amount} via {h.method} at {h.date}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payouts;
