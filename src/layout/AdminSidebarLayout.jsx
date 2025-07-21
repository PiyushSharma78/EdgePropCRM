import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  File,
  Settings,
  LogOut,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";
import { FiBell } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { logoutUserAPI } from "../features/auth/authAPI";
import {
  getAllNotifications,
  updateNotificationsReadCount,
} from "../features/userAPI";
import { getTimeAgo } from "../utilities/timeFunctions";

export default function AdminSidebarLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const notificationRef = useRef();

  const handleLogout = () => {
    logoutUserAPI();
    localStorage.removeItem("auth-token");
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Traders", icon: Users, path: "/admin/traders" },
    { name: "KYC", icon: FileText, path: "/admin/kyc" },
    { name: "Payouts", icon: DollarSign, path: "/admin/payouts" },
    { name: "Licenses", icon: File, path: "/admin/licenses" },
    { name: "Invoices", icon: File, path: "/admin/invoices" },
    { name: "Contract Status", icon: FileText, path: "/admin/contract-status" },
    { name: "Accounts", icon: FileText, path: "/admin/accounts" },
    { name: "Subscriptions", icon: FileText, path: "/admin/Subscriptions" },
    { name: "Support", icon: HelpCircle, path: "/admin/support" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
    { name: "Performance", icon: Settings, path: "/admin/performance" },
  ];

  const fetchAllNotifications = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    setLoadingNotifications(true);
    setNotificationError(null);

    try {
      const response = await getAllNotifications();
      console.log("API Response:", response); // Debug log

      // Handle different response formats
      let notifications = [];
      let unreadCount = 0;

      if (Array.isArray(response)) {
        // Case 1: Response is directly an array
        notifications = response;
      } else if (response && Array.isArray(response.data)) {
        // Case 2: Response has data array
        notifications = response.data;
        unreadCount = response.unreadCount || 0;
      } else if (response && Array.isArray(response.notifications)) {
        // Case 3: Response has notifications array
        notifications = response.notifications;
        unreadCount = response.unreadNotificationsCount || 0;
      } else {
        throw new Error("Unexpected response format");
      }

      // Validate notifications structure
      const validatedNotifications = notifications.map((notif) => ({
        id: notif.id || Math.random().toString(36).substr(2, 9),
        title: notif.title || "Notification",
        message: notif.message || notif.body || "No details available",
        createdAt: notif.createdAt || notif.date || new Date().toISOString(),
      }));

      setAllNotifications(validatedNotifications);
      setUnreadNotificationsCount(unreadCount);
    } catch (err) {
      console.error("Notification fetch failed", err);
      setNotificationError("Failed to load notifications. Please try again.");
      setAllNotifications([]);
      setUnreadNotificationsCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const updateAllNotificationRead = async () => {
    try {
      await updateNotificationsReadCount();
      setUnreadNotificationsCount(0);
    } catch (err) {
      console.error("Failed to update notification read status");
    }
  };

  const handleNotificationClick = () => {
    const newState = !showNotifications;
    setShowNotifications(newState);

    if (newState && unreadNotificationsCount > 0) {
      updateAllNotificationRead();
    }

    if (newState) {
      fetchAllNotifications();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderNotifications = () => {
    if (loadingNotifications) {
      return (
        <div className="px-4 py-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
        </div>
      );
    }

    if (notificationError) {
      return (
        <div className="px-4 py-6 text-center text-sm text-red-500">
          {notificationError}
          <button
            onClick={fetchAllNotifications}
            className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs"
          >
            Retry
          </button>
        </div>
      );
    }

    if (allNotifications.length === 0) {
      return (
        <div className="px-4 py-6 text-center text-sm text-gray-400">
          No notifications available
        </div>
      );
    }

    return allNotifications.map((notif) => (
      <div
        key={notif.id}
        className="px-4 py-3 border-b hover:bg-gray-50 transition-all"
      >
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-800">{notif.title}</h4>
          <span className="text-sm text-gray-500">
            {getTimeAgo(notif.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
      </div>
    ));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Hamburger */}
      <div className="sm:hidden fixed top-0 left-0 z-50 p-4 bg-white shadow">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-600"
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed sm:static z-40 top-0 left-0 h-screen w-64 bg-white shadow-lg flex flex-col transform transition-transform duration-200 border-r ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="p-4 text-xl font-bold text-blue-600 border-b">
          EdgeProp CRM
        </div>
        <nav className="px-2 space-y-2 flex-1">
          {navItems.map(({ name, icon: Icon, path }) => (
            <Link
              key={name}
              to={path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                location.pathname === path
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              <span>{name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-700"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Right Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white shadow px-4 flex items-center justify-between relative">
          <h2 className="text-lg font-semibold text-blue-700">Admin Panel</h2>

          <div className="flex items-center gap-3 relative">
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, {user?.username || "Admin"}
            </span>

            {/* Notification Bell */}
            <button
              onClick={handleNotificationClick}
              className="relative text-gray-600 hover:text-blue-700"
              aria-label="Notifications"
            >
              <FiBell size={22} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] leading-tight flex items-center justify-center bg-red-600 text-white font-semibold rounded-full shadow-md z-10 ">
                  {unreadNotificationsCount > 99
                    ? "99+"
                    : unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notification Popup */}
            {showNotifications && (
              <div
                ref={notificationRef}
                className="absolute right-12 top-12 w-96 max-h-[400px] min-h-[200px] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-50"
              >
                <div className="p-4 border-b font-semibold text-base text-blue-700 flex justify-between items-center">
                  <span>Notifications</span>
                  <div>
                    <button
                      onClick={fetchAllNotifications}
                      className="text-xs text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Refresh
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
                {renderNotifications()}
              </div>
            )}

            {/* Avatar */}
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.username || "Admin"
              )}&background=random`}
              alt={user?.username || "Admin"}
              className="w-9 h-9 rounded-full border border-gray-200"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
