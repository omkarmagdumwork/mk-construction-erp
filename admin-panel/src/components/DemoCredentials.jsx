const DEMO = {
  email: "admin@mkconstruction.com",
  password: "Admin@123",
};

export default function DemoCredentials({ onUse }) {
  return (
    <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-slate-700">
      <p className="mb-2 font-semibold text-slate-800">Demo credentials</p>
      <p>Email: <span className="font-mono">{DEMO.email}</span></p>
      <p>Password: <span className="font-mono">{DEMO.password}</span></p>
      <button
        type="button"
        onClick={() => onUse(DEMO)}
        className="mt-3 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-amber-400"
      >
        Use demo login
      </button>
    </div>
  );
}