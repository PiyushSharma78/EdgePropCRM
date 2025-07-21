import React, { useState, useMemo } from "react";

const initialLicenses = {
  Bookmap: Array.from({ length: 10 }, (_, i) => `BM-${i + 1000}`),
  ATAS: Array.from({ length: 10 }, (_, i) => `AT-${i + 2000}`),
  Quantower: Array.from({ length: 10 }, (_, i) => `QT-${i + 3000}`),
};

const names = [
  "Alex",
  "Maria",
  "John",
  "Elena",
  "Darius",
  "Luca",
  "Sophia",
  "Daniel",
  "Emma",
  "Victor",
  "Sara",
  "George",
  "Isabel",
  "Andrei",
  "Nina",
];
const surnames = [
  "Popescu",
  "Ionescu",
  "Marin",
  "Stan",
  "Petrescu",
  "Vasilescu",
  "Gheorghiu",
  "Dumitrescu",
  "Stefan",
  "Enache",
];

const generateTraders = () => {
  const platforms = ["Bookmap", "ATAS", "Quantower"];
  return Array.from({ length: 50 }, (_, i) => {
    const firstName = names[Math.floor(Math.random() * names.length)];
    const lastName = surnames[Math.floor(Math.random() * surnames.length)];
    return {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      selectedPlatform: platforms[Math.floor(Math.random() * platforms.length)],
    };
  });
};

const getCurrentDate = () => new Date().toISOString().split("T")[0];
const getExpiryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
};

const generateLicenseCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 21 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

const Licenses = () => {
  const [traders] = useState(generateTraders());
  const [assignedLicenses, setAssignedLicenses] = useState([]);
  const [modalTrader, setModalTrader] = useState(null);
  const [overridePlatform, setOverridePlatform] = useState("");
  const [manualLicenseKey, setManualLicenseKey] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const assignLicense = (trader) => {
    const platform = overridePlatform || trader.selectedPlatform;
    const licenseKey =
      manualLicenseKey.trim() ||
      initialLicenses[platform].find(
        (key) => !assignedLicenses.some((a) => a.licenseKey === key)
      );

    if (!licenseKey)
      return setError(`No available license key for ${platform}`);

    setAssignedLicenses((prev) => [
      ...prev,
      {
        traderId: trader.id,
        name: trader.name,
        platform,
        licenseKey,
        licenseCode: generateLicenseCode(),
        assignedDate: getCurrentDate(),
        expiryDate: getExpiryDate(),
      },
    ]);
    setModalTrader(null);
    setOverridePlatform("");
    setManualLicenseKey("");
    setError("");
  };

  const revokeLicense = (traderId) =>
    setAssignedLicenses((prev) => prev.filter((l) => l.traderId !== traderId));

  const getLicense = (id) => assignedLicenses.find((l) => l.traderId === id);

  const filteredTraders = useMemo(() => {
    return traders.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.selectedPlatform.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, traders]);

  const licensesLeft = useMemo(() => {
    return Object.keys(initialLicenses).reduce((acc, plat) => {
      const used = assignedLicenses.filter((l) => l.platform === plat).length;
      acc[plat] = initialLicenses[plat].length - used;
      return acc;
    }, {});
  }, [assignedLicenses]);

  const daysLeft = (expiryDate) => {
    const days = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return Math.ceil(days);
  };

  const exportCSV = () => {
    const csv = assignedLicenses
      .map(
        (l) =>
          `${l.name},${l.platform},${l.licenseKey},${l.licenseCode},${l.assignedDate},${l.expiryDate}`
      )
      .join("\n");

    const blob = new Blob([`Name,Platform,Key,Code,Assigned,Expires\n${csv}`], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "licenses.csv";
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Licenses</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {Object.entries(licensesLeft).map(([platform, count]) => (
          <div key={platform} className="bg-gray-100 p-4 rounded shadow">
            <h3 className="font-semibold">{platform}</h3>
            <p className="text-xl font-bold">{count} remaining</p>
          </div>
        ))}
      </div>

      {/* CSV Button + Search */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by name or platform..."
          className="w-full sm:w-1/2 border px-4 py-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={exportCSV}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Export to CSV
        </button>
      </div>

      {/* Table */}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm text-left border-collapse bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "#",
                "Name",
                "Platform (Chosen)",
                "Platform (Assigned)",
                "License",
                "Code",
                "Assigned",
                "Expires",
                "Left",
                "Action",
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
            {filteredTraders.map((trader, i) => {
              const license = getLicense(trader.id);
              return (
                <tr
                  key={trader.id}
                  className="hover:bg-blue-50 transition duration-200"
                >
                  <td className="px-4 py-3 border border-gray-300">{i + 1}</td>
                  <td className="px-4 py-3 border border-gray-300">
                    {trader.name}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {trader.selectedPlatform}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {license?.platform || "-"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {license?.licenseKey || "Unassigned"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {license?.licenseCode || "-"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {license?.assignedDate || "-"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {license?.expiryDate || "-"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {license ? `${daysLeft(license.expiryDate)}d` : "-"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {license ? (
                      <button
                        onClick={() => revokeLicense(trader.id)}
                        className="text-red-600 underline text-xs"
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => setModalTrader(trader)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition"
                      >
                        Assign
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalTrader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold">Assign License</h2>
            <p className="mt-2 mb-2">
              <strong>{modalTrader.name}</strong> selected{" "}
              <strong>{modalTrader.selectedPlatform}</strong> at checkout.
            </p>

            <label className="block mb-1">Override Platform (optional):</label>
            <select
              className="w-full border px-3 py-2 rounded mb-2"
              value={overridePlatform || modalTrader.selectedPlatform}
              onChange={(e) => setOverridePlatform(e.target.value)}
            >
              {Object.keys(initialLicenses).map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>

            <label className="block mb-1 mt-2">
              Paste License Key (optional):
            </label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Paste license key manually..."
              value={manualLicenseKey}
              onChange={(e) => setManualLicenseKey(e.target.value)}
            />
            {error && <p className="text-red-600 mb-2">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalTrader(null)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => assignLicense(modalTrader)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Licenses;
