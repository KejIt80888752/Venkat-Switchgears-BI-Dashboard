import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp } from "lucide-react";
import { plData, formatCurrency, CHART_COLORS } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {formatCurrency(p.value, true)}</p>
      ))}
    </div>
  );
};

export default function PnL() {
  const { can } = useAuth();

  const ytdRevenue = plData.reduce((s, m) => s + m.revenue, 0);
  const ytdProfit  = plData.reduce((s, m) => s + m.netProfit, 0);
  const ytdExpenses = ytdRevenue - ytdProfit;
  const avgMargin  = ((ytdProfit / ytdRevenue) * 100).toFixed(1);

  const expenseBreakdown = [
    { name: "Raw Material",  value: plData.reduce((s, m) => s + m.rawMaterial, 0) },
    { name: "Labour",        value: plData.reduce((s, m) => s + m.labour, 0)      },
    { name: "Overheads",     value: plData.reduce((s, m) => s + m.overhead, 0)    },
    { name: "Admin",         value: plData.reduce((s, m) => s + m.admin, 0)       },
    { name: "Other",         value: plData.reduce((s, m) => s + m.other, 0)       },
  ];

  const chartData = plData.map(m => ({
    month: m.month,
    Revenue:   m.revenue,
    Expenses:  m.revenue - m.netProfit,
    "Net Profit": m.netProfit,
    "Margin %": +((m.netProfit / m.revenue) * 100).toFixed(1),
  }));

  const bestMonth = [...plData].sort((a, b) => b.netProfit - a.netProfit)[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profit & Loss</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">FY 2024-25 P&L Summary</p>
        </div>
        {can("export:reports") && (
          <button className="btn-primary"><Download size={15} /> Export PDF</button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue YTD",   value: formatCurrency(ytdRevenue, true),  sub: "Gross income",       color: "text-blue-600 dark:text-blue-400"  },
          { label: "Total Expenses YTD",  value: formatCurrency(ytdExpenses, true), sub: "All costs",          color: "text-red-500"   },
          { label: "Net Profit YTD",      value: formatCurrency(ytdProfit, true),   sub: "After all expenses", color: "text-green-600 dark:text-green-400" },
          { label: "Avg Net Margin",      value: `${avgMargin}%`,                   sub: `Best: ${bestMonth.month}`, color: "text-venkat-orange" },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{k.label}</p>
            <p className={`text-xl font-bold mt-1 ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue vs Expense Area Chart */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Revenue vs Expenses vs Net Profit</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D2B5E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0D2B5E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={v => formatCurrency(v, true)} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="Revenue"    stroke="#0D2B5E" strokeWidth={2} fill="url(#revGrad)"  />
            <Area type="monotone" dataKey="Expenses"   stroke="#EF4444" strokeWidth={2} fill="url(#expGrad)"  />
            <Area type="monotone" dataKey="Net Profit" stroke="#22C55E" strokeWidth={2.5} fill="url(#profGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Expense Breakdown Pie */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Expense Breakdown YTD</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                dataKey="value" nameKey="name" paddingAngle={2}>
                {expenseBreakdown.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v, true)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
            {expenseBreakdown.map((e, i) => (
              <div key={e.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CHART_COLORS[i] }} />
                  <span className="text-xs text-slate-600 dark:text-slate-300">{e.name}</span>
                </div>
                <span className="text-xs font-medium">{formatCurrency(e.value, true)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Profit Margin Line */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Net Profit Margin Trend (%)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis domain={[20, 30]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Line dataKey="Margin %" name="Net Margin %" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 3, fill: "#22C55E" }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[
              { label: "Highest Margin", value: `${Math.max(...chartData.map(d => d["Margin %"]))}%`, month: chartData.sort((a,b) => b["Margin %"] - a["Margin %"])[0].month },
              { label: "Lowest Margin",  value: `${Math.min(...chartData.map(d => d["Margin %"]))}%`, month: chartData.sort((a,b) => a["Margin %"] - b["Margin %"])[0].month },
              { label: "Avg Margin",     value: `${avgMargin}%`, month: "FY 24-25" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">{s.value}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{s.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly P&L Table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800 dark:text-white">Monthly P&L Statement</h2>
          {can("export:reports") && <button className="btn-secondary"><Download size={14} /> Excel</button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="th">Month</th>
                <th className="th text-right">Revenue</th>
                <th className="th text-right">Raw Material</th>
                <th className="th text-right">Labour</th>
                <th className="th text-right">Overheads</th>
                <th className="th text-right">Total Exp.</th>
                <th className="th text-right">Net Profit</th>
                <th className="th text-right">Margin</th>
              </tr>
            </thead>
            <tbody>
              {plData.map((m, i) => {
                const totalExp = m.rawMaterial + m.labour + m.overhead + m.admin + m.other;
                const margin = ((m.netProfit / m.revenue) * 100).toFixed(1);
                return (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                    <td className="td font-medium text-slate-800 dark:text-slate-100">{m.month}</td>
                    <td className="td text-right">{formatCurrency(m.revenue, true)}</td>
                    <td className="td text-right text-slate-500 dark:text-slate-400">{formatCurrency(m.rawMaterial, true)}</td>
                    <td className="td text-right text-slate-500 dark:text-slate-400">{formatCurrency(m.labour, true)}</td>
                    <td className="td text-right text-slate-500 dark:text-slate-400">{formatCurrency(m.overhead, true)}</td>
                    <td className="td text-right text-red-500">{formatCurrency(totalExp, true)}</td>
                    <td className="td text-right font-semibold text-green-600 dark:text-green-400">{formatCurrency(m.netProfit, true)}</td>
                    <td className="td text-right">
                      <span className={`font-medium text-xs ${+margin >= 26 ? "text-green-600 dark:text-green-400" : "text-amber-500"}`}>{margin}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 dark:bg-slate-700/50 font-bold border-t-2 border-slate-300 dark:border-slate-600">
                <td className="td">FY Total</td>
                <td className="td text-right">{formatCurrency(ytdRevenue, true)}</td>
                <td className="td text-right">{formatCurrency(plData.reduce((s,m) => s+m.rawMaterial, 0), true)}</td>
                <td className="td text-right">{formatCurrency(plData.reduce((s,m) => s+m.labour, 0), true)}</td>
                <td className="td text-right">{formatCurrency(plData.reduce((s,m) => s+m.overhead, 0), true)}</td>
                <td className="td text-right text-red-500">{formatCurrency(ytdExpenses, true)}</td>
                <td className="td text-right text-green-600 dark:text-green-400">{formatCurrency(ytdProfit, true)}</td>
                <td className="td text-right text-green-600 dark:text-green-400">{avgMargin}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
