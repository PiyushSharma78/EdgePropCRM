import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllTraders } from "../../features/userAPI";
import { useNavigate } from "react-router-dom";

import AccountModal from "../../components/crm/AccountModal";
import AssignLicenseModal from "../../components/crm/AssignLicenseModal";
import AddAccountModal from "../../components/crm/AddAccountModal";

const Traders = () => {
  const navigate = useNavigate();

  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalTrader, setModalTrader] = useState(null);
  const [licenseModalTrader, setLicenseModalTrader] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const tradersPerPage = 10;

  useEffect(() => {
    const fetchTraders = async () => {
      try {
        const data = await getAllTraders();
        const safeData = data.map((t) => ({
          ...t,
          evalAccounts: t.evalAccounts || [],
          fundedAccounts: t.fundedAccounts || [],
        }));
        setTraders(safeData);
      } catch (err) {
        toast.error("Failed to load traders.");
      } finally {
        setLoading(false);
      }
    };
    fetchTraders();
  }, []);

  const filtered = traders
    .filter((t) => {
      const matchSearch =
        t.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        t.email?.toLowerCase().includes(searchTerm?.toLowerCase());
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "email") return a.email.localeCompare(b.email);
      if (sortBy === "eval")
        return b.evalAccounts.length - a.evalAccounts.length;
      return 0;
    });

  const paginated = filtered.slice(
    (currentPage - 1) * tradersPerPage,
    currentPage * tradersPerPage
  );
  const totalPages = Math.ceil(filtered.length / tradersPerPage);

  if (loading)
    return <div className="p-6 text-gray-700">Loading traders...</div>;

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        EdgeProp Traders
      </h1>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border px-3 py-1 rounded text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border px-2 py-1 rounded text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="funded">Funded</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          className="border px-2 py-1 rounded text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="eval">Sort by Eval Count</option>
        </select>
      </div>

      <table className="min-w-full text-sm text-left border-collapse bg-white shadow rounded">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {[
              "ID",
              "UserName",
              "Email",
              "FullName",
              "Address",
              "Evaluation",
              "Funded",
              "Actions",
              "View Profile",
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
          {paginated.map((trader) => (
            <tr
              key={trader.id}
              className="hover:bg-blue-50 transition duration-200 align-top"
            >
              <td
                className="px-4 py-3 border border-gray-300 font-mono text-sm max-w-[105px] truncate"
                title={trader.id}
              >
                {trader.id}
              </td>
              <td
                className="px-4 py-3 border border-gray-300 text-blue-700 underline cursor-pointer"
                onClick={() => setSelectedTrader(trader)}
              >
                {trader.username}
              </td>
              <td
                className="px-4 py-3 border border-gray-300 max-w-[105px] truncate text-sm"
                title={trader.email}
              >
                {trader.email}
              </td>
              <td
                className="px-4 py-3 border border-gray-300 max-w-[105px] truncate text-sm"
                title={trader.profile?.fullName}
              >
                {trader.profile?.fullName}
              </td>
              <td
                className="px-4 py-3 border border-gray-300 text-xs max-w-[300px] truncate"
                title={
                  trader.address
                    ? `${trader.address.street}, ${trader.address.city}, ${trader.address.country}, ${trader.address.postalCode}`
                    : "N/A"
                }
              >
                {trader.address
                  ? `${trader.address.street}, ${trader.address.city}, ${trader.address.country}, ${trader.address.postalCode}`
                  : "N/A"}
              </td>
              <td className="px-4 py-3 border border-gray-300">
                {
                  trader.accounts.filter((acc) => acc.type === "EVALUATION")
                    .length
                }
              </td>
              <td className="px-4 py-3 border border-gray-300">
                {trader.accounts.filter((acc) => acc.type === "FUNDED").length}
              </td>
              <td className="px-4 py-3 border border-gray-300 text-xs space-y-1">
                <button
                  onClick={() => setLicenseModalTrader(trader)}
                  className="bg-purple-100 text-purple-800 px-2 py-1 rounded block w-full text-left"
                >
                  🎓 Assign License
                </button>
              </td>
              <td className="px-4 py-3 border border-gray-300 text-center">
                <button
                  onClick={() => navigate(`/admin/traders/${trader.id}`)}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}

          {paginated.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className="text-center py-4 text-gray-500 border border-gray-300"
              >
                No traders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={`page-${i}`}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 text-sm rounded border ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-blue-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {selectedAccount && (
        <AccountModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}
      {modalTrader && (
        <AddAccountModal
          trader={modalTrader}
          onAdd={() => {}}
          onClose={() => setModalTrader(null)}
        />
      )}
      {licenseModalTrader && (
        <AssignLicenseModal
          trader={licenseModalTrader}
          onAssign={() => {}}
          onClose={() => setLicenseModalTrader(null)}
        />
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
      />
    </div>
  );
};

export default Traders;
