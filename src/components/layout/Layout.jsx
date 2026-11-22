import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../common/Toast';
import { useCharity } from '../../context/CharityContext';
import { Crown, Eye, User, Sparkles } from 'lucide-react';

export const Layout = ({
  activeTab,
  setActiveTab,
  onOpenAddFund,
  onOpenAddExpense,
  onOpenDistributeAid,
  onOpenAuthModal,
  onOpenConnectModal,
  onOpenProfileSettings,
  onOpenStaffManagement,
  onOpenOrgSettings,
  onOpenPublicDonation,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { viewMode, setViewMode, isUserAdmin } = useCharity();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Admin Preview Switcher Notice Bar (Shown when Admin previews Staff or Public view) */}
      {isUserAdmin && viewMode !== 'admin' && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-sm sticky top-0 z-40 no-print">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-200" />
            <span>
              Admin Preview Active: Viewing as{' '}
              <span className="underline uppercase tracking-wider">
                {viewMode === 'staff' ? '🤝 Staff View (Role-based)' : '🌐 Public View (Read-Only)'}
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setViewMode('admin')}
            className="px-3 py-1 bg-slate-900 hover:bg-black text-amber-300 font-bold rounded-lg transition text-[11px] shadow-xs active:scale-95"
          >
            ← Return to Admin View
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onOpenProfileSettings={onOpenProfileSettings}
        onOpenStaffManagement={onOpenStaffManagement}
        onOpenOrgSettings={onOpenOrgSettings}
        onOpenAuthModal={onOpenAuthModal}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-300">
        {/* Sticky Topbar */}
        <Topbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenAddFund={onOpenAddFund}
          onOpenAddExpense={onOpenAddExpense}
          onOpenDistributeAid={onOpenDistributeAid}
          onOpenAuthModal={onOpenAuthModal}
          onOpenConnectModal={onOpenConnectModal}
          onOpenProfileSettings={onOpenProfileSettings}
          onOpenStaffManagement={onOpenStaffManagement}
          onOpenOrgSettings={onOpenOrgSettings}
          onOpenPublicDonation={onOpenPublicDonation}
        />

        {/* Page View Body */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};
