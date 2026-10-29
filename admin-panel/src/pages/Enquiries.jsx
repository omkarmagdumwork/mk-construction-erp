import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import FormField, { inputClass } from "../components/FormField";

const SOURCES = ["Website", "Walk-in", "Phone", "Referral", "Social Media", "Other"];
const STATUSES = ["New", "Contacted", "Quoted", "Won", "Lost"];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  source: "Website",
  status: "New",
  requirement: "",
  budget: "",
  followUpDate: "",
  notes: "",
};

const statusBadge = (status) => {
  const map = {
    New: "bg-blue-100 text-blue-700",
    Contacted: "bg-indigo-100 text-indigo-700",
    Quoted: "bg-amber-100 text-amber-700",
    Won: "bg-green-100 text-green-700",
    Lost: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-slate-100 text-slate-700";
};

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadEnquiries = async () => {
    try {
      const params = { search };
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get("/enquiries", { params });
      setEnquiries(Array.isArray(data) ? data : data.enquiries || []);
      setPageError("");
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadEnquiries, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (enq) => {
    setEditingId(enq._id);
    setForm({
      name: enq.name || "",
      phone: enq.phone || "",
      email: enq.email || "",
      source: enq.source || "Website",
      status: enq.status || "New",
      requirement: enq.requirement || "",
      budget: enq.budget ?? "",
      followUpDate: enq.followUpDate
        ? new Date(enq.followUpDate).toISOString().slice(0, 10)
        : "",
      notes: enq.notes || "",
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
      setFormError("Name required aahe.");
      return;
    }
    if (!form.phone.trim()) {
      setFormError("Phone required aahe.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        source: form.source,
        status: form.status,
        requirement: form.requirement.trim(),
        budget: Number(form.budget) || 0,
        followUpDate: form.followUpDate || null,
        notes: form.notes.trim(),
      };

      if (editingId) {
        await api.put(`/enquiries/${editingId}`, payload);
      } else {
        await api.post("/enquiries", payload);
      }
      setModalOpen(false);
      loadEnquiries();
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Could not save enquiry"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (enq) => {
    if (!window.confirm(`Delete enquiry from "${enq.name}"?`)) return;
    try {
      await api.delete(`/enquiries/${enq._id}`);
      loadEnquiries();
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not delete enquiry");
    }
  };

  const handleStatusChange = async (enq, newStatus) => {
    try {
      await api.put(`/enquiries/${enq._id}`, { status: newStatus });
      loadEnquiries();
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not update status");
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Enquiries</h2>
          <p className="mt-1 text-sm text-slate-500">
            Website leads, walk-in customers, follow-ups.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
        >
          + Add Enquiry
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className={`${inputClass} sm:max-w-xs`}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${inputClass} sm:max-w-[180px]`}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Requirement</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Follow-up</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : enquiries.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-slate-500">
                  No enquiries found.
                </td>
              </tr>
            ) : (
              enquiries.map((enq) => (
                <tr key={enq._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {enq.name}
                  </td>
                  <td className="px-4 py-3">
                    <p>{enq.phone}</p>
                    {enq.email && (
                      <p className="text-xs text-slate-500">{enq.email}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">{enq.source || "-"}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate">
                    {enq.requirement || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {enq.budget ? `₹${enq.budget}` : "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {enq.followUpDate
                      ? new Date(enq.followUpDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={enq.status || "New"}
                      onChange={(e) => handleStatusChange(enq, e.target.value)}
                      className={`rounded-full border-0 px-2 py-1 text-xs font-medium ${statusBadge(
                        enq.status
                      )}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(enq)}
                      className="mr-3 text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(enq)}
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Enquiry" : "Add Enquiry"}
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <FormField label="Name" required>
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
                value={form.phone}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="Email">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <FormField label="Source" required>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                className={inputClass}
              >
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Status">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Requirement">
            <textarea
              name="requirement"
              value={form.requirement}
              onChange={handleChange}
              rows="2"
              className={inputClass}
              placeholder="e.g. 3BHK bungalow construction, 2000 sqft"
            />
          </FormField>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <FormField label="Budget (INR)">
              <input
                type="number"
                min="0"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>
            <FormField label="Follow-up Date">
              <input
                type="date"
                name="followUpDate"
                value={form.followUpDate}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="Notes">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="2"
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

export default Enquiries;