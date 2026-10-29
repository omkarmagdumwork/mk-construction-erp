import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import FormField, { inputClass } from "../components/FormField";
import { formatMoney, formatDate } from "../utils/format";

const statuses = ["planning", "in-progress", "on-hold", "completed"];

const emptyForm = {
  name: "",
  client: "",
  location: "",
  budget: "",
  status: "planning",
  startDate: "",
  endDate: "",
  description: "",
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProjects = async () => {
    try {
      const { data } = await api.get("/projects", {
        params: { search, status: statusFilter },
      });
      // handle both array and { projects: [...] } shapes
      setProjects(Array.isArray(data) ? data : data.projects || []);
      setPageError("");
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api
      .get("/clients")
      .then((res) => {
        const d = res.data;
        setClients(Array.isArray(d) ? d : d.clients || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadProjects, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditingId(project._id);
    setForm({
      name: project.name,
      client: project.client?._id || "",
      location: project.location || "",
      budget: project.budget ?? "",
      status: project.status || "planning",
      startDate: project.startDate ? project.startDate.slice(0, 10) : "",
      endDate: project.endDate ? project.endDate.slice(0, 10) : "",
      description: project.description || "",
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

    if (!form.name.trim()) {
      setFormError("Project name required aahe.");
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      budget: Number(form.budget) || 0,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    };

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post("/projects", payload);
      }
      setModalOpen(false);
      loadProjects();
    } catch (err) {
      console.error("Projects save error:", err.response?.data || err);
      setFormError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Could not save project"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete project "${project.name}"?`)) return;

    try {
      await api.delete(`/projects/${project._id}`);
      loadProjects();
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not delete project");
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
        <button
          onClick={openAdd}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
        >
          + Add Project
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by project name..."
          className={`${inputClass} sm:max-w-xs`}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${inputClass} capitalize sm:max-w-[180px]`}
        >
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.replace("-", " ")}
            </option>
          ))}
        </select>
      </div>

      {pageError && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
          {pageError}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Timeline</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project._id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{project.name}</p>
                    <p className="text-xs text-slate-500">{project.location}</p>
                  </td>
                  <td className="px-4 py-3">{project.client?.name || "-"}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatMoney(project.budget)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {formatDate(project.startDate)} to {formatDate(project.endDate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(project)}
                      className="mr-3 text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project)}
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

      {/* ✅ FIX: isOpen prop add kela + outer {modalOpen && ...} kadhla */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Project" : "Add Project"}
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {formError}
            </div>
          )}

          <FormField label="Project Name" required>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </FormField>

          <FormField label="Client" required>
            <select
              name="client"
              value={form.client}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
            {clients.length === 0 && (
              <p className="mt-1 text-xs text-amber-600">
                No clients yet. Please add a client first.
              </p>
            )}
          </FormField>

          <FormField label="Location" required>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <FormField label="Budget (INR)" required>
              <input
                type="number"
                min="0"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </FormField>

            <FormField label="Status">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={`${inputClass} capitalize`}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("-", " ")}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Start Date">
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>

            <FormField label="End Date">
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className={inputClass}
            />
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
    </div>
  );
};

export default Projects;