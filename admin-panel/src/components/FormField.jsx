export const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500";

const FormField = ({ label, required, children }) => (
  <div className="mb-4">
    <label className="mb-1 block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    {children}
  </div>
);

export default FormField;