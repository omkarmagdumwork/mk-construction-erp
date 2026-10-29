import { useEffect, useState } from "react";
import api from "../services/api";

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const StatCard = ({ label, value, color = "text-slate-900" }) => (
  <div className="rounded-lg bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load dashboard")
      );
  }, []);

  if (error) {
    return <div className="rounded-md bg-red-50 p-4 text-red-600">{error}</div>;
  }

  if (!stats) {
    return <p className="text-slate-500">Loading dashboard...</p>;
  }

  const { counts, spending, projectsByStatus, recentProjects, recentEnquiries } = stats;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Projects" value={counts.totalProjects} />
        <StatCard label="Clients" value={counts.totalClients} />
        <StatCard label="Active Employees" value={counts.activeEmployees} />
        <StatCard label="New Enquiries" value={counts.newEnquiries} color="text-amber-600" />
        <StatCard label="Pending Tasks" value={counts.pendingTasks} />
        <StatCard label="Overdue Tasks" value={counts.overdueTasks} color="text-red-600" />
        <StatCard label="Low Stock Materials" value={counts.lowStockMaterials} color="text-red-600" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Material Purchases" value={formatMoney(spending.purchases)} />
        <StatCard label="Other Expenses" value={formatMoney(spending.expenses)} />
        <StatCard label="Total Spending" value={formatMoney(spending.total)} color="text-blue-600" />
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-semibold text-slate-800">Projects by Status</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Object.entries(projectsByStatus).map(([status, count]) => (
            <div key={status} className="rounded-md bg-slate-50 p-3 text-center">
              <p className="text-xl font-bold text-slate-900">{count}</p>
              <p className="text-xs capitalize text-slate-500">{status.replace("-", " ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-semibold text-slate-800">Recent Projects</h3>
          {recentProjects.length === 0 ? (
            <p className="text-sm text-slate-500">No projects yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentProjects.map((project) => (
                <li key={project._id} className="flex justify-between py-2 text-sm">
                  <span className="font-medium text-slate-800">{project.name}</span>
                  <span className="capitalize text-slate-500">{project.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-semibold text-slate-800">Recent Enquiries</h3>
          {recentEnquiries.length === 0 ? (
            <p className="text-sm text-slate-500">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentEnquiries.map((enquiry) => (
                <li key={enquiry._id} className="flex justify-between py-2 text-sm">
                  <span className="font-medium text-slate-800">{enquiry.name}</span>
                  <span className="capitalize text-slate-500">{enquiry.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;