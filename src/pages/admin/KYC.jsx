import { useState, useEffect, Fragment } from "react";
import toast from "react-hot-toast";
import { getAllKycTraders, updateKycStatus } from "../../features/userAPI";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { Dialog, Transition } from "@headlessui/react";

export default function KYC() {
  const [kycList, setKycList] = useState([]);
  const [logs, setLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [detailModal, setDetailModal] = useState({ open: false, trader: null });

  useEffect(() => {
    const saved = localStorage.getItem("kycLogs");
    if (saved) setLogs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const fetchKycList = async () => {
      try {
        const data = await getAllKycTraders(); // uses /admin/allkyc
        setKycList(data);
      } catch (error) {
        toast.error("Failed to fetch KYC data");
        console.error(error);
      }
    };

    fetchKycList();
  }, []);

  const openModal = (id, newStatus) => {
    const user = kycList.find((u) => u.id === id);
    setPendingAction({ id, newStatus, name: user.fullName });
    setModalOpen(true);
  };

  const confirmAction = async () => {
    const { id, newStatus, name } = pendingAction;

    try {
      await updateKycStatus({ id, status: newStatus });

      const updated = kycList.map((u) =>
        u.id === id ? { ...u, status: newStatus } : u
      );
      setKycList(updated);

      const newLog = {
        id,
        name,
        action: newStatus,
        time: new Date().toLocaleString(),
        by: "Admin",
      };
      const updatedLogs = [...logs, newLog];
      setLogs(updatedLogs);
      localStorage.setItem("kycLogs", JSON.stringify(updatedLogs));

      toast.success(`KYC ${newStatus} successfully!`);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setModalOpen(false);
    }
  };

  // const exportCSV = () => {
  //   const rows = [["Trader ID", "Name", "Action", "Time", "By"]];
  //   logs.forEach((log) =>
  //     rows.push([log.id, log.name, log.action, log.time, log.by])
  //   );
  //   const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], {
  //     type: "text/csv",
  //   });
  //   const a = document.createElement("a");
  //   a.href = URL.createObjectURL(blob);
  //   a.download = "kyc_logs.csv";
  //   a.click();
  // };

  const exportCSV = () => {
    const rows = [
      [
        "User ID",
        "Full Name",
        "Nationality",
        "Email",
        "Phone",
        "Address",
        "City",
        "Status",
      ],
    ];

    paginatedList.forEach((user) => {
      rows.push([
        user.userId,
        user.fullName,
        user.nationality,
        user.email,
        user.phone,
        user.address,
        user.city,
        user.status,
      ]);
    });

    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kyc_export.csv";
    a.click();
  };

  const filteredList = kycList.filter((user) => {
    const matchSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.userId.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filter === "All" || user.status?.toLowerCase() === filter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = filteredList.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-blue-700">KYC Documents</h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name or userId"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded text-sm w-full sm:w-auto"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded text-sm w-full sm:w-auto"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <button
            onClick={exportCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Export Logs
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse bg-white shadow-md rounded-xl">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "User ID",
                "Full Name",
                "Nationality",
                "Email",
                "Phone",
                "Address",
                "City",
                "Status",
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
            {paginatedList.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-4 text-gray-500 border border-gray-300"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedList.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-50 transition duration-200"
                >
                  <td className="px-4 py-3 border border-gray-300">
                    {user.userId}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {user.fullName}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {user.nationality}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {user.phone}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {user.address}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {user.city}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                        user.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : user.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border border-gray-300 space-x-1">
                    <button
                      onClick={() => openModal(user.id, "approved")}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openModal(user.id, "rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        setDetailModal({ open: true, trader: user })
                      }
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
        <span>
          Page {totalPages === 0 ? 1 : currentPage} of{" "}
          {totalPages === 0 ? 1 : totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {pendingAction && (
        <ConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={confirmAction}
          title={`Confirm ${pendingAction.newStatus}`}
          message={`Are you sure you want to ${pendingAction.newStatus} KYC for ${pendingAction.name}?`}
        />
      )}

      {/* Trader Detail Modal */}
      <Transition appear show={detailModal.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setDetailModal({ open: false, trader: null })}
        >
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-bold text-blue-600 mb-4">
                Trader Details
              </Dialog.Title>
              {detailModal.trader && (
                <div className="text-sm text-gray-800 space-y-3">
                  <p>
                    <strong>User ID:</strong> {detailModal.trader.userId}
                  </p>
                  <p>
                    <strong>Full Name:</strong> {detailModal.trader.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {detailModal.trader.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {detailModal.trader.phone}
                  </p>
                  <p>
                    <strong>Nationality:</strong>{" "}
                    {detailModal.trader.nationality}
                  </p>

                  <div>
                    <strong>ID Document:</strong>{" "}
                    <a
                      href={detailModal.trader.idDocumentUrl}
                      target="_blank"
                      className="text-blue-600 underline mr-2"
                    >
                      View
                    </a>
                    <a
                      href={detailModal.trader.idDocumentUrl}
                      download
                      className="text-gray-600 underline text-sm"
                    >
                      Download
                    </a>
                  </div>
                  <div>
                    <strong>ID Back:</strong>{" "}
                    <a
                      href={detailModal.trader.idBackUrl}
                      target="_blank"
                      className="text-blue-600 underline mr-2"
                    >
                      View
                    </a>
                    <a
                      href={detailModal.trader.idBackUrl}
                      download
                      className="text-gray-600 underline text-sm"
                    >
                      Download
                    </a>
                  </div>
                  <div>
                    <strong>Selfie:</strong>{" "}
                    <a
                      href={detailModal.trader.selfieUrl}
                      target="_blank"
                      className="text-blue-600 underline mr-2"
                    >
                      View
                    </a>
                    <a
                      href={detailModal.trader.selfieUrl}
                      download
                      className="text-gray-600 underline text-sm"
                    >
                      Download
                    </a>
                  </div>

                  <div>
                    <strong>KYC Logs:</strong>
                    <ul className="mt-1 space-y-1 text-xs">
                      {logs.filter((log) => log.id === detailModal.trader.id)
                        .length === 0 ? (
                        <li className="text-gray-400">No logs found.</li>
                      ) : (
                        logs
                          .filter((log) => log.id === detailModal.trader.id)
                          .map((log, i) => (
                            <li key={i} className="border-b pb-1">
                              {log.action} by {log.by} on {log.time}
                            </li>
                          ))
                      )}
                    </ul>
                  </div>
                </div>
              )}
              <div className="mt-4 text-right">
                <button
                  onClick={() => setDetailModal({ open: false, trader: null })}
                  className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
