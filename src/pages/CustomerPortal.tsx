import React, { useState } from "react";
import { Package, FileText, Clock, CheckCircle, Download, Phone, Mail } from "lucide-react";
import { customerPortalData, formatCurrency, COMPANY } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function CustomerPortal() {
  const { user } = useAuth();

  // For customer role, show their own data; for admin/manager show demo
  const customerName = user?.role === "customer"
    ? user.name
    : "BHEL Bangalore"; // demo for admin viewing portal

  const customerData = customerPortalData[customerName as keyof typeof customerPortalData]
    || customerPortalData["BHEL Bangalore"];

  const paidOrders = customerData.orders.filter(o => o.status === "Paid");
  const pendingOrders = customerData.orders.filter(o => o.status !== "Paid");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Customer Header */}
      <div className="bg-venkat-navy px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg p-1.5 flex items-center justify-center" style={{ width: 40, height: 40 }}>
            <img
              src={COMPANY.logo}
              alt="Venkat Switchgears"
              className="w-full h-full object-contain"
              onError={e => { (e.target as HTMLImageElement).alt = "VSG"; }}
            />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Venkat Switchgears</p>
            <p className="text-[#8BAED6] text-xs">{COMPANY.tagline}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white text-sm font-semibold">{customerName}</p>
          <p className="text-[#8BAED6] text-xs">Customer Portal</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Welcome */}
        <div className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">{customerName}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Contact: {customerData.contact}</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <a href={`mailto:${customerData.email}`} className="flex items-center gap-1.5 text-xs text-venkat-orange hover:underline">
                  <Mail size={13} /> {customerData.email}
                </a>
                <a href={`tel:${customerData.phone}`} className="flex items-center gap-1.5 text-xs text-venkat-orange hover:underline">
                  <Phone size={13} /> {customerData.phone}
                </a>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Outstanding</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(customerData.totalOutstanding, true)}</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Orders",     value: customerData.orders.length,   color: "text-blue-600" },
            { label: "Delivered",        value: pendingOrders.length,          color: "text-amber-500" },
            { label: "Paid",             value: paidOrders.length,             color: "text-green-600" },
            { label: "Outstanding",      value: formatCurrency(customerData.totalOutstanding, true), color: "text-red-500" },
          ].map(k => (
            <div key={k.label} className="card p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">{k.label}</p>
              <p className={`text-xl font-bold mt-1 ${k.color}`}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-venkat-orange" />
              <h2 className="font-semibold text-slate-800 dark:text-white">Your Orders</h2>
            </div>
            <button className="btn-secondary text-xs"><Download size={13} /> Download Statement</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="th">Order No.</th>
                  <th className="th">Date</th>
                  <th className="th text-right">Amount</th>
                  <th className="th text-center">Status</th>
                  <th className="th text-right">Outstanding</th>
                  <th className="th text-center">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {customerData.orders.map((order, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 tr-hover">
                    <td className="td font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">{order.orderNo}</td>
                    <td className="td text-slate-500 dark:text-slate-400">{order.date}</td>
                    <td className="td text-right font-semibold">{formatCurrency(order.amount, true)}</td>
                    <td className="td text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {order.status === "Paid" ? (
                          <><CheckCircle size={13} className="text-green-500" /><span className="badge-green">Paid</span></>
                        ) : order.status === "Delivered" ? (
                          <><Clock size={13} className="text-amber-500" /><span className="badge-amber">Delivered</span></>
                        ) : (
                          <span className="badge-blue">{order.status}</span>
                        )}
                      </div>
                    </td>
                    <td className="td text-right">
                      {order.outstanding > 0
                        ? <span className="font-semibold text-red-500">{formatCurrency(order.outstanding, true)}</span>
                        : <span className="text-green-600 dark:text-green-400 text-xs font-medium">Cleared</span>
                      }
                    </td>
                    <td className="td text-center">
                      <button className="text-venkat-orange hover:underline text-xs flex items-center justify-center gap-1">
                        <Download size={12} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Info */}
        {customerData.totalOutstanding > 0 && (
          <div className="card p-5 border-l-4 border-l-amber-500">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Payment Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">Bank Details</p>
                <p className="text-slate-700 dark:text-slate-300">Account: Venkat Switchgears</p>
                <p className="text-slate-700 dark:text-slate-300">Bank: State Bank of India</p>
                <p className="text-slate-700 dark:text-slate-300">Branch: Peenya Industrial Area</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">Contact for Payment</p>
                <p className="text-slate-700 dark:text-slate-300">📞 +91 9448354274</p>
                <p className="text-slate-700 dark:text-slate-300">📧 projects@venkatswitchgears.com</p>
                <p className="text-slate-700 dark:text-slate-300">🌐 venkatswitchgears.com</p>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-slate-400 dark:text-slate-600">
          © 2025 Venkat Switchgears · {COMPANY.tagline} · {COMPANY.unit1.address}
        </p>
      </div>
    </div>
  );
}
