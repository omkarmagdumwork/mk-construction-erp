import { useEffect, useState } from "react";
import Reveal from "../components/Reveal";
import api from "../services/api";
import { company } from "../data"; // Fallback data

export default function Contact({ embedded = false }) {
  const [siteData, setSiteData] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState(""); // "", "loading", "success", "error"

  // Fetch contact info from the admin panel
  useEffect(() => {
    api.get("/website")
      .then((res) => {
        if (res.data) setSiteData(res.data);
      })
      .catch(() => console.log("Using default contact info"));
  }, []);

  const contactInfo = {
    phone: siteData?.phone || company.phone,
    email: siteData?.email || company.email,
    address: siteData?.address || company.address,
  };

  // Submit enquiry
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/enquiries", {
        name: form.name,
        phone: form.phone,
        email: form.email,
        requirement: form.message, // Admin panel uses the 'requirement' field
        source: "Website",
        status: "New",
      });
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

  return (
    <div className={embedded ? "pb-20" : "pt-24 pb-20"}>
      <section className="bg-navy px-6 py-20 text-center text-white">
        <Reveal>
          <h1 className="font-heading text-4xl font-extrabold md:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Get in touch with us for your next construction project.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Contact Info */}
          <Reveal>
            <h2 className="mb-6 font-heading text-3xl font-bold text-navy">Let's talk</h2>
            <p className="mb-8 text-slate-600">
              Have a project in mind or need a consultation? Fill out the form or reach us directly.
            </p>

            <div className="space-y-6">
              {[
                { icon: "📞", label: "Phone", value: contactInfo.phone },
                { icon: "✉️", label: "Email", value: contactInfo.email },
                { icon: "📍", label: "Address", value: contactInfo.address },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy/5 text-navy">
                    {c.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{c.label}</p>
                    <p className="text-slate-600">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Enquiry Form */}
          <Reveal delay={0.2}>
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-8 shadow-lg">
              <h3 className="mb-6 font-heading text-xl font-bold text-navy">Send Enquiry</h3>

              {status === "success" && (
                <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                  Thank you! Your enquiry has been sent successfully.
                </div>
              )}
              {status === "error" && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  Something went wrong. Please try again or call us.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Full Name *</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Phone Number *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email (Optional)</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Project Details *</label>
                  <textarea required rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass}></textarea>
                </div>

                <button
                  disabled={status === "loading"}
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-navy px-6 py-3 font-semibold text-white transition hover:bg-navy-mid disabled:opacity-70"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}