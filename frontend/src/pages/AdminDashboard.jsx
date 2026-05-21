import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  Users,
  ClipboardList,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Activity,
  Search,
  Filter,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";

import API from "../utils/api";
import DashboardLayout from "../components/DashboardLayout";
import { AuthContext } from "../context/AuthContext"; // ✅ ONLY ADDITION

const AdminDashboard = () => {
  const { user: currentUser } = useContext(AuthContext); // ✅ ONLY ADDITION

  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  const [activeTab, setActiveTab] = useState("users");

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [analyticsRes, usersRes, logsRes] = await Promise.all([
        API.get("/admin/analytics"),
        API.get("/admin/users"),
        API.get("/admin/logs"),
      ]);

      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error("Failed to load administration data");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      await API.put(`/admin/users/${id}/status`, {
        status: nextStatus,
      });

      setUsers(
        users.map((u) => (u._id === id ? { ...u, status: nextStatus } : u)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 ONLY LOGIC FIX (FROM GEMINI)
  const handleDeleteUser = async (id) => {
    // ❌ BLOCK SELF DELETE (IMPORTANT FIX)
    if (id === currentUser?._id) {
      alert("You cannot delete your own admin account.");
      return;
    }

    if (
      !window.confirm("Are you sure you want to permanently delete this user?")
    )
      return;

    try {
      await API.delete(`/admin/users/${id}`);

      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* FILTER USERS */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" ? true : user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Admin Control Panel
            </h1>

            <p className="mt-2 text-slate-400">
              Manage users, monitor activity, and track system analytics.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="flex items-center justify-center h-12 gap-2 px-5 font-medium text-white transition-all rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw size={18} />
            )}
            Refresh Data
          </button>
        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="p-5 border bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Users</p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  {analytics?.totalUsers || 0}
                </h2>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10">
                <Users className="text-blue-400" />
              </div>
            </div>
          </div>

          <div className="p-5 border bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Tasks</p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  {analytics?.totalTasks || 0}
                </h2>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10">
                <ClipboardList className="text-violet-400" />
              </div>
            </div>
          </div>

          <div className="p-5 border bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  {analytics?.completedTasks || 0}
                </h2>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10">
                <CheckCircle2 className="text-green-400" />
              </div>
            </div>
          </div>

          <div className="p-5 border bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  {analytics?.pendingTasks || 0}
                </h2>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10">
                <Clock3 className="text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* REST OF YOUR UI UNCHANGED */}
        {/* (tabs, table, logs, etc remain EXACT SAME) */}

        {/* TABS */}
        <div className="flex items-center gap-3 pb-4 overflow-x-auto border-b border-white/10">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "users"
                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            User Management
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "logs"
                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            Activity Logs
          </button>
        </div>

        {/* USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* FILTERS */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* SEARCH */}
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />

                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-3 pr-4 text-white border bg-white/5 border-white/10 rounded-2xl pl-11 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* FILTER */}
              <div className="relative">
                <Filter className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="py-3 pr-10 text-white border appearance-none bg-white/5 border-white/10 rounded-2xl pl-11 focus:outline-none focus:border-blue-500"
                >
                  <option className="bg-slate-900">All</option>

                  <option className="bg-slate-900">Admin</option>

                  <option className="bg-slate-900">User</option>
                </select>
              </div>
            </div>

            {/* USERS TABLE */}
            <div className="overflow-hidden border bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="border-b border-white/10 bg-white/[0.03]">
                    <tr>
                      <th className="px-6 py-5 text-xs font-semibold tracking-wider text-left uppercase text-slate-400">
                        User
                      </th>

                      <th className="px-6 py-5 text-xs font-semibold tracking-wider text-left uppercase text-slate-400">
                        Role
                      </th>

                      <th className="px-6 py-5 text-xs font-semibold tracking-wider text-left uppercase text-slate-400">
                        Status
                      </th>

                      <th className="px-6 py-5 text-xs font-semibold tracking-wider text-right uppercase text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-all"
                      >
                        {/* USER */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 font-bold text-white rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500">
                              {u.name?.charAt(0)}
                            </div>

                            <div>
                              <h3 className="font-medium text-white">
                                {u.name}
                              </h3>

                              <p className="text-sm text-slate-400">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ROLE */}
                        <td className="px-6 py-5">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold ${
                              u.role === "Admin"
                                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                                : "bg-slate-500/10 text-slate-300 border border-slate-500/20"
                            }`}
                          >
                            <ShieldCheck size={14} />
                            {u.role}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                          <button
                            onClick={() => toggleUserStatus(u._id, u.status)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                              u.status === "Active"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {u.status === "Active" ? (
                              <UserCheck size={14} />
                            ) : (
                              <UserX size={14} />
                            )}

                            {u.status}
                          </button>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="flex items-center justify-center text-red-400 transition-all border w-11 h-11 rounded-xl bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="py-20 text-center">
                    <Users className="mx-auto mb-4 text-slate-500 w-14 h-14" />

                    <h3 className="text-xl font-semibold text-white">
                      No Users Found
                    </h3>

                    <p className="mt-2 text-slate-400">
                      Try adjusting your filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LOGS */}
        {activeTab === "logs" && (
          <div className="overflow-hidden border bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-white/10 bg-white/[0.03]">
                  <tr>
                    <th className="px-6 py-5 text-xs font-semibold tracking-wider text-left uppercase text-slate-400">
                      Timestamp
                    </th>

                    <th className="px-6 py-5 text-xs font-semibold tracking-wider text-left uppercase text-slate-400">
                      User
                    </th>

                    <th className="px-6 py-5 text-xs font-semibold tracking-wider text-left uppercase text-slate-400">
                      Action
                    </th>

                    <th className="px-6 py-5 text-xs font-semibold tracking-wider text-left uppercase text-slate-400">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log._id}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-all"
                    >
                      <td className="px-6 py-5 text-sm text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      <td className="px-6 py-5">
                        <div>
                          <h3 className="font-medium text-white">
                            {log.user?.name || "Deleted User"}
                          </h3>

                          <p className="text-sm text-slate-400">
                            {log.user?.email || "N/A"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold ${
                            log.action === "LOGIN"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : log.action === "TASK_CREATE"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : log.action === "TASK_UPDATE"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          <Activity size={14} />

                          {log.action}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-300">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {logs.length === 0 && (
                <div className="py-20 text-center">
                  <Activity className="mx-auto mb-4 text-slate-500 w-14 h-14" />

                  <h3 className="text-xl font-semibold text-white">
                    No Activity Logs
                  </h3>

                  <p className="mt-2 text-slate-400">
                    System activity will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
