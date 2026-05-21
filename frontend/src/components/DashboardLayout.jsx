import React, { useContext, useState } from "react";

import {
  ClipboardList,
  ShieldCheck,
  LogOut,
  Bell,
  Menu,
  X,
  UserCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { useNavigate, NavLink, useLocation } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* DYNAMIC NAVIGATION */
  const navItems = [
    {
      name: "My Tasks",
      icon: ClipboardList,
      path: "/dashboard",
      show: true,
    },

    {
      name: "Admin Dashboard",
      icon: ShieldCheck,
      path: "/admin",
      show: user?.role === "Admin",
    },
  ];

  /* DYNAMIC PAGE TITLE */
  const currentPage =
    navItems.find((item) => item.path === location.pathname)?.name ||
    "Dashboard";

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-3xl rounded-full" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-3xl rounded-full" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-72 border-r border-white/10 bg-white/[0.03] backdrop-blur-3xl flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* TOP */}
        <div>
          {/* LOGO */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text">
                TaskFlow
              </h1>

              <p className="mt-1 text-xs tracking-wide uppercase text-slate-500">
                Workspace Platform
              </p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X size={22} />
            </button>
          </div>

          {/* USER CARD */}
          <div className="px-4 mt-6">
            <div className="relative p-5 overflow-hidden border bg-white/5 border-white/10 rounded-3xl">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-blue-500/10 blur-2xl" />

              <div className="relative flex items-center gap-4">
                <div className="flex items-center justify-center shadow-lg w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500">
                  <UserCircle2 size={30} />
                </div>

                <div className="overflow-hidden">
                  <h3 className="text-base font-semibold truncate">
                    {user?.name}
                  </h3>

                  <p className="text-sm truncate text-slate-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 mt-5 border rounded-xl bg-white/5 border-white/10 w-fit">
                <Sparkles size={14} className="text-blue-400" />

                <span className="text-xs font-medium text-slate-300">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="px-3 mt-8 space-y-2">
            {navItems
              .filter((item) => item.show)
              .map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xl"
                          : "hover:bg-white/5 text-slate-300 hover:text-white"
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={19} />

                      <span className="text-sm font-medium">{item.name}</span>
                    </div>

                    <ChevronRight
                      size={16}
                      className="transition-transform opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </NavLink>
                );
              })}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 py-3 font-medium text-red-400 transition-all border rounded-2xl bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="relative z-10 flex flex-col flex-1 min-h-screen">
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 border-b border-white/10 bg-[#020617]/70 backdrop-blur-2xl lg:px-8">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center justify-center border lg:hidden w-11 h-11 rounded-2xl bg-white/5 border-white/10"
            >
              <Menu size={20} />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-white">{currentPage}</h2>

              <p className="mt-1 text-sm text-slate-400">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* NOTIFICATION */}
            <button className="relative flex items-center justify-center transition-all border w-11 h-11 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10">
              <Bell size={18} className="text-slate-300" />

              <span className="absolute w-2 h-2 bg-blue-500 rounded-full top-2 right-2 animate-pulse" />
            </button>

            {/* USER MINI */}
            <div className="items-center hidden gap-3 px-4 py-2 border sm:flex border-white/10 bg-white/5 rounded-2xl">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500">
                <UserCircle2 size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">{user?.name}</p>

                <p className="text-xs text-slate-400">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden border shadow-2xl bg-white/[0.03] border-white/10 rounded-[32px] backdrop-blur-3xl min-h-[calc(100vh-170px)]">
              {/* INNER GLOW */}
              <div className="absolute top-0 right-0 rounded-full w-72 h-72 bg-blue-500/5 blur-3xl" />

              <div className="relative p-5 lg:p-8">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
