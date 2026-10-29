import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import FormField, { inputClass } from "../components/FormField";

const initialItem = { material: "", quantity: 1, rate: 0 };
const initialForm = {
  supplierName: "",
  invoiceNo: "",
  purchaseDate: new Date().toISOString().slice(0, 10),
  items: [{ ...initialItem }],
  notes: "",
};

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const res = await api.get("/purchases", { params: { search } });
      setPurchases(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Purchases load karta ala nahi.");
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async () => {
    try {
      const res = await api.get("/materials");
      const data = res.data;
      setMaterials(Array.isArray(data) ? data : data.materials || []);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const t = setTimeout(loadPurchases, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    loadMaterials();
  }, []);

  const openAdd = () => {
    setForm({ ...initialForm, items: [{ ...initialItem }] });
    setError("");
    setModalOpen(true);
  };

  const handleHeaderChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, items });
  };

  const addItemRow = () => {
    setForm({ ...form, items: [...form.items, { ...initialItem }] });
  };

  const removeItemRow = (index) => {
    if (form.items.length === 1) return;
    const items = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items });
  };

  const computedTotal = form.items.reduce(
    (sum, it) => sum + Number(it.quantity || 0) * Number(it.rate || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      if (!form.supplierName.trim()) {
        setError("Supplier name required aahe.");
        return;
      }
      for (const it of form.items) {
        if (!it.material || Number(it.quantity) <= 0) {
          setError("Pratyek item sathi material ani quantity bharava lagel.");
          return;
        }
      }

      const payload = {
        supplierName: form.supplierName.trim(),
        invoiceNo: form.invoiceNo.trim(),
        purchaseDate: form.purchaseDate,
        notes: form.notes.trim(),
        items: form.items.map((it) => ({
          material: it.material,
          quantity: Number(it.quantity),
          rate: Number(it.rate),
        })),
      };

      await api.post("/purchases", payload);
      setModalOpen(false);
      setForm(initialForm);
      await loadPurchases();
      await loadMaterials();
    } catch (err) {
      setError(err.response?.data?.message || "Purchase save karta ala nahi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (purchase) => {
    const ok = window.confirm(
      `Purchase "${purchase.supplierName}" delete karaycha? Stock reverse hoil.`
    );
    if (!ok) return;
    try {
      await api.delete(`/purchases/${purchase._id}`);
      await loadPurchases();
      await loadMaterials();
    } catch (err) {
      setError(err.response?.data?.message || "Delete karta ala nahi.");
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Purchases</h2>
          <p className="mt-1 text-sm text-slate-500">
            Supplier kadun material ghene (stock IN).
          </p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
        >
          + Add Purchase
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by supplier..."
        className={`${inputClass} mb-4 sm:max-w-xs`}
      />

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                  No purchases found.
                </td>
              </tr>
            ) : (
              purchases.map((p, i) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                  <td className="px-4 py-3">
                    {new Date(p.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {p.supplierName}
                  </td>
                  <td className="px-4 py-3">{p.invoiceNo || "-"}</td>
                  <td className="px-4 py-3">{p.items?.length || 0}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    ₹{p.totalAmount}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(p)}
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
        title="Add Purchase"
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Supplier Name" required>
              <input
                name="supplierName"
                value={form.supplierName}
                onChange={handleHeaderChange}
                className={inputClass}
                required
              />
            </FormField>
            <FormField label="Invoice No">
              <input
                name="invoiceNo"
                value={form.invoiceNo}
                onChange={handleHeaderChange}
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="Purchase Date" required>
            <input
              type="date"
              name="purchaseDate"
              value={form.purchaseDate}
              onChange={handleHeaderChange}
              className={inputClass}
              required
            />
          </FormField>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Items</span>
              <button
                type="button"
                onClick={addItemRow}
                className="text-sm font-medium text-amber-600 hover:underline"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-2">
              {form.items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center gap-2">
                  <select
                    value={it.material}
                    onChange={(e) =>
                      handleItemChange(idx, "material", e.target.value)
                    }
                    className={`${inputClass} col-span-5`}
                    required
                  >
                    <option value="">Select material</option>
                    {materials.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name} ({m.unit})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) =>
                      handleItemChange(idx, "quantity", e.target.value)
                    }
                    className={`${inputClass} col-span-2`}
                    placeholder="Qty"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={it.rate}
                    onChange={(e) =>
                      handleItemChange(idx, "rate", e.target.value)
                    }
                    className={`${inputClass} col-span-3`}
                    placeholder="Rate"
                    required
                  />
                  <div className="col-span-1 text-sm font-medium text-slate-700">
                    ₹{Number(it.quantity || 0) * Number(it.rate || 0)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    className="col-span-1 text-red-500 hover:underline"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 text-right text-sm font-semibold text-slate-800">
              Total: ₹{computedTotal}
            </div>
          </div>

          <FormField label="Notes">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleHeaderChange}
              className={inputClass}
              rows={2}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3">
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
              {saving ? "Saving..." : "Save Purchase"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}