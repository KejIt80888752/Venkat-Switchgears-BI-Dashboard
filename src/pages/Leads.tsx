import React, { useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Plus, Search, Send, Mail, MessageSquare,
  Globe, Instagram, Phone, User, Building2,
  CheckCircle, Clock, TrendingUp, Download, Eye, X,
  Zap, RefreshCw, FileText,
} from "lucide-react";
import {
  leadsData, leadSourceColors, leadStatusColors,
  WELCOME_EMAIL_TEMPLATE, WELCOME_WHATSAPP_TEMPLATE,
  formatCurrency, Lead, LeadSource, LeadStatus, COMPANY,
} from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

// ── Source Icon ───────────────────────────────────────────────
const SourceIcon: React.FC<{ source: LeadSource; size?: number }> = ({ source, size = 14 }) => {
  const icons: Record<LeadSource, React.ReactNode> = {
    Website:   <Globe size={size} />,
    Instagram: <Instagram size={size} />,
    WhatsApp:  <MessageSquare size={size} />,
    Manual:    <User size={size} />,
    Referral:  <TrendingUp size={size} />,
  };
  return <span style={{ color: leadSourceColors[source] }}>{icons[source]}</span>;
};

// ── Notification Preview Modal ─────────────────────────────────
const NotificationModal: React.FC<{
  lead: Lead; onClose: () => void;
}> = ({ lead, onClose }) => {
  const [tab, setTab] = useState<"email" | "whatsapp">("email");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<"email" | "whatsapp" | null>(null);

  const email = WELCOME_EMAIL_TEMPLATE
    .replace(/{name}/g, lead.name)
    .replace(/{product}/g, lead.productInterest)
    .replace(/{leadId}/g, lead.id);

  const whatsapp = WELCOME_WHATSAPP_TEMPLATE
    .replace(/{name}/g, lead.name)
    .replace(/{product}/g, lead.productInterest)
    .replace(/{leadId}/g, lead.id);

  const handleSend = async (type: "email" | "whatsapp") => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate API
    setSending(false);
    setSent(type);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Send Welcome Notification</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{lead.name} · {lead.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-700/50 m-4 rounded-lg p-1">
          {(["email","whatsapp"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white dark:bg-slate-600 shadow-sm" : "text-slate-500"}`}
            >
              {t === "email" ? <Mail size={14} /> : <MessageSquare size={14} />}
              {t === "email" ? "Email" : "WhatsApp"}
              {(t === "email" && lead.emailSent) || (t === "whatsapp" && lead.whatsappSent)
                ? <CheckCircle size={12} className="text-green-500" /> : null}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2 uppercase tracking-wide">
            Preview — {tab === "email" ? `To: ${lead.email}` : `To: ${lead.phone}`}
          </div>
          <div className={`rounded-xl p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300 ${tab === "email" ? "bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800" : "bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800"}`}>
            {tab === "email" ? email : whatsapp}
          </div>
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-400 font-medium">
              📋 Copy also sent to: {COMPANY.email.projects} {tab === "whatsapp" ? `& ${COMPANY.phone[0]}` : ""}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={() => handleSend(tab)}
            disabled={sending}
            className={`btn-primary ${tab === "whatsapp" ? "!bg-green-600 hover:!bg-green-700" : ""}`}
          >
            {sending ? <><RefreshCw size={14} className="animate-spin" /> Sending...</>
              : sent === tab ? <><CheckCircle size={14} /> Sent!</>
              : <><Send size={14} /> Send {tab === "email" ? "Email" : "WhatsApp"}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Add Lead Modal ─────────────────────────────────────────────
const AddLeadModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "", company: "", phone: "", email: "",
    source: "Website" as LeadSource,
    productInterest: "", message: "",
    sendEmail: true, sendWhatsApp: true,
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white">Add New Lead / Enquiry</h3>
          <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
              <input className="input" placeholder="Enquiry person name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
              <input className="input" placeholder="Company name" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Phone *</label>
              <input className="input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input type="email" className="input" placeholder="email@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Lead Source</label>
              <select className="select w-full" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value as LeadSource }))}>
                {(["Website","Instagram","WhatsApp","Manual","Referral"] as LeadSource[]).map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Product Interest</label>
              <input className="input" placeholder="e.g. LT Panel 400A" value={form.productInterest} onChange={e => setForm(f => ({ ...f, productInterest: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Enquiry Message</label>
            <textarea className="input h-20 resize-none" placeholder="Customer's requirement details..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
          </div>

          {/* Auto-notification toggles */}
          <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <Zap size={13} className="text-venkat-orange" /> Auto-send on Submit
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Welcome Email</p>
                  <p className="text-xs text-slate-400">To: {form.email || "customer"} + CC: {COMPANY.email.projects}</p>
                </div>
              </div>
              <button onClick={() => setForm(f => ({ ...f, sendEmail: !f.sendEmail }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.sendEmail ? "bg-venkat-orange" : "bg-slate-300 dark:bg-slate-600"}`}>
                <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left: form.sendEmail ? "22px" : "2px" }} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-green-600" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">WhatsApp Message</p>
                  <p className="text-xs text-slate-400">To: {form.phone || "customer"} + Copy: {COMPANY.phone[0]}</p>
                </div>
              </div>
              <button onClick={() => setForm(f => ({ ...f, sendWhatsApp: !f.sendWhatsApp }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.sendWhatsApp ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`}>
                <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left: form.sendWhatsApp ? "22px" : "2px" }} />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={onClose} className="btn-primary"><Plus size={14} /> Add Lead & Notify</button>
        </div>
      </div>
    </div>
  );
};

// ── Email Template Preview Modal ──────────────────────────────
const EmailTemplateModal: React.FC<{ lead: Lead; onClose: () => void }> = ({ lead, onClose }) => {
  const [tab, setTab] = useState<"welcome" | "reminder">("welcome");

  const welcomeBody = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <div style="background:#0D2B5E;padding:28px 32px;text-align:center">
        <img src="https://venkatswitchgears.com/wp-content/uploads/2021/08/logo_vsg-web.png" alt="VSG" style="height:48px;object-fit:contain;background:white;padding:6px;border-radius:8px" />
        <h1 style="color:white;margin:12px 0 4px;font-size:20px">Venkat Switchgears</h1>
        <p style="color:#E87722;margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase">Synergizing Power</p>
      </div>
      <div style="padding:32px">
        <p style="color:#1e293b;font-size:15px">Dear <strong>${lead.name}</strong>,</p>
        <p style="color:#475569;line-height:1.7">Thank you for reaching out to <strong>Venkat Switchgears</strong>! We have received your enquiry regarding <strong>${lead.productInterest}</strong> and our team will get back to you within <strong>24 hours</strong> with a detailed quote.</p>
        <div style="background:#f8fafc;border-left:4px solid #E87722;padding:12px 16px;margin:20px 0;border-radius:0 8px 8px 0">
          <p style="margin:0;color:#64748b;font-size:12px">Enquiry Reference</p>
          <p style="margin:4px 0 0;color:#0D2B5E;font-weight:bold;font-size:16px">${lead.id}</p>
        </div>
        <p style="color:#475569;line-height:1.7">Meanwhile, feel free to explore our product range:</p>
        <a href="https://venkatswitchgears.com" style="display:inline-block;background:#E87722;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:8px 0">Visit Website →</a>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
        <p style="color:#94a3b8;font-size:12px;margin:0">📞 +91 9448354274 / +91 9844021560<br/>📍 #150, 10th Main, 3rd Phase, Peenya Industrial Area, Bangalore – 560058</p>
      </div>
      <div style="background:#0D2B5E;padding:14px 32px;text-align:center">
        <p style="color:#8BAED6;font-size:11px;margin:0">© 2025 Venkat Switchgears Pvt Ltd · Synergizing Power</p>
      </div>
    </div>`;

  const reminderBody = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <div style="background:#0D2B5E;padding:28px 32px;text-align:center">
        <img src="https://venkatswitchgears.com/wp-content/uploads/2021/08/logo_vsg-web.png" alt="VSG" style="height:48px;object-fit:contain;background:white;padding:6px;border-radius:8px" />
        <h1 style="color:white;margin:12px 0 4px;font-size:20px">Following Up on Your Enquiry</h1>
        <p style="color:#E87722;margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase">1 Hour Reminder</p>
      </div>
      <div style="padding:32px">
        <p style="color:#1e293b;font-size:15px">Dear <strong>${lead.name}</strong>,</p>
        <p style="color:#475569;line-height:1.7">This is a quick follow-up on your enquiry for <strong>${lead.productInterest}</strong> (Ref: <strong>${lead.id}</strong>).</p>
        <p style="color:#475569;line-height:1.7">Our team is actively working on your requirement. You can expect a detailed response very soon. If you have any urgent queries, please don't hesitate to reach us directly.</p>
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px;margin:20px 0">
          <p style="margin:0;color:#9a3412;font-weight:bold;font-size:13px">⚡ Direct Contact</p>
          <p style="margin:8px 0 0;color:#c2410c;font-size:13px">📞 +91 9448354274 (Sales Team)</p>
          <p style="margin:4px 0 0;color:#c2410c;font-size:13px">📧 projects@venkatswitchgears.com</p>
        </div>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
        <p style="color:#94a3b8;font-size:12px;margin:0">📍 #150, 10th Main, 3rd Phase, Peenya Industrial Area, Bangalore – 560058</p>
      </div>
      <div style="background:#0D2B5E;padding:14px 32px;text-align:center">
        <p style="color:#8BAED6;font-size:11px;margin:0">© 2025 Venkat Switchgears Pvt Ltd · Synergizing Power</p>
      </div>
    </div>`;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Email Template Preview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{lead.name} · {lead.id}</p>
          </div>
          <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-slate-600" /></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-700/50 m-4 rounded-lg p-1">
          <button
            onClick={() => setTab("welcome")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${tab === "welcome" ? "bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white" : "text-slate-500"}`}
          >
            <Mail size={14} />
            Welcome Email
            {lead.emailSent && <CheckCircle size={12} className="text-green-500" />}
          </button>
          <button
            onClick={() => setTab("reminder")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${tab === "reminder" ? "bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white" : "text-slate-500"}`}
          >
            <Clock size={14} />
            1hr Reminder
            {lead.reminderSent && <CheckCircle size={12} className="text-green-500" />}
          </button>
        </div>

        {/* Status bar */}
        <div className={`mx-4 mb-3 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between ${
          (tab === "welcome" ? lead.emailSent : lead.reminderSent)
            ? "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800"
            : "bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800"
        }`}>
          <div className="flex items-center gap-2">
            {(tab === "welcome" ? lead.emailSent : lead.reminderSent)
              ? <CheckCircle size={13} className="text-green-500" />
              : <Clock size={13} className="text-amber-500" />}
            <span className={tab === "welcome"
              ? lead.emailSent ? "text-green-700 dark:text-green-400 font-medium" : "text-amber-700 dark:text-amber-400"
              : lead.reminderSent ? "text-green-700 dark:text-green-400 font-medium" : "text-amber-700 dark:text-amber-400"}>
              {tab === "welcome"
                ? lead.emailSent ? `Sent at ${new Date(lead.emailSentAt!).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · ${new Date(lead.emailSentAt!).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}` : "Not sent yet"
                : lead.reminderSent ? `Sent at ${new Date(lead.reminderSentAt!).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · ${new Date(lead.reminderSentAt!).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}` : "Pending — auto-sends 1hr after welcome email"}
            </span>
          </div>
          <span className="text-slate-400 dark:text-slate-500">To: {lead.email || "—"}</span>
        </div>

        {/* Email HTML Preview */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white">
            <iframe
              srcDoc={tab === "welcome" ? welcomeBody : reminderBody}
              className="w-full"
              style={{ height: 480, border: "none" }}
              title="Email Preview"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <span className="text-xs text-slate-400">Auto-sent via SendGrid · CC: projects@venkatswitchgears.com</span>
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────
export default function Leads() {
  const { can } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "All">("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState<Lead | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState<Lead | null>(null);

  const filtered = leadsData.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase())
      || l.company.toLowerCase().includes(search.toLowerCase())
      || l.phone.includes(search);
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const matchSource = sourceFilter === "All" || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  // KPIs
  const total      = leadsData.length;
  const newLeads   = leadsData.filter(l => l.status === "New").length;
  const won        = leadsData.filter(l => l.status === "Won").length;
  const convRate   = Math.round((won / total) * 100);
  const totalValue = leadsData.filter(l => l.status !== "Lost").reduce((s, l) => s + l.estimatedValue, 0);
  const notSent    = leadsData.filter(l => !l.emailSent || !l.whatsappSent).length;

  // Chart data
  const sourcePie = Object.entries(
    leadsData.reduce((acc, l) => ({ ...acc, [l.source]: (acc[l.source] || 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const statusBar = (["New","Contacted","Quoted","Won","Lost"] as LeadStatus[]).map(s => ({
    status: s,
    count: leadsData.filter(l => l.status === s).length,
  }));

  const statusBarColors: Record<LeadStatus, string> = {
    New: "#3B82F6", Contacted: "#0D2B5E", Quoted: "#F59E0B",
    Won: "#22C55E", Lost: "#EF4444",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Leads & Enquiries</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Website · Instagram · WhatsApp · Manual — All in one place
          </p>
        </div>
        <div className="flex gap-2">
          {can("export:reports") && <button className="btn-secondary"><Download size={14} /> Export</button>}
          {can("manage:leads") && (
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={15} /> Add Lead
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Leads",      value: total,                    sub: "All time",         color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/20"  },
          { label: "New (Pending)",    value: newLeads,                 sub: "Need follow-up",   color: "text-amber-600",                     bg: "bg-amber-50 dark:bg-amber-900/20"},
          { label: "Won / Converted",  value: won,                      sub: `${convRate}% rate`,color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20"},
          { label: "Pipeline Value",   value: formatCurrency(totalValue,true), sub: "Excl. lost", color: "text-venkat-navy dark:text-blue-300",bg: "bg-slate-50 dark:bg-slate-700/50"},
          { label: "Notif. Pending",   value: notSent,                  sub: "Email/WA not sent",color: "text-red-500",                       bg: "bg-red-50 dark:bg-red-900/20"    },
        ].map(k => (
          <div key={k.label} className={`card p-4 ${k.bg} border-0`}>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{k.label}</p>
            <p className={`text-xl font-bold mt-1 ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Notification pending banner */}
      {notSent > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-300 dark:border-amber-700 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
              <Send size={15} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                {notSent} lead{notSent > 1 ? "s" : ""} — welcome notification not sent yet
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-500">
                Click the <Send size={10} className="inline" /> icon on any lead row to send email + WhatsApp
              </p>
            </div>
          </div>
          <button className="btn-primary !bg-amber-600 hover:!bg-amber-700 flex-shrink-0">
            <Zap size={13} /> Send All
          </button>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Lead Source Breakdown</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={sourcePie} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={3}>
                  {sourcePie.map((e, i) => (
                    <Cell key={i} fill={leadSourceColors[e.name as LeadSource] || "#94A3B8"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {sourcePie.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: leadSourceColors[s.name as LeadSource] }} />
                    <span className="text-sm text-slate-600 dark:text-slate-300">{s.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Lead Pipeline — Status</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={statusBar} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="status" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" name="Leads" radius={[4, 4, 0, 0]}>
                {statusBar.map((e, i) => (
                  <Cell key={i} fill={statusBarColors[e.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters + Table */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8" placeholder="Search name, company, phone..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="select" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
            <option value="All">All Status</option>
            {(["New","Contacted","Quoted","Won","Lost"] as LeadStatus[]).map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="select" value={sourceFilter} onChange={e => setSourceFilter(e.target.value as any)}>
            <option value="All">All Sources</option>
            {(["Website","Instagram","WhatsApp","Manual","Referral"] as LeadSource[]).map(s => <option key={s}>{s}</option>)}
          </select>
          <span className="text-xs text-slate-400 dark:text-slate-500">{filtered.length} leads</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="th">Lead</th>
                <th className="th">Source</th>
                <th className="th">Product Interest</th>
                <th className="th text-right">Est. Value</th>
                <th className="th text-center">Status</th>
                <th className="th">Email Status</th>
                <th className="th">Date</th>
                {can("manage:leads") && <th className="th text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                  <td className="td">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">{lead.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Building2 size={10} /> {lead.company}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Phone size={10} /> {lead.phone}
                      </p>
                    </div>
                  </td>
                  <td className="td">
                    <div className="flex items-center gap-1.5">
                      <SourceIcon source={lead.source} />
                      <span className="text-xs text-slate-600 dark:text-slate-300">{lead.source}</span>
                    </div>
                  </td>
                  <td className="td">
                    <p className="text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate">{lead.productInterest}</p>
                  </td>
                  <td className="td text-right font-semibold text-slate-700 dark:text-slate-200">
                    {formatCurrency(lead.estimatedValue, true)}
                  </td>
                  <td className="td text-center">
                    <span className={leadStatusColors[lead.status]}>{lead.status}</span>
                  </td>
                  <td className="td">
                    <div className="space-y-1 min-w-[130px]">
                      {/* Welcome Email */}
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className={lead.emailSent ? "text-green-500" : "text-slate-300 dark:text-slate-600"} />
                        <span className={`text-xs ${lead.emailSent ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
                          {lead.emailSent ? "Sent" : "Pending"}
                        </span>
                        {lead.emailSentAt && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(lead.emailSentAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>
                      {/* 1hr Reminder */}
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className={lead.reminderSent ? "text-blue-500" : lead.emailSent ? "text-amber-400" : "text-slate-300 dark:text-slate-600"} />
                        <span className={`text-xs ${lead.reminderSent ? "text-blue-600 dark:text-blue-400" : lead.emailSent ? "text-amber-500" : "text-slate-400"}`}>
                          {lead.reminderSent ? "1hr ✓" : lead.emailSent ? "1hr Pending" : "—"}
                        </span>
                        {lead.reminderSentAt && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(lead.reminderSentAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>
                      {/* WhatsApp */}
                      <div className="flex items-center gap-1.5">
                        <MessageSquare size={12} className={lead.whatsappSent ? "text-green-500" : "text-slate-300 dark:text-slate-600"} />
                        <span className={`text-xs ${lead.whatsappSent ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
                          {lead.whatsappSent ? "WA Sent" : "WA Pending"}
                        </span>
                      </div>
                      {/* View Template */}
                      <button
                        onClick={() => setShowTemplateModal(lead)}
                        className="flex items-center gap-1 text-[10px] text-venkat-orange hover:text-venkat-orange-dark font-medium mt-0.5"
                      >
                        <FileText size={10} /> View Template
                      </button>
                    </div>
                  </td>
                  <td className="td text-xs text-slate-500 dark:text-slate-400">
                    {new Date(lead.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                  </td>
                  {can("manage:leads") && (
                    <td className="td text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setShowNotifModal(lead)}
                          className="p-1.5 rounded-lg bg-venkat-orange/10 text-venkat-orange hover:bg-venkat-orange/20 transition-colors"
                          title="Send Welcome Notification"
                        >
                          <Send size={13} />
                        </button>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          title="View Details"
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="td text-center text-slate-400 dark:text-slate-500 py-12">
                    No leads match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Side Panel */}
      {selectedLead && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-bold text-slate-800 dark:text-white">{selectedLead.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{selectedLead.id} · {selectedLead.company}</p>
            </div>
            <button onClick={() => setSelectedLead(null)}><X size={18} className="text-slate-400" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Phone",          value: selectedLead.phone },
                { label: "Email",          value: selectedLead.email },
                { label: "Source",         value: selectedLead.source },
                { label: "Status",         value: selectedLead.status },
                { label: "Product",        value: selectedLead.productInterest },
                { label: "Est. Value",     value: formatCurrency(selectedLead.estimatedValue, true) },
                { label: "Assigned To",    value: selectedLead.assignedTo },
                { label: "Follow-up Date", value: selectedLead.followUpDate },
              ].map(f => (
                <div key={f.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 dark:text-slate-500">{f.label}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5 truncate">{f.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Enquiry Message</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 leading-relaxed">{selectedLead.message}</p>
            </div>
            {selectedLead.notes && (
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Notes</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/10 rounded-xl p-3 leading-relaxed">{selectedLead.notes}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Notification Status</p>
              <div className="flex gap-3">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${selectedLead.emailSent ? "bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400"}`}>
                  <Mail size={14} /> Email {selectedLead.emailSent ? "Sent ✓" : "Not Sent"}
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${selectedLead.whatsappSent ? "bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400"}`}>
                  <MessageSquare size={14} /> WA {selectedLead.whatsappSent ? "Sent ✓" : "Not Sent"}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={() => { setShowNotifModal(selectedLead); setSelectedLead(null); }} className="btn-primary w-full justify-center">
              <Send size={14} /> Send Welcome Notification
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal      && <AddLeadModal onClose={() => setShowAddModal(false)} />}
      {showNotifModal    && <NotificationModal lead={showNotifModal} onClose={() => setShowNotifModal(null)} />}
      {showTemplateModal && <EmailTemplateModal lead={showTemplateModal} onClose={() => setShowTemplateModal(null)} />}
    </div>
  );
}
