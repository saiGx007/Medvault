import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext"; // 1. Import useAuth
import { Lock, Mail, Activity, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // 2. Destructure the login function
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const token = response.data;

      // Decode JWT to get Role and other payload data
      const payload = JSON.parse(atob(token.split(".")[1]));

      // 3. Create a user object to store in Context
      const userData = {
        token: token,
        role: payload.role,
        email: payload.sub, // 'sub' is standard for email/username in JWT
        fullName: payload.fullName || "User" // Fallback if fullName isn't in JWT
      };

      // 4. Update Context & LocalStorage via the login helper
      login(userData);

      // Routing logic
      const rolePath = payload.role.toLowerCase();
      navigate(`/${rolePath}/dashboard`);
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-page">
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">

        {/* LEFT SIDE: Branding & Visuals */}
        <div className="hidden md:flex flex-col justify-center items-center bg-slate-900 text-white p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="max-w-md text-center relative z-10">
            <div className="bg-blue-600/20 p-4 rounded-2xl inline-block mb-6">
              <Activity className="w-12 h-12 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">MedVault</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The professional standard for secure medical record management and unified healthcare workflows.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Authentication Form */}
        <div className="flex items-center justify-center p-8 lg:p-16 bg-slate-50/30">
          <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-800">Welcome back</h2>
              <p className="text-slate-500 mt-2 font-medium">Please enter your credentials to access your vault.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    placeholder="dr.smith@medvault.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Verifying..." : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-10 text-center border-t border-slate-100 pt-8">
              <p className="text-slate-500 text-sm font-medium">
                Don't have a MedVault account? <br />
                <Link to="/register" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors mt-2 inline-block">
                  Create an account now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}