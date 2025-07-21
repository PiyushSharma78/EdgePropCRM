import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

export default function StaffSidebarLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/staff/dashboard" },
    { name: "Tasks", icon: Settings, path: "/staff/tasks" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Hamburger */}
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
          Staff Panel
        </div>
        <nav className="flex-1 px-2 space-y-2 overflow-y-auto">
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

      {/* Main Right Section */}
      <div className="flex-1 bg-gray-100 py-6">
        {/* Header */}
        <header className="h-16 bg-white shadow px-4 flex items-center justify-between z-30">
          <h2 className="text-lg font-semibold text-blue-700">
            Staff Dashboard
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, {user?.name || "Staff"}
            </span>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "Staff"
              )}`}
              alt={user?.name || "Staff"}
              className="w-9 h-9 rounded-full"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-gray-100 px-4 sm:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
