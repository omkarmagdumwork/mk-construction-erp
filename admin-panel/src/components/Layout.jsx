import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Sidebar menu for MK Construction admin panel
const MENU = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Projects", path: "/projects" },
  { label: "Clients", path: "/clients" },
  { label: "Employees", path: "/employees" },
  { label: "Materials", path: "/materials" },
  { label: "Purchases", path: "/purchases" },
  { label: "Expenses", path: "/expenses" },
  { label: "Tasks", path: "/tasks" },
  { label: "Enquiries", path: "/enquiries" },
  { label: "Reports", path: "/reports" },
  { label: "Website", path: "/website" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-gray-200 flex flex-col">
        <div className="p-4 text-xl font-bold text-orange-400">MK Construction</div>
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {MENU.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${
                  isActive ? "bg-orange-500 text-white" : "hover:bg-gray-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Welcome, <span className="font-semibold text-gray-800">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}