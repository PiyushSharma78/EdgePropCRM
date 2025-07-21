import React, { useState } from "react";

const initialAdmins = [
  {
    id: 1,
    name: "Main Admin",
    email: "admin@edgeprop.com",
    role: "Super Admin",
    status: "Active",
    createdAt: "2025-06-10 09:00",
  },
  {
    id: 2,
    name: "Mihai Stan",
    email: "mihai@edgeprop.com",
    role: "Support Staff",
    status: "Active",
    createdAt: "2025-06-15 12:30",
  },
];

const AdminSettingsAccess = () => {
  const [admins, setAdmins] = useState(initialAdmins);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Support Staff",
  });
  const [status, setStatus] = useState("");

  const addAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      setStatus("❗ Name and email are required.");
      return;
    }
    const newEntry = {
      id: admins.length + 1,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      status: "Active",
      createdAt: new Date().toLocaleString(),
    };
    setAdmins([newEntry, ...admins]);
    setNewAdmin({ name: "", email: "", role: "Support Staff" });
    setStatus(`✅ Admin ${newEntry.name} added.`);
  };

  const deactivateAdmin = (id) => {
    const updated = admins.map((a) =>
      a.id === id ? { ...a, status: "Inactive" } : a
    );
    setAdmins(updated);
    setStatus("🔒 Admin access revoked.");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">
        Admin Panel – Settings & Access Management
      </h1>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Add New Admin</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input
            className="border px-4 py-2 rounded"
            placeholder="Full Name"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
          />
          <input
            className="border px-4 py-2 rounded"
            placeholder="Email Address"
            value={newAdmin.email}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, email: e.target.value })
            }
          />
          <input
            className="border px-4 py-2 rounded"
            placeholder="Temporary Password"
            type="password"
          />
          <select
            className="border px-4 py-2 rounded"
            value={newAdmin.role}
            onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
          >
            <option value="Support Staff">Support Staff</option>
            <option value="Manager">Manager</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>
        <button
          onClick={addAdmin}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Admin
        </button>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Current Admin Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-t">
                  <td className="p-2 font-semibold text-blue-700">
                    {admin.id}
                  </td>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.role}</td>
                  <td>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        admin.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {admin.status}
                    </span>
                  </td>
                  <td>{admin.createdAt}</td>
                  <td>
                    {admin.status === "Active" && (
                      <button
                        onClick={() => deactivateAdmin(admin.id)}
                        className="text-red-600 text-xs underline"
                      >
                        Revoke Access
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {status && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded">
          {status}
        </div>
      )}
    </div>
  );
};

export default AdminSettingsAccess;
