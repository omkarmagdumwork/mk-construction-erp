import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      const userRole = res.data.role || res.data.user?.role;

      if (userRole !== "admin") {
        setError("Access denied. Only admin can login here.");
        return;
      }

      localStorage.setItem("mk_user", JSON.stringify({ 
        token: res.data.token, 
        name: res.data.name || res.data.user?.name, 
        role: userRole 
      }));

      window.location.href = "http://localhost:5173"; 
      
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-24">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-navy">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-500">Login to manage the website content</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              placeholder="admin@mkconstruction.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-lg bg-navy px-6 py-3 font-semibold text-white transition hover:bg-navy-mid disabled:opacity-70 mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <a href="/" className="hover:text-navy hover:underline">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}