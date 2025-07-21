import React, { useEffect, useState } from "react";
import { getAllAccounts } from "../../features/userAPI";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null); // For modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAccounts();
        setAccounts(data);
      } catch (err) {
        console.error("Error fetching accounts:", err);
      }
    };
    fetchData();
  }, []);

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.user?.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || acc.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* 🔍 Filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">All Accounts</h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            placeholder="Search by account or trader"
            className="border rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* 📊 Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "Account No.",
                "Name",
                "Type",
                "Status",
                "Balance",
                "Profit Target",
                "Drawdown",
                "Max Contracts",
                "Micro Contracts",
                "Market Data",
                "Capital",
                "License",
                "Trader",
                "Evaluation",
                "Created At",
                "Expires At",
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
            {filteredAccounts.map((acc) => (
              <tr
                key={acc.id}
                className="hover:bg-blue-50 transition duration-200"
              >
                <td className="px-4 py-3 border border-gray-300 font-mono">
                  {acc.accountNumber}
                </td>
                <td className="px-4 py-3 border border-gray-300">{acc.name}</td>
                <td className="px-4 py-3 border border-gray-300">{acc.type}</td>
                <td className="px-4 py-3 border border-gray-300">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      acc.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {acc.status}
                  </span>
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  € {acc.balance}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  € {acc.profitTarget}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  € {acc.trailingDrawdown}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {acc.maxContracts}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {acc.microMaxContracts}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {acc.marketDataOption}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  € {acc.capital}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {acc.softwareLicense}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  <button
                    onClick={() => setSelectedUser(acc.user)}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {acc.user?.username}
                  </button>
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {acc.evaluationResult}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {new Date(acc.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {new Date(acc.expiresAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {filteredAccounts.length === 0 && (
              <tr>
                <td
                  colSpan={16}
                  className="text-center py-4 text-gray-500 border"
                >
                  No accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 👤 User Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

// 📦 Modal Component (inside same file)
function UserDetailModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          User Details
        </h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Password:</strong> {user.password}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Google ID:</strong> {user.googleId || "N/A"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(user.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(user.updatedAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
