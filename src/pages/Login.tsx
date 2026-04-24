import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const DEMO_CREDS = [
  { role: "Super Admin",     email: "admin@venkat.com",    password: "Admin@123"    },
  { role: "Manager",         email: "manager@venkat.com",  password: "Manager@123"  },
  { role: "Sales Executive", email: "sales@venkat.com",    password: "Sales@123"    },
  { role: "Accounts",        email: "accounts@venkat.com", password: "Accounts@123" },
  { role: "Viewer",          email: "viewer@venkat.com",   password: "Viewer@123"   },
];

export default function Login() {
  const { login, isDark, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      // Customer role → customer portal
      const stored = JSON.parse(localStorage.getItem("venkat_user") || "{}");
      navigate(stored.role === "customer" ? "/customer-portal" : "/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  const fillCred = (cred: typeof DEMO_CREDS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 shadow-2xl rounded-2xl overflow-hidden">

        {/* Left Panel — Brand */}
        <div className="bg-venkat-navy p-8 flex flex-col justify-between">
          <div>
            {/* Real VSG Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white rounded-xl p-2 flex items-center justify-center" style={{ width: 56, height: 56 }}>
                <img
                  src="https://venkatswitchgears.com/wp-content/uploads/2021/08/logo_vsg-web.png"
                  alt="Venkat Switchgears"
                  className="w-full h-full object-contain"
                  onError={e => { (e.target as HTMLImageElement).alt = "VSG"; }}
                />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl leading-tight">Venkat Switchgears</h1>
                <p className="text-venkat-orange text-xs font-semibold tracking-widest uppercase">Synergizing Power</p>
              </div>
            </div>

            <h2 className="text-white text-2xl font-bold mb-2">Business Intelligence Dashboard</h2>
            <p className="text-[#8BAED6] text-sm leading-relaxed">
              Live insights from Tally ERP — Sales, Purchases, Inventory, GST & more. Est. 2002 · Peenya Industrial Area, Bangalore.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { label: "Est.",           value: "2002" },
                { label: "Units",          value: "2 Plants" },
                { label: "Products",       value: "HT & LT" },
                { label: "GST Reports",    value: "Integrated" },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl p-3">
                  <p className="text-venkat-orange font-bold text-lg">{s.value}</p>
                  <p className="text-[#8BAED6] text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 text-xs text-[#8BAED6] space-y-1">
              <p>📍 Unit 1: #150, 10th Main, 3rd Phase, Peenya — 560058</p>
              <p>📍 Unit 2: #439-440, 12th Main, 4th Phase, Peenya — 560058</p>
              <p>📞 +91 94483 54274 / 080-23722274</p>
            </div>
          </div>

          <div>
            <p className="text-[#8BAED6] text-xs mt-4 border-t border-white/10 pt-3">
              Manufacturing · Export · Electrical Contracts · AMC Services
            </p>
            {/* Built by The Raise */}
            <div className="mt-4 flex items-center gap-2">
              <p className="text-[#8BAED6] text-[10px] uppercase tracking-widest flex-shrink-0">Built by</p>
              <img
                src="/Venkat-Switchgears-BI-Dashboard/the-raise-logo.png"
                alt="The Raise"
                className="h-5 object-contain brightness-0 invert opacity-70"
              />
            </div>
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="bg-white dark:bg-slate-800 p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-slate-800 dark:text-white text-2xl font-bold">Sign In</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="you@venkat.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-venkat-orange hover:bg-venkat-orange-dark disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">DEMO CREDENTIALS — click to fill</p>
            <div className="space-y-1.5">
              {DEMO_CREDS.map(c => (
                <button
                  key={c.email}
                  onClick={() => fillCred(c)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors text-left"
                >
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{c.role}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{c.email}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="mt-4 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors self-center"
          >
            Toggle Dark / Light mode
          </button>
        </div>
      </div>
    </div>
  );
}
