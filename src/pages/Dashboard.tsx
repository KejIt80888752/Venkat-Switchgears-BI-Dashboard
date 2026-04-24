import React, { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, TrendingDown, CreditCard, Package, DollarSign,
  AlertTriangle, Target, ArrowUpRight, ArrowDownRight, Download,
} from "lucide-react";
import {
  monthlySales, salesTarget, getLowStockItems, getTotalOutstanding,
  getYTDSales, getYTDProfit, formatCurrency, debtors, CHART_COLORS, productWiseSales,
} from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const KPICard: React.FC<{
  title: string; value: string; sub: string;
  change?: number; icon: React.ReactNode; color: string; bg: string;
}> = ({ title, value, sub, change, icon, color, bg }) => (
  <div className="card p-5 flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
      <span className={color}>{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">{title}</p>
      <p className="text-slate-800 dark:text-white text-xl font-bold mt-0.5">{value}</p>
      <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{sub}</p>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
          {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(change)}% vs last year
        </div>
      )}
    </div>
  </div>
);

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {formatCurrency(p.value, true)}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user, can } = useAuth();
  const [unitFilter, setUnitFilter] = useState<"all" | "unit1" | "unit2">("all");

  const ytdSales = getYTDSales();
  const ytdProfit = getYTDProfit();
  const totalOutstanding = getTotalOutstanding();
  const lowStockItems = getLowStockItems();
  const targetPct = Math.round((salesTarget.currentYTD / salesTarget.yearly) * 100);

  const overdue60 = debtors.filter(d => d.agingDays > 60);
  const overdueAmt = overdue60.reduce((s, d) => s + d.amount, 0);

  const salesChartData = monthlySales.map(m => ({
    month: m.month,
    "Unit 1": m.unit1,
    "Unit 2": m.unit2,
    Total: m.total,
  }));

  const productPieData = productWiseSales.slice(0, 6).map(p => ({
    name: p.product.length > 22 ? p.product.slice(0, 22) + "…" : p.product,
    value: p.total,
  }));

  const categoryBreakdown = [
    { name: "Panels",       value: 55800000 },
    { name: "DB/PDB",       value: 20600000 },
    { name: "Breakers",     value: 28600000 },
    { name: "Bus Systems",  value: 11800000 },
    { name: "Power Factor", value: 15100000 },
    { name: "Automation",   value: 9700000  },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Welcome back, {user?.name.split(" ")[0]}! &nbsp;·&nbsp; FY 2024-25 Overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={unitFilter}
            onChange={e => setUnitFilter(e.target.value as any)}
            className="select text-sm"
          >
            <option value="all">All Units</option>
            <option value="unit1">Unit 1 (10th Main)</option>
            <option value="unit2">Unit 2 (12th Main)</option>
          </select>
          {can("export:reports") && (
            <button className="btn-primary">
              <Download size={15} /> Export
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Sales YTD"
          value={formatCurrency(ytdSales, true)}
          sub="Apr '24 – Mar '25"
          change={8.2}
          icon={<TrendingUp size={22} />}
          color="text-blue-600"
          bg="bg-blue-50 dark:bg-blue-900/20"
        />
        <KPICard
          title="Outstanding Receivables"
          value={formatCurrency(totalOutstanding, true)}
          sub={`${overdue60.length} invoices overdue 60+ days`}
          icon={<CreditCard size={22} />}
          color="text-orange-500"
          bg="bg-orange-50 dark:bg-orange-900/20"
        />
        <KPICard
          title="Low Stock Alerts"
          value={`${lowStockItems.length} Items`}
          sub="Below minimum threshold"
          icon={<Package size={22} />}
          color="text-red-600"
          bg="bg-red-50 dark:bg-red-900/20"
        />
        <KPICard
          title="Net Profit YTD"
          value={formatCurrency(ytdProfit, true)}
          sub={`${((ytdProfit / ytdSales) * 100).toFixed(1)}% net margin`}
          change={5.4}
          icon={<DollarSign size={22} />}
          color="text-green-600"
          bg="bg-green-50 dark:bg-green-900/20"
        />
      </div>

      {/* Sales Target Progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-venkat-orange" />
            <h2 className="font-semibold text-slate-800 dark:text-white">FY 2024-25 Sales Target</h2>
          </div>
          <span className={`text-sm font-bold ${targetPct >= 80 ? "text-green-600" : targetPct >= 60 ? "text-amber-500" : "text-red-500"}`}>
            {targetPct}% achieved
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Overall",  actual: salesTarget.currentYTD, target: salesTarget.yearly },
            { label: "Unit 1",   actual: salesTarget.unit1Actual, target: salesTarget.unit1Target },
            { label: "Unit 2",   actual: salesTarget.unit2Actual, target: salesTarget.unit2Target },
          ].map(t => {
            const pct = Math.min(100, Math.round((t.actual / t.target) * 100));
            const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500";
            return (
              <div key={t.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{t.label}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatCurrency(t.actual, true)} / {formatCurrency(t.target, true)}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-right mt-1 text-slate-500 dark:text-slate-400">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Monthly Sales Trend */}
        <div className="card p-5 xl:col-span-2">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Monthly Sales — Unit 1 vs Unit 2</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesChartData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => formatCurrency(v, true)} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Unit 1" fill="#0D2B5E" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Unit 2" fill="#E87722" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                dataKey="value" nameKey="name" paddingAngle={2}>
                {categoryBreakdown.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v, true)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {categoryBreakdown.slice(0, 4).map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CHART_COLORS[i] }} />
                  <span className="text-slate-600 dark:text-slate-300">{c.name}</span>
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200">{formatCurrency(c.value, true)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts & Recent */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Overdue Alerts */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-red-500" />
            <h2 className="font-semibold text-slate-800 dark:text-white">Critical Alerts</h2>
          </div>
          <div className="space-y-2">
            {overdue60.slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{d.customer}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{d.invoiceNo} · {d.agingDays} days overdue</p>
                </div>
                <span className="text-red-600 dark:text-red-400 font-semibold text-sm">{formatCurrency(d.amount, true)}</span>
              </div>
            ))}
            {overdue60.length > 5 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-1">
                +{overdue60.length - 5} more overdue invoices
              </p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-amber-500" />
            <h2 className="font-semibold text-slate-800 dark:text-white">Low Stock Items</h2>
          </div>
          <div className="space-y-2">
            {lowStockItems.slice(0, 6).map((item, i) => {
              const stock = item.unit1 + item.unit2;
              const pct = Math.round((stock / item.minLevel) * 100);
              return (
                <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{item.product}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                        {stock} / {item.minLevel} {item.unitOfMeasure}
                      </span>
                    </div>
                  </div>
                  <span className="badge-amber flex-shrink-0">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
