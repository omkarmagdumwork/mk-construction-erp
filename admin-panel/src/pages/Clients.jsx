import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import FormField, { inputClass } from "../components/FormField";

const emptyForm = { name: "", phone: "", email: "", company: "", address: "" };

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadClients = async () => {
    try {
      const { data } = await api.get("/clients", { params: { search } });
      setClients(data);
      setPageError("");
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadClients, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (client) => {
    setEditingId(client._id);
    setForm({
      name: client.name,
      phone: client.phone,
      email: client.email || "",
      company: client.company || "",
      address: client.address || "",
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
      if (editingId) {
        await api.put(`/clients/${editingId}`, form);
      } else {
        await api.post("/clients", form);
      }
      setModalOpen(false);
      loadClients();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save client");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (client) => {
    if (!window.confirm(`Delete client "${client.name}"?`)) return;

    try {
      await api.delete(`/clients/${client._id}`);
      loadClients();
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not delete client");
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Clients</h2>
        <button
          onClick={openAdd}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
        >
          + Add Client
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by client name..."
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
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Address</th>
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
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                  No clients found.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {client.name}
                  </td>
                  <td className="px-4 py-3">{client.phone}</td>
                  <td className="px-4 py-3">{client.email || "-"}</td>
                  <td className="px-4 py-3">{client.company || "-"}</td>
                  <td className="px-4 py-3">{client.address || "-"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(client)}
                      className="mr-3 text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client)}
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

      {/* ✅ Modal — isOpen prop vaparla, {modalOpen && ...} kadhla */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Client" : "Add Client"}
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {formError}
            </div>
          )}

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

          <FormField label="Email">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>

          <FormField label="Company">
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>

          <FormField label="Address">
            <textarea
              name="address"
              value={form.address}
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

export default Clients;