import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const dummyKycList = [
  {
    id: "TR001",
    name: "Ravi Kumar",
    pan: "pan-tr001.pdf",
    aadhar: "aadhar-tr001.pdf",
    status: "Pending",
  },
  {
    id: "TR002",
    name: "Anjali Verma",
    pan: "pan-tr002.pdf",
    aadhar: "aadhar-tr002.pdf",
    status: "Pending",
  },
  {
    id: "TR003",
    name: "Mohit Sharma",
    pan: "pan-tr003.pdf",
    aadhar: "aadhar-tr003.pdf",
    status: "Approved",
  },
];

export default function KYCReview() {
  const [kycList, setKycList] = useState(dummyKycList);
  const [confirm, setConfirm] = useState({
    open: false,
    trader: null,
    action: "",
  });

  const openConfirm = (trader, action) => {
    setConfirm({ open: true, trader, action });
  };

  const handleConfirm = () => {
    const { trader, action } = confirm;
    const updated = kycList.map((t) =>
      t.id === trader.id ? { ...t, status: action } : t
    );
    setKycList(updated);
    toast.success(`KYC ${action} for ${trader.name}`);
    setConfirm({ open: false, trader: null, action: "" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6">
        🧾 KYC Review (Staff)
      </h2>

      <div className="overflow-x-auto rounded-xl shadow border bg-white">
        <table className="w-full text-sm sm:text-base">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">PAN</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Aadhar</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {kycList.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">
                  <a
                    href={`/${user.pan}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View PAN
                  </a>
                </td>
                <td className="px-4 py-2">
                  <a
                    href={`/${user.aadhar}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Aadhar
                  </a>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full ${
                      user.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : user.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  {user.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => openConfirm(user, "Approved")}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openConfirm(user, "Rejected")}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 italic text-xs">
                      Reviewed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, trader: null, action: "" })}
        onConfirm={handleConfirm}
        title={`Confirm ${confirm.action}`}
        message={
          confirm.trader
            ? `Are you sure you want to ${confirm.action.toLowerCase()} KYC for ${
                confirm.trader.name
              }?`
            : ""
        }
      />
    </div>
  );
}
