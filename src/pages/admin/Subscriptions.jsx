import React, { useEffect, useState } from "react";
import { getAllSubscriptions } from "../../features/userAPI";

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSubscriptions();
        setSubs(data);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      }
    };
    fetchData();
  }, []);

  const filteredSubs = subs.filter((sub) => {
    const matchesSearch =
      sub.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.user?.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || sub.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* 🔍 Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">Subscriptions</h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            placeholder="Search by plan or trader"
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
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* 📊 Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "Plan Name",
                "Status",
                "Username",
                "Email",
                "Subscription ID",
                "Price ID",
                "Product ID",
                "Period Start",
                "Period End",
                "Created At",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 border border-gray-300 font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSubs.map((sub) => (
              <tr
                key={sub.id}
                className="hover:bg-blue-50 transition duration-200"
              >
                <td className="px-4 py-3 border border-gray-300 font-mono">
                  {sub.planName}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      sub.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  <button
                    onClick={() => setSelectedUser(sub.user)}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {sub.user?.username}
                  </button>
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {sub.user?.email}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {sub.stripeSubscriptionId}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {sub.stripePriceId}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {sub.stripeProductId}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {new Date(sub.currentPeriodStart).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filteredSubs.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-4 text-gray-500 border"
                >
                  No subscriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 👤 Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

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
