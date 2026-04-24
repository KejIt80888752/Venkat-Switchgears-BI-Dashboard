import React, { useState } from "react";
import {
  Plus, Trash2, Printer, Save, Send, Search,
  CheckCircle, FileText, Eye, ArrowRight, Clock,
} from "lucide-react";
import { COMPANY, formatCurrency } from "@/data/mockData";

// ── Types ─────────────────────────────────────────────────────
interface QuoteItem {
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

interface Quotation {
  quoteNo: string;
  date: string;
  validTill: string;
  party: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  reference: string;
  items: QuoteItem[];
  terms: string;
  status: "Draft" | "Sent" | "Converted" | "Expired";
}

// ── Mock Quotations ────────────────────────────────────────────
const recentQuotations: Quotation[] = [
  {
    quoteNo: "VSG/QT/2025/042", date: "2025-04-20", validTill: "2025-05-20",
    party: "BMRCL Phase-III", contactPerson: "Suresh K", phone: "+91 98765 43210",
    email: "suresh@bmrcl.com", gstin: "29AAACB1234C1ZX",
    address: "BMRCL Office, MG Road, Bangalore", reference: "Tender Ref: BMRCL/2025/T-048",
    status: "Sent",
    terms: "• Prices valid for 30 days\n• Delivery: 8-10 weeks from order\n• Payment: 30% advance, balance on delivery\n• GST extra as applicable",
    items: [
      { id: 1, code: "VK0001", description: "LT Switchgear Panel 400A",  hsn: "8537", qty: 8,  unit: "Nos", rate: 145000, disc: 5, gstPct: 18 },
      { id: 2, code: "VK0003", description: "MCC Panel Standard",         hsn: "8537", qty: 4,  unit: "Nos", rate: 220000, disc: 5, gstPct: 18 },
      { id: 3, code: "VK0011", description: "Bus Bar Copper 100A",        hsn: "7407", qty: 120, unit: "Mtr", rate: 1200, disc: 0, gstPct: 18 },
    ],
  },
  {
    quoteNo: "VSG/QT/2025/041", date: "2025-04-15", validTill: "2025-05-15",
    party: "Prestige Group", contactPerson: "Anil Nair", phone: "+91 87654 32109",
    email: "anil@prestigegroup.com", gstin: "29AAACB5678D1ZX",
    address: "Prestige Shantiniketan, Whitefield, Bangalore", reference: "Email enquiry 15-Apr-2025",
    status: "Converted",
    terms: "• Prices valid for 30 days\n• Installation charges extra\n• AMC available at 1.5% of project value",
    items: [
      { id: 1, code: "VK0004", description: "Distribution Board 12-way", hsn: "8537", qty: 20, unit: "Nos", rate: 28000, disc: 10, gstPct: 18 },
      { id: 2, code: "VK0005", description: "Distribution Board 24-way", hsn: "8537", qty: 8,  unit: "Nos", rate: 45000, disc: 10, gstPct: 18 },
    ],
  },
  {
    quoteNo: "VSG/QT/2025/040", date: "2025-04-10", validTill: "2025-04-24",
    party: "Wipro SEZ, Sarjapur", contactPerson: "Ramesh S", phone: "+91 76543 21098",
    email: "ramesh@wipro.com", gstin: "29AAACW4567E1ZX",
    address: "Wipro SEZ, Sarjapur Rd, Bangalore", reference: "Site visit ref: WIP/2025/0220",
    status: "Expired",
    terms: "• Prices valid for 14 days\n• Supply only (no installation)\n• IGST applicable for interstate supply",
    items: [
      { id: 1, code: "VK0006", description: "MCCB 63A (3P)",  hsn: "8536", qty: 50, unit: "Nos", rate: 2800, disc: 8, gstPct: 18 },
      { id: 2, code: "VK0007", description: "MCCB 100A (3P)", hsn: "8536", qty: 30, unit: "Nos", rate: 4200, disc: 8, gstPct: 18 },
    ],
  },
];

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

function calcItem(item: QuoteItem) {
  const taxable = item.qty * item.rate * (1 - item.disc / 100);
  const gst = taxable * (item.gstPct / 100);
  return { taxable, gst, total: taxable + gst };
}

function calcTotals(items: QuoteItem[]) {
  return items.reduce(
    (acc, item) => { const c = calcItem(item); return { taxable: acc.taxable + c.taxable, gst: acc.gst + c.gst, total: acc.total + c.total }; },
    { taxable: 0, gst: 0, total: 0 }
  );
}

// ── Item Row ───────────────────────────────────────────────────
const ItemRow: React.FC<{ item: QuoteItem; onChange: (i: QuoteItem) => void; onDelete: () => void }> = ({ item, onChange, onDelete }) => {
  const [showSuggest, setShowSuggest] = useState(false);
  const [codeQuery, setCodeQuery] = useState(item.code);
  const c = calcItem(item);
  const suggestions = PRODUCT_SUGGESTIONS.filter(p =>
    p.code.toLowerCase().includes(codeQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(codeQuery.toLowerCase())
  );
  const pick = (p: typeof PRODUCT_SUGGESTIONS[0]) => {
    onChange({ ...item, code: p.code, description: p.description, hsn: p.hsn, unit: p.unit, rate: p.rate, gstPct: p.gstPct });
    setCodeQuery(p.code); setShowSuggest(false);
  };
  return (
    <tr className="border-b border-slate-200 dark:border-slate-700">
      <td className="px-2 py-1.5 relative">
        <input className="input text-xs w-24" value={codeQuery}
          onChange={e => { setCodeQuery(e.target.value); setShowSuggest(true); onChange({ ...item, code: e.target.value }); }}
          onFocus={() => setShowSuggest(true)} onBlur={() => setTimeout(() => setShowSuggest(false), 150)} placeholder="VK0001" />
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
      <td className="px-2 py-1.5"><input className="input text-xs w-full min-w-40" value={item.description} onChange={e => onChange({ ...item, description: e.target.value })} /></td>
      <td className="px-2 py-1.5"><input className="input text-xs w-20" value={item.hsn} onChange={e => onChange({ ...item, hsn: e.target.value })} /></td>
      <td className="px-2 py-1.5"><input type="number" className="input text-xs w-16 text-right" value={item.qty} onChange={e => onChange({ ...item, qty: +e.target.value })} /></td>
      <td className="px-2 py-1.5">
        <select className="select text-xs w-16" value={item.unit} onChange={e => onChange({ ...item, unit: e.target.value })}>
          {["Nos","Mtr","Kg","Set","Lot"].map(u => <option key={u}>{u}</option>)}
        </select>
      </td>
      <td className="px-2 py-1.5"><input type="number" className="input text-xs w-24 text-right" value={item.rate} onChange={e => onChange({ ...item, rate: +e.target.value })} /></td>
      <td className="px-2 py-1.5"><input type="number" className="input text-xs w-14 text-right" value={item.disc} onChange={e => onChange({ ...item, disc: +e.target.value })} /></td>
      <td className="px-2 py-1.5">
        <select className="select text-xs w-16" value={item.gstPct} onChange={e => onChange({ ...item, gstPct: +e.target.value })}>
          {[5,12,18,28].map(g => <option key={g} value={g}>{g}%</option>)}
        </select>
      </td>
      <td className="px-2 py-1.5 text-right text-xs text-slate-700 dark:text-slate-300 w-28">{formatCurrency(c.taxable, true)}</td>
      <td className="px-2 py-1.5 text-right text-xs font-semibold text-slate-800 dark:text-slate-100 w-28">{formatCurrency(c.total, true)}</td>
      <td className="px-2 py-1.5 text-center">
        <button onClick={onDelete} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
      </td>
    </tr>
  );
};

// ── Print View ─────────────────────────────────────────────────
const PrintView: React.FC<{ quote: Quotation; onClose: () => void }> = ({ quote, onClose }) => {
  const totals = calcTotals(quote.items);
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 print:hidden">
          <p className="font-bold text-slate-800">Quotation Preview</p>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn-primary"><Printer size={14} /> Print</button>
            <button onClick={onClose} className="btn-secondary">Close</button>
          </div>
        </div>
        <div className="p-8 font-sans text-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xl font-black text-venkat-navy">{COMPANY.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{COMPANY.tagline}</p>
              <p className="text-xs text-slate-500 mt-1">{COMPANY.unit1.address}</p>
              <p className="text-xs text-slate-500">GSTIN: {COMPANY.gstin} | Ph: {COMPANY.phone[0]}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-venkat-orange">QUOTATION</p>
              <p className="text-sm font-semibold mt-1">{quote.quoteNo}</p>
              <p className="text-xs text-slate-500">Date: {new Date(quote.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
              <p className="text-xs text-red-500 font-medium">Valid Till: {new Date(quote.validTill).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">To</p>
              <p className="font-semibold text-slate-800">{quote.party}</p>
              <p className="text-xs text-slate-600">{quote.contactPerson} · {quote.phone}</p>
              <p className="text-xs text-slate-500">{quote.address}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Reference</p>
              <p className="text-xs text-slate-700">{quote.reference}</p>
            </div>
          </div>

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
                <th className="px-2 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, i) => {
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
                    <td className="px-2 py-1.5 text-right font-semibold">{formatCurrency(c.total, true)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-between items-start">
            <div className="w-56 text-xs">
              <p className="font-bold text-slate-700 mb-1">Terms & Conditions</p>
              <pre className="text-slate-500 whitespace-pre-wrap font-sans leading-relaxed">{quote.terms}</pre>
            </div>
            <div className="w-56 text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-500">Taxable Amount</span><span className="font-medium">{formatCurrency(totals.taxable)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">GST Amount</span><span>{formatCurrency(totals.gst)}</span></div>
              <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-black">
                <span>Quote Value</span><span className="text-venkat-orange">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-slate-400 border-t pt-3">
            <p>For {COMPANY.name} · {COMPANY.phone[0]} · {COMPANY.email.projects}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const statusColor: Record<Quotation["status"], string> = {
  Draft: "badge-amber", Sent: "badge-blue", Converted: "badge-green", Expired: "badge-red",
};

// ── Main Quotation Page ────────────────────────────────────────
export default function QuotationPage() {
  const [tab, setTab] = useState<"new" | "list">("new");
  const [showPrint, setShowPrint] = useState<Quotation | null>(null);
  const [saved, setSaved] = useState(false);

  // Today + 30 days for valid till
  const today = new Date().toISOString().split("T")[0];
  const validDefault = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [party, setParty] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gstin, setGstin] = useState("");
  const [address, setAddress] = useState("");
  const [reference, setReference] = useState("");
  const [quoteDate, setQuoteDate] = useState(today);
  const [validTill, setValidTill] = useState(validDefault);
  const [terms, setTerms] = useState("• Prices valid for 30 days\n• Delivery: 8-10 weeks from order\n• Payment: 30% advance, balance on delivery\n• GST extra as applicable\n• Subject to Bangalore jurisdiction");
  const [items, setItems] = useState<QuoteItem[]>([
    { id: 1, code: "", description: "", hsn: "", qty: 1, unit: "Nos", rate: 0, disc: 0, gstPct: 18 },
  ]);

  const totals = calcTotals(items);
  const nextQuoteNo = "VSG/QT/2025/043";

  const addItem = () => setItems(prev => [...prev, { id: Date.now(), code: "", description: "", hsn: "", qty: 1, unit: "Nos", rate: 0, disc: 0, gstPct: 18 }]);
  const updateItem = (id: number, updated: QuoteItem) => setItems(prev => prev.map(i => i.id === id ? updated : i));
  const deleteItem = (id: number) => { if (items.length > 1) setItems(prev => prev.filter(i => i.id !== id)); };

  const currentQuote: Quotation = {
    quoteNo: nextQuoteNo, date: quoteDate, validTill, party, contactPerson, phone, email,
    gstin, address, reference, items, terms, status: "Draft",
  };

  const daysLeft = Math.ceil((new Date(validTill).getTime() - Date.now()) / 86400000);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Quotation / Estimate</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Create professional quotations — convert to invoice in one click</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab("new")} className={`btn-secondary ${tab === "new" ? "!bg-venkat-navy !text-white" : ""}`}>
            <Plus size={14} /> New Quotation
          </button>
          <button onClick={() => setTab("list")} className={`btn-secondary ${tab === "list" ? "!bg-venkat-navy !text-white" : ""}`}>
            <FileText size={14} /> Quotation List
          </button>
        </div>
      </div>

      {/* List Tab */}
      {tab === "list" && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-white">Recent Quotations</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-8 w-48" placeholder="Search quotation..." />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="th">Quote No</th>
                  <th className="th">Date</th>
                  <th className="th">Party</th>
                  <th className="th">Valid Till</th>
                  <th className="th text-right">Value</th>
                  <th className="th text-center">Status</th>
                  <th className="th text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotations.map((q) => {
                  const t = calcTotals(q.items);
                  const days = Math.ceil((new Date(q.validTill).getTime() - Date.now()) / 86400000);
                  return (
                    <tr key={q.quoteNo} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                      <td className="td font-mono font-semibold text-venkat-navy dark:text-blue-300 text-sm">{q.quoteNo}</td>
                      <td className="td text-sm text-slate-600 dark:text-slate-300">
                        {new Date(q.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="td">
                        <p className="font-medium text-slate-800 dark:text-slate-100">{q.party}</p>
                        <p className="text-xs text-slate-400">{q.contactPerson}</p>
                      </td>
                      <td className="td">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className={days < 0 ? "text-red-400" : days < 7 ? "text-amber-500" : "text-slate-400"} />
                          <span className={`text-xs ${days < 0 ? "text-red-500" : days < 7 ? "text-amber-600" : "text-slate-500 dark:text-slate-400"}`}>
                            {days < 0 ? "Expired" : `${days} days left`}
                          </span>
                        </div>
                      </td>
                      <td className="td text-right font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(t.total)}</td>
                      <td className="td text-center">
                        <span className={statusColor[q.status]}>{q.status}</span>
                      </td>
                      <td className="td text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => setShowPrint(q)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-venkat-navy transition-colors" title="Preview">
                            <Eye size={13} />
                          </button>
                          <button onClick={() => setShowPrint(q)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-venkat-orange transition-colors" title="Print">
                            <Printer size={13} />
                          </button>
                          {q.status !== "Converted" && (
                            <button className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 transition-colors" title="Convert to Invoice">
                              <ArrowRight size={13} />
                            </button>
                          )}
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

      {/* New Quote Tab */}
      {tab === "new" && (
        <div className="space-y-4">
          {/* Meta */}
          <div className="card p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Quote No</label>
                <input className="input font-mono font-semibold bg-slate-50 dark:bg-slate-700/50" value={nextQuoteNo} readOnly />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Date</label>
                <input type="date" className="input" value={quoteDate} onChange={e => setQuoteDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Valid Till {daysLeft > 0 && <span className="text-amber-500 ml-1">({daysLeft} days)</span>}
                </label>
                <input type="date" className="input" value={validTill} onChange={e => setValidTill(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Reference</label>
                <input className="input" placeholder="Email ref / Site visit / Tender no" value={reference} onChange={e => setReference(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Party / Company *</label>
                <input className="input" placeholder="Customer name" value={party} onChange={e => setParty(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Contact Person</label>
                <input className="input" placeholder="Name" value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Phone</label>
                <input className="input" placeholder="+91" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Email</label>
                <input className="input" placeholder="email@company.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">GSTIN</label>
                <input className="input font-mono" placeholder="29XXXXXXXX1ZX" value={gstin} onChange={e => setGstin(e.target.value.toUpperCase())} />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-800 dark:text-white">Item Details</h2>
              <p className="text-xs text-slate-400">Type product code (VK0001) to auto-fill</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-xs">
                    <th className="px-2 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Code</th>
                    <th className="px-2 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Description</th>
                    <th className="px-2 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">HSN</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Qty</th>
                    <th className="px-2 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Unit</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Rate (₹)</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Disc%</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">GST%</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Taxable</th>
                    <th className="px-2 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Total</th>
                    <th className="px-2 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <ItemRow key={item.id} item={item} onChange={updated => updateItem(item.id, updated)} onDelete={() => deleteItem(item.id)} />
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addItem} className="mt-3 btn-secondary text-xs"><Plus size={13} /> Add Item</button>

            <div className="mt-4 flex justify-end">
              <div className="w-64 bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Taxable Amount</span><span className="font-medium text-slate-700 dark:text-slate-200">{formatCurrency(totals.taxable)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">GST Amount</span><span className="text-slate-600 dark:text-slate-300">{formatCurrency(totals.gst)}</span></div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-600 pt-2">
                  <span className="font-bold text-slate-800 dark:text-white">Quote Value</span>
                  <span className="font-bold text-lg text-venkat-orange">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="card p-5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Terms & Conditions</label>
            <textarea className="input h-28 resize-none w-full font-mono text-xs" value={terms} onChange={e => setTerms(e.target.value)} />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button className="btn-secondary">Clear</button>
            <div className="flex gap-2">
              <button onClick={() => setShowPrint(currentQuote)} className="btn-secondary"><Printer size={14} /> Preview & Print</button>
              <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }} className="btn-primary">
                {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Quotation</>}
              </button>
              <button className="btn-primary !bg-green-600 hover:!bg-green-700"><Send size={14} /> Save & Email to Client</button>
            </div>
          </div>
        </div>
      )}

      {showPrint && <PrintView quote={showPrint} onClose={() => setShowPrint(null)} />}
    </div>
  );
}
