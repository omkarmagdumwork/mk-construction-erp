
import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import FormField, { inputClass } from "../components/FormField";

const emptyForm = {
  name: "",
  phone: "",
  dailyWage: "",
  role: "labour",
  status: "active",
  assignedProject: "",
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadEmployees = async () => {
    try {
      const { data } = await api.get("/employees", {
        params: { search },
      });

      setEmployees(Array.isArray(data) ? data : []);
      setPageError("");
    } catch (err) {
      setPageError(
        err.response?.data?.message || "Could not load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      // Employee management can work without project options.
      setProjects([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadEmployees, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadProjects();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (employee) => {
    setEditingId(employee._id);
    setForm({
      name: employee.name || "",
      phone: employee.phone || "",
      dailyWage: String(employee.dailyWage ?? ""),
      role: employee.role || "labour",
      status: employee.status || "active",
      assignedProject:
        employee.assignedProject?._id ||
        employee.assignedProject ||
        "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        dailyWage: Number(form.dailyWage),
        role: form.role,
        status: form.status,
        assignedProject: form.assignedProject || null,
      };

      if (editingId) {
        await api.put(`/employees/${editingId}`, payload);
      } else {
        await api.post("/employees", payload);
      }

      setModalOpen(false);
      await loadEmployees();
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Could not save employee"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (employee) => {
    if (!window.confirm(`Delete employee "${employee.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/employees/${employee._id}`);
      await loadEmployees();
    } catch (err) {
      setPageError(
        err.response?.data?.message || "Could not delete employee"
      );
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Employees
        </h2>

        <button
          onClick={openAdd}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
        >
          + Add Employee
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by employee name..."
        className={`${inputClass} mb-4 sm:max-w-xs`}
      />

      {pageError && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
          {pageError}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Daily Wage</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {employee.name}
                  </td>
                  <td className="px-4 py-3">{employee.phone}</td>
                  <td className="px-4 py-3">
                    ₹{Number(employee.dailyWage).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">{employee.role || "-"}</td>
                  <td className="px-4 py-3">
                    {employee.assignedProject?.name || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        employee.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {employee.status || "-"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(employee)}
                      className="mr-3 text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal
          title={editingId ? "Edit Employee" : "Add Employee"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            {formError && (
              <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {formError}
              </div>
            )}

            <FormField label="Employee Name" required>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </FormField>

            <FormField label="Phone" required>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </FormField>

            <FormField label="Daily Wage (₹)" required>
              <input
                name="dailyWage"
                type="number"
                min="0"
                value={form.dailyWage}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </FormField>

            <FormField label="Role">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="labour">Labour</option>
                <option value="mason">Mason</option>
                <option value="carpenter">Carpenter</option>
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="supervisor">Supervisor</option>
                <option value="other">Other</option>
              </select>
            </FormField>

            <FormField label="Status">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FormField>

            <FormField label="Assigned Project">
              <select
                name="assignedProject"
                value={form.assignedProject}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">No project assigned</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Employees;
