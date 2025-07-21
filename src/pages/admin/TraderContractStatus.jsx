// Trader Contract Status Page – Updated According to Full Spec

import React, { useState, useMemo } from "react";

const traders = [
  {
    id: "EDGEF1001",
    name: "Darius Popescu",
    email: "darius@edgeprop.com",
    kycApproved: true,
    kycTimestamp: "2025-06-12T10:14:00Z",
    activationPaid: true,
    activationTimestamp: "2025-06-13T08:25:00Z",
    contractSigned: true,
    contractTimestamp: "2025-06-14T09:00:00Z",
    contractUrl: "/contracts/Contract_DariusPopescu_EDGEF1001.pdf",
  },
  {
    id: "EDGEF1002",
    name: "Maria Vasilescu",
    email: "maria@edgeprop.com",
    kycApproved: false,
    kycTimestamp: null,
    activationPaid: false,
    activationTimestamp: null,
    contractSigned: false,
    contractTimestamp: null,
    contractUrl: "",
  },
  {
    id: "EDGEF1003",
    name: "Alex Enache",
    email: "alex@edgeprop.com",
    kycApproved: true,
    kycTimestamp: "2025-06-10T14:32:00Z",
    activationPaid: false,
    activationTimestamp: null,
    contractSigned: false,
    contractTimestamp: null,
    contractUrl: "",
  },
  {
    id: "EDGEF1004",
    name: "Andreea Ionescu",
    email: "andreea@edgeprop.com",
    kycApproved: true,
    kycTimestamp: "2025-06-09T10:00:00Z",
    activationPaid: true,
    activationTimestamp: "2025-06-10T11:00:00Z",
    contractSigned: true,
    contractTimestamp: "2025-06-11T09:15:00Z",
    contractUrl: "/contracts/Contract_AndreeaIonescu_EDGEF1004.pdf",
  },
];

const formatTimestamp = (ts) => (ts ? new Date(ts).toLocaleString() : "-");

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    {status ? "Approved" : "Missing"}
  </span>
);

const TraderContractStatus = () => {
  const [search, setSearch] = useState("");
  const [modalTrader, setModalTrader] = useState(null);

  const summary = useMemo(() => {
    const total = traders.length;
    const signed = traders.filter((t) => t.contractSigned).length;
    const missing = traders.filter(
      (t) => !t.kycApproved || !t.contractSigned || !t.contractUrl
    ).length;
    const lastSigned = traders.reduce((latest, t) => {
      if (t.contractSigned && t.contractTimestamp) {
        return !latest || new Date(t.contractTimestamp) > new Date(latest)
          ? t.contractTimestamp
          : latest;
      }
      return latest;
    }, null);
    return { total, signed, missing, lastSigned };
  }, []);

  const handleToggle = (id, key) => {
    const idx = traders.findIndex((t) => t.id === id);
    if (idx !== -1) {
      traders[idx][key] = !traders[idx][key];
      traders[idx][key + "Timestamp"] = traders[idx][key]
        ? new Date().toISOString()
        : null;
      setModalTrader({ ...traders[idx] });
    }
  };

  const filtered = traders.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Trader Contract Status
      </h1>

      {/* Summary */}
      <div className="bg-white border p-4 rounded shadow mb-6 text-sm">
        <p>Total Traders: {summary.total}</p>
        <p>Signed Contracts: {summary.signed}</p>
        <p>Missing KYC / Contracts: {summary.missing}</p>
        <p>Last Signed Contract: {formatTimestamp(summary.lastSigned)}</p>
      </div>

      <input
        type="text"
        className="border px-4 py-2 mb-4 w-full rounded shadow-sm"
        placeholder="🔍 Search by name or ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm rounded shadow">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">KYC</th>
              <th className="px-4 py-2 border">Activation Fee</th>
              <th className="px-4 py-2 border">Contract</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{t.id}</td>
                <td className="px-4 py-2 border">{t.name}</td>
                <td className="px-4 py-2 border">{t.email}</td>
                <td className="px-4 py-2 border">
                  <StatusBadge status={t.kycApproved} />
                  <div className="text-xs text-gray-500">
                    {formatTimestamp(t.kycTimestamp)}
                  </div>
                </td>
                <td className="px-4 py-2 border">
                  <StatusBadge status={t.activationPaid} />
                  <div className="text-xs text-gray-500">
                    {formatTimestamp(t.activationTimestamp)}
                  </div>
                </td>
                <td className="px-4 py-2 border">
                  <StatusBadge status={t.contractSigned} />
                  <div className="text-xs text-gray-500">
                    {formatTimestamp(t.contractTimestamp)}
                  </div>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => setModalTrader(t)}
                    className="text-blue-600 hover:text-blue-800 underline text-xs"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalTrader && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full relative shadow-lg">
            <button
              onClick={() => setModalTrader(null)}
              className="absolute top-2 right-3 text-xl font-bold text-gray-700 hover:text-black"
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-1 text-blue-700">
              {modalTrader.name} – {modalTrader.id}
            </h2>
            <p className="text-sm text-gray-600 mb-4">📧 {modalTrader.email}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {["kycApproved", "activationPaid", "contractSigned"].map(
                (key) => (
                  <div key={key}>
                    <p className="font-medium">
                      {key === "kycApproved"
                        ? "KYC"
                        : key === "activationPaid"
                        ? "Activation Fee"
                        : "Contract"}
                    </p>
                    <StatusBadge status={modalTrader[key]} />
                    <p className="text-xs text-gray-500 mb-1">
                      {formatTimestamp(modalTrader[key + "Timestamp"])}
                    </p>
                    <button
                      onClick={() => handleToggle(modalTrader.id, key)}
                      className="text-blue-600 hover:text-blue-800 text-xs underline"
                    >
                      Toggle
                    </button>
                  </div>
                )
              )}
            </div>

            {modalTrader.contractUrl && (
              <>
                <div className="mt-4">
                  <a
                    href={modalTrader.contractUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="text-blue-600 underline text-sm hover:text-blue-800"
                  >
                    📄 Download Contract PDF
                  </a>
                </div>
                <iframe
                  src={modalTrader.contractUrl}
                  title="Contract PDF"
                  className="w-full h-96 border mt-4 rounded"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TraderContractStatus;
