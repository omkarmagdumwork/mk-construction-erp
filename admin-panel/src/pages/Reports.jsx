import { useEffect, useState } from "react";
import api from "../services/api";

const StatCard = ({ label, value, sub, color = "amber" }) => {
  const colors = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <p className="text-xs uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs opacity-70">{sub}</p>}
    </div>
  );
};

const Bar = ({ label, value, max, color = "bg-amber-500" }) => {
  const width = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    projects: [],
    clients: [],
    enquiries: [],
    tasks: [],
    expenses: [],
    purchases: [],
    materials: [],
    employees: [],
  });

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const [
          projectsRes,
          clientsRes,
          enquiriesRes,
          tasksRes,
          expensesRes,
          purchasesRes,
          materialsRes,
          employeesRes,
        ] = await Promise.all([
          api.get("/projects").catch(() => ({ data: [] })),
          api.get("/clients").catch(() => ({ data: [] })),
          api.get("/enquiries").catch(() => ({ data: [] })),
          api.get("/tasks").catch(() => ({ data: [] })),
          api.get("/expenses").catch(() => ({ data: [] })),
          api.get("/purchases").catch(() => ({ data: [] })),
          api.get("/materials").catch(() => ({ data: [] })),
          api.get("/employees").catch(() => ({ data: [] })),
        ]);

        const unwrap = (res, key) => {
          const d = res.data;
          return Array.isArray(d) ? d : d?.[key] || [];
        };

        setData({
          projects: unwrap(projectsRes, "projects"),
          clients: unwrap(clientsRes, "clients"),
          enquiries: unwrap(enquiriesRes, "enquiries"),
          tasks: unwrap(tasksRes, "tasks"),
          expenses: unwrap(expensesRes, "expenses"),
          purchases: unwrap(purchasesRes, "purchases"),
          materials: unwrap(materialsRes, "materials"),
          employees: unwrap(employeesRes, "employees"),
        });
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Could not load reports");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // ---------- Aggregations ----------
  const totalExpenses = data.expenses.reduce(
    (s, e) => s + Number(e.amount || 0),
    0
  );
  const totalPurchases = data.purchases.reduce(
    (s, p) => s + Number(p.totalAmount || 0),
    0
  );
  const activeProjects = data.projects.filter(
    (p) => p.status === "in-progress" || p.status === "In Progress"
  ).length;
  const completedProjects = data.projects.filter(
    (p) => p.status === "completed" || p.status === "Completed"
  ).length;
  const wonEnquiries = data.enquiries.filter(
    (e) => e.status === "Won" || e.status === "won"
  ).length;
  const openTasks = data.tasks.filter(
    (t) => t.status !== "Completed" && t.status !== "completed"
  ).length;

  // Expenses by category
  const expensesByCategory = {};
  data.expenses.forEach((e) => {
    const c = e.category || "Other";
    expensesByCategory[c] = (expensesByCategory[c] || 0) + Number(e.amount || 0);
  });
  const expenseCatList = Object.entries(expensesByCategory).sort(
    (a, b) => b[1] - a[1]
  );
  const maxExpense = expenseCatList[0]?.[1] || 1;

  // Enquiries by status
  const enquiriesByStatus = {};
  data.enquiries.forEach((e) => {
    const s = e.status || "New";
    enquiriesByStatus[s] = (enquiriesByStatus[s] || 0) + 1;
  });
  const enquiryStatList = Object.entries(enquiriesByStatus).sort(
    (a, b) => b[1] - a[1]
  );
  const maxEnquiry = enquiryStatList[0]?.[1] || 1;

  // Purchases by supplier
  const purchasesBySupplier = {};
  data.purchases.forEach((p) => {
    const s = p.supplierName || "Unknown";
    purchasesBySupplier[s] =
      (purchasesBySupplier[s] || 0) + Number(p.totalAmount || 0);
  });
  const supplierList = Object.entries(purchasesBySupplier)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxSupplier = supplierList[0]?.[1] || 1;

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 text-center text-slate-500 shadow-sm">
        Loading reports...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reports</h2>
          <p className="mt-1 text-sm text-slate-500">
            Overall business snapshot — sarvat ekach page var.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stat cards row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label="Total Projects"
          value={data.projects.length}
          sub={`${activeProjects} active • ${completedProjects} done`}
          color="blue"
        />
        <StatCard
          label="Clients"
          value={data.clients.length}
          color="amber"
        />
        <StatCard
          label="Enquiries"
          value={data.enquiries.length}
          sub={`${wonEnquiries} won`}
          color="green"
        />
        <StatCard
          label="Open Tasks"
          value={openTasks}
          sub={`${data.tasks.length} total`}
          color="slate"
        />
        <StatCard
          label="Total Expenses"
          value={`₹${totalExpenses.toLocaleString("en-IN")}`}
          color="red"
        />
        <StatCard
          label="Total Purchases"
          value={`₹${totalPurchases.toLocaleString("en-IN")}`}
          color="amber"
        />
        <StatCard
          label="Employees"
          value={data.employees.length}
          color="blue"
        />
        <StatCard
          label="Materials"
          value={data.materials.length}
          color="slate"
        />
      </div>

      {/* Two column reports */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Expenses by Category */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Expenses by Category
          </h3>
          {expenseCatList.length === 0 ? (
            <p className="text-sm text-slate-500">No expense data.</p>
          ) : (
            expenseCatList.map(([cat, amt]) => (
              <Bar
                key={cat}
                label={cat}
                value={`₹${amt.toLocaleString("en-IN")}`}
                max={maxExpense}
                color="bg-red-500"
              />
            ))
          )}
        </div>

        {/* Purchases by Supplier (top 5) */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Top 5 Suppliers (by purchase value)
          </h3>
          {supplierList.length === 0 ? (
            <p className="text-sm text-slate-500">No purchase data.</p>
          ) : (
            supplierList.map(([sup, amt]) => (
              <Bar
                key={sup}
                label={sup}
                value={`₹${amt.toLocaleString("en-IN")}`}
                max={maxSupplier}
                color="bg-amber-500"
              />
            ))
          )}
        </div>

        {/* Enquiries by Status */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Enquiries by Status
          </h3>
          {enquiryStatList.length === 0 ? (
            <p className="text-sm text-slate-500">No enquiry data.</p>
          ) : (
            enquiryStatList.map(([status, count]) => (
              <Bar
                key={status}
                label={status}
                value={count}
                max={maxEnquiry}
                color="bg-blue-500"
              />
            ))
          )}
        </div>

        {/* Project Status Summary */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Project Status
          </h3>
          {data.projects.length === 0 ? (
            <p className="text-sm text-slate-500">No project data.</p>
          ) : (
            Object.entries(
              data.projects.reduce((acc, p) => {
                const s = p.status || "Unknown";
                acc[s] = (acc[s] || 0) + 1;
                return acc;
              }, {})
            ).map(([status, count]) => (
              <Bar
                key={status}
                label={status}
                value={count}
                max={data.projects.length}
                color="bg-green-500"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;