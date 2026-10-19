function StatsCard({ icon: Icon, title, value, description, tone = "indigo" }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
  };

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        {Icon && (
          <span className={`rounded-xl p-3 ring-1 ${tones[tone] ?? tones.indigo}`}>
            <Icon size={20} strokeWidth={2.1} aria-hidden="true" />
          </span>
        )}
      </div>
      {description && (
        <p className="mt-3 text-xs text-slate-400">{description}</p>
      )}
    </article>
  );
}

export default StatsCard;
