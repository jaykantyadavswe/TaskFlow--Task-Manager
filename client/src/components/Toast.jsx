import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;

    const timeoutId = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isError = toast.type === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm justify-end sm:right-6 sm:top-6">
      <div
        role={isError ? "alert" : "status"}
        aria-live={isError ? "assertive" : "polite"}
        className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl shadow-slate-900/10 ${
          isError ? "border-rose-200" : "border-emerald-200"
        }`}
      >
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            isError
              ? "bg-rose-50 text-rose-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          <Icon size={19} aria-hidden="true" />
        </span>
        <p className="flex-1 pt-1.5 text-sm font-medium leading-5 text-slate-700">
          {toast.message}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default Toast;
