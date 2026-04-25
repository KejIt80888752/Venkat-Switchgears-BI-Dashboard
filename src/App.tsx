import React, { useState, useEffect, Suspense, lazy } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";

// Pages — lazy loaded for performance
const Login           = lazy(() => import("@/pages/Login"));
const Dashboard       = lazy(() => import("@/pages/Dashboard"));
const Sales           = lazy(() => import("@/pages/Sales"));
const Purchases       = lazy(() => import("@/pages/Purchases"));
const Inventory       = lazy(() => import("@/pages/Inventory"));
const Outstanding     = lazy(() => import("@/pages/Outstanding"));
const PnL             = lazy(() => import("@/pages/PnL"));
const GST             = lazy(() => import("@/pages/GST"));
const Units           = lazy(() => import("@/pages/Units"));
const Leads           = lazy(() => import("@/pages/Leads"));
const Users           = lazy(() => import("@/pages/Users"));
const Settings        = lazy(() => import("@/pages/Settings"));
const CustomerPortal  = lazy(() => import("@/pages/CustomerPortal"));
const Billing         = lazy(() => import("@/pages/Billing"));
const Quotation       = lazy(() => import("@/pages/Quotation"));

// Page-level spinner — same dual-ring style as loading screen
const PageSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
      {/* Outer orange ring */}
      <svg className="animate-spin absolute" style={{ width: 72, height: 72, animationDuration: "1s" }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#E87722" strokeWidth="4"
          strokeDasharray="60 220" strokeLinecap="round" />
      </svg>
      {/* Inner navy ring counter-spin */}
      <svg className="animate-spin absolute" style={{ width: 54, height: 54, animationDuration: "1.5s", animationDirection: "reverse" }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#0D2B5E" strokeWidth="4"
          strokeDasharray="30 250" strokeLinecap="round" />
      </svg>
      {/* VSG logo center */}
      <div className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center border border-slate-100">
        <img
          src="https://venkatswitchgears.com/wp-content/uploads/2021/08/logo_vsg-web.png"
          alt="VSG"
          className="w-7 h-7 object-contain"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; permission?: string }> = ({ children, permission }) => {
  const { user, can } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (permission && !can(permission as any)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

// Customer route — only for customer role
const CustomerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Public route — redirects logged-in users
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === "customer" ? "/customer-portal" : "/dashboard"} replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={
          <Navigate to={!user ? "/login" : user.role === "customer" ? "/customer-portal" : "/dashboard"} replace />
        } />

        {/* Public */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Customer portal — has its own full-page layout */}
        <Route path="/customer-portal" element={
          <CustomerRoute><CustomerPortal /></CustomerRoute>
        } />

        {/* Protected — inside Layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
        } />
        <Route path="/leads" element={
          <ProtectedRoute permission="view:leads"><Layout><Leads /></Layout></ProtectedRoute>
        } />
        <Route path="/sales" element={
          <ProtectedRoute permission="view:sales"><Layout><Sales /></Layout></ProtectedRoute>
        } />
        <Route path="/purchases" element={
          <ProtectedRoute permission="view:purchases"><Layout><Purchases /></Layout></ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute permission="view:inventory"><Layout><Inventory /></Layout></ProtectedRoute>
        } />
        <Route path="/outstanding" element={
          <ProtectedRoute permission="view:outstanding"><Layout><Outstanding /></Layout></ProtectedRoute>
        } />
        <Route path="/pnl" element={
          <ProtectedRoute permission="view:pnl"><Layout><PnL /></Layout></ProtectedRoute>
        } />
        <Route path="/gst" element={
          <ProtectedRoute permission="view:gst"><Layout><GST /></Layout></ProtectedRoute>
        } />
        <Route path="/units" element={
          <ProtectedRoute permission="view:units"><Layout><Units /></Layout></ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute permission="view:users"><Layout><Users /></Layout></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute permission="view:settings"><Layout><Settings /></Layout></ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute permission="view:sales"><Layout><Billing /></Layout></ProtectedRoute>
        } />
        <Route path="/quotation" element={
          <ProtectedRoute permission="view:sales"><Layout><Quotation /></Layout></ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-center p-8">
            <p className="text-6xl font-black text-venkat-navy dark:text-venkat-orange mb-4">404</p>
            <p className="text-slate-600 dark:text-slate-300 mb-6">Page not found.</p>
            <a href="#/dashboard" className="btn-primary">Go to Dashboard</a>
          </div>
        } />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [themeReady, setThemeReady] = useState(false);

  // Apply saved theme before first render (prevents flash)
  useEffect(() => {
    const saved = localStorage.getItem("venkat_theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    setThemeReady(true);
  }, []);

  if (!themeReady) return null;

  return (
    <HashRouter>
      <AuthProvider>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
        {!loading && <AppRoutes />}
      </AuthProvider>
    </HashRouter>
  );
}
