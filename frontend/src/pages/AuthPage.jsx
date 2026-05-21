import React, { useState, useContext } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, register } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const data = await login(formData.email, formData.password);

        if (data.role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.role,
        );

        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#020617]">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 blur-3xl rounded-full" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* LEFT SIDE */}
      <div className="relative items-center flex-1 hidden px-20 lg:flex">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border rounded-full border-white/10 bg-white/5 backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-blue-400" />

            <span className="text-sm text-slate-300">
              Smart Task Management Platform
            </span>
          </div>

          <h1 className="text-6xl font-black leading-tight text-white">
            Work Faster.
            <span className="block text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text">
              Manage Smarter.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            A professional productivity workspace built for teams and
            individuals to organize tasks, monitor workflows, and stay
            productive.
          </p>

          {/* FEATURES */}
          <div className="mt-10 space-y-4">
            {[
              "Real-time task management",
              "Secure admin & user access",
              "Professional analytics dashboard",
              "Modern responsive workspace",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 border rounded-lg bg-blue-500/10 border-blue-500/20">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                </div>

                <p className="text-slate-300">{item}</p>
              </div>
            ))}
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="p-5 border bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <h2 className="text-3xl font-bold text-white">99%</h2>

              <p className="mt-1 text-sm text-slate-400">Uptime</p>
            </div>

            <div className="p-5 border bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <h2 className="text-3xl font-bold text-white">10K+</h2>

              <p className="mt-1 text-sm text-slate-400">Tasks Managed</p>
            </div>

            <div className="p-5 border bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <h2 className="text-3xl font-bold text-white">24/7</h2>

              <p className="mt-1 text-sm text-slate-400">Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative z-10 flex items-center justify-center w-full lg:w-[520px] p-6">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden border shadow-2xl bg-white/10 backdrop-blur-3xl border-white/10 rounded-3xl">
            {/* TOP GRADIENT */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500" />

            <div className="p-8">
              {/* HEADER */}
              <div className="mb-8 text-center">
                <div className="relative flex items-center justify-center w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-violet-500 blur-lg opacity-60" />

                  <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-violet-500">
                    <ShieldCheck className="text-white w-9 h-9" />
                  </div>
                </div>

                <h2 className="text-4xl font-bold text-white">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>

                <p className="mt-3 text-slate-400">
                  {isLogin
                    ? "Access your workspace securely"
                    : "Start managing your workflow today"}
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div className="p-4 mb-6 text-sm text-red-300 border bg-red-500/10 border-red-500/20 rounded-2xl">
                  {error}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* NAME */}
                {!isLogin && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-300">
                      Full Name
                    </label>

                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />

                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                        className="w-full py-3.5 pl-12 pr-4 text-white transition-all border bg-white/5 border-white/10 rounded-2xl placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.07]"
                      />
                    </div>
                  </div>
                )}

                {/* EMAIL */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />

                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="w-full py-3.5 pl-12 pr-4 text-white transition-all border bg-white/5 border-white/10 rounded-2xl placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.07]"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      className="w-full py-3.5 pl-12 pr-12 text-white transition-all border bg-white/5 border-white/10 rounded-2xl placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.07]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute transition-all right-4 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* ROLE */}
                {!isLogin && (
                  <div>
                    <label className="block mb-3 text-sm font-medium text-slate-300">
                      Choose Role
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      {["User", "Admin"].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              role,
                            })
                          }
                          className={`group relative overflow-hidden rounded-2xl border p-4 transition-all ${
                            formData.role === role
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="relative z-10">
                            <p className="font-semibold text-white">{role}</p>

                            <p className="mt-1 text-xs text-slate-400">
                              {role === "Admin"
                                ? "Manage the platform"
                                : "Manage your tasks"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* FORGOT PASSWORD */}
                {isLogin && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-blue-400 transition-all hover:text-blue-300"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center w-full gap-2 py-3.5 font-semibold text-white transition-all rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Create Account"}

                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* TOGGLE */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm transition-all text-slate-400 hover:text-white"
                >
                  {isLogin
                    ? "Don't have an account? Create one"
                    : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
