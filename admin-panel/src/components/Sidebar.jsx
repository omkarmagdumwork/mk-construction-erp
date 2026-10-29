import { NavLink } from "react-router-dom";
import { navItems } from "../config/navItems";

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-slate-900 text-white transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-700 px-6 py-5">
          <h1 className="text-xl font-bold text-amber-400">MK Construction</h1>
          <p className="text-xs text-slate-400">ERP Admin Panel</p>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `block rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-500 text-slate-900"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;