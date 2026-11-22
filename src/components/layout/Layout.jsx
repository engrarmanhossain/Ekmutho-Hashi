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
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-300">
        {/* Sticky Topbar */}
        <Topbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenAddFund={onOpenAddFund}
          onOpenAddExpense={onOpenAddExpense}
          onOpenDistributeAid={onOpenDistributeAid}
        />

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};
