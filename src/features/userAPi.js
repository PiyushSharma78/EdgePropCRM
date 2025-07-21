import axiosInstance from "../api/axios";

// ✅ USER AUTH / PROFILE
export const getUserProfile = async () => {
  const response = await axiosInstance.get("/user/profile");
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await axiosInstance.post("/user/profile", userData);
  return response.data;
};

export const changeUserPassword = async (userData) => {
  const response = await axiosInstance.post("/auth/changepassword", userData);
  return response.data;
};

export const sendResetPasswordLink = async (userData) => {
  const response = await axiosInstance.post(
    "/auth/request-password-reset",
    userData
  );
  return response.data;
};

export const resetUserPassword = async (userData) => {
  const response = await axiosInstance.post("/auth/reset-password", userData);
  return response.data;
};

// ✅ NOTIFICATIONS
export const getAllNotifications = async () => {
  const response = await axiosInstance.get("admin/notifications");
  return response.data;
};

// export const getAllNotifications = async () => {
//   const token = localStorage.getItem("auth-token");
//   const response = await axiosInstance.get("/notifications", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

// export const updateNotificationsReadCount = async () => {
//   const token = localStorage.getItem("auth-token");
//   const response = await axiosInstance.post("/notifications/read", null, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

export const updateNotificationsReadCount = async () => {
  console.log("Notification calling");
  const response = await axiosInstance.post("admin/notifications/read");
  return response.data;
};

// ✅ ADMIN DATA: Traders / Invoices
export const getAllTraders = async () => {
  const response = await axiosInstance.get("/admin/alltraders");
  return response.data;
};

export const getAllInvoices = async () => {
  const response = await axiosInstance.get("/admin/allinvoices");
  return response.data;
};

// ✅ STRIPE PAYMENT APIs
export const stripePaymentApi = async (data) => {
  const response = await axiosInstance.post(
    "/stripe/create-checkout-session",
    data
  );
  return response.data;
};

export const verifyStripePaymentApi = async (sessionId) => {
  const response = await axiosInstance.get(
    `/stripe/verify/stripe-payment-status?session_id=${sessionId}`
  );
  return response.data;
};

// ✅ EVALUATION PLANS
export const getAllEvalautionPlans = async () => {
  const response = await axiosInstance.get("/evaluationplans");
  return response.data;
};

export const getUserEvalautionPlans = async () => {
  const response = await axiosInstance.get("/evaluationplans");
  return response.data;
};

export const getSelectedEvaluationPlan = async (name) => {
  const response = await axiosInstance.get(`/evaluationplans/${name}`);
  return response.data;
};

// ✅ KYC APIs (NEW)
export const getAllKycTraders = async () => {
  const response = await axiosInstance.get("/admin/allkyc");
  return response.data;
};

export const updateKycStatus = async ({ id, status }) => {
  const response = await axiosInstance.post(`/admin/updatekyc/${id}`, {
    status,
  });
  return response.data;
};

export const getAllAccounts = async () => {
  const response = await axiosInstance.get("/admin/allaccounts");
  return response.data;
};

export const getAllPayouts = async () => {
  const res = await fetch("/api/payouts", {
    headers: {
      "auth-token": localStorage.getItem("auth-token"),
    },
  });
  return res.json();
};

export const getAllLicenses = async () => {
  const res = await fetch("/api/licenses", {
    headers: {
      "auth-token": localStorage.getItem("auth-token"),
    },
  });
  return res.json();
};

export const getAllSubscriptions = async () => {
  const response = await axiosInstance.get("/admin/allsubscriptions");
  return response.data;
};
