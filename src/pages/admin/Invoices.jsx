import React, { useState, useEffect } from "react";
import { getAllInvoices } from "../../features/userAPI";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { format, isValid } from "date-fns";
export default function Invoices() {
  const [selected, setSelected] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  //pdf
  // ✅ Move these inside the component 👇
  const downloadMonthlyPDF = () => {
    const doc = new jsPDF();
    doc.text("EdgeProp – Monthly Invoice Summary", 14, 20);

    const tableData = invoices.map((inv) => [
      inv.id,
      inv.user.username,
      inv.user.email,
      inv.type,
      // inv.category,
      inv.amount,
      inv.paymentMode,
      // format(new Date(inv.date), "yyyy-MM-dd HH:mm"),
      inv.status,
      // inv.source,
      // inv.invoiceLink,
    ]);

    autoTable(doc, {
      head: [
        [
          "Invoice ID",
          "Trader Name",
          "Email",
          "Product Type",
          "Category",
          "Amount (€)",
          "Payment Method",
          "Date",
          "Status",
          "Source",
          "PDF Link",
        ],
      ],
      body: tableData,
      startY: 30,
    });

    doc.save("Monthly_Invoice_Summary.pdf");
  };

  const downloadZipArchive = async () => {
    const zip = new JSZip();

    for (const inv of invoices) {
      try {
        const response = await fetch(inv.invoiceLink);
        const blob = await response.blob();
        zip.file(`${inv.id}.pdf`, blob);
      } catch (err) {
        console.error(`Error fetching ${inv.id}:`, err);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "Invoices_Archive.zip");
    });
  };

  const exportAllCSV = () => {
    const headers = [
      "Invoice ID",
      "Trader Name",
      "Email",
      // "Type",
      // "Category",
      "Amount",
      "Payment Method",
      // "Date",
      "Status",
      // "Source",
      // "Invoice Link",
    ];
    const rows = invoices.map((inv) => [
      inv.id,
      inv.user.username,
      inv.user.email,
      inv.type,
      // inv.category,
      inv.amount,
      inv.paymentMode,
      // format(new Date(inv.date), "yyyy-MM-dd HH:mm"),
      inv.status,
      // inv.source,
      // inv.invoiceLink,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "All_Invoices.csv");
  };
  //above is pdf
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getAllInvoices();
        console.log("Invoices:", data);
        setInvoices(data);
      } catch (err) {
        console.error("Failed to load invoices", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((inv) => inv.id));
    }
  };

  const exportCSV = () => {
    const headers = [
      "Invoice ID",
      "Trader Name",
      "Email",
      // "Type",
      // "Category",
      "Amount",
      "Payment Method",
      // "Date",
      "Status",
      // "Source",
      // "Invoice Link",
    ];
    const rows = invoices.map((inv) => [
      inv.id,
      inv.user.username,
      inv.user.email,
      // inv.type,
      // inv.category,
      inv.amount,
      inv.paymentMode,
      // format(new Date(inv.date), "yyyy-MM-dd HH:mm"),
      // isValid(new Date(inv.date))
      //   ? format(new Date(inv.date), "yyyy-MM-dd HH:mm")
      //   : "Invalid Date",
      inv.status,
      // inv.source,
      // inv.invoiceLink,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "edgeprop_invoices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = invoices.filter((inv) => {
    const searchMatch =
      (inv?.user.username || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (inv?.email || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (inv?.id || "").toLowerCase().includes(searchText.toLowerCase());

    const categoryMatch = productCategory
      ? inv?.category === productCategory
      : true;

    const methodMatch = paymentMethod
      ? inv?.paymentMode === paymentMethod
      : true;

    const statusMatch = statusFilter ? inv?.status === statusFilter : true;

    const sourceMatch = sourceFilter ? inv?.source === sourceFilter : true;

    const fromMatch = fromDate
      ? new Date(inv?.date) >= new Date(fromDate)
      : true;

    const toMatch = toDate ? new Date(inv?.date) <= new Date(toDate) : true;

    return (
      searchMatch &&
      categoryMatch &&
      methodMatch &&
      statusMatch &&
      sourceMatch &&
      fromMatch &&
      toMatch
    );
  });

  if (loading)
    return <div className="p-4 text-gray-600">Loading invoices...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        Admin – Invoices & Financial Reporting
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        Powered by <strong>Oblio API</strong> & Internal Logic. Role: Finance /
        Accountant only.
      </p>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Trader Name, Email, Invoice ID"
          className="border px-3 py-2 rounded w-full"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded w-full"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Evaluation">Evaluation</option>
          <option value="Reset">Reset</option>
          <option value="Activation">Activation</option>
        </select>

        <select
          className="border px-3 py-2 rounded w-full"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">All Payment Methods</option>
          <option value="Card">Card</option>
          <option value="PayPal">PayPal</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>

        <select
          className="border px-3 py-2 rounded w-full"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        <select
          className="border px-3 py-2 rounded w-full"
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
        >
          <option value="">All Sources</option>
          <option value="Oblio">Oblio</option>
          <option value="Internal">Internal</option>
        </select>

        <input
          type="date"
          className="border px-3 py-2 rounded w-full"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          className="border px-3 py-2 rounded w-full"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button
          className="bg-gray-600 text-white px-4 py-2 rounded w-full"
          onClick={() => {
            setSearchText("");
            setProductCategory("");
            setPaymentMethod("");
            setStatusFilter("");
            setSourceFilter("");
            setFromDate("");
            setToDate("");
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Search + Export */}
      <div className="flex justify-between gap-4 mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={exportCSV}
        >
          Export CSV
        </button>
      </div>

      {/* Table */}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="whitespace-nowrap">
              <th className="px-4 py-3 border border-gray-300">Invoice ID</th>
              <th className="px-4 py-3 border border-gray-300">Trader Name</th>
              <th className="px-4 py-3 border border-gray-300">Email</th>
              <th className="px-4 py-3 border border-gray-300">Amount (€)</th>
              <th className="px-4 py-3 border border-gray-300">
                Payment Method
              </th>
              <th className="px-4 py-3 border border-gray-300">Status</th>
              <th className="px-4 py-3 border border-gray-300">PDF Link</th>
              <th className="px-4 py-3 border border-gray-300">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className={`hover:bg-blue-50 transition duration-200 ${
                    selected.includes(inv.id) ? "bg-blue-50" : ""
                  }`}
                >
                  {/* Invoice ID */}
                  <td
                    className="px-4 py-3 border border-gray-300 font-mono max-w-[150px] truncate overflow-hidden whitespace-nowrap"
                    title={inv.id}
                  >
                    {inv.id}
                  </td>

                  {/* Trader Name */}
                  <td
                    className="px-4 py-3 border border-gray-300 max-w-[150px] truncate overflow-hidden whitespace-nowrap"
                    title={inv.user.username}
                  >
                    {inv.user.username}
                  </td>

                  {/* Email */}
                  <td
                    className="px-4 py-3 border border-gray-300 max-w-[180px] truncate overflow-hidden whitespace-nowrap"
                    title={inv.user.email}
                  >
                    {inv.user.email}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 border border-gray-300">
                    € {inv.amount}
                  </td>

                  {/* Payment Method */}
                  <td className="px-4 py-3 border border-gray-300">
                    {inv.paymentMode}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3 border border-gray-300">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        inv.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  {/* PDF Link */}
                  <td className="px-4 py-3 border border-gray-300">
                    <a
                      href={inv.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-xs"
                    >
                      View PDF
                    </a>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 border border-gray-300 space-x-2">
                    <button
                      className="text-green-600 text-xs hover:underline"
                      onClick={() => alert(`Downloading CSV for ${inv.id}...`)}
                    >
                      CSV
                    </button>
                    <button
                      className="text-yellow-600 text-xs hover:underline"
                      onClick={() =>
                        alert(`Generating internal invoice for ${inv.id}...`)
                      }
                    >
                      Internal
                    </button>
                    <button
                      className="text-blue-600 text-xs hover:underline"
                      onClick={() =>
                        alert(`Regenerating via Oblio for ${inv.id}...`)
                      }
                    >
                      Regenerate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-4 text-gray-500 border border-gray-300"
                >
                  No invoices found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Monthly Report Section */}
      <div className="mt-8 border border-gray-200 rounded-lg bg-white shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          📁 Monthly Report Export
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* PDF Summary */}
          {/* <button
            onClick={() => alert("Downloading Monthly Summary (PDF)...")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded flex items-center justify-center shadow-sm transition"
          >
            📄 Monthly Summary (PDF)
          </button> */}
          <button
            onClick={downloadMonthlyPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded flex items-center justify-center shadow-sm transition"
          >
            📄 Monthly Summary (PDF)
          </button>

          {/* ZIP Archive */}
          {/* <button
            onClick={() => alert("Downloading ZIP Archive of Invoices...")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded flex items-center justify-center shadow-sm transition"
          >
            🗂️ ZIP Archive of Invoices
          </button> */}
          <button
            onClick={downloadZipArchive}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded flex items-center justify-center shadow-sm transition"
          >
            🗂️ ZIP Archive of Invoices
          </button>

          {/* CSV Export */}
          {/* <button
            onClick={() => alert("Exporting All Invoices as CSV...")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded flex items-center justify-center shadow-sm transition"
          >
            📊 Export All Invoices (CSV)
          </button> */}
          <button
            onClick={exportAllCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded flex items-center justify-center shadow-sm transition"
          >
            📊 Export All Invoices (CSV)
          </button>
        </div>
      </div>
    </div>
  );
}
