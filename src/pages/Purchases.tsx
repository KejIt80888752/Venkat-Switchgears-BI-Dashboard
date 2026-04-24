import React, { useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";
import { vendorWisePurchase, monthlyPurchase, formatCurrency, CHART_COLORS } from "@/data/mockData";
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

export default function Purchases() {
  const { can } = useAuth();
  const [unit, setUnit] = useState("all");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(vendorWisePurchase.map(v => v.category)))];
  const totalPurchase = vendorWisePurchase.reduce((s, v) => s + v.amount, 0);

  const filteredVendors = vendorWisePurchase.filter(v =>
    (unit === "all" || v.unit === "Both" || v.unit === unit) &&
    (category === "All" || v.category === category)
  );

  const categoryData = Array.from(
    vendorWisePurchase.reduce((map, v) => {
      map.set(v.category, (map.get(v.category) || 0) + v.amount);
      return map;
    }, new Map<string, number>()),
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Purchase Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">FY 2024-25 · Vendor & Category Analysis</p>
        </div>
        <div className="flex gap-2">
          <select className="select" value={unit} onChange={e => setUnit(e.target.value)}>
            <option value="all">All Units</option>
            <option value="Unit 1">Unit 1</option>
            <option value="Unit 2">Unit 2</option>
          </select>
          {can("export:reports") && <button className="btn-primary"><Download size={15} /> Export</button>}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Purchases YTD", value: formatCurrency(totalPurchase, true), sub: "10 vendors" },
          { label: "Largest Vendor",      value: "Havells India", sub: formatCurrency(18400000, true) },
          { label: "Purchase/Sales Ratio",value: `${((totalPurchase / 121000000) * 100).toFixed(0)}%`, sub: "of total sales" },
          { label: "Pending Payables",    value: formatCurrency(13990000, true), sub: "To 9 vendors" },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{k.label}</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{k.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vendor Pie */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Vendor-wise Split</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={vendorWisePurchase} cx="50%" cy="50%" outerRadius={95}
                dataKey="amount" nameKey="vendor" paddingAngle={2}>
                {vendorWisePurchase.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v, true)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            {vendorWisePurchase.slice(0, 6).map((v, i) => (
              <div key={v.vendor} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CHART_COLORS[i] }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{v.vendor.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Bar */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Category-wise Purchases</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} horizontal={false} />
              <XAxis type="number" tickFormatter={v => formatCurrency(v, true)} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={120} />
              <Tooltip formatter={(v: number) => formatCurrency(v, true)} />
              <Bar dataKey="value" name="Amount" fill="#0D2B5E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Monthly Purchase Trend</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthlyPurchase}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={v => formatCurrency(v, true)} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line dataKey="unit1" name="Unit 1" stroke="#0D2B5E" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line dataKey="unit2" name="Unit 2" stroke="#E87722" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Vendor Table */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold text-slate-800 dark:text-white">Vendor-wise Details</h2>
          <div className="flex gap-2">
            <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            {can("export:reports") && <button className="btn-secondary"><Download size={14} /> Excel</button>}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="th">Vendor</th>
                <th className="th">Category</th>
                <th className="th">Unit</th>
                <th className="th text-right">Amount</th>
                <th className="th text-right">Share</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.sort((a, b) => b.amount - a.amount).map((v, i) => {
                const share = ((v.amount / totalPurchase) * 100).toFixed(1);
                return (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                    <td className="td font-medium text-slate-800 dark:text-slate-100">{v.vendor}</td>
                    <td className="td"><span className="badge-navy">{v.category}</span></td>
                    <td className="td text-slate-500 dark:text-slate-400">{v.unit}</td>
                    <td className="td text-right font-semibold">{formatCurrency(v.amount, true)}</td>
                    <td className="td text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-venkat-navy rounded-full" style={{ width: `${share}%` }} />
                        </div>
                        <span className="text-xs w-10 text-right font-medium">{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 dark:bg-slate-700/50 font-bold">
                <td className="td" colSpan={3}>Total</td>
                <td className="td text-right text-venkat-navy dark:text-venkat-orange">{formatCurrency(filteredVendors.reduce((s, v) => s + v.amount, 0), true)}</td>
                <td className="td" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
