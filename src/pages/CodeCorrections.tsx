import React, { useState } from "react";
import {
  Tag, Search, Filter, CheckCircle2, AlertCircle,
  Edit3, Save, X, RefreshCw, Download, Upload,
  ChevronDown, Check, Clock, Info,
} from "lucide-react";
import { inventoryItems } from "@/data/mockData";

type CorrectionStatus = "pending" | "approved" | "rejected" | "flagged";

interface CodeEntry {
  id: number;
  oldCode: string;
  newCode: string;
  product: string;
  category: string;
  hsn: string;
  reason: string;
  status: CorrectionStatus;
  requestedBy: string;
  requestedOn: string;
  reviewedBy?: string;
  reviewedOn?: string;
  note?: string;
}

const MOCK_CORRECTIONS: CodeEntry[] = [
  { id: 1, oldCode: "VK0003", newCode: "VK0003A", product: "MCC Panel (Standard)", category: "Panels", hsn: "8537", reason: "Variant split — Standard vs Custom", status: "pending", requestedBy: "Sales Team", requestedOn: "28 Apr 2025" },
  { id: 2, oldCode: "VK0008", newCode: "VK0008B", product: "MCCB 250A (3P)", category: "Breakers", hsn: "8536", reason: "Duplicate SKU detected in Tally", status: "flagged", requestedBy: "Admin", requestedOn: "26 Apr 2025", note: "Check with Unit 2 before approving" },
  { id: 3, oldCode: "VK0012", newCode: "VK0012C", product: "Bus Bar Copper 250A", category: "Bus Systems", hsn: "7407", reason: "Supplier prefix mismatch — reconciling with PO", status: "approved", requestedBy: "Purchase Dept", requestedOn: "22 Apr 2025", reviewedBy: "Manager", reviewedOn: "24 Apr 2025" },
  { id: 4, oldCode: "VK0015", newCode: "VK0015X", product: "Capacitor 50 KVAR", category: "Power Factor", hsn: "8532", reason: "Seasonal stock re-code for FY2025–26", status: "approved", requestedBy: "Inventory Team", requestedOn: "20 Apr 2025", reviewedBy: "Manager", reviewedOn: "21 Apr 2025" },
  { id: 5, oldCode: "VK0017", newCode: "VK0017D", product: "Control Cable 2.5 sq.mm", category: "Cables", hsn: "8544", reason: "Typo in original Tally entry — 2.5 vs 2.50", status: "rejected", requestedBy: "Accounts", requestedOn: "18 Apr 2025", reviewedBy: "Manager", reviewedOn: "19 Apr 2025", note: "Keep existing code — no change needed" },
  { id: 6, oldCode: "VK0019", newCode: "VK0019E", product: "Indicating Lamps", category: "Instruments", hsn: "8531", reason: "New colour variant added to product line", status: "pending", requestedBy: "Sales Team", requestedOn: "29 Apr 2025" },
];

const STATUS_CONFIG: Record<CorrectionStatus, { label: string; icon: React.ReactNode; cls: string }> = {
  pending:  { label: "Pending",  icon: <Clock size={12} />,        cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  approved: { label: "Approved", icon: <CheckCircle2 size={12} />, cls: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  rejected: { label: "Rejected", icon: <X size={12} />,            cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  flagged:  { label: "Flagged",  icon: <AlertCircle size={12} />,  cls: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
};

const CATEGORIES = ["All", "Panels", "DB/PDB", "Breakers", "Bus Systems", "Power Factor", "Cables", "Instruments"];

export default function CodeCorrections() {
  const [tab, setTab] = useState<"corrections" | "master">("corrections");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CorrectionStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [corrections, setCorrections] = useState<CodeEntry[]>(MOCK_CORRECTIONS);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNote, setEditNote] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ oldCode: "", newCode: "", product: "", reason: "" });

  // Summary counts
  const counts = {
    total:    corrections.length,
    pending:  corrections.filter(c => c.status === "pending").length,
    approved: corrections.filter(c => c.status === "approved").length,
    flagged:  corrections.filter(c => c.status === "flagged").length,
    rejected: corrections.filter(c => c.status === "rejected").length,
  };

  // Filter corrections
  const filtered = corrections.filter(c => {
    const matchSearch = !search ||
      c.oldCode.toLowerCase().includes(search.toLowerCase()) ||
      c.newCode.toLowerCase().includes(search.toLowerCase()) ||
      c.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchCat = categoryFilter === "All" || c.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const updateStatus = (id: number, status: CorrectionStatus) => {
    setCorrections(prev => prev.map(c =>
      c.id === id ? { ...c, status, reviewedBy: "Manager", reviewedOn: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) } : c
    ));
    setEditingId(null);
  };

  const handleAddRequest = () => {
    if (!newEntry.oldCode || !newEntry.newCode || !newEntry.reason) return;
    const item = inventoryItems.find(i => i.code === newEntry.oldCode);
    setCorrections(prev => [{
      id: Date.now(),
      oldCode: newEntry.oldCode,
      newCode: newEntry.newCode,
      product: item?.product || newEntry.product || "—",
      category: item?.category || "—",
      hsn: item?.hsn || "—",
      reason: newEntry.reason,
      status: "pending",
      requestedBy: "You",
      requestedOn: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    }, ...prev]);
    setNewEntry({ oldCode: "", newCode: "", product: "", reason: "" });
    setShowNewForm(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Tag size={20} className="text-venkat-orange" />
            Code Corrections
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review and manage product code change requests
          </p>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <button className="btn-secondary text-sm flex items-center gap-1.5">
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => setShowNewForm(true)}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            <Edit3 size={14} /> New Request
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Requests", value: counts.total,    color: "text-slate-700 dark:text-slate-200",  bg: "bg-slate-50 dark:bg-slate-800" },
          { label: "Pending",        value: counts.pending,  color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Approved",       value: counts.approved, color: "text-green-600 dark:text-green-400",  bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Flagged",        value: counts.flagged,  color: "text-violet-600 dark:text-violet-400",bg: "bg-violet-50 dark:bg-violet-900/20" },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        {[
          { key: "corrections", label: "Correction Requests" },
          { key: "master",      label: "Master Code List" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              tab === t.key
                ? "bg-white dark:bg-slate-700 text-venkat-navy dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CORRECTIONS TAB ── */}
      {tab === "corrections" && (
        <div className="space-y-4">
          {/* New Request Form */}
          {showNewForm && (
            <div className="card p-5 border-2 border-venkat-orange/30 bg-orange-50/30 dark:bg-orange-900/10">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">New Code Correction Request</p>
                <button onClick={() => setShowNewForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Current Code *</label>
                  <input
                    list="code-list"
                    value={newEntry.oldCode}
                    onChange={e => setNewEntry(p => ({ ...p, oldCode: e.target.value }))}
                    placeholder="e.g. VK0008"
                    className="input text-sm"
                  />
                  <datalist id="code-list">
                    {inventoryItems.map(i => (
                      <option key={i.code} value={i.code}>{i.product}</option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">New Code *</label>
                  <input
                    value={newEntry.newCode}
                    onChange={e => setNewEntry(p => ({ ...p, newCode: e.target.value }))}
                    placeholder="e.g. VK0008B"
                    className="input text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Reason *</label>
                  <input
                    value={newEntry.reason}
                    onChange={e => setNewEntry(p => ({ ...p, reason: e.target.value }))}
                    placeholder="Why is this correction needed?"
                    className="input text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <button onClick={() => setShowNewForm(false)} className="btn-secondary text-sm">Cancel</button>
                <button onClick={handleAddRequest} className="btn-primary text-sm flex items-center gap-1.5">
                  <Save size={14} /> Submit Request
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search code or product…"
                className="input pl-8 text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "pending", "approved", "flagged", "rejected"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    statusFilter === s
                      ? "bg-venkat-navy text-white border-venkat-navy"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-venkat-navy"
                  }`}
                >
                  {s === "all" ? "All" : STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Code</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Code</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Reason</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Requested By</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-400 dark:text-slate-500">
                        No correction requests found.
                      </td>
                    </tr>
                  )}
                  {filtered.map(c => {
                    const sc = STATUS_CONFIG[c.status];
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded border border-red-200 dark:border-red-800 line-through">
                            {c.oldCode}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded border border-green-200 dark:border-green-800 font-semibold">
                            {c.newCode}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-slate-800 dark:text-slate-200 font-medium text-xs">{c.product}</p>
                          <p className="text-slate-400 text-xs">{c.category} · HSN {c.hsn}</p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="text-slate-600 dark:text-slate-300 text-xs max-w-[180px] truncate" title={c.reason}>{c.reason}</p>
                          {c.note && (
                            <p className="text-amber-600 dark:text-amber-400 text-xs flex items-center gap-1 mt-0.5">
                              <Info size={10} /> {c.note}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.cls}`}>
                            {sc.icon} {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="text-xs text-slate-600 dark:text-slate-300">{c.requestedBy}</p>
                          {c.reviewedBy && <p className="text-xs text-slate-400">→ {c.reviewedBy}</p>}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="text-xs text-slate-600 dark:text-slate-300">{c.requestedOn}</p>
                          {c.reviewedOn && <p className="text-xs text-slate-400">{c.reviewedOn}</p>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {c.status === "pending" || c.status === "flagged" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => updateStatus(c.id, "approved")}
                                className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                                title="Approve"
                              >
                                <Check size={13} />
                              </button>
                              <button
                                onClick={() => updateStatus(c.id, "rejected")}
                                className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                title="Reject"
                              >
                                <X size={13} />
                              </button>
                              <button
                                onClick={() => updateStatus(c.id, "flagged")}
                                className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-500 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                                title="Flag for review"
                              >
                                <AlertCircle size={13} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              {c.status === "approved" ? "Applied" : "Closed"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── MASTER CODE LIST TAB ── */}
      {tab === "master" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search code or product…"
                className="input pl-8 text-sm"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="input text-sm w-auto"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <span className="text-xs text-slate-400 ml-auto">
              {inventoryItems.filter(i =>
                (!search || i.code.toLowerCase().includes(search.toLowerCase()) || i.product.toLowerCase().includes(search.toLowerCase())) &&
                (categoryFilter === "All" || i.category === categoryFilter)
              ).length} of {inventoryItems.length} products
            </span>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Code</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">HSN</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unit</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rate (₹)</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Corrections</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {inventoryItems
                    .filter(i =>
                      (!search || i.code.toLowerCase().includes(search.toLowerCase()) || i.product.toLowerCase().includes(search.toLowerCase())) &&
                      (categoryFilter === "All" || i.category === categoryFilter)
                    )
                    .map(item => {
                      const hasPending = corrections.some(c => c.oldCode === item.code && c.status === "pending");
                      const hasApproved = corrections.some(c => c.oldCode === item.code && c.status === "approved");
                      return (
                        <tr key={item.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs font-bold text-venkat-navy dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                              {item.code}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium text-xs">{item.product}</td>
                          <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{item.category}</td>
                          <td className="px-4 py-3 text-xs font-mono text-slate-600 dark:text-slate-300">{item.hsn}</td>
                          <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{item.unitOfMeasure}</td>
                          <td className="px-4 py-3 text-right text-xs font-semibold text-slate-700 dark:text-slate-200">
                            ₹{item.rate.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {hasPending && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                <Clock size={10} /> Pending
                              </span>
                            )}
                            {hasApproved && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                <CheckCircle2 size={10} /> Updated
                              </span>
                            )}
                            {!hasPending && !hasApproved && (
                              <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
