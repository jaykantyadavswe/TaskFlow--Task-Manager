import {
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
  ListTodo,
  Sparkles,
} from "lucide-react";

const links = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "My Day", icon: CalendarDays, href: "/my-day" },
  { label: "Completed", icon: CheckCircle2, href: "/completed" },
  { label: "All tasks", icon: ListTodo, href: "/all-tasks" },
];

function Sidebar({ activePage, onNavigate, totalCount, completedCount }) {
  return (
    <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <a
        href="/dashboard"
        onClick={(event) => onNavigate(event, "/dashboard")}
        className="flex items-center gap-3 px-5 py-4 lg:px-6 lg:pb-8 lg:pt-7"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
          <CheckCircle2 size={21} strokeWidth={2.4} aria-hidden="true" />
        </span>
        <span className="text-lg font-bold tracking-tight text-slate-900">
          Task<span className="text-indigo-600">flow</span>
        </span>
      </a>

      <div className="hidden px-6 pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 lg:block">
        Workspace
      </div>
      <nav
        aria-label="Main navigation"
        className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0"
      >
        {links.map(({ label, icon: Icon, href }) => {
          const active = activePage === href;
          const count =
            href === "/completed"
              ? completedCount
              : href === "/all-tasks"
                ? totalCount
                : null;

          return (
            <a
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              onClick={(event) => onNavigate(event, href)}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition lg:w-full ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.3 : 1.9} aria-hidden="true" />
              <span>{label}</span>
              {count !== null && (
                <span
                  className={`ml-auto hidden rounded-md px-2 py-0.5 text-xs tabular-nums lg:inline ${
                    active
                      ? "bg-white text-indigo-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      <div className="mt-auto hidden p-4 lg:block">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white shadow-lg shadow-indigo-900/10">
          <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold">A little progress adds up.</p>
          <p className="mt-1 text-xs leading-5 text-indigo-100">
            Keep your focus on one task at a time.
          </p>
        </div>
        <p className="px-2 pt-5 text-xs text-slate-400">TaskFlow Workspace</p>
      </div>
    </aside>
  );
}

export default Sidebar;
