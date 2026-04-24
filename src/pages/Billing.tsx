import React, { useState } from "react";
import {
  Plus, Trash2, Printer, Save, Send, Search,
  ChevronDown, CheckCircle, FileText, Eye,
} from "lucide-react";
import { COMPANY, formatCurrency } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

// ── Types ─────────────────────────────────────────────────────
interface BillItem {
  id: number;
  code: string;
  description: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  disc: number;
  gstPct: number;
}

interface Invoice {
  invoiceNo: string;
  date: string;
  party: string;
  gstin: string;
  address: string;
  placeOfSupply: string;
  items: BillItem[];
  status: "Draft" | "Saved" | "Sent";
}

// ── Mock recent invoices ───────────────────────────────────────
const recentInvoices: Invoice[] = [
  {
    invoiceNo: "VSG/2025/0058", date: "2025-04-22", party: "BHEL Bangalore",
    gstin: "29AAACB1234C1ZX", address: "BHEL Complex, Mysore Rd, Bangalore", placeOfSupply: "Karnataka",
    status: "Sent",
    items: [
      { id: 1, code: "VK0003", description: "LT Switchgear Panel 630A",   hsn: "8537", qty: 2, unit: "Nos", rate: 185000, disc: 5, gstPct: 18 },
      { id: 2, code: "VK0006", description: "MCCB 250A (3P) Havells",     hsn: "8536", qty: 10, unit: "Nos", rate: 8500, disc: 0, gstPct: 18 },
    ],
  },
  {
    invoiceNo: "VSG/2025/0057", date: "2025-04-20", party: "Brigade Enterprises",
    gstin: "29AAACB5678D1ZX", address: "Brigade Gateway, Rajajinagar, Bangalore", placeOfSupply: "Karnataka",
    status: "Sent",
    items: [
      { id: 1, code: "VK0004", description: "MCC Panel Standard",         hsn: "8537", qty: 3, unit: "Nos", rate: 220000, disc: 3, gstPct: 18 },
      { id: 2, code: "VK0011", description: "Bus Bar Copper 100A",         hsn: "7407", qty: 50, unit: "Mtr", rate: 1200, disc: 0, gstPct: 18 },
    ],
  },
  {
    invoiceNo: "VSG/2025/0056", date: "2025-04-18", party: "KPTCL",
    gstin: "29AAACK2345E1ZX", address: "Kaveri Bhavan, Bangalore", placeOfSupply: "Karnataka",
    status: "Draft",
    items: [
      { id: 1, code: "VK0001", description: "LT Switchgear Panel 400A",   hsn: "8537", qty: 5, unit: "Nos", rate: 145000, disc: 2, gstPct: 18 },
    ],
  },
];

// ── HSN Suggestions ────────────────────────────────────────────
const PRODUCT_SUGGESTIONS = [
  { code: "VK0001", description: "LT Switchgear Panel 400A",    hsn: "8537", unit: "Nos", rate: 145000, gstPct: 18 },
  { code: "VK0002", description: "LT Switchgear Panel 630A",    hsn: "8537", unit: "Nos", rate: 185000, gstPct: 18 },
  { code: "VK0003", description: "MCC Panel Standard",          hsn: "8537", unit: "Nos", rate: 220000, gstPct: 18 },
  { code: "VK0004", description: "Distribution Board 12-way",   hsn: "8537", unit: "Nos", rate: 28000,  gstPct: 18 },
  { code: "VK0005", description: "Distribution Board 24-way",   hsn: "8537", unit: "Nos", rate: 45000,  gstPct: 18 },
  { code: "VK0006", description: "MCCB 63A (3P)",               hsn: "8536", unit: "Nos", rate: 2800,   gstPct: 18 },
  { code: "VK0007", description: "MCCB 100A (3P)",              hsn: "8536", unit: "Nos", rate: 4200,   gstPct: 18 },
  { code: "VK0008", description: "MCCB 250A (3P)",              hsn: "8536", unit: "Nos", rate: 8500,   gstPct: 18 },
  { code: "VK0009", description: "MCB 16A (1P)",                hsn: "8536", unit: "Nos", rate: 380,    gstPct: 18 },
  { code: "VK0010", description: "MCB 32A (1P)",                hsn: "8536", unit: "Nos", rate: 520,    gstPct: 18 },
  { code: "VK0011", description: "Bus Bar Copper 100A",         hsn: "7407", unit: "Mtr", rate: 1200,   gstPct: 18 },
  { code: "VK0012", description: "Bus Bar Copper 250A",         hsn: "7407", unit: "Mtr", rate: 2800,   gstPct: 18 },
];

// ── Calcs ──────────────────────────────────────────────────────
function calcItem(item: BillItem) {
  const taxable = item.qty * item.rate * (1 - item.disc / 100);
  const gst = taxable * (item.gstPct / 100);
  return { taxable, gst, total: taxable + gst };
}

function calcTotals(items: BillItem[]) {
  return items.reduce(
    (acc, item) => {
      const c = calcItem(item);
      return { taxable: acc.taxable + c.taxable, gst: acc.gst + c.gst, total: acc.total + c.total };
    },
    { taxable: 0, gst: 0, total: 0 }
  );
}

// ── Item Row ───────────────────────────────────────────────────
const ItemRow: React.FC<{
  item: BillItem;
  onChange: (item: BillItem) => void;
  onDelete: () => void;
}> = ({ item, onChange, onDelete }) => {
  const [showSuggest, setShowSuggest] = useState(false);
  const [codeQuery, setCodeQuery] = useState(item.code);
  const c = calcItem(item);

  const suggestions = PRODUCT_SUGGESTIONS.filter(p =>
    p.code.toLowerCase().includes(codeQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(codeQuery.toLowerCase())
  );

  const pick = (p: typeof PRODUCT_SUGGESTIONS[0]) => {
    onChange({ ...item, code: p.code, description: p.description, hsn: p.hsn, unit: p.unit, rate: p.rate, gstPct: p.gstPct });
    setCodeQuery(p.code);
    setShowSuggest(false);
  };

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700">
      {/* Code */}
      <td className="px-2 py-1.5 relative">
        <input
          className="input text-xs w-24"
          value={codeQuery}
          onChange={e => { setCodeQuery(e.target.value); setShowSuggest(true); onChange({ ...item, code: e.target.value }); }}
          onFocus={() => setShowSuggest(true)}
          onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
          placeholder="VK0001"
        />
        {showSuggest && suggestions.length > 0 && (
          <div className="absolute top-10 left-0 z-50 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
            {suggestions.map(p => (
              <button key={p.code} onMouseDown={() => pick(p)} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700">
                <p className="text-xs font-semibold text-venkat-navy dark:text-blue-300">{p.code}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{p.description}</p>
              </button>
            ))}
          </div>
        )}
      </td>
      {/* Description */}
      <td className="px-2 py-1.5">
        <input className="input text-xs w-full min-w-40" value={item.description}
          onChange={e => onChange({ ...item, description: e.target.value })} />
      </td>
      {/* HSN */}
      <td className="px-2 py-1.5">
        <input className="input text-xs w-20" value={item.hsn}
          onChange={e => onChange({ ...item, hsn: e.target.value })} />
      </td>
      {/* Qty */}
      <td className="px-2 py-1.5">
        <input type="number" className="input text-xs w-16 text-right" value={item.qty}
          onChange={e => onChange({ ...item, qty: +e.target.value })} />
      </td>
      {/* Unit */}
      <td className="px-2 py-1.5">
        <select className="select text-xs w-16" value={item.unit}
          onChange={e => onChange({ ...item, unit: e.target.value })}>
          {["Nos", "Mtr", "Kg", "Set", "Lot"].map(u => <option key={u}>{u}</option>)}
        </select>
      </td>
      {/* Rate */}
      <td className="px-2 py-1.5">
        <input type="number" className="input text-xs w-24 text-right" value={item.rate}
          onChange={e => onChange({ ...item, rate: +e.target.value })} />
      </td>
      {/* Disc% */}
      <td className="px-2 py-1.5">
        <input type="number" className="input text-xs w-14 text-right" value={item.disc}
          onChange={e => onChange({ ...item, disc: +e.target.value })} />
      </td>
      {/* GST% */}
      <td className="px-2 py-1.5">
        <select className="select text-xs w-16" value={item.gstPct}
          onChange={e => onChange({ ...item, gstPct: +e.target.value })}>
          {[5, 12, 18, 28].map(g => <option key={g} value={g}>{g}%</option>)}
        </select>
      </td>
      {/* Taxable */}
      <td className="px-2 py-1.5 text-right text-xs text-slate-700 dark:text-slate-300 w-28">
        {formatCurrency(c.taxable, true)}
      </td>
      {/* GST Amt */}
      <td className="px-2 py-1.5 text-right text-xs text-slate-500 dark:text-slate-400 w-24">
        {formatCurrency(c.gst, true)}
      </td>
      {/* Total */}
      <td className="px-2 py-1.5 text-right text-xs font-semibold text-slate-800 dark:text-slate-100 w-28">
        {formatCurrency(c.total, true)}
      </td>
      {/* Del */}
      <td className="px-2 py-1.5 text-center">
        <button onClick={onDelete} className="text-red-400 hover:text-red-600">
          <Trash2 size={13} />
        </button>
      </td>
    </tr>
  );
};

// ── Invoice Print View ─────────────────────────────────────────
const PrintView: React.FC<{ invoice: Invoice; onClose: () => void }> = ({ invoice, onClose }) => {
  const totals = calcTotals(invoice.items);
  const cgst = totals.gst / 2;
  const sgst = totals.gst / 2;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 print:hidden">
          <p className="font-bold text-slate-800">Invoice Preview</p>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn-primary"><Printer size={14} /> Print</button>
            <button onClick={onClose} className="btn-secondary">Close</button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-8 font-sans text-sm">
          {/* Company header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xl font-black text-venkat-navy">{COMPANY.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{COMPANY.tagline}</p>
              <p className="text-xs text-slate-500 mt-1">{COMPANY.unit1.address}</p>
              <p className="text-xs text-slate-500">GSTIN: {COMPANY.gstin}</p>
              <p className="text-xs text-slate-500">Ph: {COMPANY.phone[0]} | {COMPANY.email.projects}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-venkat-orange">TAX INVOICE</p>
              <p className="text-sm font-semibold mt-1">{invoice.invoiceNo}</p>
              <p className="text-xs text-slate-500">{new Date(invoice.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Bill To</p>
              <p className="font-semibold text-slate-800">{invoice.party}</p>
              <p className="text-xs text-slate-600">{invoice.address}</p>
              <p className="text-xs text-slate-500">GSTIN: {invoice.gstin}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Place of Supply</p>
              <p className="text-sm text-slate-700">{invoice.placeOfSupply}</p>
            </div>
          </div>

          {/* Items */}
          <table className="w-full text-xs mb-4">
            <thead>
              <tr className="bg-venkat-navy text-white">
                <th className="px-2 py-2 text-left">#</th>
                <th className="px-2 py-2 text-left">Code</th>
                <th className="px-2 py-2 text-left">Description</th>
                <th className="px-2 py-2 text-center">HSN</th>
                <th className="px-2 py-2 text-right">Qty</th>
                <th className="px-2 py-2 text-center">Unit</th>
                <th className="px-2 py-2 text-right">Rate</th>
                <th className="px-2 py-2 text-right">Disc%</th>
                <th className="px-2 py-2 text-right">Taxable</th>
                <th className="px-2 py-2 text-right">GST%</th>
                <th className="px-2 py-2 text-right">GST Amt</th>
                <th className="px-2 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => {
                const c = calcItem(item);
                return (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-2 py-1.5">{i + 1}</td>
                    <td className="px-2 py-1.5 font-mono font-semibold text-venkat-navy">{item.code}</td>
                    <td className="px-2 py-1.5">{item.description}</td>
                    <td className="px-2 py-1.5 text-center">{item.hsn}</td>
                    <td className="px-2 py-1.5 text-right">{item.qty}</td>
                    <td className="px-2 py-1.5 text-center">{item.unit}</td>
                    <td className="px-2 py-1.5 text-right">{formatCurrency(item.rate, true)}</td>
                    <td className="px-2 py-1.5 text-right">{item.disc}%</td>
                    <td className="px-2 py-1.5 text-right">{formatCurrency(c.taxable, true)}</td>
                    <td className="px-2 py-1.5 text-right">{item.gstPct}%</td>
                    <td className="px-2 py-1.5 text-right">{formatCurrency(c.gst, true)}</td>
                    <td className="px-2 py-1.5 text-right font-semibold">{formatCurrency(c.total, true)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-500">Taxable Amount</span><span className="font-medium">{formatCurrency(totals.taxable)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">CGST (9%)</span><span>{formatCurrency(cgst)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">SGST (9%)</span><span>{formatCurrency(sgst)}</span></div>
              <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-black">
                <span>Total Amount</span><span className="text-venkat-orange">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-slate-400 border-t pt-3">
            <p>Terms: Payment due within 30 days · Subject to Bangalore jurisdiction</p>
            <p className="mt-1">This is a computer generated invoice · {COMPANY.name} · {COMPANY.website}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Billing Page ──────────────────────────────────────────
export default function Billing() {
  const { can } = useAuth();
  const [tab, setTab] = useState<"new" | "list">("new");
  const [showPrint, setShowPrint] = useState<Invoice | null>(null);
  const [saved, setSaved] = useState(false);

  // Form state
  const [party, setParty] = useState("");
  const [gstin, setGstin] = useState("");
  const [address, setAddress] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState("Karnataka");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<BillItem[]>([
    { id: 1, code: "", description: "", hsn: "", qty: 1, unit: "Nos", rate: 0, disc: 0, gstPct: 18 },
  ]);

  const nextInvoiceNo = "VSG/2025/0059";
  const totals = calcTotals(items);

  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now(), code: "", description: "", hsn: "", qty: 1, unit: "Nos", rate: 0, disc: 0, gstPct: 18 }]);
  };

  const updateItem = (id: number, updated: BillItem) => {
    setItems(prev => prev.map(i => i.id === id ? updated : i));
  };

  const deleteItem = (id: number) => {
    if (items.length > 1) setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const currentInvoice: Invoice = {
    invoiceNo: nextInvoiceNo, date: invoiceDate,
    party, gstin, address, placeOfSupply, items, status: "Draft",
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Billing — Tax Invoice</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Create and manage GST invoices — Tally-style</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("new")}
            className={`btn-secondary ${tab === "new" ? "!bg-venkat-navy !text-white" : ""}`}
          >
            <Plus size={14} /> New Invoice
          </button>
          <button
            onClick={() => setTab("list")}
            className={`btn-secondary ${tab === "list" ? "!bg-venkat-navy !text-white" : ""}`}
          >
            <FileText size={14} /> Invoice List
          </button>
        </div>
      </div>

      {/* Invoice List Tab */}
      {tab === "list" && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-white">Recent Invoices</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-8 w-48" placeholder="Search invoice..." />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="th">Invoice No</th>
                  <th className="th">Date</th>
                  <th className="th">Party</th>
                  <th className="th text-right">Amount</th>
                  <th className="th text-center">Status</th>
                  <th className="th text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => {
                  const t = calcTotals(inv.items);
                  return (
                    <tr key={inv.invoiceNo} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                      <td className="td font-mono font-semibold text-venkat-navy dark:text-blue-300 text-sm">{inv.invoiceNo}</td>
                      <td className="td text-sm text-slate-600 dark:text-slate-300">
                        {new Date(inv.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="td font-medium text-slate-800 dark:text-slate-100">{inv.party}</td>
                      <td className="td text-right font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(t.total)}</td>
                      <td className="td text-center">
                        <span className={inv.status === "Sent" ? "badge-green" : inv.status === "Saved" ? "badge-blue" : "badge-amber"}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="td text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setShowPrint(inv)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-venkat-navy transition-colors" title="Preview">
                            <Eye size={13} />
                          </button>
                          <button onClick={() => setShowPrint(inv)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-venkat-orange transition-colors" title="Print">
                            <Printer size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Invoice Tab */}
      {tab === "new" && (
        <div className="space-y-4">
          {/* Invoice meta */}
          <div className="card p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Invoice No</label>
                <input className="input font-mono font-semibold bg-slate-50 dark:bg-slate-700/50" value={nextInvoiceNo} readOnly />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Invoice Date</label>
                <input type="date" className="input" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Place of Supply</label>
                <select className="select w-full" value={placeOfSupply} onChange={e => setPlaceOfSupply(e.target.value)}>
                  {["Karnataka","Tamil Nadu","Maharashtra","Delhi","Andhra Pradesh","Telangana","Kerala","Gujarat"].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Unit</label>
                <select className="select w-full">
                  <option>Unit 1 — 3rd Phase, Peenya</option>
                  <option>Unit 2 — 4th Phase, Peenya</option>
                </select>
              </div>
            </div>

            {/* Party */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Party Name *</label>
                <input className="input" placeholder="Customer / Company name" value={party} onChange={e => setParty(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">GSTIN</label>
                <input className="input font-mono" placeholder="29XXXXXXXXXX1ZX" value={gstin} onChange={e => setGstin(e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Billing Address</label>
                <input className="input" placeholder="Full address with city & pin" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-800 dark:text-white">Item Details</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Type product code (VK0001) to auto-fill</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-xs">
                    <th className="px-2 py-2 text-left font-semibold text-slate-600 dark:text-slate-300 rounded-tl-lg">Code</th>
                    <th className="px-2 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Description</th>
                    <th className="px-2 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">HSN</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Qty</th>
                    <th className="px-2 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Unit</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Rate (₹)</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Disc%</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">GST%</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Taxable</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">GST Amt</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300 rounded-tr-lg">Total</th>
                    <th className="px-2 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onChange={updated => updateItem(item.id, updated)}
                      onDelete={() => deleteItem(item.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={addItem} className="mt-3 btn-secondary text-xs">
              <Plus size={13} /> Add Item
            </button>

            {/* Totals */}
            <div className="mt-4 flex justify-end">
              <div className="w-64 bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Taxable Amount</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{formatCurrency(totals.taxable)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">CGST</span>
                  <span className="text-slate-600 dark:text-slate-300">{formatCurrency(totals.gst / 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">SGST</span>
                  <span className="text-slate-600 dark:text-slate-300">{formatCurrency(totals.gst / 2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-600 pt-2">
                  <span className="font-bold text-slate-800 dark:text-white">Grand Total</span>
                  <span className="font-bold text-lg text-venkat-orange">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <button className="btn-secondary">Clear</button>
            <div className="flex gap-2">
              <button onClick={() => setShowPrint(currentInvoice)} className="btn-secondary">
                <Printer size={14} /> Preview & Print
              </button>
              <button onClick={handleSave} className="btn-primary">
                {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Invoice</>}
              </button>
              <button className="btn-primary !bg-green-600 hover:!bg-green-700">
                <Send size={14} /> Save & Email
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrint && <PrintView invoice={showPrint} onClose={() => setShowPrint(null)} />}
    </div>
  );
}
