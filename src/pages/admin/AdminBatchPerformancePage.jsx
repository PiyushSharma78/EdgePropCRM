// Admin Performance Batch Manager Page - EdgeProp with Enhanced Features
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockTraders = [
  {
    id: "U001",
    name: "Alex Brown",
    email: "alex@edgeprop.com",
    accounts: [
      {
        id: "A001",
        name: "50K_Rithmic",
        platform: "Rithmic",
        type: "evaluation",
      },
      { id: "A002", name: "100K_CQG", platform: "CQG", type: "funding" },
    ],
  },
  {
    id: "U002",
    name: "Maria Lopez",
    email: "maria@edgeprop.com",
    accounts: [
      {
        id: "A003",
        name: "75K_Rithmic",
        platform: "Rithmic",
        type: "evaluation",
      },
    ],
  },
  {
    id: "U003",
    name: "John Smith",
    email: "john@edgeprop.com",
    accounts: [
      { id: "A004", name: "150K_CQG", platform: "CQG", type: "funding" },
      {
        id: "A005",
        name: "50K_Rithmic",
        platform: "Rithmic",
        type: "evaluation",
      },
    ],
  },
  {
    id: "U004",
    name: "Lisa Chan",
    email: "lisa@edgeprop.com",
    accounts: [
      { id: "A006", name: "25K_CQG", platform: "CQG", type: "evaluation" },
    ],
  },
  {
    id: "U005",
    name: "Omar Youssef",
    email: "omar@edgeprop.com",
    accounts: [
      {
        id: "A007",
        name: "200K_Rithmic",
        platform: "Rithmic",
        type: "funding",
      },
      { id: "A008", name: "100K_CQG", platform: "CQG", type: "evaluation" },
      {
        id: "A009",
        name: "50K_Rithmic",
        platform: "Rithmic",
        type: "evaluation",
      },
    ],
  },
];

const ruleConfigs = {
  "25K": { profitTarget: 1500, maxDrawdown: -1250, minDays: 7 },
  "50K": { profitTarget: 3000, maxDrawdown: -2500, minDays: 7 },
  "75K": { profitTarget: 4500, maxDrawdown: -3500, minDays: 7 },
  "100K": { profitTarget: 6000, maxDrawdown: -5000, minDays: 7 },
  "150K": { profitTarget: 9000, maxDrawdown: -7000, minDays: 7 },
  "200K": { profitTarget: 12000, maxDrawdown: -10000, minDays: 7 },
};

const extractAccountSize = (accountName) => {
  const match = accountName.match(/(\d{2,3})K/);
  return match ? `${match[1]}K` : null;
};

const AdminBatchPerformancePage = () => {
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [batchLinks, setBatchLinks] = useState({});
  const [parsedData, setParsedData] = useState({});
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [validationResults, setValidationResults] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    if (
      header.length !== 4 ||
      !header.includes("date") ||
      !header.includes("pnl") ||
      !header.includes("equity") ||
      !header.includes("drawdown")
    ) {
      throw new Error(
        "CSV must contain 4 columns: date, pnl, equity, drawdown"
      );
    }
    return lines.slice(1).map((line) => {
      const [date, pnl, equity, drawdown] = line
        .split(",")
        .map((val) => val.trim());
      return {
        date,
        pnl: parseFloat(pnl),
        equity: parseFloat(equity),
        drawdown: parseFloat(drawdown),
      };
    });
  };

  const computeSummary = (data) => {
    if (!data?.length) return null;
    const last = data[data.length - 1];
    const pnl = data.reduce((sum, d) => sum + d.pnl, 0);
    const maxDrawdown = Math.min(...data.map((d) => d.drawdown));
    return {
      balance: last.equity,
      equity: last.equity,
      pnl,
      drawdown: maxDrawdown,
      days: data.length,
    };
  };

  const validateAccountRules = (accountName, summary) => {
    const size = extractAccountSize(accountName);
    const rules = ruleConfigs[size];
    if (!rules) return [];
    return [
      summary.pnl >= rules.profitTarget
        ? "✅ Profit Target met"
        : `❌ Profit Target not met (${summary.pnl.toFixed(2)} / ${
            rules.profitTarget
          })`,
      summary.drawdown >= rules.maxDrawdown
        ? "✅ Drawdown OK"
        : `❌ Max Drawdown exceeded (${summary.drawdown.toFixed(2)} < ${
            rules.maxDrawdown
          })`,
      summary.days >= rules.minDays
        ? "✅ Minimum trading days met"
        : `❌ Not enough trading days (${summary.days} / ${rules.minDays})`,
    ];
  };

  const handleBatchAssign = (accountId, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseCSV(reader.result);
        setBatchLinks((prev) => ({ ...prev, [accountId]: file.name }));
        setParsedData((prev) => ({ ...prev, [accountId]: parsed }));
      } catch (err) {
        alert("Invalid file format: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const sampleCSV = `date,pnl,equity,drawdown\n2024-01-01,200,50200,-100\n2024-01-02,300,50500,-50\n2024-01-03,-150,50350,-150\n2024-01-04,400,50750,-80\n2024-01-05,250,51000,-60`;
    const parsed = parseCSV(sampleCSV);
    setBatchLinks({ A001: "Simulated CSV", A003: "Simulated CSV" });
    setParsedData({ A001: parsed, A003: parsed });
  }, []);

  useEffect(() => {
    if (selectedAccountId && parsedData[selectedAccountId]) {
      const acc = selectedTrader?.accounts.find(
        (a) => a.id === selectedAccountId
      );
      const summary = computeSummary(parsedData[selectedAccountId]);
      const validation = validateAccountRules(acc.name, summary);
      setValidationResults((prev) => ({
        ...prev,
        [selectedAccountId]: validation,
      }));
    }
  }, [selectedAccountId, parsedData]);

  const filteredTraders = mockTraders.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // <div className="min-h-screen bg-gray-100 p-6">
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">
        Trader Batch Performance Manager
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search trader by name or email..."
          className="p-2 border rounded w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTraders.map((trader) => {
          const allComplete = trader.accounts.every(
            (acc) => batchLinks[acc.id]
          );
          return (
            <div
              key={trader.id}
              className={`p-4 rounded shadow cursor-pointer ${
                selectedTrader?.id === trader.id ? "bg-blue-100" : "bg-white"
              } border-l-4 ${
                allComplete ? "border-green-500" : "border-yellow-400"
              }`}
              onClick={() => {
                setSelectedTrader(trader);
                setSelectedAccountId(null);
              }}
            >
              <h2 className="text-lg font-semibold">{trader.name}</h2>
              <p className="text-sm text-gray-500">{trader.email}</p>
              <p className="text-sm">Accounts: {trader.accounts.length}</p>
              <p
                className={`text-xs font-medium mt-1 ${
                  allComplete ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {allComplete
                  ? "✅ All batch files uploaded"
                  : "⚠️ Incomplete batch files"}
              </p>
            </div>
          );
        })}
      </div>

      {selectedTrader && (
        <div className="mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">
            {selectedTrader.name} – Batch Assign
          </h2>

          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Account</th>
                <th className="border px-3 py-2">Platform</th>
                <th className="border px-3 py-2">Type</th>
                <th className="border px-3 py-2">Batch File</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedTrader.accounts.map((acc) => (
                <tr
                  key={acc.id}
                  className={selectedAccountId === acc.id ? "bg-blue-50" : ""}
                >
                  <td
                    className="border px-3 py-2 cursor-pointer text-blue-600 hover:underline"
                    onClick={() => setSelectedAccountId(acc.id)}
                  >
                    {acc.name}
                  </td>
                  <td className="border px-3 py-2">{acc.platform}</td>
                  <td className="border px-3 py-2 capitalize">{acc.type}</td>
                  <td className="border px-3 py-2 text-sm text-gray-500">
                    {batchLinks[acc.id] || "No file"}
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={(e) =>
                        handleBatchAssign(acc.id, e.target.files[0])
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedAccountId && parsedData[selectedAccountId] && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Performance Summary</h3>
              {(() => {
                const summary = computeSummary(parsedData[selectedAccountId]);
                return summary ? (
                  <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <li>
                      <strong>Balance:</strong> ${summary.balance.toFixed(2)}
                    </li>
                    <li>
                      <strong>Equity:</strong> ${summary.equity.toFixed(2)}
                    </li>
                    <li>
                      <strong>PNL:</strong> ${summary.pnl.toFixed(2)}
                    </li>
                    <li>
                      <strong>Drawdown:</strong> ${summary.drawdown.toFixed(2)}
                    </li>
                  </ul>
                ) : (
                  <p>No summary available</p>
                );
              })()}

              {validationResults[selectedAccountId] && (
                <div className="mt-4">
                  <h4 className="font-medium">Validation Results</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {validationResults[selectedAccountId].map((res, i) => (
                      <li key={i}>{res}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={parsedData[selectedAccountId]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="pnl" stroke="#10b981" />
                    <Line type="monotone" dataKey="equity" stroke="#3b82f6" />
                    <Line type="monotone" dataKey="drawdown" stroke="#ef4444" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBatchPerformancePage;
