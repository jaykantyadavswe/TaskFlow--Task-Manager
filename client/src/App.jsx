import "./App.css";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import TaskCard from "./components/TaskCard";
import StatsCard from "./components/StatsCard";
import TaskForm from "./components/TaskForm";
import Toast from "./components/Toast";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./services/taskApi.js";

const pages = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "A clear view of what you want to get done.",
  },
  "/my-day": {
    title: "My Day",
    subtitle: "Today's priorities, all in one place.",
  },
  "/completed": {
    title: "Completed tasks",
    subtitle: "Take a moment to appreciate your progress.",
  },
  "/all-tasks": {
    title: "All tasks",
    subtitle: "Everything on your plate, organized.",
  },
};

const filterClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:w-auto";

const taskStatuses = [
  {
    value: "pending",
    label: "Pending",
    dotClass: "bg-amber-500",
    countClass: "bg-amber-50 text-amber-700",
  },
  {
    value: "active",
    label: "Active",
    dotClass: "bg-indigo-500",
    countClass: "bg-indigo-50 text-indigo-700",
  },
  {
    value: "completed",
    label: "Completed",
    dotClass: "bg-emerald-500",
    countClass: "bg-emerald-50 text-emerald-700",
  },
];

function getPageFromPath(pathname) {
  return Object.hasOwn(pages, pathname) ? pathname : "/dashboard";
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTaskDueDateKey(dueDate) {
  if (typeof dueDate === "string") {
    const dateOnly = dueDate.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    if (dateOnly) return dateOnly;
  }

  const parsedDate = new Date(dueDate);
  return Number.isNaN(parsedDate.getTime())
    ? null
    : getLocalDateKey(parsedDate);
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [activePage, setActivePage] = useState(() =>
    getPageFromPath(window.location.pathname),
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const dismissToast = useCallback(() => setToast(null), []);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  useEffect(() => {
    function handlePopState() {
      setActivePage(getPageFromPath(window.location.pathname));
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function handleNavigate(event, href) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    if (window.location.pathname !== href) {
      window.history.pushState({}, "", href);
    }
    setActivePage(href);
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <CheckCircle2 size={23} aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your workspace...
          </p>
          <span className="mx-auto mt-4 block h-1 w-24 overflow-hidden rounded-full bg-indigo-100">
            <span className="block h-full w-1/2 animate-pulse rounded-full bg-indigo-600" />
          </span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <ListTodo size={22} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-lg font-semibold text-slate-900">
            Could not load your tasks
          </h1>
          <p role="alert" className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const total = tasks.length;
  const active = tasks.filter((task) => task.status === "active").length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const todayKey = getLocalDateKey(new Date());
  const todayTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      getTaskDueDateKey(task.dueDate) === todayKey,
  );
  const page = pages[activePage];
  const pageTasks =
    activePage === "/my-day"
      ? todayTasks
      : activePage === "/completed"
        ? tasks.filter((task) => task.status === "completed")
        : tasks;
  const isBoardView =
    activePage === "/dashboard" || activePage === "/all-tasks";
  const boardCompleted = pageTasks.filter(
    (task) => task.status === "completed",
  ).length;
  const boardProgress =
    pageTasks.length === 0
      ? 0
      : Math.round((boardCompleted / pageTasks.length) * 100);

  const filteredTasks = pageTasks.filter((task) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      task.title.toLowerCase().includes(query) ||
      (task.description || "").toLowerCase().includes(query) ||
      (task.category || "").toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });
  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all";
  const activeFilterCount =
    Number(search.trim() !== "") +
    Number(statusFilter !== "all") +
    Number(priorityFilter !== "all");

  function resetFilters() {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
  }

  async function handleSaveTask(taskData) {
    try {
      if (editingTask) {
        const taskId = editingTask._id ?? editingTask.id;
        const updatedTask = await updateTask(taskId, taskData);
        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            (task._id ?? task.id) === taskId ? updatedTask : task,
          ),
        );
        showToast("Task updated successfully.");
      } else {
        const createdTask = await createTask(taskData);
        setTasks((previousTasks) => [createdTask, ...previousTasks]);
        showToast("Task created successfully.");
      }

      setShowTaskForm(false);
      setEditingTask(null);
    } catch (err) {
      showToast(
        err.message || `Could not ${editingTask ? "update" : "create"} this task.`,
        "error",
      );
      throw err;
    }
  }

  function handleEdit(task) {
    setEditingTask(task);
    setShowTaskForm(true);
  }

  function handleCloseTaskForm() {
    setShowTaskForm(false);
    setEditingTask(null);
  }

  async function handleStatusChange(task, status) {
    const taskId = task._id ?? task.id;
    setUpdatingTaskId(taskId);

    try {
      const updatedTask = await updateTask(taskId, { status });
      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          (item._id ?? item.id) === taskId ? updatedTask : item,
        ),
      );
      showToast(`Task moved to ${status}.`);
    } catch (err) {
      showToast(err.message || "Could not update this task.", "error");
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleToggle(task) {
    await handleStatusChange(
      task,
      task.status === "completed" ? "pending" : "completed",
    );
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((previousTasks) =>
        previousTasks.filter((task) => (task._id ?? task.id) !== id),
      );
      showToast("Task deleted.");
    } catch (err) {
      showToast(err.message || "Could not delete this task.", "error");
    }
  }

  const listTitle =
    activePage === "/dashboard"
      ? "Task board"
      : activePage === "/my-day"
        ? "Today's tasks"
        : page.title;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 lg:flex">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        totalCount={total}
        completedCount={completed}
      />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Workspace <span className="px-1.5 text-slate-300">/</span>{" "}
                {page.title}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {activePage === "/dashboard" ? "Good to see you" : page.title}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">{page.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowTaskForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-600/25 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
            >
              <Plus size={17} aria-hidden="true" />
              <span>Add task</span>
            </button>
          </header>

          {activePage === "/dashboard" && (
            <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-900/10 sm:p-8">
              <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[36px] border-white/5" />
              <div className="pointer-events-none absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-violet-400/20 blur-2xl" />
              <div className="relative flex flex-wrap items-end justify-between gap-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-50 ring-1 ring-inset ring-white/15">
                    <Sparkles size={13} aria-hidden="true" />
                    Your personal workspace
                  </span>
                  <h2 className="mt-4 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
                    Make space for what matters.
                  </h2>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-indigo-100">
                    Break your day into small wins. Your next completed task is
                    closer than you think.
                  </p>
                </div>
                <div className="flex min-w-36 items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-inset ring-white/10">
                  <CalendarDays size={19} className="text-indigo-100" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-indigo-100">Today</p>
                    <p className="text-sm font-semibold">
                      {new Date().toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activePage === "/dashboard" && (
            <section
              aria-label="Task summary"
              className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              <StatsCard
                icon={ListTodo}
                title="Total tasks"
                value={total}
                description="Tasks in your workspace"
                tone="indigo"
              />
              <StatsCard
                icon={Clock3}
                title="Active tasks"
                value={active}
                description="Currently in progress"
                tone="amber"
              />
              <StatsCard
                icon={CheckCircle2}
                title="Completed"
                value={completed}
                description="Wins you have already made"
                tone="emerald"
              />
            </section>
          )}

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-semibold text-slate-900">{listTitle}</h2>
                <p className="mt-1 text-xs text-slate-400">
                  {activePage === "/my-day"
                    ? `${todayTasks.length} task${todayTasks.length === 1 ? "" : "s"} scheduled for today`
                    : activePage === "/completed"
                      ? `${completed} task${completed === 1 ? "" : "s"} completed`
                      : `${pageTasks.length} task${pageTasks.length === 1 ? "" : "s"} to explore`}
                </p>
              </div>
              <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                {filteredTasks.length} shown
              </span>
            </div>

            <div className="grid gap-3 border-b border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5">
              <label className="relative min-w-0">
                <Search
                  size={17}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  aria-label="Search tasks"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </label>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <select
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className={`${filterClassName} min-w-0`}
                >
                  <option value="all">Any status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  aria-label="Filter by priority"
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value)}
                  className={`${filterClassName} min-w-0`}
                >
                  <option value="all">Any priority</option>
                  <option value="high">High priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="low">Low priority</option>
                </select>
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:text-slate-400 sm:col-span-1"
                >
                  <RotateCcw size={15} aria-hidden="true" />
                  Reset filters
                  {hasActiveFilters && (
                    <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-xs tabular-nums text-indigo-700">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {isBoardView && (
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-slate-600">
                    Board completion
                  </span>
                  <span className="tabular-nums text-slate-500">
                    {boardCompleted} of {pageTasks.length} · {boardProgress}%
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Board task completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={boardProgress}
                  className="h-2 overflow-hidden rounded-full bg-slate-100"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-[width] duration-500 ease-out"
                    style={{ width: `${boardProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="px-4 sm:px-6">
              {filteredTasks.length === 0 && !isBoardView ? (
                <div className="px-5 py-14 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    {activePage === "/my-day" ? (
                      <CalendarDays size={21} aria-hidden="true" />
                    ) : activePage === "/completed" ? (
                      <CheckCircle2 size={21} aria-hidden="true" />
                    ) : (
                      <ListTodo size={21} aria-hidden="true" />
                    )}
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-slate-800">
                    {search || statusFilter !== "all" || priorityFilter !== "all"
                      ? "No tasks match those filters"
                      : activePage === "/my-day"
                        ? "Nothing scheduled for today"
                        : activePage === "/completed"
                          ? "Your completed tasks will show up here"
                          : "A fresh start"}
                  </h3>
                  <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-slate-500">
                    {search || statusFilter !== "all" || priorityFilter !== "all"
                      ? "Try a different search or adjust your filters."
                      : activePage === "/my-day"
                        ? "Add a due date to a task to see it in your day."
                        : activePage === "/completed"
                          ? "Complete a task and it will be added to this list."
                          : "Add your first task and turn your plans into progress."}
                  </p>
                  {activePage !== "/completed" && (
                    <button
                      type="button"
                      onClick={() => setShowTaskForm(true)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                    >
                      <Plus size={16} aria-hidden="true" />
                      Create a task
                    </button>
                  )}
                </div>
              ) : isBoardView && filteredTasks.length === 0 ? (
                <div className="px-5 py-14 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Search size={21} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-slate-800">
                    No tasks match these filters
                  </h3>
                  <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-slate-500">
                    Try a different search or adjust your filters to see tasks
                    on the board.
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    >
                      <RotateCcw size={15} aria-hidden="true" />
                      Reset filters
                    </button>
                  )}
                </div>
              ) : isBoardView ? (
                <div className="grid gap-4 py-4 lg:grid-cols-3">
                  {taskStatuses.map((status) => {
                    const statusTasks = filteredTasks.filter(
                      (task) => task.status === status.value,
                    );

                    return (
                      <section
                        key={status.value}
                        aria-labelledby={`column-${status.value}`}
                        className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4"
                      >
                        <header className="mb-3 flex items-center justify-between gap-2 px-1">
                          <h3
                            id={`column-${status.value}`}
                            className="flex items-center gap-2 text-sm font-semibold text-slate-800"
                          >
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${status.dotClass}`}
                            />
                            {status.label}
                          </h3>
                          <span
                            className={`rounded-lg px-2 py-0.5 text-xs font-semibold tabular-nums ${status.countClass}`}
                          >
                            {statusTasks.length}
                          </span>
                        </header>

                        <div className="flex min-h-32 flex-col gap-3">
                          {statusTasks.length === 0 ? (
                            <p className="flex min-h-28 flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/70 px-3 text-center text-xs text-slate-400">
                              No {status.label.toLowerCase()} tasks
                            </p>
                          ) : (
                            statusTasks.map((task) => (
                              <TaskCard
                                key={task._id ?? task.id}
                                task={task}
                                variant="board"
                                disabled={(task._id ?? task.id) === updatingTaskId}
                                onToggle={() => handleToggle(task)}
                                onEdit={() => handleEdit(task)}
                                onStatusChange={(nextStatus) =>
                                  handleStatusChange(task, nextStatus)
                                }
                                onDelete={() => handleDelete(task._id ?? task.id)}
                              />
                            ))
                          )}
                        </div>
                      </section>
                    );
                  })}
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id ?? task.id}
                    task={task}
                    disabled={(task._id ?? task.id) === updatingTaskId}
                    onToggle={() => handleToggle(task)}
                    onEdit={() => handleEdit(task)}
                    onDelete={() => handleDelete(task._id ?? task.id)}
                  />
                ))
              )}
            </div>
          </section>
          <footer className="py-6 text-center text-xs text-slate-400">
            Small steps. Meaningful progress.
          </footer>
        </div>
      </main>

      {showTaskForm && (
        <TaskForm
          key={editingTask?._id ?? editingTask?.id ?? "new-task"}
          task={editingTask}
          onSubmit={handleSaveTask}
          onCancel={handleCloseTaskForm}
        />
      )}
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
