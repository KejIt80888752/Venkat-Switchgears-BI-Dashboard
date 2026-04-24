import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { GitCompare, Download } from "lucide-react";
import { monthlySales, monthlyPurchase, plData, formatCurrency } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function Units() {
  const { can } = useAuth();
  const [metric, setMetric] = useState<"sales" | "purchase" | "pnl">("sales");

  const u1Sales   = monthlySales.reduce((s, m) => s + m.unit1, 0);
  const u2Sales   = monthlySales.reduce((s, m) => s + m.unit2, 0);
  const u1Purchase = monthlyPurchase.reduce((s, m) => s + m.unit1, 0);
  const u2Purchase = monthlyPurchase.reduce((s, m) => s + m.unit2, 0);
  const totalSales = u1Sales + u2Sales;

  const salesData = monthlySales.map(m => ({
    month: m.month,
    "Unit 1 (10th Main)": m.unit1,
    "Unit 2 (12th Main)": m.unit2,
  }));

  const purchaseData = monthlyPurchase.map(m => ({
    month: m.month,
    "Unit 1 (10th Main)": m.unit1,
    "Unit 2 (12th Main)": m.unit2,
  }));

  const chartData = metric === "sales" ? salesData : purchaseData;

  const comparisonStats = [
    {
      label: "Total Sales",
      u1: u1Sales, u2: u2Sales,
      u1Pct: ((u1Sales / totalSales) * 100).toFixed(1),
      u2Pct: ((u2Sales / totalSales) * 100).toFixed(1),
    },
    {
      label: "Total Purchase",
      u1: u1Purchase, u2: u2Purchase,
      u1Pct: ((u1Purchase / (u1Purchase + u2Purchase)) * 100).toFixed(1),
      u2Pct: ((u2Purchase / (u1Purchase + u2Purchase)) * 100).toFixed(1),
    },
    {
      label: "Best Month Sales",
      u1: 8700000, u2: 5800000,
      u1Pct: "60.0", u2Pct: "40.0",
    },
    {
      label: "Avg Monthly Sales",
      u1: Math.round(u1Sales / 12), u2: Math.round(u2Sales / 12),
      u1Pct: ((u1Sales / totalSales) * 100).toFixed(1),
      u2Pct: ((u2Sales / totalSales) * 100).toFixed(1),
    },
  ];

  const monthlyComparison = monthlySales.map((m, i) => ({
    month: m.month,
    "U1 Sales": m.unit1,
    "U2 Sales": m.unit2,
    "U1 Purchase": monthlyPurchase[i].unit1,
    "U2 Purchase": monthlyPurchase[i].unit2,
    "U1 Profit": Math.round(m.unit1 * 0.26),
    "U2 Profit": Math.round(m.unit2 * 0.26),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Unit Comparison</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Unit 1 (10th Main) vs Unit 2 (12th Main) — Side-by-side</p>
        </div>
        {can("export:reports") && (
          <button className="btn-primary"><Download size={15} /> Export</button>
        )}
      </div>

      {/* Unit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5 border-t-4 border-t-venkat-navy">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-venkat-navy rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">U1</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white">Unit 1 — 10th Main</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Peenya Industrial Area</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Sales",    value: formatCurrency(u1Sales, true),    share: ((u1Sales/totalSales)*100).toFixed(0) + "% of total" },
              { label: "Total Purchase", value: formatCurrency(u1Purchase, true), share: ((u1Purchase/(u1Purchase+u2Purchase))*100).toFixed(0) + "% of total" },
              { label: "Best Month",     value: "Mar '25",    share: formatCurrency(8700000, true) },
              { label: "Avg/Month",      value: formatCurrency(u1Sales/12, true), share: "monthly avg" },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-base font-bold text-venkat-navy dark:text-blue-300 mt-0.5">{s.value}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{s.share}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 border-t-4 border-t-venkat-orange">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-venkat-orange rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">U2</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white">Unit 2 — 12th Main</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Peenya Industrial Area</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Sales",    value: formatCurrency(u2Sales, true),    share: ((u2Sales/totalSales)*100).toFixed(0) + "% of total" },
              { label: "Total Purchase", value: formatCurrency(u2Purchase, true), share: ((u2Purchase/(u1Purchase+u2Purchase))*100).toFixed(0) + "% of total" },
              { label: "Best Month",     value: "Mar '25",    share: formatCurrency(5800000, true) },
              { label: "Avg/Month",      value: formatCurrency(u2Sales/12, true), share: "monthly avg" },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-base font-bold text-venkat-orange mt-0.5">{s.value}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{s.share}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Toggle + Chart */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold text-slate-800 dark:text-white">Month-by-Month Comparison</h2>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            {(["sales", "purchase"] as const).map(m => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${metric === m ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={v => formatCurrency(v, true)} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(v: number) => formatCurrency(v, true)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Unit 1 (10th Main)" fill="#0D2B5E" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Unit 2 (12th Main)" fill="#E87722" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Stats Table */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Key Metrics Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="th">Metric</th>
                <th className="th text-right text-venkat-navy dark:text-blue-300">Unit 1 (10th Main)</th>
                <th className="th text-right text-venkat-orange">Unit 2 (12th Main)</th>
                <th className="th text-right">Combined</th>
                <th className="th text-right">U1 Share</th>
              </tr>
            </thead>
            <tbody>
              {comparisonStats.map((s, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                  <td className="td font-medium text-slate-800 dark:text-slate-100">{s.label}</td>
                  <td className="td text-right font-semibold text-venkat-navy dark:text-blue-300">{formatCurrency(s.u1, true)}</td>
                  <td className="td text-right font-semibold text-venkat-orange">{formatCurrency(s.u2, true)}</td>
                  <td className="td text-right font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(s.u1 + s.u2, true)}</td>
                  <td className="td text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div className="h-full bg-venkat-navy rounded-full" style={{ width: `${s.u1Pct}%` }} />
                      </div>
                      <span className="text-xs font-medium w-10 text-right">{s.u1Pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
