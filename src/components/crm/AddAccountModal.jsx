import React, { useState } from "react";
import { toast } from "react-toastify";

const AddAccountModal = ({ trader, onAdd, onClose }) => {
  const [platform, setPlatform] = useState("Rithmic");
  const [size, setSize] = useState("50K");
  const [license, setLicense] = useState("bookmap");

  const handleSubmit = () => {
    const newAccount = {
      id: `EV${Math.floor(Math.random() * 10000)}`,
      platform,
      size,
      balance: 0,
      status: "active",
      license,
      purchasedAt: new Date().toISOString(),
    };
    onAdd(trader, newAccount);
    toast.success(`Account added to ${trader.name}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          Add Account for {trader.name}
        </h2>
        <div className="space-y-3 text-sm">
          <div>
            <label>Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            >
              <option>Rithmic</option>
              <option>CQG</option>
            </select>
          </div>
          <div>
            <label>Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            >
              <option>25K</option>
              <option>50K</option>
              <option>75K</option>
              <option>100K</option>
              <option>150K</option>
            </select>
          </div>
          <div>
            <label>License</label>
            <select
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="bookmap">Bookmap</option>
              <option value="atas">ATAS</option>
              <option value="quantower">Quantower</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
