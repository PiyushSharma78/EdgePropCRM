import { ClipboardList, CheckCircle, FileSearch } from "lucide-react";

const stats = [
  {
    title: "Assigned Tasks",
    value: 8,
    icon: <ClipboardList className="w-5 h-5 text-blue-600" />,
    bg: "bg-blue-50",
  },
  {
    title: "KYC Reviews",
    value: 5,
    icon: <FileSearch className="w-5 h-5 text-yellow-600" />,
    bg: "bg-yellow-50",
  },
  {
    title: "Completed Today",
    value: 3,
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    bg: "bg-green-50",
  },
];

const pendingKYC = [
  { id: "TR001", name: "Ravi Kumar", status: "Pending" },
  { id: "TR004", name: "Deepa Singh", status: "Pending" },
  { id: "TR006", name: "Sana Shaikh", status: "Pending" },
];

export default function StaffDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center sm:text-left">
        Welcome, Staff Member 👩‍💻
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl shadow-sm border hover:shadow-md transition ${stat.bg}`}
          >
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-600">
                {stat.title}
              </div>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Pending KYC List */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-lg font-semibold text-gray-700">
          🔍 Pending KYC Reviews
        </h3>
        <p className="text-sm text-gray-500 mb-3">Assigned to you</p>
        <ul className="text-sm text-gray-700 space-y-2">
          {pendingKYC.map((kyc) => (
            <li
              key={kyc.id}
              className="flex justify-between items-center border-b pb-1"
            >
              <span>
                {kyc.name} ({kyc.id})
              </span>
              <span className="text-yellow-600 text-xs sm:text-sm">
                {kyc.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-lg font-semibold text-gray-700">⚡ Quick Access</h3>
        <div className="flex gap-3 mt-3 flex-wrap">
          <a
            href="/staff/tasks"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            View Tasks
          </a>
          <a
            href="/staff/kycreview"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm"
          >
            KYC Review
          </a>
        </div>
      </div>
    </div>
  );
}
