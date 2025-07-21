import React from "react";
import { toast } from "react-toastify";

const AccountModal = ({ account, onClose }) => {
  if (!account) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Account Details</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>ID:</strong> {account.id}
          </p>
          <p>
            <strong>Platform:</strong> {account.platform}
          </p>
          <p>
            <strong>Size:</strong> {account.size}
          </p>
          <p>
            <strong>Balance:</strong> ${account.balance.toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {account.status}
          </p>
          <p>
            <strong>License:</strong> {account.license}
          </p>
          {account.purchasedAt && (
            <p>
              <strong>Purchased At:</strong>{" "}
              {new Date(account.purchasedAt).toLocaleString()}
            </p>
          )}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
          <button
            onClick={() => toast.warning("Account suspended")}
            className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded"
          >
            Suspend
          </button>
          <button
            onClick={() => toast.info("Account reset")}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded"
          >
            Reset
          </button>
          <button
            onClick={() => toast.error("Account deleted")}
            className="bg-red-100 text-red-700 px-3 py-1 rounded"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
