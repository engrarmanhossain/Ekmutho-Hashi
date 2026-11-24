import React, { useState } from 'react';
import {
  Menu,
  PlusCircle,
  Gift,
  Filter,
  RotateCcw,
  Trash2,
  ChevronDown,
  Cloud,
  CloudOff,
  User,
  RefreshCw,
  Users,
  Settings,
  Building2,
  Heart,
  HeartHandshake,
  Eye,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const Topbar = ({
  onToggleSidebar,
  onOpenAddFund,
  onOpenAddExpense,
  onOpenDistributeAid,
  onOpenAuthModal,
  onOpenConnectModal,
  onOpenProfileSettings,
  onOpenStaffManagement,
  onOpenOrgSettings,
  onOpenPublicDonation,
  onOpenPublicApply
}) => {
  const {
    campaigns,
    selectedCampaign,
    setSelectedCampaign,
    resetToSampleData,
    clearAllData,
    isCloudConnected,
    isCloudSyncing,
    user,
    staff,
    beneficiaries,
    donors,
    orgSettings,
    viewMode,
    permissions,
    currentStaffProfile,
    isUserAdmin,
    signOutVolunteer,
    verifyUserPassword
  } = useCharity();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const pendingStaffCount = staff ? staff.filter(s => s.status === 'pending').length : 0;
  const pendingReliefCount = beneficiaries ? beneficiaries.filter(b => b.approvalStatus === 'pending' || b.status === 'Pending Approval').length : 0;
  const pendingDonorsCount = donors ? donors.filter(d => d.approvalStatus === 'pending' || d.status === 'Pending Verification').length : 0;
  const totalPendingApprovals = pendingStaffCount + pendingReliefCount + pendingDonorsCount;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-3 sm:px-6 py-2.5 no-print">
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
              {/* Dynamic Logo */}
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-300 shadow-xs shrink-0 flex items-center justify-center bg-white p-0.5">
                <img
                  src={orgSettings?.logoUrl || '/logo.png'}
                  alt={orgSettings?.name || 'Ekmutho Hashi'}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Dynamic Organization Title */}
              <div className="truncate">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight truncate">
                    {orgSettings?.banglaName || 'একমুঠো হাসি'}
                  </h2>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 hidden sm:inline">
                    {orgSettings?.name || 'Ekmutho Hashi'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden md:block truncate">
                  {orgSettings?.slogan || 'Charity & Relief Distribution Hub'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Controls: Role actions, and menus */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* 1. ADMIN-ONLY: SUPABASE CLOUD SYNC BUTTON (Strictly visible ONLY in Admin View) */}
            {permissions.canManageSupabase && (
              <button
                type="button"
                onClick={onOpenConnectModal}
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold border transition ${
                  isCloudConnected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
                title={isCloudConnected ? 'Supabase Cloud Sync Active (Admin Only)' : 'Connect Supabase Cloud Database (Admin Only)'}
              >
                {isCloudSyncing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                ) : isCloudConnected ? (
                  <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <CloudOff className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span className="hidden lg:inline">
                  {isCloudSyncing ? 'Syncing...' : isCloudConnected ? 'Cloud DB' : 'Connect DB'}
                </span>
              </button>
            )}

            {/* 3. ADMIN-ONLY: ORG BRANDING & LOGO SETTINGS BUTTON */}
            {permissions.canManageOrg && onOpenOrgSettings && (
              <button
                type="button"
                onClick={onOpenOrgSettings}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-xs"
                title="Change Organization Name, Logo & Official Profile"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden xl:inline">Org & Logo</span>
              </button>
            )}

            {/* 4. ADMIN-ONLY: APPROVALS & TEAM MANAGEMENT */}
            {permissions.canManageStaff && onOpenStaffManagement && (
              <button
                type="button"
                onClick={onOpenStaffManagement}
                className="relative inline-flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-900 border border-amber-300 hover:bg-amber-500/25 transition shadow-xs cursor-pointer"
                title="Executive Approvals (Relief, Donations & Staff)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Approvals</span>
                {totalPendingApprovals > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                    {totalPendingApprovals}
                  </span>
                )}
              </button>
            )}

            {/* 5. PUBLIC VIEW: APPLY FOR RELIEF & DONATE BUTTONS */}
            {permissions.isPublic && onOpenPublicApply && (
              <button
                type="button"
                onClick={onOpenPublicApply}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-98 shadow-sm transition border border-amber-500/30"
                title="Apply for Relief Aid / দুস্থ পরিবার আবেদন"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-amber-900" />
                <span>Apply for Relief</span>
              </button>
            )}

            {permissions.isPublic && onOpenPublicDonation && (
              <button
                type="button"
                onClick={onOpenPublicDonation}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 shadow-sm transition"
              >
                <Heart className="w-3.5 h-3.5 text-rose-200 fill-rose-200" />
                <span>Donate</span>
              </button>
            )}

            {/* 6. PROFILE / AUTH BUTTON */}
            {user ? (
              <button
                type="button"
                onClick={onOpenProfileSettings}
                className={`inline-flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border transition ${
                  isUserAdmin
                    ? 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200'
                    : 'bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100'
                }`}
                title="Staff Profile & Account Settings"
              >
                {currentStaffProfile?.avatarUrl ? (
                  <img
                    src={currentStaffProfile.avatarUrl}
                    alt={user.user_metadata?.full_name || 'Staff'}
                    className="w-4 h-4 rounded-full object-cover border border-amber-500/50"
                  />
                ) : isUserAdmin ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                ) : (
                  <User className="w-3.5 h-3.5 text-teal-700" />
                )}
                <span className="hidden sm:inline truncate max-w-[120px]">
                  {isUserAdmin
                    ? 'Engr. Arman'
                    : user.user_metadata?.full_name?.split(' ')[0] || 'My Profile'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Staff Sign In</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            {/* 7. CAMPAIGN SELECTOR: Visible on md+ to prevent mobile blowout */}
            <div className="relative hidden md:flex items-center">
              <div className="absolute left-2.5 pointer-events-none text-slate-400">
                <Filter className="w-3.5 h-3.5" />
              </div>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="pl-7 pr-7 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/70 text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer appearance-none max-w-[110px] sm:max-w-[170px] truncate"
              >
                <option value="all">All Drives</option>
                {campaigns.map((camp) => (
                  <option key={camp.id} value={camp.id}>
                    {camp.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>

            {/* 8. QUICK ACTIONS: Visible on sm+ screens */}
            {permissions.canAddFund && (
              <button
                type="button"
                onClick={onOpenAddFund}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-sm transition"
                title="Record a donor contribution"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden md:inline">+ Fund</span>
              </button>
            )}

            {permissions.canDistributeAid && (
              <button
                type="button"
                onClick={onOpenDistributeAid}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-98 shadow-sm transition"
                title="Distribute relief aid to family"
              >
                <Gift className="w-4 h-4" />
                <span className="hidden md:inline">Distribute</span>
              </button>
            )}

            {/* 9. OPTIONS DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                title="Settings & Tools"
              >
                <Settings className="w-4 h-4" />
              </button>

              {showSettingsDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettingsDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-xs font-medium text-slate-700">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-800">{orgSettings?.name || 'Ekmutho Hashi'}</p>
                      <p className="text-[11px] text-slate-400">
                        {viewMode.toUpperCase()} MODE • {user ? (user.email) : 'Public Guest'}
                      </p>
                    </div>

                    {user && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowSettingsDropdown(false);
                          onOpenProfileSettings();
                        }}
                        className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-slate-50 text-slate-800 transition"
                      >
                        <User className="w-3.5 h-3.5 text-teal-600" />
                        <span>Staff Profile Settings</span>
                      </button>
                    )}

                    {permissions.canManageOrg && onOpenOrgSettings && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowSettingsDropdown(false);
                          onOpenOrgSettings();
                        }}
                        className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-amber-50 text-amber-900 transition"
                      >
                        <Building2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Change Org Name & Logo</span>
                      </button>
                    )}

                    {permissions.canManageStaff && onOpenStaffManagement && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowSettingsDropdown(false);
                          onOpenStaffManagement();
                        }}
                        className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-amber-50 text-amber-900 transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pending Approvals ({totalPendingApprovals})</span>
                      </button>
                    )}

                    {permissions.canManageSupabase && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowSettingsDropdown(false);
                          onOpenConnectModal();
                        }}
                        className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-emerald-50 text-emerald-800 transition font-medium"
                      >
                        <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Supabase Connection Settings</span>
                      </button>
                    )}

                    {permissions.isAdmin && (
                      <>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={() => {
                            setShowSettingsDropdown(false);
                            setShowResetConfirm(true);
                          }}
                          className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-amber-50 text-amber-800 transition"
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
                          className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-rose-50 text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear All Records</span>
                        </button>
                      </>
                    )}

                    {user && (
                      <>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={() => {
                            setShowSettingsDropdown(false);
                            signOutVolunteer();
                          }}
                          className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-rose-50 text-rose-700 transition"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Confirmation Dialogs with Account Password Authorization */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetToSampleData}
        title="Reset to Ramadan 2026 Sample Data?"
        message="This will restore the pre-populated realistic Ramadan Iftar Drive data with donors, inventory, beneficiaries, and expenses. Please enter your account password to authorize."
        confirmText="Yes, Reset Data"
        requirePassword={true}
        onVerifyPassword={verifyUserPassword}
        accountName={user?.user_metadata?.full_name || currentStaffProfile?.fullName || 'Engr. Arman Hossain (Admin)'}
      />

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearAllData}
        title="Clear All Records?"
        message="Are you sure you want to clear all records? This removes all donors, beneficiaries, inventory, and expenses so you can start completely fresh. Please enter your account password to authorize this destructive action."
        confirmText="Yes, Clear Everything"
        isDestructive={true}
        requirePassword={true}
        onVerifyPassword={verifyUserPassword}
        accountName={user?.user_metadata?.full_name || currentStaffProfile?.fullName || 'Engr. Arman Hossain (Admin)'}
      />
    </>
  );
};
