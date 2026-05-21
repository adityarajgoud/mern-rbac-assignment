import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Search,
  Filter,
  Loader2,
} from "lucide-react";

import API from "../utils/api";
import DashboardLayout from "../components/DashboardLayout";

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Could not load tasks");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!newTask.title.trim()) return;

    setLoading(true);

    try {
      const res = await API.post("/tasks", {
        ...newTask,
        status: "Pending",
      });

      setTasks([res.data, ...tasks]);

      setNewTask({
        title: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Pending" ? "Completed" : "Pending";

    try {
      const res = await API.put(`/tasks/${id}`, {
        status: nextStatus,
      });

      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);

      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* FILTERED TASKS */
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" ? true : task.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  /* STATS */
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* TOP STATS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="p-5 border bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Tasks</p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {tasks.length}
                </h2>
              </div>

              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10">
                <ClipboardList className="text-blue-400" />
              </div>
            </div>
          </div>

          <div className="p-5 border bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed</p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {completedTasks}
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
                  {pendingTasks}
                </h2>
              </div>

              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10">
                <Clock3 className="text-amber-400" />
              </div>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl">
            <p className="text-sm text-blue-100">Productivity</p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {tasks.length
                ? Math.round((completedTasks / tasks.length) * 100)
                : 0}
              %
            </h2>

            <p className="mt-2 text-sm text-blue-100">Task completion rate</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8">
          {/* CREATE TASK */}
          <div className="p-6 border bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500">
                <Plus className="text-white" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">Create Task</h2>

                <p className="text-sm text-slate-400">
                  Add a new task to your workflow
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm text-slate-300">
                  Task Title
                </label>

                <input
                  type="text"
                  required
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 text-white border bg-white/5 border-white/10 rounded-2xl placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-slate-300">
                  Description
                </label>

                <textarea
                  rows="5"
                  placeholder="Task details..."
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 text-white border resize-none bg-white/5 border-white/10 rounded-2xl placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full h-12 gap-2 font-semibold text-white transition-all rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}

                {loading ? "Creating..." : "Create Task"}
              </button>
            </form>
          </div>

          {/* TASK LIST */}
          <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">My Tasks</h1>

                <p className="mt-1 text-slate-400">
                  Organize and manage your workflow
                </p>
              </div>

              {/* CONTROLS */}
              <div className="flex flex-col gap-3 sm:flex-row">
                {/* SEARCH */}
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />

                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="py-3 pr-4 text-sm text-white border bg-white/5 border-white/10 rounded-2xl pl-11 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* FILTER */}
                <div className="relative">
                  <Filter className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />

                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="py-3 pr-10 text-sm text-white border appearance-none bg-white/5 border-white/10 rounded-2xl pl-11 focus:outline-none focus:border-blue-500"
                  >
                    <option className="bg-slate-900">All</option>

                    <option className="bg-slate-900">Pending</option>

                    <option className="bg-slate-900">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TASKS */}
            {filteredTasks.length === 0 ? (
              <div className="p-16 text-center border bg-white/5 border-white/10 rounded-3xl">
                <ClipboardList className="mx-auto mb-4 text-slate-500 w-14 h-14" />

                <h3 className="text-xl font-semibold text-white">
                  No Tasks Found
                </h3>

                <p className="mt-2 text-slate-400">
                  Create a task to start managing your work.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:bg-white/[0.07] transition-all"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* LEFT */}
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() =>
                            toggleTaskStatus(task._id, task.status)
                          }
                          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.status === "Completed"
                              ? "bg-green-500 border-green-500"
                              : "border-slate-500"
                          }`}
                        >
                          {task.status === "Completed" && (
                            <CheckCircle2 size={14} className="text-white" />
                          )}
                        </button>

                        <div>
                          <h3
                            className={`text-lg font-semibold ${
                              task.status === "Completed"
                                ? "line-through text-slate-500"
                                : "text-white"
                            }`}
                          >
                            {task.title}
                          </h3>

                          <p className="mt-1 text-sm text-slate-400">
                            {task.description || "No description provided"}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                            task.status === "Completed"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {task.status}
                        </div>

                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="flex items-center justify-center text-red-400 transition-all border w-11 h-11 rounded-xl bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
