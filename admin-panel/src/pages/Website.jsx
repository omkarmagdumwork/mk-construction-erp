import { useEffect, useState } from "react";
import api from "../services/api";
import FormField, { inputClass } from "../components/FormField";

const emptyForm = {
  companyName: "",
  tagline: "",
  heroTitle: "",
  heroSubtitle: "",
  aboutText: "",
  phone: "",
  email: "",
  address: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  metaTitle: "",
  metaDescription: "",
};

const Website = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadWebsite = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/website");
      const src = data?.website || data || {};
      setForm({
        companyName: src.companyName || "",
        tagline: src.tagline || "",
        heroTitle: src.heroTitle || "",
        heroSubtitle: src.heroSubtitle || "",
        aboutText: src.aboutText || "",
        phone: src.phone || "",
        email: src.email || "",
        address: src.address || "",
        facebook: src.facebook || "",
        instagram: src.instagram || "",
        linkedin: src.linkedin || "",
        youtube: src.youtube || "",
        metaTitle: src.metaTitle || "",
        metaDescription: src.metaDescription || "",
      });
      setError("");
    } catch (err) {
      // 404 = not created yet — that's fine, empty form dikhva
      if (err.response?.status !== 404) {
        setError(
          err.response?.data?.message || "Could not load website settings"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWebsite();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      // Backend upsert karto — PUT /api/website (create-or-update)
      await api.put("/website", form);
      setSuccess("Website settings saved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not save website settings"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 text-center text-slate-500 shadow-sm">
        Loading website settings...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Website Content</h2>
          <p className="mt-1 text-sm text-slate-500">
            Company website var disnara content ithun manage kara.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Company Identity --- */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Company Identity
          </h3>
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <FormField label="Company Name">
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>
            <FormField label="Tagline">
              <input
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>
          </div>
        </section>

        {/* --- Hero Section --- */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Hero Section
          </h3>
          <FormField label="Hero Title">
            <input
              name="heroTitle"
              value={form.heroTitle}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>
          <FormField label="Hero Subtitle">
            <textarea
              name="heroSubtitle"
              value={form.heroSubtitle}
              onChange={handleChange}
              rows="2"
              className={inputClass}
            />
          </FormField>
        </section>

        {/* --- About --- */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            About Us
          </h3>
          <FormField label="About Text">
            <textarea
              name="aboutText"
              value={form.aboutText}
              onChange={handleChange}
              rows="4"
              className={inputClass}
            />
          </FormField>
        </section>

        {/* --- Contact --- */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <FormField label="Phone">
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
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
          </div>
          <FormField label="Address">
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="2"
              className={inputClass}
            />
          </FormField>
        </section>

        {/* --- Social Links --- */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Social Media Links
          </h3>
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <FormField label="Facebook URL">
              <input
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://facebook.com/..."
              />
            </FormField>
            <FormField label="Instagram URL">
              <input
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://instagram.com/..."
              />
            </FormField>
            <FormField label="LinkedIn URL">
              <input
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://linkedin.com/..."
              />
            </FormField>
            <FormField label="YouTube URL">
              <input
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://youtube.com/..."
              />
            </FormField>
          </div>
        </section>

        {/* --- SEO --- */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            SEO (Search Engine)
          </h3>
          <FormField label="Meta Title">
            <input
              name="metaTitle"
              value={form.metaTitle}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>
          <FormField label="Meta Description">
            <textarea
              name="metaDescription"
              value={form.metaDescription}
              onChange={handleChange}
              rows="2"
              className={inputClass}
            />
          </FormField>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-amber-500 px-6 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Website;