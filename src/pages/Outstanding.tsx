import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, AlertTriangle, TrendingDown } from "lucide-react";
import { debtors, creditors, formatCurrency, getAgingBucket } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function Outstanding() {
  const { can } = useAuth();
  const [tab, setTab] = useState<"debtors" | "creditors">("debtors");
  const [sortBy, setSortBy] = useState<"amount" | "aging">("aging");

  const debtorAging = {
    "0-30":  { count: 0, amount: 0 },
    "31-60": { count: 0, amount: 0 },
    "60+":   { count: 0, amount: 0 },
  };
  debtors.forEach(d => {
    const b = getAgingBucket(d.agingDays);
    debtorAging[b].count++;
    debtorAging[b].amount += d.amount;
  });

  const creditorAging = {
    "0-30":  { count: 0, amount: 0 },
    "31-60": { count: 0, amount: 0 },
    "60+":   { count: 0, amount: 0 },
  };
  creditors.forEach(c => {
    const b = getAgingBucket(c.agingDays);
    creditorAging[b].count++;
    creditorAging[b].amount += c.amount;
  });

  const agingChartData = [
    {
      bucket: "0-30 days",
      Debtors: debtorAging["0-30"].amount,
      Creditors: creditorAging["0-30"].amount,
    },
    {
      bucket: "31-60 days",
      Debtors: debtorAging["31-60"].amount,
      Creditors: creditorAging["31-60"].amount,
    },
    {
      bucket: "60+ days",
      Debtors: debtorAging["60+"].amount,
      Creditors: creditorAging["60+"].amount,
    },
  ];

  const totalDebtors = debtors.reduce((s, d) => s + d.amount, 0);
  const totalCreditors = creditors.reduce((s, c) => s + c.amount, 0);
  const netReceivable = totalDebtors - totalCreditors;

  const sortedDebtors = [...debtors].sort((a, b) =>
    sortBy === "amount" ? b.amount - a.amount : b.agingDays - a.agingDays
  );
  const sortedCreditors = [...creditors].sort((a, b) =>
    sortBy === "amount" ? b.amount - a.amount : b.agingDays - a.agingDays
  );

  const getBadge = (days: number) => {
    const b = getAgingBucket(days);
    if (b === "60+") return <span className="badge-red">{days} days</span>;
    if (b === "31-60") return <span className="badge-amber">{days} days</span>;
    return <span className="badge-green">{days} days</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Outstanding Payments</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Debtors (Receivables) & Creditors (Payables)</p>
        </div>
        {can("export:reports") && (
          <button className="btn-primary"><Download size={15} /> Export</button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-l-blue-500">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Receivables</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{formatCurrency(totalDebtors, true)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{debtors.length} invoices pending</p>
        </div>
        <div className="card p-4 border-l-4 border-l-orange-500">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Payables</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{formatCurrency(totalCreditors, true)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{creditors.length} invoices pending</p>
        </div>
        <div className={`card p-4 border-l-4 ${netReceivable > 0 ? "border-l-green-500" : "border-l-red-500"}`}>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Net Position</p>
          <p className={`text-2xl font-bold mt-1 ${netReceivable > 0 ? "text-green-600" : "text-red-600"}`}>
            {netReceivable > 0 ? "+" : ""}{formatCurrency(netReceivable, true)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Receivables - Payables</p>
        </div>
      </div>

      {/* Overdue Alert */}
      {debtorAging["60+"].amount > 0 && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-400">
              {formatCurrency(debtorAging["60+"].amount, true)} overdue beyond 60 days
            </p>
            <p className="text-xs text-red-700 dark:text-red-500 mt-0.5">
              {debtorAging["60+"].count} invoices need immediate follow-up
            </p>
          </div>
        </div>
      )}

      {/* Aging Chart */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Aging Bucket Analysis</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={agingChartData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="bucket" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={v => formatCurrency(v, true)} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(v: number) => formatCurrency(v, true)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Debtors" fill="#0D2B5E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Creditors" fill="#E87722" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            {(["debtors", "creditors"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
              >
                {t === "debtors" ? `Debtors (${debtors.length})` : `Creditors (${creditors.length})`}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-500 dark:text-slate-400">Sort by:</span>
            <select className="select" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="aging">Aging (oldest first)</option>
              <option value="amount">Amount (highest first)</option>
            </select>
            {can("export:reports") && <button className="btn-secondary"><Download size={14} /> Excel</button>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            {tab === "debtors" ? (
              <>
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="th">Customer</th>
                    <th className="th">Invoice No.</th>
                    <th className="th">Unit</th>
                    <th className="th text-right">Amount</th>
                    <th className="th text-center">Aging</th>
                    <th className="th text-center">Bucket</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDebtors.map((d, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                      <td className="td font-medium text-slate-800 dark:text-slate-100">{d.customer}</td>
                      <td className="td font-mono text-xs text-slate-500 dark:text-slate-400">{d.invoiceNo}</td>
                      <td className="td"><span className="badge-navy">{d.unit}</span></td>
                      <td className="td text-right font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(d.amount, true)}</td>
                      <td className="td text-center">{getBadge(d.agingDays)}</td>
                      <td className="td text-center">
                        <span className={getAgingBucket(d.agingDays) === "60+" ? "badge-red" : getAgingBucket(d.agingDays) === "31-60" ? "badge-amber" : "badge-green"}>
                          {getAgingBucket(d.agingDays)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 font-bold border-t border-slate-200 dark:border-slate-700">
                    <td className="td" colSpan={3}>Total Receivables</td>
                    <td className="td text-right text-venkat-navy dark:text-venkat-orange">{formatCurrency(totalDebtors, true)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </>
            ) : (
              <>
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="th">Vendor</th>
                    <th className="th">Invoice No.</th>
                    <th className="th text-right">Amount</th>
                    <th className="th text-center">Aging</th>
                    <th className="th text-center">Bucket</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCreditors.map((c, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                      <td className="td font-medium text-slate-800 dark:text-slate-100">{c.vendor}</td>
                      <td className="td font-mono text-xs text-slate-500 dark:text-slate-400">{c.invoiceNo}</td>
                      <td className="td text-right font-semibold">{formatCurrency(c.amount, true)}</td>
                      <td className="td text-center">{getBadge(c.agingDays)}</td>
                      <td className="td text-center">
                        <span className={getAgingBucket(c.agingDays) === "60+" ? "badge-red" : getAgingBucket(c.agingDays) === "31-60" ? "badge-amber" : "badge-green"}>
                          {getAgingBucket(c.agingDays)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 font-bold border-t border-slate-200 dark:border-slate-700">
                    <td className="td" colSpan={2}>Total Payables</td>
                    <td className="td text-right text-venkat-orange">{formatCurrency(totalCreditors, true)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
