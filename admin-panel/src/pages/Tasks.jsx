import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import FormField, { inputClass } from "../components/FormField";

const STATUSES = ["Pending", "In Progress", "Completed", "On Hold"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const initialForm = {
  title: "",
  description: "",
  project: "",
  assignedTo: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

const statusBadge = (status) => {
  const map = {
    Pending: "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    "On Hold": "bg-amber-100 text-amber-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
};

const priorityBadge = (priority) => {
  const map = {
    Low: "bg-gray-100 text-gray-600",
    Medium: "bg-blue-50 text-blue-700",
    High: "bg-orange-100 text-orange-700",
    Urgent: "bg-red-100 text-red-700",
  };
  return map[priority] || "bg-gray-100 text-gray-600";
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = { search };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/tasks", { params });
      setTasks(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Tasks load karta ale nahit.");
    } finally {
      setLoading(false);
    }
  };

  const loadLookups = async () => {
    try {
      const [pRes, eRes] = await Promise.all([
        api.get("/projects"),
        api.get("/employees"),
      ]);
      const pData = pRes.data;
      const eData = eRes.data;
      setProjects(Array.isArray(pData) ? pData : pData.projects || []);
      setEmployees(Array.isArray(eData) ? eData : eData.employees || []);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const t = setTimeout(loadTasks, 300);
    return () => clearTimeout(t);
  }, [search, statusFilter]);

  useEffect(() => {
    loadLookups();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(initialForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setForm({
      title: task.title || "",
      description: task.description || "",
      project: task.project?._id || task.project || "",
      assignedTo: task.assignedTo?._id || task.assignedTo || "",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 10)
        : "",
    });
    setError("");
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      if (!form.title.trim()) {
        setError("Task title required aahe.");
        return;
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        project: form.project || undefined,
        assignedTo: form.assignedTo || undefined,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || undefined,
      };

      if (editing) {
        await api.put(`/tasks/${editing._id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      setModalOpen(false);
      setForm(initialForm);
      setEditing(null);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Task save karta ala nahi.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Status update zala nahi.");
    }
  };

  const handleDelete = async (task) => {
    const ok = window.confirm(`"${task.title}" delete karaycha?`);
    if (!ok) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Delete karta ala nahi.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Site work assign kara ani track kara.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className={`${inputClass} w-full sm:max-w-sm`}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${inputClass} w-full sm:max-w-[180px]`}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center">
                    Loading tasks...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                tasks.map((task, i) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {task.title}
                    </td>
                    <td className="px-4 py-3">{task.project?.name || "-"}</td>
                    <td className="px-4 py-3">
                      {task.assignedTo?.name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${priorityBadge(
                          task.priority
                        )}`}
                      >
                        {task.priority || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={task.status || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(task, e.target.value)
                        }
                        className={`rounded-md border-0 px-2 py-1 text-xs font-medium ${statusBadge(
                          task.status
                        )}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(task)}
                          className="rounded-md bg-amber-50 px-3 py-1.5 text-amber-700 hover:bg-amber-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          className="rounded-md bg-red-50 px-3 py-1.5 text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Task" : "Add Task"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Task Title" required>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Foundation concrete pour"
              required
            />
          </FormField>

          <FormField label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={inputClass}
              rows={3}
              placeholder="Details, instructions..."
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Project">
              <select
                name="project"
                value={form.project}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">— None —</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Assigned To">
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">— Unassigned —</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Priority" required>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={inputClass}
                required
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Status" required>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
                required
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Due Date">
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : editing ? "Update Task" : "Save Task"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}