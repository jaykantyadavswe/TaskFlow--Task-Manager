import {
  CalendarDays,
  Check,
  Circle,
  Clock3,
  Pencil,
  Trash2,
} from "lucide-react";

function TaskCard({
  task,
  onToggle,
  onDelete,
  onEdit,
  onStatusChange,
  disabled = false,
  variant = "list",
}) {
  const priorityStyles = {
    low: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    medium: "bg-amber-50 text-amber-700 ring-amber-600/10",
    high: "bg-rose-50 text-rose-700 ring-rose-600/10",
  };
  const completed = task.status === "completed";
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const validDueDate = dueDate && !Number.isNaN(dueDate.getTime());
  const formattedDueDate = validDueDate
    ? dueDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;
  const formattedDueTime = task.dueTime
    ? new Date(`1970-01-01T${task.dueTime}:00Z`).toLocaleTimeString(
        undefined,
        { hour: "numeric", minute: "2-digit", timeZone: "UTC" },
      )
    : null;

  if (variant === "board") {
    return (
      <article className="group rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm shadow-slate-200/30 transition hover:border-indigo-200 hover:shadow-md">
        <div className="flex items-start gap-2.5">
          <button
            type="button"
            role="checkbox"
            aria-checked={completed}
            aria-label={`Mark ${task.title} as ${completed ? "pending" : "completed"}`}
            disabled={disabled}
            onClick={onToggle}
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition focus:outline-none focus:ring-4 focus:ring-indigo-500/15 disabled:cursor-wait disabled:opacity-50 ${
              completed
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-slate-300 text-transparent hover:border-indigo-500"
            }`}
          >
            {completed ? (
              <Check size={12} strokeWidth={3} aria-hidden="true" />
            ) : (
              <Circle size={8} fill="currentColor" aria-hidden="true" />
            )}
          </button>
          <div className="min-w-0 flex-1">
            <h4
              className={`break-words text-sm font-semibold ${
                completed ? "text-slate-400 line-through" : "text-slate-800"
              }`}
            >
              {task.title}
            </h4>
          </div>
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${task.title}`}
            className="rounded-lg p-1.5 text-slate-300 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
          >
            <Pencil size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${task.title}`}
            className="rounded-lg p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-500/10 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>

        {task.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
            {task.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="truncate">{task.category || "General"}</span>
          {formattedDueDate && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={12} aria-hidden="true" />
              {formattedDueDate}
            </span>
          )}
          {formattedDueTime && (
            <span className="inline-flex items-center gap-1">
              <Clock3 size={12} aria-hidden="true" />
              {formattedDueTime}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold capitalize ring-1 ring-inset ${
              priorityStyles[task.priority] ?? priorityStyles.medium
            }`}
          >
            {task.priority || "medium"}
          </span>
          <label className="sr-only" htmlFor={`status-${task._id ?? task.id}`}>
            Change {task.title} status
          </label>
          <select
            id={`status-${task._id ?? task.id}`}
            value={task.status}
            disabled={disabled}
            onChange={(event) => onStatusChange(event.target.value)}
            className="min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-wait disabled:opacity-50"
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex items-start gap-3 border-b border-slate-100 px-1 py-4 last:border-0 sm:items-center sm:gap-4">
      <button
        type="button"
        role="checkbox"
        aria-checked={completed}
        aria-label={`Mark ${task.title} as ${completed ? "pending" : "completed"}`}
        disabled={disabled}
        onClick={onToggle}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition focus:outline-none focus:ring-4 focus:ring-indigo-500/15 disabled:cursor-wait disabled:opacity-50 sm:mt-0 ${
          completed
            ? "border-indigo-600 bg-indigo-600 text-white"
            : "border-slate-300 text-transparent hover:border-indigo-500"
        }`}
      >
        {completed ? (
          <Check size={12} strokeWidth={3} aria-hidden="true" />
        ) : (
          <Circle size={8} fill="currentColor" aria-hidden="true" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`truncate text-sm font-semibold ${
              completed ? "text-slate-400 line-through" : "text-slate-800"
            }`}
          >
            {task.title}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
              completed
                ? "bg-slate-100 text-slate-500"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            {completed ? "Completed" : task.status}
          </span>
        </div>
        {task.description && (
          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
            {task.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          <span>{task.category || "General"}</span>
          {formattedDueDate && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={13} aria-hidden="true" />
              {formattedDueDate}
            </span>
          )}
          {formattedDueTime && (
            <span className="inline-flex items-center gap-1">
              <Clock3 size={13} aria-hidden="true" />
              {formattedDueTime}
            </span>
          )}
        </div>
      </div>

      <span
        className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset sm:mt-0 ${
          priorityStyles[task.priority] ?? priorityStyles.medium
        }`}
      >
        {task.priority || "medium"}
      </span>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${task.title}`}
        className="rounded-lg p-2 text-slate-300 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
      >
        <Pencil size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${task.title}`}
        className="rounded-lg p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-500/10 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </article>
  );
}

export default TaskCard;
