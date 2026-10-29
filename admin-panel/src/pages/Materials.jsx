
import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import FormField, { inputClass } from "../components/FormField";

const initialForm = {
    name: "",
    unit: "bag",
    minStockLevel: 0,
};

export default function Materials() {
    const [materials, setMaterials] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadMaterials = async () => {
        try {
            setLoading(true);
            const response = await api.get("/materials", {
                params: { search },
            });

            const data = response.data;
            setMaterials(Array.isArray(data) ? data : data.materials || []);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.message || "Materials load karta ale nahi."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(loadMaterials, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const openAddModal = () => {
        setEditingMaterial(null);
        setForm(initialForm);
        setError("");
        setModalOpen(true);
    };

    const openEditModal = (material) => {
        setEditingMaterial(material);
        setForm({
            name: material.name || "",
            unit: material.unit || "bag",
            minStockLevel: material.minStockLevel ?? 0,
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

            const payload = {
                ...form,
                name: form.name.trim(),
                minStockLevel: Number(form.minStockLevel),
            };

            if (!payload.name) {
                setError("Material name required aahe.");
                return;
            }

            if (editingMaterial) {
                await api.put(`/materials/${editingMaterial._id}`, payload);
            } else {
                await api.post("/materials", payload);
            }

            setModalOpen(false);
            setForm(initialForm);
            setEditingMaterial(null);
            await loadMaterials();
        } catch (err) {
            setError(
                err.response?.data?.message || "Material save karta ala nahi."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (material) => {
        const confirmed = window.confirm(
            `"${material.name}" delete karaycha aahe ka?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/materials/${material._id}`);
            await loadMaterials();
        } catch (err) {
            setError(
                err.response?.data?.message || "Material delete karta ala nahi."
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Materials</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Construction materials manage kara.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                    + Add Material
                </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search materials..."
                    className={`${inputClass} w-full sm:max-w-sm`}
                />

                {error && (
                    <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Material Name</th>
                                <th className="px-4 py-3">Unit</th>
                                <th className="px-4 py-3">Minimum Stock</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center">
                                        Loading materials...
                                    </td>
                                </tr>
                            ) : materials.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No materials found.
                                    </td>
                                </tr>
                            ) : (
                                materials.map((material, index) => (
                                    <tr key={material._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {material.name}
                                        </td>
                                        <td className="px-4 py-3">{material.unit}</td>
                                        <td className="px-4 py-3">
                                            {material.minStockLevel ?? 0}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(material)}
                                                    className="rounded-md bg-amber-50 px-3 py-1.5 text-amber-700 hover:bg-amber-100"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(material)}
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
                title={editingMaterial ? "Edit Material" : "Add Material"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField label="Material Name" required>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="e.g. Cement"
                            required
                        />
                    </FormField>

                    <FormField label="Unit" required>
                        <select
                            name="unit"
                            value={form.unit}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        >
                            <option value="bag">Bag</option>
                            <option value="kg">Kg</option>
                            <option value="ton">Ton</option>
                            <option value="piece">Piece</option>
                            <option value="liter">Liter</option>
                            <option value="meter">Meter</option>
                            <option value="cubic_meter">Cubic Meter</option>
                        </select>
                    </FormField>

                    <FormField label="Minimum Stock Level" required>
                        <input
                            type="number"
                            name="minStockLevel"
                            min="0"
                            value={form.minStockLevel}
                            onChange={handleChange}
                            className={inputClass}
                            required
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
                                : editingMaterial
                                    ? "Update Material"
                                    : "Save Material"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

