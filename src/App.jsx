// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./features/auth/authSlice";

import AdminSidebarLayout from "./layout/AdminSidebarLayout";
// import StaffSidebarLayout from "./layout/StaffSidebarLayout";

import AdminDashboard from "./pages/admin/Dashboard";
import Traders from "./pages/admin/Traders";
import TraderProfile from "./pages/admin/Traders/TraderProfile";

import KYC from "./pages/admin/KYC";
import Payouts from "./pages/admin/Payouts";
import Invoices from "./pages/admin/Invoices";
import Licenses from "./pages/admin/Licenses";
import StaffTasks from "./pages/admin/StaffTasks";
import TraderContractStatus from "./pages/admin/TraderContractStatus";
import Accounts from "./pages/admin/Accounts";
import Subscriptions from "./pages/admin/Subscriptions";

import StaffDashboard from "./pages/staff/Dashboard";
// import Tasks from "./pages/staff/Tasks";
import KYCReview from "./pages/staff/KYCReview";

import Login from "./pages/login/Login";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedRoute from "./auth/RoleBasedRoute";
import AdminSupportNewsletter from "./pages/admin/AdminSupportNewsletter";
import AdminSettingsAccess from "./pages/admin/AdminSettingsAccess";
import AdminBatchPerformancePage from "./pages/admin/AdminBatchPerformancePage";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  const dispatch = useDispatch(); // ✅ Added this

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch(setUser(JSON.parse(user))); // ✅ set user from localStorage
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={["ADMIN", "admin"]}>
              <AdminSidebarLayout />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="traders" element={<Traders />} />
        <Route path="traders/:id" element={<TraderProfile />} />
        <Route path="kyc" element={<KYC />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="licenses" element={<Licenses />} />
        <Route path="staff-tasks" element={<StaffTasks />} />
        <Route path="contract-status" element={<TraderContractStatus />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="support" element={<AdminSupportNewsletter />} />
        <Route path="settings" element={<AdminSettingsAccess />} />
        <Route path="performance" element={<AdminBatchPerformancePage />} />
      </Route>

      {/* Staff Routes (commented) */}
      {/* <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["staff"]}>
              <StaffSidebarLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="kycreview" element={<KYCReview />} />
      </Route> */}
    </Routes>
  );
}
