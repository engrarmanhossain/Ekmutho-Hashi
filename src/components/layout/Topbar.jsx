import React, { useState } from 'react';
import {
  Menu,
  PlusCircle,
  TrendingDown,
  Gift,
  Filter,
  RotateCcw,
  Trash2,
  ChevronDown,
  Cloud,
  CloudOff,
  User,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const Topbar = ({
  onToggleSidebar,
  onOpenAddFund,
  onOpenAddExpense,
  onOpenDistributeAid,
  onOpenAuthModal,
  onOpenConnectModal
}) => {
  const {
    campaigns,
    selectedCampaign,
    setSelectedCampaign,
    resetToSampleData,
    clearAllData,
    isCloudConnected,
    isCloudSyncing,
    user
  } = useCharity();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-3 sm:px-6 py-3 no-print">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Mobile hamburger & Organization info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition shrink-0"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-300 shadow-xs shrink-0 hidden xs:flex">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-full h-full object-contain bg-white"
                />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
                    একমুঠো হাসি
                  </h2>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 hidden sm:inline">
                    Ekmutho Hashi
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 hidden md:block truncate">
                  Volunteer Charity & Relief Distribution Hub
                </p>
              </div>
            </div>
          </div>

          {/* Right: Cloud status, Volunteer login, Campaign filter, Quick actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Cloud Sync Status Indicator */}
            <button
              type="button"
              onClick={onOpenConnectModal}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                isCloudConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title={isCloudConnected ? 'Supabase Real-Time Cloud Sync Active' : 'Operating in Local Mode. Click to connect Supabase.'}
            >
              {isCloudSyncing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
              ) : isCloudConnected ? (
                <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <CloudOff className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span className="hidden md:inline">
                {isCloudSyncing ? 'Syncing...' : isCloudConnected ? 'Cloud Synced' : 'Connect Cloud'}
              </span>
            </button>

            {/* Volunteer Login / Profile Button */}
            <button
              type="button"
              onClick={onOpenAuthModal}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition ${
                user
                  ? 'bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title={user ? `Signed in as ${user.user_metadata?.full_name || user.email}` : 'Sign in as Volunteer'}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline truncate max-w-[100px]">
                {user ? (user.user_metadata?.full_name?.split(' ')[0] || 'Volunteer') : 'Volunteer Login'}
              </span>
              {user && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
            </button>

            {/* Campaign Selector Filter */}
            <div className="relative flex items-center">
              <div className="absolute left-2.5 pointer-events-none text-slate-400">
                <Filter className="w-3.5 h-3.5" />
              </div>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="pl-7 pr-7 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/70 text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer appearance-none max-w-[125px] sm:max-w-[180px] truncate"
              >
                <option value="all">🌟 All Drives</option>
                {campaigns.map((camp) => (
                  <option key={camp.id} value={camp.id}>
                    {camp.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>

            {/* Quick Action: + Add Fund */}
            <button
              type="button"
              onClick={onOpenAddFund}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-sm transition"
              title="Record a donor contribution"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">+ Fund</span>
            </button>

            {/* Quick Action: + Distribute Aid */}
            <button
              type="button"
              onClick={onOpenDistributeAid}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-98 shadow-sm transition"
              title="Distribute relief aid to family"
            >
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">Distribute</span>
            </button>

            {/* Options Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                title="Settings & Reset"
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
                      <p className="font-bold text-slate-800">Data & Cloud Controls</p>
                      <p className="text-[11px] text-slate-400">
                        {isCloudConnected ? 'Cloud Sync: Active' : 'Cloud Sync: Offline'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowSettingsDropdown(false);
                        onOpenConnectModal();
                      }}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2 hover:bg-slate-50 text-teal-700 transition"
                    >
                      <Cloud className="w-3.5 h-3.5" />
                      <span>{isCloudConnected ? 'Cloud Sync Settings' : 'Connect Supabase Cloud'}</span>
                    </button>

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
