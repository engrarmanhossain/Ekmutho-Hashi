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

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Quick Action Modal states
  const [isAddFundOpen, setIsAddFundOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isDistributeAidOpen, setIsDistributeAidOpen] = useState(false);
  const [distributeInitialBeneficiaryId, setDistributeInitialBeneficiaryId] = useState(null);

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
