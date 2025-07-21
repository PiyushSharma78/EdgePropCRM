import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllTraders } from "../../features/userAPI";
import { getAllKycTraders } from "../../features/userAPI";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Sample data
const accountSalesData = [
  { month: "Jan", accounts: 30 },
  { month: "Feb", accounts: 42 },
  { month: "Mar", accounts: 38 },
  { month: "Apr", accounts: 55 },
  { month: "May", accounts: 70 },
  { month: "Jun", accounts: 63 },
];

const newTradersData = [
  { month: "Jan", traders: 25 },
  { month: "Feb", traders: 40 },
  { month: "Mar", traders: 35 },
  { month: "Apr", traders: 50 },
  { month: "May", traders: 65 },
  { month: "Jun", traders: 58 },
];

const revenueData = [
  { month: "Jan", revenue: 3000 },
  { month: "Feb", revenue: 4200 },
  { month: "Mar", revenue: 3800 },
  { month: "Apr", revenue: 5500 },
  { month: "May", revenue: 7000 },
  { month: "Jun", revenue: 6300 },
];

const payoutData = [
  { month: "Jan", requested: 10, approved: 7 },
  { month: "Feb", requested: 12, approved: 10 },
  { month: "Mar", requested: 15, approved: 12 },
  { month: "Apr", requested: 18, approved: 16 },
  { month: "May", requested: 22, approved: 19 },
  { month: "Jun", requested: 17, approved: 14 },
];

const traderStatusData = [
  { name: "Active", value: 60 },
  { name: "Pending KYC", value: 15 },
  { name: "Funded", value: 20 },
  { name: "Evaluating", value: 33 },
];

const topTraders = [
  { name: "Alex Brown", profit: 4200, days: 15, status: "Funded" },
  { name: "Maria Lopez", profit: 3900, days: 13, status: "Funded" },
  { name: "John Doe", profit: 3650, days: 10, status: "Active" },
];

const activityLog = [
  { user: "Alex Brown", action: "Requested Payout", date: "2025-06-17 12:45" },
  {
    user: "Jane Smith",
    action: "Uploaded KYC Document",
    date: "2025-06-17 11:30",
  },
  {
    user: "Maria Lopez",
    action: "Completed Evaluation",
    date: "2025-06-17 10:15",
  },
];

const recentPayouts = [
  {
    id: 1,
    trader: "Alex Brown",
    amount: 1200,
    method: "PayPal",
    status: "Pending",
    timestamp: "2025-06-20 14:35",
  },
  {
    id: 2,
    trader: "Maria Lopez",
    amount: 950,
    method: "Bank",
    status: "Approved",
    timestamp: "2025-06-19 16:10",
  },
  {
    id: 3,
    trader: "John Doe",
    amount: 700,
    method: "Crypto",
    status: "Rejected",
    timestamp: "2025-06-18 11:00",
  },
];
const statusBadge = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const getBadgeStyle = (action) => {
  if (action.toLowerCase().includes("kyc"))
    return "bg-yellow-100 text-yellow-800";
  if (action.toLowerCase().includes("payout"))
    return "bg-blue-100 text-blue-800";
  if (action.toLowerCase().includes("evaluation"))
    return "bg-green-100 text-green-800";
  if (action.toLowerCase().includes("flagged"))
    return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];

export default function Dashboard() {
  //
  const [totalTraders, setTotalTraders] = useState(0);
  const [totalKyc, setTotalKyc] = useState(0);

  const handleSendNewsletter = () => alert("Newsletter sent to all traders!");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTraders = async () => {
      try {
        const data = await getAllTraders();
        setTotalTraders(data.length);
      } catch (error) {
        console.error("Failed to fetch traders:", error);
      }
    };

    fetchTraders();
  }, []);

  useEffect(() => {
    const fetchKycTraders = async () => {
      try {
        const data = await getAllKycTraders();
        setTotalKyc(data.length);
      } catch (error) {
        console.error("Failed to fetch KYC traders:", error);
      }
    };

    fetchKycTraders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <main className="flex-1 p-4 md:p-6 space-y-8 overflow-y-auto">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            onClick={() => navigate("/admin/traders")}
            className="bg-blue-100 text-blue-900 p-4 rounded-xl shadow text-center"
          >
            <h2 className="text-sm">Total Traders</h2>
            <p className="text-2xl font-bold">{totalTraders}</p>
          </div>

          <div className="bg-yellow-100 text-yellow-900 p-4 rounded-xl shadow text-center">
            <h2 className="text-sm">Total KYC</h2>
            <p className="text-2xl font-bold">{totalKyc}</p>
          </div>
          <div className="bg-green-100 text-green-900 p-4 rounded-xl shadow text-center">
            <h2 className="text-sm">Payout Requests</h2>
            <p className="text-2xl font-bold">9</p>
          </div>
          <div className="bg-purple-100 text-purple-900 p-4 rounded-xl shadow text-center">
            <h2 className="text-sm">Active Accounts</h2>
            <p className="text-2xl font-bold">92</p>
          </div>
          <div className="bg-green-200 text-green-900 p-4 rounded-xl shadow text-center col-span-full sm:col-span-2 lg:col-span-1">
            <h2 className="text-sm">Monthly Revenue</h2>
            <p className="text-2xl font-bold">€23,500</p>
          </div>
          <div className="bg-indigo-100 text-indigo-900 p-4 rounded-xl shadow text-center col-span-full sm:col-span-2 lg:col-span-1">
            <h2 className="text-sm">Licenses Issued This Month</h2>
            <p className="text-2xl font-bold">27</p>
          </div>
          <div className="bg-rose-100 text-rose-900 p-4 rounded-xl shadow text-center col-span-full sm:col-span-2 lg:col-span-1">
            <h2 className="text-sm">Accounts Under Monitoring</h2>
            <p className="text-2xl font-bold">6</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">
              Accounts Sold / Month
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={accountSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accounts" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">New Traders / Month</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={newTradersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="traders" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Revenue / Month</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">
              Payouts: Requested vs Approved
            </h2>

            {/* 🟠 Legend */}
            <div className="flex gap-4 mb-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-2 bg-orange-400"></span>
                <span className="text-gray-700">Requested Payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-2 bg-emerald-500"></span>
                <span className="text-gray-700">Approved Payouts</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={payoutData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  dataKey="requested"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Requested"
                />
                <Line
                  dataKey="approved"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Approved"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}

        <div className="bg-white p-4 rounded shadow max-w-xl mx-auto">
          <h2 className="text-lg font-semibold mb-2">
            Trader Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={traderStatusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {traderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]} // 🔁 matches index with consistent color
                  />
                ))}
              </Pie>
              <Legend /> {/* ℹ️ shows name + color */}
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Traders */}

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Top Performing Traders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse bg-white">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {["Trader Name", "Profit", "Days Active", "Account Type"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 border border-gray-300 font-medium"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {topTraders.length > 0 ? (
                  topTraders.map((t, i) => (
                    <tr
                      key={i}
                      className="hover:bg-blue-50 transition duration-200"
                    >
                      <td className="px-4 py-3 border border-gray-300 font-medium">
                        {t.name}
                      </td>
                      <td className="px-4 py-3 border border-gray-300">
                        €{t.profit}
                      </td>
                      <td className="px-4 py-3 border border-gray-300">
                        {t.days}
                      </td>
                      <td className="px-4 py-3 border border-gray-300">
                        {t.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-4 text-gray-500 border border-gray-300"
                    >
                      No top traders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Activity */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="divide-y text-sm text-gray-800">
            {activityLog.map((a, i) => (
              <li
                key={i}
                className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <strong>{a.user}</strong> – {a.action}
                  <span className="text-gray-500 block sm:inline sm:ml-2">
                    ({a.date})
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeStyle(
                    a.action
                  )}`}
                >
                  {a.action.includes("flagged")
                    ? "Alert"
                    : a.action.includes("payout")
                    ? "Payout"
                    : a.action.includes("KYC")
                    ? "KYC Update"
                    : a.action.includes("evaluation")
                    ? "Evaluation"
                    : "Info"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payouts */}

        <div className="bg-white p-4 rounded shadow mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Payout Requests</h2>
            <button className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
              Bulk Approve
            </button>
          </div>

          {/* 👇 Max height added here */}
          <div className="overflow-auto max-h-[400px]">
            <table className="min-w-full text-sm table-auto">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Trader
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Method
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Timestamp
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-800">
                {recentPayouts.map((payout) => (
                  <tr key={payout.id}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {payout.trader}
                    </td>
                    <td className="px-4 py-2 font-medium text-blue-700 whitespace-nowrap">
                      €{payout.amount}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {payout.method}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          statusBadge[payout.status]
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500 whitespace-nowrap">
                      {payout.timestamp}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:underline text-xs"
                        onClick={() =>
                          alert(`Viewing details for ${payout.trader}`)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {/* 📌 Quick Actions Floating Panel */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-lg shadow-lg p-4 w-72 border border-gray-200">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">
            Quick Actions
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => alert("CSV Report Exported")}
              className="w-full px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Export CSV
            </button>

            <button
              onClick={() => alert("Announcement modal opened")}
              className="w-full px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700"
            >
              Send Announcement
            </button>

            <button
              onClick={() => alert("Monthly Summary PDF generated")}
              className="w-full px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Generate PDF
            </button>

            <button
              onClick={() => alert("Manual Sync Triggered")}
              className="w-full px-4 py-2 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Trigger Sync 🔄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
