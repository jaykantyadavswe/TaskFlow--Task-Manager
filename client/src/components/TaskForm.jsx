import { useEffect, useState } from "react";
import {
  AlignLeft,
  CalendarDays,
  Clock3,
  Flag,
  ListTodo,
  Tag,
  X,
} from "lucide-react";

const initialFormState = {
  title: "",
  description: "",
  category: "General",
  priority: "medium",
  dueDate: "",
  dueTime: "",
};

const categories = [
  "General",
  "Work",
  "Personal",
  "Study",
  "Health",
  "Shopping",
  "Other",
];

const fieldClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

function TaskForm({ task, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
    task
      ? {
          title: task.title ?? "",
          description: task.description ?? "",
          category: task.category || "General",
          priority: task.priority || "medium",
          dueDate: task.dueDate
            ? String(task.dueDate).slice(0, 10)
            : "",
          dueTime: task.dueTime ?? "",
        }
      : initialFormState,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !saving) {
        onCancel();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel, saving]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
      ...(name === "dueDate" && !value ? { dueTime: "" } : {}),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setSaving(true);

    try {
      const taskData = {
        ...form,
        title: form.title.trim(),
        category: form.category.trim() || "General",
        dueDate: form.dueDate || null,
        dueTime: form.dueDate ? form.dueTime : "",
      };

      if (task && taskData.category === (task.category || "General")) {
        delete taskData.category;
      }

      await onSubmit(taskData);
      setForm(initialFormState);
    } catch (err) {
      setError(err.message || "An error occurred while creating the task.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        aria-label="Close task form"
        className="fixed inset-0 h-full w-full cursor-default bg-slate-950/40 backdrop-blur-sm disabled:cursor-wait"
      />
      <div className="relative z-10 mx-auto mt-5 w-full max-w-2xl px-4 pb-5 sm:mt-10 sm:px-6">
        <form
          onSubmit={handleSubmit}
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-form-title"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20"
        >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-5 py-5 sm:px-7">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <ListTodo size={21} aria-hidden="true" />
          </span>
          <div>
            <h2 id="task-form-title" className="text-lg font-semibold tracking-tight text-slate-900">
              {task ? "Edit task" : "Create a task"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {task
                ? "Update the details and keep everything on track."
                : "Add the details and make a plan to get it done."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          aria-label="Close task form"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
        <label className="grid gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
          Task title <span className="text-red-500">*</span>
          <input
            name="title"
            maxLength={120}
            className={fieldClassName}
            placeholder="e.g. Prepare the project presentation"
            value={form.title}
            onChange={handleChange}
            autoFocus
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
          Description <span className="font-normal text-slate-400">Optional</span>
          <span className="relative">
            <AlignLeft
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400"
            />
            <textarea
              name="description"
              maxLength={1000}
              rows={3}
              className={`${fieldClassName} resize-y pl-10`}
              placeholder="Add a few details to help you get started..."
              value={form.description}
              onChange={handleChange}
            />
          </span>
        </label>

        <fieldset className="grid gap-2 sm:col-span-2">
          <legend className="mb-2 text-sm font-medium text-slate-700">
            Priority
          </legend>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              {
                value: "low",
                label: "Low",
                detail: "When you can",
                selectedClasses: "border-emerald-300 bg-emerald-50",
                iconClass: "text-emerald-600",
              },
              {
                value: "medium",
                label: "Medium",
                detail: "On your list",
                selectedClasses: "border-amber-300 bg-amber-50",
                iconClass: "text-amber-600",
              },
              {
                value: "high",
                label: "High",
                detail: "Do it first",
                selectedClasses: "border-rose-300 bg-rose-50",
                iconClass: "text-rose-600",
              },
            ].map((option) => {
              const selected = form.priority === option.value;

              return (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={option.value}
                    checked={selected}
                    onChange={handleChange}
                    disabled={saving}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex min-h-20 flex-col justify-center rounded-xl border px-3 py-3 transition focus-within:ring-4 focus-within:ring-indigo-500/10 ${
                      selected
                        ? `${option.selectedClasses} shadow-sm`
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    } peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-500/20 peer-disabled:cursor-not-allowed peer-disabled:opacity-60`}
                  >
                    <span className="flex items-center gap-2">
                      <Flag
                        size={15}
                        aria-hidden="true"
                        className={`shrink-0 ${
                          selected
                            ? option.iconClass
                            : "text-slate-400"
                        }`}
                      />
                      <span className="text-sm font-semibold text-slate-800">
                        {option.label}
                      </span>
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                      {option.detail}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Category
          <span className="relative">
            <Tag
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              name="category"
              className={`${fieldClassName} appearance-none pl-10`}
              value={form.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Due date <span className="font-normal text-slate-400">Optional</span>
          <span className="relative">
            <CalendarDays
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className={`${fieldClassName} pl-10`}
            />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Due time <span className="font-normal text-slate-400">Optional</span>
          <span className="relative">
            <Clock3
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="time"
              name="dueTime"
              value={form.dueTime}
              onChange={handleChange}
              disabled={!form.dueDate}
              className={`${fieldClassName} pl-10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
            />
          </span>
          {!form.dueDate && (
            <span className="text-xs font-normal text-slate-400">
              Choose a due date first
            </span>
          )}
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        {error ? (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        ) : (
          <p className="text-xs text-slate-400">
            Fields marked with <span className="text-red-500">*</span> are required.
          </p>
        )}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ListTodo size={16} aria-hidden="true" />
            {saving
              ? task
                ? "Saving..."
                : "Creating..."
              : task
                ? "Save changes"
                : "Create task"}
          </button>
        </div>
      </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
