// ✅ FundingAgreementModal.jsx
import React from "react";

const FundingAgreementModal = ({ trader, onClose }) => {
  if (!trader) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-blue-700">
            Trader Funding Agreement
          </h2>
          <button
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="prose text-sm max-w-none">
          <p>
            <strong>Company Name:</strong> EdgeProp Trading S.R.L.
            <br />
            <strong>Registered Address:</strong> Str. Ing. Zablovschi Nr. 10,
            Biroul 1, Sector 1, București, Romania
            <br />
            <strong>Trade Register No.:</strong> J2025014346001
            <br />
            <strong>Tax ID (CUI):</strong> 51366724
          </p>

          <p>
            This Funding Agreement ("Agreement") is entered into by and between
            EdgeProp Trading S.R.L. ("Company"), and the undersigned individual
            trader ("Trader"), as an Independent Contractor.
          </p>

          <p>
            By signing this Agreement, the Trader certifies that they have read,
            understood, and fully accepted all terms in the EdgeProp Trader
            Funding Contract including FAQs, rules, payment policy.
          </p>

          <p>
            The Trader acknowledges that all funded or simulated accounts remain
            property of EdgeProp Trading S.R.L., and trading activities must
            comply with company rules and regulatory standards.
          </p>

          <p>
            Breach of this Agreement (e.g. unauthorized access, fraudulent
            behavior, reputational harm) will result in immediate termination
            and forfeiture of balances and rights.
          </p>

          <p>
            This Agreement includes non-disclosure and non-disparagement
            clauses. Any violation may trigger legal action and liquidated
            damages up to
            <strong> 10,000 EUR</strong> per incident.
          </p>

          <p>The Trader certifies the following information:</p>

          <ul className="text-sm">
            <li>
              <strong>Full Name:</strong> {trader.name}
            </li>
            <li>
              <strong>EdgeProp Account ID:</strong> {trader.id}
            </li>
            <li>
              <strong>Email:</strong> {trader.email}
            </li>
            <li>
              <strong>Address:</strong> {trader.address.street},{" "}
              {trader.address.city}, {trader.address.country}
            </li>
            <li>
              <strong>Phone Number:</strong> +40 700 000 000
            </li>
            <li>
              <strong>Account ID for Agreement:</strong> EDGEF1001
            </li>
          </ul>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-1">
              Draw Signature:
            </label>
            <div className="w-full h-24 border border-gray-400 rounded bg-gray-50 text-center flex items-center justify-center">
              <span className="text-gray-400">(Signature Pad Placeholder)</span>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Date of Birth:
            </label>
            <input type="date" className="border px-3 py-1 rounded w-full" />
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <button
              className="bg-gray-300 text-sm px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded">
              Submit Agreement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingAgreementModal;
