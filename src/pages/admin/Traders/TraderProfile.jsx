import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../../components/common/Button";

const TraderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trader, setTrader] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrader = async () => {
      try {
        const res = await axios.get(`/api/traders/${id}`); // ✅ Replace with your actual endpoint
        setTrader(res.data);
      } catch (err) {
        console.error("Error fetching trader:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrader();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!trader) return <div className="p-4 text-red-500">Trader not found</div>;

  const { profile, accounts = [], subscriptions = [], invoices = [] } = trader;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trader Profile</h1>
        <Button onClick={() => navigate(-1)}>← Back</Button>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <p>
          <strong>Full Name:</strong> {profile?.fullName || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {trader.email}
        </p>
        <p>
          <strong>Phone:</strong> {profile?.phone || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {profile?.address || ""},{" "}
          {profile?.city || ""}, {profile?.state || ""} -{" "}
          {profile?.zipCode || ""}
        </p>
        <p>
          <strong>Country:</strong> {profile?.country || "N/A"}
        </p>
        <p>
          <strong>KYC Status:</strong> {profile?.kycStatus || "N/A"}
        </p>
        <p>
          <strong>Rithmic Status:</strong> {profile?.rithmicStatus || "N/A"}
        </p>
      </div>

      {/* Accounts Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Accounts</h2>
        <div className="space-y-2">
          {accounts.length > 0 ? (
            accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 border rounded bg-gray-50 text-sm"
              >
                <p>
                  <strong>Account Number:</strong> {acc.accountNumber}
                </p>
                <p>
                  <strong>Name:</strong> {acc.profile.fullName}
                </p>
                <p>
                  <strong>Status:</strong> {acc.status}
                </p>
                <p>
                  <strong>Balance:</strong> ${acc.balance}
                </p>
                <p>
                  <strong>Capital:</strong> ${acc.capital}
                </p>
                <p>
                  <strong>Profit Target:</strong> ${acc.profitTarget}
                </p>
                <p>
                  <strong>Trailing Drawdown:</strong> ${acc.trailingDrawdown}
                </p>
                <p>
                  <strong>Max Contracts:</strong> {acc.maxContracts}
                </p>
                <p>
                  <strong>Micro Max Contracts:</strong> {acc.microMaxContracts}
                </p>
                <p>
                  <strong>Software License:</strong> {acc.softwareLicense}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No accounts available.</p>
          )}
        </div>
      </div>

      {/* Subscriptions Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Subscriptions</h2>
        <div className="space-y-2">
          {subscriptions.length > 0 ? (
            subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 border rounded bg-gray-50 text-sm"
              >
                <p>
                  <strong>Plan:</strong> {sub.planName}
                </p>
                <p>
                  <strong>Status:</strong> {sub.status}
                </p>
                <p>
                  <strong>Current Period:</strong>{" "}
                  {new Date(sub.currentPeriodStart).toLocaleDateString()} -{" "}
                  {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No subscriptions found.</p>
          )}
        </div>
      </div>

      {/* Invoices Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Invoices</h2>
        <div className="space-y-2">
          {invoices.length > 0 ? (
            invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 border rounded bg-gray-50 text-sm"
              >
                <p>
                  <strong>Amount:</strong> ${inv.amount}
                </p>
                <p>
                  <strong>Mode:</strong> {inv.paymentMode}
                </p>
                <p>
                  <strong>Status:</strong> {inv.status}
                </p>
                <p>
                  <a
                    href={inv.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Download PDF
                  </a>
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(inv.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No invoices available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TraderProfile;
