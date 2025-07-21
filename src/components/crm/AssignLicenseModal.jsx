// ✅ AssignLicenseModal.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function AssignLicenseModal({ trader, onAssign, onClose }) {
  const [license, setLicense] = useState("bookmap");

  const handleAssign = () => {
    onAssign(trader, license);
    toast.success(`Assigned ${license} to ${trader.name}`);
    onClose();
  };

  if (!trader) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          Assign License to {trader.name}
        </h2>
        <div className="space-y-3 text-sm">
          <label>Select License</label>
          <select
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="bookmap">Bookmap</option>
            <option value="atas">ATAS</option>
            <option value="quantower">Quantower</option>
          </select>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
              Cancel
            </button>
            <button
              onClick={handleAssign}
              className="px-3 py-1 bg-purple-700 text-white rounded"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
