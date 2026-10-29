import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import FormField, { inputClass } from "../components/FormField";

const CATEGORIES = [
  "Labour",
  "Transport",
  "Fuel",
  "Material",
  "Equipment",
  "Office",
  "Misc",
];

const initialForm = {
  title: "",
  category: "Labour",
  amount: 0,
  expenseDate: new Date().toISOString().slice(0, 10),
  project: "",
  paidTo: "",
  notes: "",
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expenses", { params: { search } });
      setExpenses(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Expenses load karta ala nahi.");
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await api.get("/projects");
      const data = res.data;
      setProjects(Array.isArray(data) ? data : data.projects || []);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const t = setTimeout(loadExpenses, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    loadProjects();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(initialForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (exp) => {
    setEditing(exp);
    setForm({
      title: exp.title || "",
      category: exp.category || "Labour",
      amount: exp.amount ?? 0,
      expenseDate: exp.expenseDate
        ? new Date(exp.expenseDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      project: exp.project?._id || exp.project || "",
      paidTo: exp.paidTo || "",
      notes: exp.notes || "",
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
        setError("Title required aahe.");
        return;
      }
      if (Number(form.amount) <= 0) {
        setError("Amount 0 peksha jasta asava.");
        return;
      }

      const payload = {
        title: form.title.trim(),
        category: form.category,
        amount: Number(form.amount),
        expenseDate: form.expenseDate,
        project: form.project || undefined,
        paidTo: form.paidTo.trim(),
        notes: form.notes.trim(),
      };

      if (editing) {
        await api.put(`/expenses/${editing._id}`, payload);
      } else {
        await api.post("/expenses", payload);
      }

      setModalOpen(false);
      setForm(initialForm);
      setEditing(null);
      await loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Expense save karta ala nahi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (exp) => {
    const ok = window.confirm(`"${exp.title}" delete karaycha?`);
    if (!ok) return;
    try {
      await api.delete(`/expenses/${exp._id}`);
      await loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Delete karta ala nahi.");
    }
  };

  const totalAmount = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Site kharche track kara — labour, transport, fuel, misc.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          + Add Expense
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className={`${inputClass} w-full sm:max-w-sm`}
          />
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">₹{totalAmount}</span>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Paid To</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center">
                    Loading expenses...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                expenses.map((exp, i) => (
                  <tr key={exp._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">
                      {exp.expenseDate
                        ? new Date(exp.expenseDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {exp.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                        {exp.category || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {exp.project?.name || "-"}
                    </td>
                    <td className="px-4 py-3">{exp.paidTo || "-"}</td>
                    <td className="px-4 py-3 font-medium">₹{exp.amount}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(exp)}
                          className="rounded-md bg-amber-50 px-3 py-1.5 text-amber-700 hover:bg-amber-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(exp)}
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
        title={editing ? "Edit Expense" : "Add Expense"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Title" required>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Labour payment week 1"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category" required>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
                required
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Amount (₹)" required>
              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Expense Date" required>
              <input
                type="date"
                name="expenseDate"
                value={form.expenseDate}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </FormField>

            <FormField label="Project (optional)">
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
          </div>

          <FormField label="Paid To">
            <input
              name="paidTo"
              value={form.paidTo}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Ramesh (Labour contractor)"
            />
          </FormField>

          <FormField label="Notes">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className={inputClass}
              rows={2}
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
              {saving
                ? "Saving..."
                : editing
                ? "Update Expense"
                : "Save Expense"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
