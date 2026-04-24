import React, { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp, ArrowUpRight } from "lucide-react";
import { monthlySales, prevYearSales, productWiseSales, salesTarget, formatCurrency } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

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

export default function Sales() {
  const { can } = useAuth();
  const [unit, setUnit] = useState<"all" | "unit1" | "unit2">("all");
  const [view, setView] = useState<"monthly" | "comparison">("monthly");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(productWiseSales.map(p => p.category)))];

  const filteredProducts = productWiseSales.filter(p => category === "All" || p.category === category);

  const ytdTotal = monthlySales.reduce((s, m) => s + m.total, 0);
  const prevYtd = prevYearSales.reduce((s, m) => s + m.total, 0);
  const yoyGrowth = (((ytdTotal - prevYtd) / prevYtd) * 100).toFixed(1);

  const comparisonData = monthlySales.map((m, i) => ({
    month: m.month.replace(" '24", "").replace(" '25", ""),
    "FY 24-25": m.total,
    "FY 23-24": prevYearSales[i]?.total ?? 0,
  }));

  const chartData = monthlySales.map(m => ({
    month: m.month,
    "Unit 1": m.unit1,
    "Unit 2": m.unit2,
    Total: m.total,
  }));

  const displayData = unit === "unit1"
    ? chartData.map(d => ({ ...d, Total: d["Unit 1"] }))
    : unit === "unit2"
    ? chartData.map(d => ({ ...d, Total: d["Unit 2"] }))
    : chartData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Sales Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">FY 2024-25 · Venkat Switchgears</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="select" value={unit} onChange={e => setUnit(e.target.value as any)}>
            <option value="all">All Units</option>
            <option value="unit1">Unit 1</option>
            <option value="unit2">Unit 2</option>
          </select>
          {can("export:reports") && (
            <button className="btn-primary"><Download size={15} /> Export PDF</button>
          )}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sales YTD",     value: formatCurrency(ytdTotal, true),                            sub: "Apr '24 – Mar '25", color: "text-blue-600 dark:text-blue-400" },
          { label: "YoY Growth",           value: `+${yoyGrowth}%`,                                         sub: "vs FY 23-24",         color: "text-green-600 dark:text-green-400" },
          { label: "Target Achievement",   value: `${Math.round((salesTarget.currentYTD / salesTarget.yearly) * 100)}%`, sub: `₹18 Cr target`, color: "text-amber-500" },
          { label: "Best Month",           value: "Mar '25",                                                sub: formatCurrency(14500000, true), color: "text-venkat-orange" },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{k.label}</p>
            <p className={`text-xl font-bold mt-1 ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1 w-fit">
        {(["monthly", "comparison"] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === v ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
          >
            {v === "monthly" ? "Monthly Breakdown" : "Year-on-Year"}
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4">
          {view === "monthly" ? "Monthly Sales — Unit 1 vs Unit 2" : "FY 24-25 vs FY 23-24 Comparison"}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          {view === "monthly" ? (
            <BarChart data={displayData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => formatCurrency(v, true)} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {unit === "all" && <Bar dataKey="Unit 1" fill="#0D2B5E" radius={[3, 3, 0, 0]} />}
              {unit === "all" && <Bar dataKey="Unit 2" fill="#E87722" radius={[3, 3, 0, 0]} />}
              {unit !== "all" && <Bar dataKey="Total" fill={unit === "unit1" ? "#0D2B5E" : "#E87722"} radius={[3, 3, 0, 0]} />}
            </BarChart>
          ) : (
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => formatCurrency(v, true)} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line dataKey="FY 24-25" stroke="#0D2B5E" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line dataKey="FY 23-24" stroke="#E87722" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Product-wise Table */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold text-slate-800 dark:text-white">Product-wise Sales</h2>
          <div className="flex items-center gap-2">
            <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            {can("export:reports") && (
              <button className="btn-secondary"><Download size={14} /> Excel</button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="th text-left">Product</th>
                <th className="th text-left">Category</th>
                <th className="th text-right">Unit 1</th>
                <th className="th text-right">Unit 2</th>
                <th className="th text-right">Total Sales</th>
                <th className="th text-right">Qty</th>
                <th className="th text-right">Share</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, i) => {
                const share = ((p.total / ytdTotal) * 100).toFixed(1);
                return (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                    <td className="td font-medium text-slate-800 dark:text-slate-100">{p.product}</td>
                    <td className="td"><span className="badge-navy">{p.category}</span></td>
                    <td className="td text-right">{formatCurrency(p.unit1, true)}</td>
                    <td className="td text-right">{formatCurrency(p.unit2, true)}</td>
                    <td className="td text-right font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(p.total, true)}</td>
                    <td className="td text-right">{p.qty.toLocaleString()}</td>
                    <td className="td text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-venkat-orange rounded-full" style={{ width: `${share}%` }} />
                        </div>
                        <span className="text-xs font-medium w-10 text-right">{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                <td className="td font-bold text-slate-800 dark:text-white" colSpan={2}>Total</td>
                <td className="td text-right font-bold">{formatCurrency(filteredProducts.reduce((s, p) => s + p.unit1, 0), true)}</td>
                <td className="td text-right font-bold">{formatCurrency(filteredProducts.reduce((s, p) => s + p.unit2, 0), true)}</td>
                <td className="td text-right font-bold text-venkat-navy dark:text-venkat-orange">{formatCurrency(filteredProducts.reduce((s, p) => s + p.total, 0), true)}</td>
                <td className="td text-right font-bold">{filteredProducts.reduce((s, p) => s + p.qty, 0).toLocaleString()}</td>
                <td className="td" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
