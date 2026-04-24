import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, Package, Download, Search } from "lucide-react";
import { inventoryItems, formatCurrency, getLowStockItems } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function Inventory() {
  const { can } = useAuth();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [unit, setUnit] = useState("all");

  const categories = ["All", ...Array.from(new Set(inventoryItems.map(i => i.category)))];
  const lowStockItems = getLowStockItems();

  const filtered = inventoryItems.filter(item => {
    const matchCat = category === "All" || item.category === category;
    const matchSearch = item.product.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getStockForUnit = (item: typeof inventoryItems[0]) => {
    if (unit === "unit1") return item.unit1;
    if (unit === "unit2") return item.unit2;
    return item.unit1 + item.unit2;
  };

  const getStatusBadge = (item: typeof inventoryItems[0]) => {
    const stock = getStockForUnit(item);
    const threshold = unit === "all" ? item.minLevel * 1.2 : item.minLevel * 0.6;
    if (stock < item.minLevel * (unit === "all" ? 0.7 : 0.5)) return { label: "Critical", cls: "badge-red" };
    if (stock < threshold) return { label: "Low Stock", cls: "badge-amber" };
    return { label: "Adequate", cls: "badge-green" };
  };

  const chartData = filtered.slice(0, 12).map(item => ({
    name: item.product.split(" ").slice(0, 3).join(" "),
    "Unit 1": item.unit1,
    "Unit 2": item.unit2,
    Min: item.minLevel,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Stock & Inventory</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Current stock levels · {inventoryItems.length} SKUs</p>
        </div>
        <div className="flex gap-2">
          <select className="select" value={unit} onChange={e => setUnit(e.target.value)}>
            <option value="all">All Units</option>
            <option value="unit1">Unit 1</option>
            <option value="unit2">Unit 2</option>
          </select>
          {can("export:reports") && <button className="btn-primary"><Download size={15} /> Export</button>}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total SKUs",       value: inventoryItems.length,         sub: "Active products",         cls: "text-blue-600 dark:text-blue-400" },
          { label: "Low Stock",        value: lowStockItems.length,          sub: "Below 120% of min level", cls: "text-amber-500" },
          { label: "Critical Stock",   value: inventoryItems.filter(i => (i.unit1+i.unit2) < i.minLevel).length, sub: "Below min level", cls: "text-red-600" },
          { label: "Adequate Stock",   value: inventoryItems.filter(i => (i.unit1+i.unit2) >= i.minLevel * 1.5).length, sub: "Well stocked", cls: "text-green-600 dark:text-green-400" },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{k.label}</p>
            <p className={`text-2xl font-bold mt-1 ${k.cls}`}>{k.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
              {lowStockItems.length} items are below recommended stock levels
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
              {lowStockItems.map(i => i.product.split(" ").slice(0, 2).join(" ")).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Stock Level Chart */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Stock Levels — Unit 1 vs Unit 2</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" barSize={10}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={120} />
            <Tooltip />
            <Bar dataKey="Unit 1" fill="#0D2B5E" radius={[0, 3, 3, 0]} />
            <Bar dataKey="Unit 2" fill="#E87722" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filter & Table */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold text-slate-800 dark:text-white">Product Stock Details</h2>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-8 w-48"
                placeholder="Search product..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
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
                <th className="th">Product</th>
                <th className="th">Category</th>
                <th className="th text-right">Unit 1</th>
                <th className="th text-right">Unit 2</th>
                <th className="th text-right">Total</th>
                <th className="th text-right">Min Level</th>
                <th className="th text-right">UOM</th>
                <th className="th text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const status = getStatusBadge(item);
                const total = item.unit1 + item.unit2;
                return (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                    <td className="td font-medium text-slate-800 dark:text-slate-100">{item.product}</td>
                    <td className="td"><span className="badge-navy">{item.category}</span></td>
                    <td className="td text-right">{item.unit1.toLocaleString()}</td>
                    <td className="td text-right">{item.unit2.toLocaleString()}</td>
                    <td className="td text-right font-semibold">{total.toLocaleString()}</td>
                    <td className="td text-right text-slate-500 dark:text-slate-400">{item.minLevel.toLocaleString()}</td>
                    <td className="td text-right text-slate-500 dark:text-slate-400">{item.unitOfMeasure}</td>
                    <td className="td text-center"><span className={status.cls}>{status.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
