"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageFrame({
  title,
  eyebrow,
  children,
  actions
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="space-y-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink dark:text-white md:text-4xl">{title}</h1>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </motion.main>
  );
}

export function Panel({
  title,
  subtitle,
  children,
  className,
  right
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  right?: React.ReactNode;
}) {
  return (
    <section className={cn("glass rounded-lg p-4 transition hover:shadow-lift", className)}>
      {(title || right) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title ? <h2 className="text-sm font-semibold text-ink dark:text-white">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "brand"
}: {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  tone?: string;
}) {
  return (
    <Panel className="group min-h-[136px]">
      <div className="flex items-start justify-between">
        <div className="rounded-lg border border-slate-200 bg-white p-2 text-brand shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-semibold",
            tone === "danger" && "bg-red-50 text-danger dark:bg-red-950/40",
            tone === "warning" && "bg-amber-50 text-warning dark:bg-amber-950/40",
            tone === "success" && "bg-emerald-50 text-success dark:bg-emerald-950/40",
            tone === "brand" && "bg-blue-50 text-brand dark:bg-blue-950/40",
            tone === "ink" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          )}
        >
          {delta}
        </span>
      </div>
      <div className="mt-6">
        <div className="text-3xl font-semibold text-ink transition group-hover:translate-x-0.5 dark:text-white">{value}</div>
        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</div>
      </div>
    </Panel>
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  onClick
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition active:scale-[0.98]",
        variant === "primary" && "bg-brand text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700",
        variant === "ghost" && "border border-slate-200 bg-white/70 text-slate-700 hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200",
        variant === "danger" && "bg-danger text-white shadow-lg shadow-red-600/20 hover:bg-red-600",
        className
      )}
    >
      {children}
    </button>
  );
}

export function StatusPill({ value }: { value: string }) {
  const tone =
    value === "Live" || value === "Pass" || value === "Stable" || value === "Compliant"
      ? "success"
      : value === "Fail" || value === "Guarded"
      ? "danger"
      : "warning";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "success" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
        tone === "warning" && "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
        tone === "danger" && "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone === "success" && "bg-success", tone === "warning" && "bg-warning", tone === "danger" && "bg-danger")} />
      {value}
    </span>
  );
}

export function ProgressBar({ value, tone = "brand" }: { value: number; tone?: "brand" | "success" | "warning" | "danger" }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div
        className={cn(
          "h-full rounded-full",
          tone === "brand" && "bg-brand",
          tone === "success" && "bg-success",
          tone === "warning" && "bg-warning",
          tone === "danger" && "bg-danger"
        )}
        style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
      />
    </div>
  );
}
