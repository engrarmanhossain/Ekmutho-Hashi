import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../common/Toast';

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
  onOpenPublicApply,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
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
        onOpenPublicDonation={onOpenPublicDonation}
        onOpenPublicApply={onOpenPublicApply}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-300 w-full max-w-full min-w-0 overflow-x-hidden">
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
          onOpenPublicApply={onOpenPublicApply}
        />

        {/* Page View Body */}
        <main className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl w-full min-w-0 mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Floating Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};
