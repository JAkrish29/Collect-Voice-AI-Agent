"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  Bell,
  ChevronRight,
  Command,
  CreditCard,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Phone,
  Play,
  Plus,
  Search,
  Send,
  Sparkles,
  Sun,
  Timer,
  X,
  Zap
} from "lucide-react";
import {
  agentNodes,
  analyticsSeries,
  campaigns,
  customers,
  funnel,
  kpis,
  liveCalls,
  navItems,
  outcomes,
  performanceTrend,
  redTeamScenarios,
  settingsGroups,
  transcript,
  type PageKey
} from "@/lib/mock-data";
import { cn, formatCurrency, pct } from "@/lib/utils";
import { Button, MetricCard, PageFrame, Panel, ProgressBar, StatusPill } from "@/components/ui";

const chartBlue = "#2563EB";
const chartGreen = "#10B981";
const chartAmber = "#F59E0B";
const chartRed = "#EF4444";
const chartInk = "#0F172A";

export function AppShell() {
  const [page, setPage] = useState<PageKey>("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === "?") setCommandOpen(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const activeItem = navItems.find((item) => item.key === page);

  return (
    <div className="flex min-h-screen text-ink dark:text-slate-100">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-slate-200/70 bg-white/80 p-3 backdrop-blur-xl transition-all dark:border-slate-800 dark:bg-slate-950/70 lg:block",
          collapsed ? "w-[82px]" : "w-[280px]"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white shadow-lg shadow-slate-900/20">
              <Sparkles className="h-5 w-5 text-blue-200" />
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-bold tracking-wide">Aegis Collect AI</div>
                <div className="text-xs text-slate-500">Collections OS</div>
              </div>
            )}
          </div>
          <nav className="mt-5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.key === page;
              return (
                <button
                  key={item.key}
                  onClick={() => setPage(item.key)}
                  className={cn(
                    "group flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold transition",
                    active
                      ? "bg-ink text-white shadow-lg shadow-slate-900/18 dark:bg-white dark:text-ink"
                      : "text-slate-600 hover:bg-slate-100 hover:text-ink dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
            {!collapsed && (
              <>
                <div className="text-xs font-semibold text-slate-500">Compliance Guard</div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="font-semibold">Policy health</span>
                  <span className="text-success">98.2%</span>
                </div>
                <ProgressBar value={98} tone="success" />
              </>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="mt-3 grid h-9 w-full place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:text-ink dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-canvas/80 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <button
              onClick={() => setCommandOpen(true)}
              className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white/80 px-3 text-left text-sm text-slate-500 shadow-sm transition hover:border-blue-200 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400"
            >
              <Search className="h-4 w-4" />
              <span className="truncate">Search customers, campaigns, calls, policies...</span>
              <span className="ml-auto hidden rounded border border-slate-200 px-2 py-0.5 text-xs font-semibold dark:border-slate-700 md:inline">Ctrl K</span>
            </button>
            <button
              onClick={() => setDark(!dark)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:text-ink dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:text-ink dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
            </button>
          </div>
          {notificationsOpen && <Notifications />}
        </header>

        <div className="px-4 py-5 lg:px-6">
          <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-xs font-semibold",
                  item.key === page ? "bg-ink text-white" : "bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {activeItem && (
            <div className="mb-5 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Aegis</span>
              <ChevronRight className="h-3 w-3" />
              <span>{activeItem.label}</span>
              <span className="ml-auto hidden items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-slate-900 md:flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                Live mock environment
              </span>
            </div>
          )}

          {page === "overview" && <Overview />}
          {page === "campaigns" && <Campaigns setModalOpen={setModalOpen} setDrawerOpen={setDrawerOpen} />}
          {page === "live-calls" && <LiveCalls />}
          {page === "customers" && <Customers />}
          {page === "voice-agent" && <VoiceAgent />}
          {page === "analytics" && <Analytics />}
          {page === "red-team" && <RedTeam />}
          {page === "settings" && <SettingsPage />}
        </div>
      </div>

      {commandOpen && <CommandPalette setPage={setPage} onClose={() => setCommandOpen(false)} />}
      {modalOpen && <CreateCampaignModal onClose={() => setModalOpen(false)} />}
      {drawerOpen && <CampaignDrawer onClose={() => setDrawerOpen(false)} />}
    </div>
  );
}

function Overview() {
  return (
    <PageFrame title="Collections Command Center" eyebrow="Executive overview">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <MetricCard key={kpi.label} {...kpi} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel title="Performance Trends" subtitle="Collections, promise-to-pay and callback movement" className="h-[360px]">
          <ResponsiveContainer width="100%" height={286}>
            <AreaChart data={performanceTrend}>
              <defs>
                <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartBlue} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={chartBlue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.35} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="promises" stroke={chartBlue} fill="url(#blueFill)" strokeWidth={3} />
              <Line type="monotone" dataKey="collected" stroke={chartGreen} strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="callbacks" stroke={chartAmber} strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="AI Insights" subtitle="Operational recommendations generated from today&apos;s calls">
          <div className="space-y-3">
            {[
              ["High-value Tamil borrowers are 18% more likely to commit after salary-date framing.", "Prioritize vernacular routing"],
              ["Escalations dropped after adding hardship acknowledgement in the first 20 seconds.", "Keep prompt variant B"],
              ["Payment link delivery over WhatsApp is outperforming SMS by 11.7 pts.", "Shift channel mix"]
            ].map(([text, action]) => (
              <div key={text} className="rounded-lg border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="flex gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-brand" />
                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{text}</p>
                </div>
                <button className="mt-3 text-xs font-semibold text-brand">{action}</button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Collection Funnel" className="xl:col-span-1">
          <div className="space-y-3">
            {funnel.map((item, index) => (
              <div key={item.stage}>
                <div className="mb-1 flex justify-between text-xs font-semibold">
                  <span>{item.stage}</span>
                  <span>{item.value.toLocaleString()}</span>
                </div>
                <ProgressBar value={(item.value / funnel[0].value) * 100} tone={index > 3 ? "success" : "brand"} />
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Agent Performance" className="xl:col-span-1">
          <div className="space-y-3">
            {["Asha Hindi", "Nila Tamil", "Arjun English", "Meera Telugu"].map((agent, i) => (
              <div key={agent} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white font-semibold text-brand shadow-sm dark:bg-slate-950">{agent[0]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{agent}</span>
                    <span>{88 - i * 6}%</span>
                  </div>
                  <ProgressBar value={88 - i * 6} tone={i < 2 ? "success" : "brand"} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Call Outcome Breakdown" className="h-[300px] xl:col-span-1">
          <ResponsiveContainer width="100%" height={236}>
            <PieChart>
              <Pie data={outcomes} innerRadius={58} outerRadius={92} paddingAngle={4} dataKey="value">
                {[chartGreen, chartBlue, chartAmber, chartRed, chartInk].map((color) => (
                  <Cell key={color} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <Panel title="Recent Call Activity" subtitle="Latest outcomes from the collections floor">
        <ActivityTable />
      </Panel>
    </PageFrame>
  );
}

function Campaigns({ setModalOpen, setDrawerOpen }: { setModalOpen: (value: boolean) => void; setDrawerOpen: (value: boolean) => void }) {
  return (
    <PageFrame
      title="Campaign Management Center"
      eyebrow="Portfolio orchestration"
      actions={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Create Campaign</Button>}
    >
      <Panel title="Active Campaigns" subtitle="Targets, customer volume and AI outcome quality">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-3">Campaign</th>
                <th>Due Customers</th>
                <th>Collection Target</th>
                <th>Success Rate</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {campaigns.map((campaign) => (
                <tr key={campaign.name} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-900/60">
                  <td className="py-4 font-semibold">{campaign.name}</td>
                  <td>{campaign.customers.toLocaleString()}</td>
                  <td>{formatCurrency(campaign.target)}</td>
                  <td><div className="w-36"><ProgressBar value={campaign.success} tone="success" /></div></td>
                  <td><StatusPill value={campaign.status} /></td>
                  <td><Button variant="ghost" onClick={() => setDrawerOpen(true)}>Details</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Campaign Performance Dashboard" className="h-[320px]">
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={campaigns.map((c) => ({ name: c.name.split(" ")[0], success: c.success, customers: c.customers / 300 }))}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="success" fill={chartBlue} radius={[6, 6, 0, 0]} />
              <Bar dataKey="customers" fill={chartGreen} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Call Distribution View">
          <div className="grid grid-cols-2 gap-3">
            {["Hindi", "Tamil", "English", "Telugu", "Kannada", "Malayalam"].map((language, i) => (
              <div key={language} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-xs text-slate-500">{language}</div>
                <div className="mt-2 text-2xl font-semibold">{(4200 - i * 430).toLocaleString()}</div>
                <ProgressBar value={82 - i * 9} tone={i < 3 ? "brand" : "warning"} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageFrame>
  );
}

function LiveCalls() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((value) => value + 1), 2200);
    return () => window.clearInterval(id);
  }, []);
  const active = liveCalls[tick % liveCalls.length];
  return (
    <PageFrame title="Live Calls Control Room" eyebrow="Real-time AI supervision">
      <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr_0.7fr]">
        <Panel title="Current Active Calls" subtitle="Streaming call states">
          <div className="space-y-3">
            {liveCalls.map((call, i) => (
              <div key={call.customer} className={cn("rounded-lg border p-3 transition", active.customer === call.customer ? "border-blue-300 bg-blue-50/70 dark:border-blue-800 dark:bg-blue-950/30" : "border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-950/40")}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{call.customer}</div>
                  <span className={cn("h-2.5 w-2.5 rounded-full", i === tick % liveCalls.length ? "animate-pulse bg-success" : "bg-slate-300")} />
                </div>
                <div className="mt-1 text-xs text-slate-500">{call.phone} · {call.language}</div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span>{formatCurrency(call.amount)}</span>
                  <span>{call.likelihood}% payment likelihood</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Real-time Transcript" subtitle={`${active.language} detected · emotion ${active.emotion}`}>
          <div className="mb-4 grid grid-cols-3 gap-3">
            {[
              ["Sentiment", active.emotion],
              ["Compliance", "Clear"],
              ["Intent", "Partial PTP"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                <div className="text-xs text-slate-500">{label}</div>
                <div className="mt-1 text-sm font-semibold">{value}</div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {transcript.map((line, i) => (
              <div key={i} className={cn("max-w-[86%] rounded-lg p-3 text-sm leading-6", line.who === "AI" ? "bg-ink text-white" : "ml-auto bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200")}>
                <div className="mb-1 text-xs font-semibold opacity-70">{line.who}</div>
                {line.text}
              </div>
            ))}
            <div className="h-12 rounded-lg bg-slate-100 p-3 text-sm text-slate-500 shimmer dark:bg-slate-900">Listening for next utterance...</div>
          </div>
        </Panel>
        <Panel title="AI Suggestions" subtitle="Best next action">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand"><Zap className="h-4 w-4" />Recommended response</div>
            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">Confirm the partial payment today, capture Friday as promise date, then send payment link via WhatsApp.</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button><Phone className="h-4 w-4" />Coach</Button>
            <Button variant="ghost"><Timer className="h-4 w-4" />Callback</Button>
            <Button variant="ghost"><Send className="h-4 w-4" />Send Link</Button>
            <Button variant="danger"><X className="h-4 w-4" />Escalate</Button>
          </div>
          <div className="mt-5 space-y-3">
            {["Identity verified", "Mini-Miranda completed", "Payment claim recorded", "No prohibited language"].map((item) => (
              <div key={item} className="flex items-center justify-between text-sm">
                <span>{item}</span>
                <StatusPill value="Pass" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel title="Live Metrics" subtitle="Call timeline and latency monitors">
        <div className="grid gap-3 md:grid-cols-4">
          {["Avg latency 312ms", "Talk ratio 42:58", "Interruptions 3", "QA confidence 94%"].map((metric) => (
            <div key={metric} className="rounded-lg bg-white p-4 text-sm font-semibold shadow-sm dark:bg-slate-900">{metric}</div>
          ))}
        </div>
      </Panel>
    </PageFrame>
  );
}

function Customers() {
  const selected = customers[0];
  return (
    <PageFrame title="Customer Intelligence" eyebrow="Borrower profile and risk operations">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Customer Table" subtitle="Prioritized for today&apos;s collection campaigns">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="py-3">Name</th><th>Phone</th><th>Due Amount</th><th>Due Date</th><th>Language</th><th>Risk</th><th>Likelihood</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {customers.map((customer) => (
                  <tr key={customer.phone} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="py-4 font-semibold">{customer.name}</td><td>{customer.phone}</td><td>{formatCurrency(customer.due)}</td><td>{customer.dueDate}</td><td>{customer.language}</td>
                    <td><div className="w-24"><ProgressBar value={customer.risk} tone={customer.risk > 65 ? "danger" : customer.risk > 45 ? "warning" : "success"} /></div></td>
                    <td>{customer.likelihood}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Customer Profile" subtitle={selected.phone}>
          <div className="flex items-start justify-between">
            <div><div className="text-2xl font-semibold">{selected.name}</div><div className="text-sm text-slate-500">Personal loan · Bucket 1 · {selected.language}</div></div>
            <StatusPill value="Live" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Info label="Outstanding" value={formatCurrency(selected.due)} />
            <Info label="Risk Score" value={`${selected.risk}/100`} />
            <Info label="Payment Likelihood" value={`${selected.likelihood}%`} />
            <Info label="Next Due" value={selected.dueDate} />
          </div>
          <div className="mt-5 space-y-3">
            {["PTP captured for 14 Jun", "Callback requested after salary credit", "Partial payment of Rs 5,000 discussed", "Note: prefers Hindi after 6 PM"].map((item, i) => (
              <div key={item} className="flex gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                <div className="mt-1 h-2 w-2 rounded-full bg-brand" />
                <div><div className="text-sm font-semibold">{item}</div><div className="text-xs text-slate-500">{i + 1} day{i ? "s" : ""} ago</div></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageFrame>
  );
}

function VoiceAgent() {
  return (
    <PageFrame title="Voice Agent Studio" eyebrow="Conversation intelligence builder">
      <div className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr_0.75fr]">
        <Panel title="Agent Persona">
          <div className="space-y-3">
            {["Empathetic collections specialist", "Firm but compliant tone", "Salary-date aware negotiation", "Human handoff when risk rises"].map((item) => (
              <label key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900"><input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" />{item}</label>
            ))}
          </div>
          <div className="mt-5">
            <div className="mb-2 text-xs font-semibold uppercase text-slate-500">Languages</div>
            <div className="flex flex-wrap gap-2">{["Hindi", "English", "Tamil", "Telugu", "Kannada", "Malayalam"].map((language) => <span key={language} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand dark:bg-blue-950/40">{language}</span>)}</div>
          </div>
        </Panel>
        <Panel title="Flow Visualization" subtitle="Drag-and-drop style conversation graph" className="min-h-[520px]">
          <div className="relative h-[430px] rounded-lg border border-slate-200 bg-slate-50 chart-grid dark:border-slate-800 dark:bg-slate-950">
            {agentNodes.map((node) => (
              <div key={node.title} className="absolute w-40 rounded-lg border border-slate-200 bg-white p-3 shadow-soft transition hover:-translate-y-1 hover:shadow-lift dark:border-slate-800 dark:bg-slate-900" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                <div className="text-sm font-semibold">{node.title}</div>
                <div className="mt-2"><StatusPill value={node.status} /></div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Prompt Editor & Testing">
          <textarea className="h-44 w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 outline-none focus:border-blue-400 dark:border-slate-800 dark:bg-slate-950" defaultValue={"You are Aegis, a compliant AI collections agent. Verify identity before disclosure. Use empathetic but clear language. Optimize for promise-to-pay while respecting borrower hardship."} />
          <div className="mt-4 space-y-3">
            {["Objection: salary delayed", "Objection: already paid", "Objection: cannot talk", "Voice: Asha - warm Hindi"].map((item) => <div key={item} className="rounded-lg bg-slate-50 p-3 text-sm font-semibold dark:bg-slate-900">{item}</div>)}
          </div>
          <Button className="mt-4 w-full"><Play className="h-4 w-4" />Run Playground Test</Button>
        </Panel>
      </div>
    </PageFrame>
  );
}

function Analytics() {
  const heatmap = useMemo(() => Array.from({ length: 42 }, (_, i) => 20 + ((i * 17) % 78)), []);
  return (
    <PageFrame title="Analytics Intelligence Center" eyebrow="Portfolio forecasting and risk science">
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Collection Trends" className="h-[340px]">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analyticsSeries}><CartesianGrid strokeDasharray="3 3" opacity={0.25} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line dataKey="collections" stroke={chartBlue} strokeWidth={3} /><Line dataKey="ptp" stroke={chartGreen} strokeWidth={3} /><Line dataKey="risk" stroke={chartRed} strokeWidth={2} /></LineChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Language Distribution" className="h-[340px]">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={[{ l: "Hindi", v: 42 }, { l: "English", v: 23 }, { l: "Tamil", v: 14 }, { l: "Telugu", v: 11 }, { l: "Kannada", v: 6 }, { l: "Malayalam", v: 4 }]}><CartesianGrid strokeDasharray="3 3" opacity={0.25} /><XAxis dataKey="l" /><YAxis /><Tooltip /><Bar dataKey="v" fill={chartBlue} radius={[7, 7, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Promise-to-pay Heatmap" className="xl:col-span-2">
          <div className="grid grid-cols-7 gap-2">
            {heatmap.map((v, i) => <div key={i} className="h-14 rounded-lg border border-white/60 dark:border-slate-900" style={{ backgroundColor: `rgba(37, 99, 235, ${v / 110})` }} title={`${v}%`} />)}
          </div>
        </Panel>
        <Panel title="Forecasts & Risk Clusters">
          <div className="space-y-3">
            {["Early salary segment: +9.4% expected recovery", "High-risk urban SME: legal review advised", "Vernacular bot routing saves 1,280 agent hours", "Dispute cluster rising in auto-loan west"].map((item) => (
              <div key={item} className="rounded-lg bg-slate-50 p-3 text-sm leading-6 dark:bg-slate-900">{item}</div>
            ))}
          </div>
        </Panel>
      </div>
    </PageFrame>
  );
}

function RedTeam() {
  return (
    <PageFrame title="Red Team Testing Lab" eyebrow="Safety, compliance and adversarial QA">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {redTeamScenarios.map((scenario) => (
          <Panel key={scenario.name} className="min-h-[260px]">
            <div className="flex items-start justify-between gap-3">
              <div><div className="text-lg font-semibold">{scenario.name}</div><div className="mt-1 text-xs text-slate-500">Collections compliance scenario</div></div>
              <StatusPill value={scenario.result} />
            </div>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs font-semibold"><span>Risk Score</span><span>{scenario.risk}</span></div>
              <ProgressBar value={scenario.risk} tone={scenario.risk > 74 ? "danger" : scenario.risk > 55 ? "warning" : "success"} />
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{scenario.reasoning}</p>
            <Button className="mt-5 w-full" variant={scenario.result === "Fail" ? "danger" : "primary"}><Play className="h-4 w-4" />Run Test</Button>
          </Panel>
        ))}
      </div>
      <Panel title="Evaluation Console" subtitle="AI reasoning, pass/fail traces and policy assertions">
        <div className="grid gap-3 md:grid-cols-3">
          {["Disclosure control", "Threat de-escalation", "Language stability", "Human handoff", "Payment claim handling", "Identity boundary"].map((item) => <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"><StatusPill value="Pass" /><div className="mt-3 text-sm font-semibold">{item}</div></div>)}
        </div>
      </Panel>
    </PageFrame>
  );
}

function SettingsPage() {
  return (
    <PageFrame title="Enterprise Settings" eyebrow="Governance and platform operations">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settingsGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Panel key={group.title}>
              <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-brand dark:bg-slate-900"><Icon className="h-5 w-5" /></div><div className="font-semibold">{group.title}</div></div>
              <div className="mt-4 space-y-2">{group.items.map((item) => <div key={item} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900"><span>{item}</span><ChevronRight className="h-4 w-4 text-slate-400" /></div>)}</div>
            </Panel>
          );
        })}
      </div>
      <Panel title="Audit Logs" subtitle="Recent configuration and access events">
        <ActivityTable compact />
      </Panel>
    </PageFrame>
  );
}

function ActivityTable({ compact = false }: { compact?: boolean }) {
  const rows = customers.slice(0, compact ? 4 : 6);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-slate-500"><tr><th className="py-3">Customer</th><th>Outcome</th><th>Amount</th><th>Channel</th><th>Agent</th><th>Time</th></tr></thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, i) => <tr key={row.phone} className="hover:bg-slate-50 dark:hover:bg-slate-900"><td className="py-4 font-semibold">{row.name}</td><td>{["PTP captured", "Callback", "Paid", "Escalated", "Dispute", "Partial payment"][i]}</td><td>{formatCurrency(row.due)}</td><td>{row.language}</td><td>{["Asha", "Nila", "Arjun", "Meera"][i % 4]}</td><td>{8 + i} min ago</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 text-lg font-semibold">{value}</div></div>;
}

function Notifications() {
  return (
    <div className="absolute right-4 top-16 z-50 w-[min(380px,calc(100vw-32px))] rounded-lg border border-slate-200 bg-white p-3 shadow-lift dark:border-slate-800 dark:bg-slate-950">
      {["High-risk escalation awaiting supervisor", "Campaign Prime Bucket 1 exceeded target", "Voice provider latency normalized"].map((item) => <div key={item} className="rounded-lg p-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-900">{item}</div>)}
    </div>
  );
}

function CommandPalette({ setPage, onClose }: { setPage: (page: PageKey) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/35 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-auto mt-20 max-w-2xl rounded-lg border border-slate-200 bg-white p-3 shadow-lift dark:border-slate-800 dark:bg-slate-950" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-100 px-2 pb-3 dark:border-slate-800"><Command className="h-5 w-5 text-brand" /><input autoFocus className="h-10 flex-1 bg-transparent text-sm outline-none" placeholder="Jump to page, customer, campaign or action..." /></div>
        <div className="mt-3 grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.key} onClick={() => { setPage(item.key); onClose(); }} className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900">
                <Icon className="h-4 w-4 text-brand" />Open {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CreateCampaignModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-5 shadow-lift dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Create Campaign</h2><button onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="mt-5 grid gap-3">
          {["Campaign name", "Portfolio segment", "Collection target", "Preferred languages"].map((field) => <input key={field} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-800 dark:bg-slate-900" placeholder={field} />)}
        </div>
        <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={onClose}>Create Draft</Button></div>
      </div>
    </div>
  );
}

function CampaignDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/25" onClick={onClose}>
      <div className="ml-auto h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-lift dark:border-slate-800 dark:bg-slate-950" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Campaign Details</h2><button onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="mt-5 space-y-4">
          <Panel title="Prime Bucket 1 - North"><div className="grid grid-cols-2 gap-3"><Info label="Due customers" value="12,840" /><Info label="Target" value={formatCurrency(84000000)} /><Info label="Success rate" value={pct(42.1)} /><Info label="Active agents" value="18" /></div></Panel>
          <Panel title="Performance"><ProgressBar value={72} tone="success" /><p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Best performance is coming from Hindi salary-date negotiation flow with payment link sent inside 45 seconds.</p></Panel>
          <Panel title="Distribution"><div className="space-y-2">{["North Urban", "Semi-urban", "High balance", "First reminder"].map((item, i) => <div key={item} className="flex justify-between rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900"><span>{item}</span><span>{34 - i * 6}%</span></div>)}</div></Panel>
        </div>
      </div>
    </div>
  );
}
