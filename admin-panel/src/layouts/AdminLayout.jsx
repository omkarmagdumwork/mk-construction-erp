import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:ml-64">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 md:hidden"
          >
            Menu
          </button>

          <p className="hidden text-sm text-slate-500 md:block">
            Welcome back, <span className="font-semibold text-slate-800">{user?.name}</span>
          </p>

          <button
            onClick={logout}
            className="rounded-md bg-slate-800 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Logout
          </button>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;