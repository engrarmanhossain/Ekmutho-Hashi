import React, { useState } from 'react';
import { CharityProvider } from './context/CharityContext';
import { Layout } from './components/layout/Layout';

// Views
import { DashboardView } from './components/views/DashboardView';
import { CampaignsView } from './components/views/CampaignsView';
import { DonorsView } from './components/views/DonorsView';
import { BeneficiariesView } from './components/views/BeneficiariesView';
import { InventoryView } from './components/views/InventoryView';
import { ExpensesView } from './components/views/ExpensesView';
import { ReportsView } from './components/views/ReportsView';

// Modals
import { AddFundModal } from './components/modals/AddFundModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { DistributeAidModal } from './components/modals/DistributeAidModal';
import { DonorReceiptModal } from './components/modals/DonorReceiptModal';
import { BeneficiaryTokenModal } from './components/modals/BeneficiaryTokenModal';
import { FamilyDetailsModal } from './components/modals/FamilyDetailsModal';
import { SupabaseConnectModal } from './components/modals/SupabaseConnectModal';
import { AuthModal } from './components/modals/AuthModal';
import { ProfileSettingsModal } from './components/modals/ProfileSettingsModal';
import { StaffManagementModal } from './components/modals/StaffManagementModal';
import { OrgSettingsModal } from './components/modals/OrgSettingsModal';
import { PublicDonationModal } from './components/modals/PublicDonationModal';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Quick Action Modal states
  const [isAddFundOpen, setIsAddFundOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isDistributeAidOpen, setIsDistributeAidOpen] = useState(false);
  const [distributeInitialBeneficiaryId, setDistributeInitialBeneficiaryId] = useState(null);

  // Cloud & Auth Modals
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isStaffManagementOpen, setIsStaffManagementOpen] = useState(false);
  const [isOrgSettingsOpen, setIsOrgSettingsOpen] = useState(false);
  const [isPublicDonationOpen, setIsPublicDonationOpen] = useState(false);

  // Document Viewers states
  const [receiptDonor, setReceiptDonor] = useState(null);
  const [tokenBeneficiary, setTokenBeneficiary] = useState(null);
  const [detailsBeneficiary, setDetailsBeneficiary] = useState(null);

  const handleOpenDistributeAid = (beneficiaryId = null) => {
    setDistributeInitialBeneficiaryId(beneficiaryId);
    setIsDistributeAidOpen(true);
  };

  const handleReceiptCreated = (donorRecord) => {
    setReceiptDonor(donorRecord);
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenAddFund={() => setIsAddFundOpen(true)}
      onOpenAddExpense={() => setIsAddExpenseOpen(true)}
      onOpenDistributeAid={() => handleOpenDistributeAid(null)}
      onOpenAuthModal={() => setIsAuthModalOpen(true)}
      onOpenConnectModal={() => setIsConnectModalOpen(true)}
      onOpenProfileSettings={() => setIsProfileModalOpen(true)}
      onOpenStaffManagement={() => setIsStaffManagementOpen(true)}
      onOpenOrgSettings={() => setIsOrgSettingsOpen(true)}
      onOpenPublicDonation={() => setIsPublicDonationOpen(true)}
    >
      {/* Dynamic View rendering */}
      {activeTab === 'dashboard' && (
        <DashboardView
          setActiveTab={setActiveTab}
          onOpenAddFund={() => setIsAddFundOpen(true)}
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
          onOpenDistributeAid={() => handleOpenDistributeAid(null)}
          onOpenReceipt={(donor) => setReceiptDonor(donor)}
          onOpenToken={(beneficiary) => setTokenBeneficiary(beneficiary)}
        />
      )}

      {activeTab === 'campaigns' && <CampaignsView />}

      {activeTab === 'donors' && (
        <DonorsView
          onOpenAddFund={() => setIsAddFundOpen(true)}
          onOpenReceipt={(donor) => setReceiptDonor(donor)}
        />
      )}

      {activeTab === 'beneficiaries' && (
        <BeneficiariesView
          onOpenDistributeAid={(benId) => handleOpenDistributeAid(benId)}
          onOpenToken={(beneficiary) => setTokenBeneficiary(beneficiary)}
          onOpenFamilyDetails={(beneficiary) => setDetailsBeneficiary(beneficiary)}
        />
      )}

      {activeTab === 'inventory' && (
        <InventoryView
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
        />
      )}

      {activeTab === 'expenses' && (
        <ExpensesView
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
          onOpenDistributeAid={() => handleOpenDistributeAid(null)}
        />
      )}

      {activeTab === 'reports' && <ReportsView />}

      {/* Global Quick Action Modals */}
      <AddFundModal
        isOpen={isAddFundOpen}
        onClose={() => setIsAddFundOpen(false)}
        onReceiptCreated={handleReceiptCreated}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />

      <DistributeAidModal
        isOpen={isDistributeAidOpen}
        onClose={() => {
          setIsDistributeAidOpen(false);
          setDistributeInitialBeneficiaryId(null);
        }}
        initialBeneficiaryId={distributeInitialBeneficiaryId}
      />

      {/* Printable Document Modals */}
      <DonorReceiptModal
        isOpen={Boolean(receiptDonor)}
        onClose={() => setReceiptDonor(null)}
        donor={receiptDonor}
      />

      <BeneficiaryTokenModal
        isOpen={Boolean(tokenBeneficiary)}
        onClose={() => setTokenBeneficiary(null)}
        beneficiary={tokenBeneficiary}
      />

      <FamilyDetailsModal
        isOpen={Boolean(detailsBeneficiary)}
        onClose={() => setDetailsBeneficiary(null)}
        beneficiary={detailsBeneficiary}
        onOpenDistribute={(benId) => handleOpenDistributeAid(benId)}
        onOpenToken={(beneficiary) => setTokenBeneficiary(beneficiary)}
      />

      {/* Supabase Cloud Connect & Auth Modals */}
      <SupabaseConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />

      {/* Staff Profile Settings & Admin Management Modals */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenStaffManagement={() => setIsStaffManagementOpen(true)}
      />

      <StaffManagementModal
        isOpen={isStaffManagementOpen}
        onClose={() => setIsStaffManagementOpen(false)}
      />

      {/* Admin Organization & Branding Settings Modal */}
      <OrgSettingsModal
        isOpen={isOrgSettingsOpen}
        onClose={() => setIsOrgSettingsOpen(false)}
      />

      {/* Public Guest Donation Information & Pledge Modal */}
      <PublicDonationModal
        isOpen={isPublicDonationOpen}
        onClose={() => setIsPublicDonationOpen(false)}
      />
    </Layout>
  );
}

export default function App() {
  return (
    <CharityProvider>
      <AppContent />
    </CharityProvider>
  );
}
