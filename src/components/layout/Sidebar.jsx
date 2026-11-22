import React from 'react';
import {
  LayoutDashboard,
  Megaphone,
  HeartHandshake,
  Users,
  PackageCheck,
  Receipt,
  FileSpreadsheet,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { campaigns, donors, beneficiaries, inventory, expenses } = useCharity();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Overview Dashboard',
      banglaLabel: 'ড্যাশবোর্ড ওভারভিউ',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'campaigns',
      label: 'Campaigns / Drives',
      banglaLabel: 'ত্রাণ কর্মসূচি',
      icon: Megaphone,
      badge: campaigns.length
    },
    {
      id: 'donors',
      label: 'Fund Collection (Donors)',
      banglaLabel: 'তহবিল ও অনুদান',
      icon: HeartHandshake,
      badge: donors.length
    },
    {
      id: 'beneficiaries',
      label: 'Beneficiary List (Needy Families)',
      banglaLabel: 'সুবিধাভোগী পরিবার',
      icon: Users,
      badge: beneficiaries.length
    },
    {
      id: 'inventory',
      label: 'Relief Products & Packages',
      banglaLabel: 'পণ্য স্টক ও ইফতার বক্স',
      icon: PackageCheck,
      badge: inventory.length
    },
    {
      id: 'expenses',
      label: 'Expenses & Distribution Log',
      banglaLabel: 'খরচ ও বিতরণ হিসাব',
      icon: Receipt,
      badge: expenses.length
    },
    {
      id: 'reports',
      label: 'Financial Ledger & Export',
      banglaLabel: 'হিসাব খতিয়ান ও রিপোর্ট',
      icon: FileSpreadsheet,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } no-print`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl bg-white p-1 shadow-md border border-amber-400/40 shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Ekmutho Hashi Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
                  Ekmutho Hashi
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  BD
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium font-sans">একমুঠো হাসি</p>
              <p className="text-[11px] text-slate-400">Charity & Relief Distribution</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold tracking-wider uppercase text-slate-400/90">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <div className="truncate">
                    <span className="block leading-snug">{item.label}</span>
                    <span
                      className={`block text-[11px] leading-tight ${
                        isActive ? 'text-emerald-100 font-normal' : 'text-slate-400 font-normal'
                      }`}
                    >
                      {item.banglaLabel}
                    </span>
                  </div>
                </div>

                {item.badge !== null && (
                  <span
                    className={`shrink-0 ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Info & Verification badge */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Transparent Ledger</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Grassroots community charity in Bangladesh. Zero overhead, direct aid to deserving hands.
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Ekmutho Hashi v2.0</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3 h-3" /> Ramadan 1447H
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
