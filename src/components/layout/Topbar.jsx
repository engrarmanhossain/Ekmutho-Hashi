import React, { useState } from 'react';
import {
  Menu,
  PlusCircle,
  TrendingDown,
  Gift,
  Filter,
  RotateCcw,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const Topbar = ({
  onToggleSidebar,
  onOpenAddFund,
  onOpenAddExpense,
  onOpenDistributeAid
}) => {
  const {
    campaigns,
    selectedCampaign,
    setSelectedCampaign,
    resetToSampleData,
    clearAllData
  } = useCharity();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-6 py-3.5 no-print">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Mobile hamburger & Organization info */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 truncate">
              <div className="hidden sm:flex w-8 h-8 rounded-lg overflow-hidden border border-amber-300 shadow-xs shrink-0">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-full h-full object-contain bg-white"
                />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
                    একমুঠো হাসি <span className="text-slate-400 font-normal">|</span> Ekmutho Hashi
                  </h2>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Community Charity BD
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block truncate">
                  Volunteer Charity & Relief Distribution Management Portal
                </p>
              </div>
            </div>
          </div>

          {/* Right: Campaign Filter & Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Campaign Selector Filter */}
            <div className="relative flex items-center">
              <div className="absolute left-3 pointer-events-none text-slate-400">
                <Filter className="w-3.5 h-3.5" />
              </div>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="pl-8 pr-8 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/70 text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition cursor-pointer appearance-none max-w-[150px] sm:max-w-[210px] truncate"
              >
                <option value="all">🌟 All Campaigns (সব কর্মসূচি)</option>
                {campaigns.map((camp) => (
                  <option key={camp.id} value={camp.id}>
                    {camp.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>

            {/* Quick Action: + Add Fund */}
            <button
              type="button"
              onClick={onOpenAddFund}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-sm transition"
              title="Record a new donor contribution"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">+ Add Fund</span>
              <span className="sm:hidden">+ Fund</span>
            </button>

            {/* Quick Action: + Add Expense */}
            <button
              type="button"
              onClick={onOpenAddExpense}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-98 shadow-sm transition"
              title="Record a market purchase or logistics expense"
            >
              <TrendingDown className="w-4 h-4" />
              <span className="hidden sm:inline">+ Add Expense</span>
              <span className="sm:hidden">+ Expense</span>
            </button>

            {/* Quick Action: + Distribute Aid */}
            <button
              type="button"
              onClick={onOpenDistributeAid}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-98 shadow-sm transition"
              title="Hand over relief package or cash aid to a beneficiary family"
            >
              <Gift className="w-4 h-4" />
              <span className="hidden md:inline">+ Distribute Aid</span>
              <span className="md:hidden">Distribute</span>
            </button>

            {/* Manage / Reset Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                title="Data Options"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {showSettingsDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettingsDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-xs font-medium text-slate-700">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-800">Data Management</p>
                      <p className="text-[11px] text-slate-400">LocalStorage Controls</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSettingsDropdown(false);
                        setShowResetConfirm(true);
                      }}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2 hover:bg-amber-50 hover:text-amber-800 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reset to Sample Data</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSettingsDropdown(false);
                        setShowClearConfirm(true);
                      }}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2 hover:bg-rose-50 text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All Records</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetToSampleData}
        title="Reset to Ramadan 2026 Sample Data?"
        message="This will restore the pre-populated realistic Ramadan Iftar Drive data with donors, inventory, beneficiaries, and expenses."
        confirmText="Yes, Reset Data"
      />

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearAllData}
        title="Clear All Records?"
        message="Are you sure you want to clear all records? This removes all donors, beneficiaries, inventory, and expenses so you can start completely fresh."
        confirmText="Yes, Clear Everything"
        isDestructive={true}
      />
    </>
  );
};
