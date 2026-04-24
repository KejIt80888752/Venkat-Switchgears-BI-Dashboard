import React, { useState } from "react";
import { Users as UsersIcon, Plus, Shield, Edit2, Trash2, Activity } from "lucide-react";
import { users, activityLogs } from "@/data/mockData";
import { ROLE_LABELS, ROLE_COLORS, UserRole } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Users() {
  const { can } = useAuth();
  const [tab, setTab] = useState<"users" | "activity">("users");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{users.length} users · Role-based access control</p>
        </div>
        {can("manage:users") && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Add User
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(["superadmin","manager","sales","accounts","viewer"] as UserRole[]).map(role => {
          const count = users.filter(u => u.role === role).length;
          return (
            <div key={role} className="card p-4 text-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{count}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ROLE_LABELS[role]}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1 w-fit">
        {(["users", "activity"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
          >
            {t === "users" ? "All Users" : "Activity Log"}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="card p-5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="th">User</th>
                  <th className="th">Email</th>
                  <th className="th">Role</th>
                  <th className="th">Unit Access</th>
                  <th className="th">Last Login</th>
                  <th className="th text-center">Status</th>
                  {can("manage:users") && <th className="th text-center">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-venkat-navy flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-semibold">{u.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-100">{u.name}</span>
                      </div>
                    </td>
                    <td className="td text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td className="td">
                      <span className={ROLE_COLORS[u.role as UserRole]}>{ROLE_LABELS[u.role as UserRole]}</span>
                    </td>
                    <td className="td text-slate-600 dark:text-slate-300">{u.unit}</td>
                    <td className="td text-slate-500 dark:text-slate-400 text-xs">{u.lastLogin}</td>
                    <td className="td text-center">
                      <span className={u.status === "active" ? "badge-green" : "badge-red"}>
                        {u.status}
                      </span>
                    </td>
                    {can("manage:users") && (
                      <td className="td text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-slate-400 hover:text-venkat-navy dark:hover:text-blue-400 transition-colors" title="Edit">
                            <Edit2 size={15} />
                          </button>
                          <button className="text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "activity" && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-venkat-orange" />
            <h2 className="font-semibold text-slate-800 dark:text-white">Recent Activity</h2>
          </div>
          <div className="space-y-0">
            {activityLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-slate-600 dark:text-slate-300 text-sm font-semibold">{log.user.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 dark:text-slate-100">
                    <span className="font-medium">{log.user}</span>
                    <span className="text-slate-500 dark:text-slate-400"> — {log.action}</span>
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{log.time}</p>
                </div>
                <span className="badge-navy flex-shrink-0">{log.module}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role Permissions Matrix */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-venkat-navy dark:text-blue-400" />
          <h2 className="font-semibold text-slate-800 dark:text-white">Role Permissions Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="th">Module</th>
                <th className="th text-center">Super Admin</th>
                <th className="th text-center">Manager</th>
                <th className="th text-center">Sales</th>
                <th className="th text-center">Accounts</th>
                <th className="th text-center">Viewer</th>
              </tr>
            </thead>
            <tbody>
              {[
                { module: "Sales Reports",    sa: true,  mg: true,  sl: true,  ac: false, vw: true  },
                { module: "Purchase Reports", sa: true,  mg: true,  sl: false, ac: true,  vw: false },
                { module: "Inventory",        sa: true,  mg: true,  sl: true,  ac: false, vw: true  },
                { module: "Outstanding",      sa: true,  mg: true,  sl: true,  ac: true,  vw: true  },
                { module: "P&L",              sa: true,  mg: true,  sl: false, ac: true,  vw: true  },
                { module: "GST Reports",      sa: true,  mg: true,  sl: false, ac: true,  vw: false },
                { module: "Unit Comparison",  sa: true,  mg: true,  sl: false, ac: false, vw: false },
                { module: "Export Reports",   sa: true,  mg: true,  sl: true,  ac: true,  vw: false },
                { module: "User Management",  sa: true,  mg: false, sl: false, ac: false, vw: false },
                { module: "Settings",         sa: true,  mg: false, sl: false, ac: false, vw: false },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                  <td className="td font-medium text-slate-700 dark:text-slate-300">{row.module}</td>
                  {[row.sa, row.mg, row.sl, row.ac, row.vw].map((allowed, j) => (
                    <td key={j} className="td text-center">
                      {allowed
                        ? <span className="text-green-600 dark:text-green-400 text-base">✓</span>
                        : <span className="text-slate-300 dark:text-slate-600 text-base">—</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Add New User</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input className="input" placeholder="e.g. Suresh Kumar" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input type="email" className="input" placeholder="user@venkat.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select className="select w-full">
                  <option value="manager">Manager</option>
                  <option value="sales">Sales Executive</option>
                  <option value="accounts">Accounts</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unit Access</label>
                <select className="select w-full">
                  <option>Both</option>
                  <option>Unit 1</option>
                  <option>Unit 2</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setShowModal(false)}>Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
