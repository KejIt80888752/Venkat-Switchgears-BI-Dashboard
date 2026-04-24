import React, { useState } from "react";
import { Settings as SettingsIcon, Mail, MessageSquare, Target, Bell, Database, Save } from "lucide-react";
import { salesTarget, formatCurrency, COMPANY } from "@/data/mockData";

export default function Settings() {
  const [section, setSection] = useState("targets");

  const [targets, setTargets] = useState({
    yearly: (salesTarget.yearly / 10000000).toFixed(1),
    unit1: (salesTarget.unit1Target / 10000000).toFixed(1),
    unit2: (salesTarget.unit2Target / 10000000).toFixed(1),
    lowStockThreshold: "120",
    overdueAlertDays: "60",
  });

  const [email, setEmail] = useState({
    enabled: true,
    recipients: "admin@venkat.com, manager@venkat.com",
    frequency: "daily",
    time: "07:00",
    reports: ["sales", "outstanding", "lowstock"],
  });

  const [whatsapp, setWhatsapp] = useState({
    enabled: true,
    number: "+91 9448354274",
    triggers: ["lowstock", "overdue60"],
  });

  const [tally, setTally] = useState({
    host: "192.168.1.100",
    port: "9000",
    company: "Venkat Switchgears",
    syncFrequency: "realtime",
    lastSync: "2025-04-16 10:05:22",
  });

  const sections = [
    { id: "targets",  label: "KPI Targets",     icon: <Target size={16} /> },
    { id: "email",    label: "Email Reports",    icon: <Mail size={16} /> },
    { id: "whatsapp", label: "WhatsApp Alerts",  icon: <MessageSquare size={16} /> },
    { id: "tally",    label: "Tally ERP",        icon: <Database size={16} /> },
    { id: "alerts",   label: "Alert Config",     icon: <Bell size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">System configuration · Venkat Switchgears BI Dashboard</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar Nav */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="card p-2 space-y-0.5">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  section === s.id
                    ? "bg-venkat-navy text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {section === "targets" && (
            <div className="card p-5 space-y-5">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-venkat-orange" />
                <h2 className="font-semibold text-slate-800 dark:text-white">KPI Sales Targets (FY 2025-26)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Overall Annual Target (Cr)", key: "yearly" },
                  { label: "Unit 1 Annual Target (Cr)",  key: "unit1" },
                  { label: "Unit 2 Annual Target (Cr)",  key: "unit2" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                      <input
                        type="number"
                        step="0.1"
                        className="input pl-7"
                        value={(targets as any)[f.key]}
                        onChange={e => setTargets(t => ({ ...t, [f.key]: e.target.value }))}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Cr</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Low Stock Alert Threshold (%)</label>
                  <input
                    type="number"
                    className="input"
                    value={targets.lowStockThreshold}
                    onChange={e => setTargets(t => ({ ...t, lowStockThreshold: e.target.value }))}
                  />
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Alert when stock falls below X% of minimum level</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Overdue Alert Threshold (Days)</label>
                  <input
                    type="number"
                    className="input"
                    value={targets.overdueAlertDays}
                    onChange={e => setTargets(t => ({ ...t, overdueAlertDays: e.target.value }))}
                  />
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Alert when debtor invoice exceeds X days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" /> On Track ≥ 80% &nbsp;&nbsp;
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> At Risk 60-79% &nbsp;&nbsp;
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Behind &lt;60%
                </div>
                <button className="btn-primary"><Save size={15} /> Save Targets</button>
              </div>
            </div>
          )}

          {section === "email" && (
            <div className="card p-5 space-y-5">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-venkat-orange" />
                <h2 className="font-semibold text-slate-800 dark:text-white">Automated Email Reports</h2>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Enable Email Reports</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Send automated PDF reports to management</p>
                </div>
                <button
                  onClick={() => setEmail(e => ({ ...e, enabled: !e.enabled }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${email.enabled ? "bg-venkat-orange" : "bg-slate-300 dark:bg-slate-600"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${email.enabled ? "left-5.5" : "left-0.5"}`} style={{ left: email.enabled ? "22px" : "2px" }} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Report Recipients</label>
                  <textarea
                    className="input h-20 resize-none"
                    value={email.recipients}
                    onChange={e => setEmail(em => ({ ...em, recipients: e.target.value }))}
                    placeholder="email1@venkat.com, email2@venkat.com"
                  />
                  <p className="text-xs text-slate-400 mt-1">Comma-separated email addresses</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Frequency</label>
                    <select className="select w-full" value={email.frequency} onChange={e => setEmail(em => ({ ...em, frequency: e.target.value }))}>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly (Monday)</option>
                      <option value="monthly">Monthly (1st)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Send Time</label>
                    <input type="time" className="input" value={email.time} onChange={e => setEmail(em => ({ ...em, time: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
                <button className="btn-primary"><Save size={15} /> Save Config</button>
              </div>
            </div>
          )}

          {section === "whatsapp" && (
            <div className="card p-5 space-y-5">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-green-600" />
                <h2 className="font-semibold text-slate-800 dark:text-white">WhatsApp Business Alerts</h2>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Enable WhatsApp Alerts</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Via WhatsApp Business API / Twilio</p>
                </div>
                <button
                  onClick={() => setWhatsapp(w => ({ ...w, enabled: !w.enabled }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${whatsapp.enabled ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`}
                >
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: whatsapp.enabled ? "22px" : "2px" }} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Alert Recipient Number</label>
                <input className="input" value={whatsapp.number} onChange={e => setWhatsapp(w => ({ ...w, number: e.target.value }))} placeholder="+91 9xxxxxxxxx" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Alert Triggers</label>
                <div className="space-y-2">
                  {[
                    { key: "lowstock", label: "Low Stock Alert", sub: "When inventory falls below threshold" },
                    { key: "overdue60", label: "Overdue Payment (60+ days)", sub: "When debtor invoice crosses 60 days" },
                    { key: "overdue90", label: "Critical Overdue (90+ days)", sub: "When debtor invoice crosses 90 days" },
                  ].map(t => (
                    <div key={t.key} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <input type="checkbox" defaultChecked={whatsapp.triggers.includes(t.key)} className="w-4 h-4 accent-venkat-orange" />
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{t.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
                <button className="btn-primary"><Save size={15} /> Save Config</button>
              </div>
            </div>
          )}

          {section === "tally" && (
            <div className="card p-5 space-y-5">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-venkat-orange" />
                <h2 className="font-semibold text-slate-800 dark:text-white">Tally ERP Integration</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tally Server Host</label>
                  <input className="input" value={tally.host} onChange={e => setTally(t => ({ ...t, host: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Port (default: 9000)</label>
                  <input className="input" value={tally.port} onChange={e => setTally(t => ({ ...t, port: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Company Name in Tally</label>
                <input className="input" value={tally.company} onChange={e => setTally(t => ({ ...t, company: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sync Frequency</label>
                <select className="select w-full" value={tally.syncFrequency} onChange={e => setTally(t => ({ ...t, syncFrequency: e.target.value }))}>
                  <option value="realtime">Real-time (recommended)</option>
                  <option value="15min">Every 15 minutes</option>
                  <option value="1hour">Every 1 hour</option>
                  <option value="daily">Daily at midnight</option>
                </select>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-sm font-semibold text-green-800 dark:text-green-400">Tally Connection: Active (Mock Mode)</p>
                </div>
                <p className="text-xs text-green-700 dark:text-green-500 mt-1">Last sync: {tally.lastSync} · Connect real Tally ODBC/XML after deployment</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                <button className="btn-secondary">Test Connection</button>
                <button className="btn-primary"><Save size={15} /> Save Config</button>
              </div>
            </div>
          )}

          {section === "alerts" && (
            <div className="card p-5 space-y-5">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-venkat-orange" />
                <h2 className="font-semibold text-slate-800 dark:text-white">Alert Configuration</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Low Stock Notification",       sub: "In-app alert when stock falls below threshold", defaultOn: true  },
                  { label: "Overdue Invoice (60+ days)",   sub: "Red alert badge on Outstanding page",           defaultOn: true  },
                  { label: "Target Achievement Warnings",  sub: "Amber warning when monthly target at risk",     defaultOn: true  },
                  { label: "Daily Summary Digest",         sub: "End-of-day summary in notification panel",      defaultOn: false },
                  { label: "GST Filing Reminder",          sub: "Remind 5 days before GSTR-1/3B due date",      defaultOn: true  },
                  { label: "Vendor Payment Due Alert",     sub: "Alert when creditor payment due in 7 days",     defaultOn: false },
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{alert.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{alert.sub}</p>
                    </div>
                    <input type="checkbox" defaultChecked={alert.defaultOn} className="w-4 h-4 accent-venkat-orange" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
                <button className="btn-primary"><Save size={15} /> Save Alerts</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
