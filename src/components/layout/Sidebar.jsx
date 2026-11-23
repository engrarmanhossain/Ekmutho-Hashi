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
  ShieldCheck,
  Building2,
  LogIn,
  Eye,
  UserCheck,
  Heart
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  onOpenProfileSettings,
  onOpenStaffManagement,
  onOpenOrgSettings,
  onOpenAuthModal,
  onOpenPublicDonation,
  onOpenPublicApply
}) => {
  const {
    campaigns,
    donors,
    beneficiaries,
    inventory,
    expenses,
    staff,
    user,
    orgSettings,
    viewMode,
    permissions,
    currentStaffProfile,
    isUserAdmin
  } = useCharity();

  const pendingStaffCount = staff ? staff.filter(s => s.status === 'pending').length : 0;

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

  // In public mode, hide sensitive Donor and Beneficiary tabs for family & donor privacy
  const isPublicMode = viewMode === 'public' || permissions?.isPublic;
  const visibleNavItems = navItems.filter((item) => {
    if (isPublicMode && (item.id === 'donors' || item.id === 'beneficiaries')) {
      return false;
    }
    return true;
  });

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
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Dynamic Org Logo */}
            <div className="relative w-12 h-12 rounded-xl bg-white p-1 shadow-md border border-amber-400/40 shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src={orgSettings?.logoUrl || '/logo.png'}
                alt={orgSettings?.name || 'Ekmutho Hashi'}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Dynamic Org Title */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm tracking-tight text-white leading-tight truncate">
                  {orgSettings?.name || 'Ekmutho Hashi'}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 shrink-0">
                  BD
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium font-sans truncate">
                {orgSettings?.banglaName || 'একমুঠো হাসি'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {viewMode === 'admin'
                  ? 'Admin Master Control'
                  : viewMode === 'staff'
                  ? 'Volunteer Field Portal'
                  : 'Public Relief Ledger'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Indicator Banner in Sidebar */}
        <div className="px-3 pt-3">
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between border ${
              viewMode === 'admin'
                ? 'bg-amber-500/15 border-amber-400/30 text-amber-300'
                : viewMode === 'staff'
                ? 'bg-teal-500/15 border-teal-400/30 text-teal-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {viewMode === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
              {viewMode === 'staff' && <UserCheck className="w-3.5 h-3.5 text-teal-400" />}
              {viewMode === 'public' && <Eye className="w-3.5 h-3.5 text-slate-400" />}
              <span className="capitalize">{viewMode} Mode</span>
            </span>

            {permissions.canManageOrg && onOpenOrgSettings && (
              <button
                type="button"
                onClick={onOpenOrgSettings}
                className="p-1 text-slate-400 hover:text-amber-300 transition"
                title="Change Org Name & Logo"
              >
                <Building2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1 text-[10px] font-bold tracking-wider uppercase text-slate-400/90">
            Navigation Menu
          </div>

          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <div className="truncate">
                    <span className="block leading-snug">{item.label}</span>
                    <span
                      className={`block text-[10px] leading-tight ${
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

          {isPublicMode && (
            <div className="pt-3 pb-1 border-t border-slate-800/80 space-y-2">
              <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-amber-400/90">
                Public Gateway / নাগরিক সেবা
              </div>

              {onOpenPublicApply && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenPublicApply();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left font-semibold text-sm bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition shadow-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition" />
                    <div className="truncate">
                      <span className="block leading-snug">Apply for Relief Aid</span>
                      <span className="block text-[10px] text-amber-200/80 leading-tight">
                        দুস্থ পরিবার সহায়তা আবেদন
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-400 text-slate-950 uppercase">
                    Apply
                  </span>
                </button>
              )}

              {onOpenPublicDonation && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenPublicDonation();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left font-semibold text-sm bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition shadow-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Heart className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition" />
                    <div className="truncate">
                      <span className="block leading-snug">Donate to Relief Fund</span>
                      <span className="block text-[10px] text-emerald-200/80 leading-tight">
                        তহবিলে অনুদান প্রদান
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-400 text-slate-950 uppercase">
                    Donate
                  </span>
                </button>
              )}
            </div>
          )}
        </nav>

        {/* Leadership & Verification Footer */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          {/* Authenticated Staff / Admin Card */}
          {user ? (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (isUserAdmin && onOpenStaffManagement) {
                  onOpenStaffManagement();
                } else if (onOpenProfileSettings) {
                  onOpenProfileSettings();
                }
              }}
              className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-amber-500/30 flex items-center justify-between gap-2.5 transition group cursor-pointer"
              title="Click to view leadership & staff controls"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
                  {currentStaffProfile?.avatarUrl ? (
                    <img
                      src={currentStaffProfile.avatarUrl}
                      alt={user?.user_metadata?.full_name || 'Staff'}
                      className="w-full h-full object-cover"
                    />
                  ) : isUserAdmin ? (
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-teal-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-white truncate group-hover:text-amber-200">
                    {isUserAdmin
                      ? orgSettings?.president || 'Engr. Arman Hossain'
                      : user?.user_metadata?.full_name || 'Staff Member'}
                  </p>
                  <p className="text-[10px] text-amber-300 font-semibold truncate">
                    {isUserAdmin
                      ? orgSettings?.designation || 'Admin, President & CEO'
                      : currentStaffProfile?.role || 'Field Volunteer'}
                  </p>
                </div>
              </div>

              {isUserAdmin && pendingStaffCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse shrink-0">
                  {pendingStaffCount}
                </span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenAuthModal && onOpenAuthModal();
              }}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white flex items-center justify-center gap-2 text-xs font-bold shadow-xs transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Volunteer / Staff Login</span>
            </button>
          )}

          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-0.5">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>100% Transparent Relief Ledger</span>
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">
              Community funds & Ramadan grocery kits directly in poor families' hands.
            </p>
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-400 px-1">
            <span>{orgSettings?.name || 'Ekmutho Hashi'}</span>
            <span className="text-amber-400 font-semibold">
              Ramadan 1447H
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
