import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth, ROLE_LABELS } from "@/contexts/AuthContext";
import {
  LayoutDashboard, TrendingUp, ShoppingCart, Package,
  CreditCard, BarChart3, FileText, GitCompare,
  Users, Settings, ExternalLink, Moon, Sun,
  Menu, X, LogOut, Bell, Inbox, Receipt, ClipboardList,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",           path: "/dashboard",       icon: <LayoutDashboard size={18} /> },
  { label: "Billing / Invoice",   path: "/billing",         icon: <Receipt size={18} />,       permission: "view:sales" },
  { label: "Quotation",           path: "/quotation",       icon: <ClipboardList size={18} />, permission: "view:sales" },
  { label: "Leads & Enquiries",   path: "/leads",           icon: <Inbox size={18} />,         permission: "view:leads" },
  { label: "Sales Reports",       path: "/sales",           icon: <TrendingUp size={18} />,    permission: "view:sales" },
  { label: "Purchase Reports",    path: "/purchases",       icon: <ShoppingCart size={18} />,  permission: "view:purchases" },
  { label: "Stock & Inventory",   path: "/inventory",       icon: <Package size={18} />,       permission: "view:inventory" },
  { label: "Outstanding",         path: "/outstanding",     icon: <CreditCard size={18} />,    permission: "view:outstanding" },
  { label: "Profit & Loss",       path: "/pnl",             icon: <BarChart3 size={18} />,     permission: "view:pnl" },
  { label: "GST Reports",         path: "/gst",             icon: <FileText size={18} />,      permission: "view:gst" },
  { label: "Unit Comparison",     path: "/units",           icon: <GitCompare size={18} />,    permission: "view:units" },
  { label: "User Management",     path: "/users",           icon: <Users size={18} />,         permission: "view:users" },
  { label: "Settings",            path: "/settings",        icon: <Settings size={18} />,      permission: "view:settings" },
  { label: "Customer Portal",     path: "/customer-portal", icon: <ExternalLink size={18} />,  permission: "view:customerportal" },
];

const Sidebar: React.FC<{ collapsed: boolean; onClose: () => void }> = ({ collapsed, onClose }) => {
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter(item =>
    !item.permission || can(item.permission as any)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-40 flex flex-col
        bg-venkat-navy
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-0 overflow-hidden md:w-16" : "w-64"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-center flex-shrink-0 bg-white rounded-lg overflow-hidden" style={{ width: collapsed ? 36 : 44, height: collapsed ? 36 : 44 }}>
          <img
            src="https://venkatswitchgears.com/wp-content/uploads/2021/08/logo_vsg-web.png"
            alt="Venkat Switchgears"
            className="w-full h-full object-contain p-1"
            onError={e => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-venkat-navy font-bold text-lg">V</span>';
            }}
          />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight truncate">Venkat Switchgears</p>
            <p className="text-[#8BAED6] text-xs truncate">Synergizing Power</p>
          </div>
        )}
        <button
          onClick={onClose}
          className="ml-auto text-[#8BAED6] hover:text-white md:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {visibleItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => { if (window.innerWidth < 768) onClose(); }}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* The Raise + Powered by KEJ */}
      {!collapsed && (
        <div className="px-4 py-2 flex flex-col gap-0.5 flex-shrink-0 opacity-50">
          <img
            src="/Venkat-Switchgears-BI-Dashboard/the-raise-logo.png"
            alt="The Raise"
            className="h-4 object-contain brightness-0 invert"
          />
          <p className="text-white text-[9px] uppercase tracking-widest">Powered by KEJ</p>
        </div>
      )}

      {/* User info */}
      <div className="border-t border-white/10 px-3 py-3 flex-shrink-0">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-venkat-orange flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.name}</p>
              <p className="text-[#8BAED6] text-xs truncate">{user ? ROLE_LABELS[user.role] : ""}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="text-[#8BAED6] hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<{ onMenuClick: () => void; sidebarCollapsed: boolean }> = ({
  onMenuClick, sidebarCollapsed,
}) => {
  const { user, isDark, toggleTheme, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const alerts = [
    { text: "7 items below min stock level", type: "warn" },
    { text: "BMRCL — ₹82L overdue (95 days)", type: "error" },
    { text: "BHEL — ₹48.5L overdue (90 days)", type: "error" },
  ];

  return (
    <header className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-3 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      {/* Unit Badge */}
      <span className="hidden sm:inline-flex badge-navy text-xs">
        {user?.unit === "Both" ? "Unit 1 + Unit 2" : user?.unit}
      </span>

      {/* Alerts */}
      <div className="relative">
        <button
          className="relative text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          onClick={() => setShowDropdown(d => !d)}
        >
          <Bell size={18} />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        {showDropdown && (
          <div className="absolute right-0 top-10 w-72 card z-50 shadow-lg">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Alerts</p>
            </div>
            <div className="py-1">
              {alerts.map((a, i) => (
                <div key={i} className="px-4 py-2.5 flex items-start gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${a.type === "error" ? "bg-red-500" : "bg-amber-500"}`} />
                  <p className="text-xs text-slate-700 dark:text-slate-300">{a.text}</p>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
              <button className="text-xs text-venkat-orange font-medium" onClick={() => setShowDropdown(false)}>
                View all alerts
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* User */}
      <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
        <div className="w-8 h-8 rounded-full bg-venkat-navy flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">
          {user?.name.split(" ")[0]}
        </span>
      </div>
    </header>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 overflow-hidden">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar collapsed={!sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <Header onMenuClick={() => setSidebarOpen(s => !s)} sidebarCollapsed={!sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
