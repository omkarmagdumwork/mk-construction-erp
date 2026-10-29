import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RateTicker from "./RateTicker"; // NEW

// Which roles can see which menu item
const MENU = [
  { label: "Dashboard", path: "/dashboard", roles: ["admin", "manager", "salesman"] },
  { label: "Rates", path: "/rates", roles: ["admin", "manager", "salesman"] },
  { label: "Inventory", path: "/inventory", roles: ["admin", "manager", "salesman"] },
  { label: "Customers", path: "/customers", roles: ["admin", "manager", "salesman"] },
  { label: "Billing", path: "/billing", roles: ["admin", "manager", "salesman"] },
  { label: "Suppliers", path: "/suppliers", roles: ["admin", "manager"] },
  { label: "Reports", path: "/reports", roles: ["admin", "manager"] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const items = MENU.filter((m) => m.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-gray-200 flex flex-col">
        <div className="p-4 text-xl font-bold text-yellow-400">Jewellery ERP</div>
        <nav className="flex-1 px-2 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${
                  isActive ? "bg-yellow-500 text-black" : "hover:bg-gray-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-3 flex justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            Welcome, <span className="font-semibold text-gray-800">{user.name}</span>{" "}
            <span className="ml-1 px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800 capitalize">
              {user.role}
            </span>
          </div>

          {/* NEW: live gold/silver rates */}
          <RateTicker />

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