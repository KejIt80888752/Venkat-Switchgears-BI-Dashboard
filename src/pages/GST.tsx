import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, FileText } from "lucide-react";
import { gstData, formatCurrency } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function GST() {
  const { can } = useAuth();
  const [tab, setTab] = useState<"gstr1" | "gstr3b" | "summary">("summary");
  const [selectedMonth, setSelectedMonth] = useState("Mar '25");

  const totalCollected = gstData.reduce((s, m) => s + m.totalCollected, 0);
  const totalPaid      = gstData.reduce((s, m) => s + m.totalPaid, 0);
  const totalNet       = gstData.reduce((s, m) => s + m.net, 0);
  const totalTaxable   = gstData.reduce((s, m) => s + m.taxableValue, 0);

  const monthData = gstData.find(m => m.month === selectedMonth) || gstData[gstData.length - 1];

  const chartData = gstData.map(m => ({
    month: m.month,
    "Tax Collected": m.totalCollected,
    "Tax Paid (ITC)": m.totalPaid,
    "Net Liability": m.net,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">GST Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">GSTR-1 & GSTR-3B · FY 2024-25</p>
        </div>
        <div className="flex gap-2">
          {can("export:reports") && (
            <>
              <button className="btn-secondary"><Download size={14} /> Download GSTR-1</button>
              <button className="btn-primary"><Download size={15} /> Download GSTR-3B</button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Taxable Value",  value: formatCurrency(totalTaxable, true),  sub: "FY 24-25", color: "text-blue-600 dark:text-blue-400" },
          { label: "Tax Collected (Output)", value: formatCurrency(totalCollected, true), sub: "CGST + SGST + IGST", color: "text-red-500" },
          { label: "ITC Claimed (Input)",  value: formatCurrency(totalPaid, true),     sub: "Input Tax Credit", color: "text-green-600 dark:text-green-400" },
          { label: "Net GST Liability",    value: formatCurrency(totalNet, true),       sub: "Paid to Govt.", color: "text-venkat-orange" },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{k.label}</p>
            <p className={`text-xl font-bold mt-1 ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* GST Trend Chart */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Monthly GST — Collected vs ITC vs Net</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={v => formatCurrency(v, true)} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(v: number) => formatCurrency(v, true)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Tax Collected"   fill="#EF4444" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Tax Paid (ITC)"  fill="#22C55E" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Net Liability"   fill="#0D2B5E" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1 w-fit">
        {(["summary", "gstr1", "gstr3b"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
          >
            {t === "summary" ? "Annual Summary" : t === "gstr1" ? "GSTR-1" : "GSTR-3B"}
          </button>
        ))}
      </div>

      {tab === "summary" && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-white">Monthly GST Summary</h2>
            {can("export:reports") && <button className="btn-secondary"><Download size={14} /> Excel</button>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="th">Month</th>
                  <th className="th text-right">Taxable Value</th>
                  <th className="th text-right">CGST</th>
                  <th className="th text-right">SGST</th>
                  <th className="th text-right">IGST</th>
                  <th className="th text-right">Total Collected</th>
                  <th className="th text-right">ITC Paid</th>
                  <th className="th text-right">Net Liability</th>
                </tr>
              </thead>
              <tbody>
                {gstData.map((m, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                    <td className="td font-medium text-slate-800 dark:text-slate-100">{m.month}</td>
                    <td className="td text-right">{formatCurrency(m.taxableValue, true)}</td>
                    <td className="td text-right text-slate-500 dark:text-slate-400">{formatCurrency(m.cgst, true)}</td>
                    <td className="td text-right text-slate-500 dark:text-slate-400">{formatCurrency(m.sgst, true)}</td>
                    <td className="td text-right text-slate-500 dark:text-slate-400">{formatCurrency(m.igst, true)}</td>
                    <td className="td text-right text-red-500 font-semibold">{formatCurrency(m.totalCollected, true)}</td>
                    <td className="td text-right text-green-600 dark:text-green-400">{formatCurrency(m.totalPaid, true)}</td>
                    <td className="td text-right font-semibold text-venkat-navy dark:text-venkat-orange">{formatCurrency(m.net, true)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-700/50 font-bold border-t-2 border-slate-300 dark:border-slate-600">
                  <td className="td">FY Total</td>
                  <td className="td text-right">{formatCurrency(totalTaxable, true)}</td>
                  <td className="td text-right">{formatCurrency(gstData.reduce((s,m) => s+m.cgst, 0), true)}</td>
                  <td className="td text-right">{formatCurrency(gstData.reduce((s,m) => s+m.sgst, 0), true)}</td>
                  <td className="td text-right">{formatCurrency(gstData.reduce((s,m) => s+m.igst, 0), true)}</td>
                  <td className="td text-right text-red-500">{formatCurrency(totalCollected, true)}</td>
                  <td className="td text-right text-green-600 dark:text-green-400">{formatCurrency(totalPaid, true)}</td>
                  <td className="td text-right text-venkat-orange">{formatCurrency(totalNet, true)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {(tab === "gstr1" || tab === "gstr3b") && (
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="font-semibold text-slate-800 dark:text-white">
              {tab === "gstr1" ? "GSTR-1 — Outward Supplies" : "GSTR-3B — Summary Return"}
            </h2>
            <div className="flex gap-2">
              <select className="select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                {gstData.map(m => <option key={m.month}>{m.month}</option>)}
              </select>
              {can("export:reports") && <button className="btn-primary"><Download size={14} /> Download</button>}
            </div>
          </div>

          {tab === "gstr1" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Taxable Value",   value: formatCurrency(monthData.taxableValue, true) },
                  { label: "CGST @ 9%",       value: formatCurrency(monthData.cgst, true) },
                  { label: "SGST @ 9%",       value: formatCurrency(monthData.sgst, true) },
                  { label: "IGST @ 18%",      value: formatCurrency(monthData.igst, true) },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4">
                <p className="text-sm text-blue-800 dark:text-blue-400 font-medium">
                  Note: GSTR-1 data is auto-populated from Tally ERP invoices. Filing status will be integrated with GST portal API.
                </p>
              </div>
            </div>
          )}

          {tab === "gstr3b" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "3.1 Outward Supplies (Tax)", value: formatCurrency(monthData.totalCollected, true), sub: "Total tax on sales" },
                  { label: "4A ITC Available",           value: formatCurrency(monthData.totalPaid, true),      sub: "Input Tax Credit" },
                  { label: "Net Tax Payable",            value: formatCurrency(monthData.net, true),            sub: "Paid via cash ledger" },
                ].map(s => (
                  <div key={s.label} className="border border-slate-200 dark:border-slate-600 rounded-xl p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{s.label}</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{s.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4">
                <p className="text-sm text-green-800 dark:text-green-400 font-medium">
                  GSTR-3B for {selectedMonth}: Net liability of {formatCurrency(monthData.net, true)} — reconciliation complete.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
