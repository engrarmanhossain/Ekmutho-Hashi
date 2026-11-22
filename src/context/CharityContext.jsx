import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  initialCampaigns,
  initialDonors,
  initialBeneficiaries,
  initialInventory,
  initialPackages,
  initialExpenses
} from '../data/initialData';

const CharityContext = createContext(null);

export const CharityProvider = ({ children }) => {
  // LocalStorage state initialization
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('ekmutho_campaigns');
    return saved ? JSON.parse(saved) : initialCampaigns;
  });

  const [donors, setDonors] = useState(() => {
    const saved = localStorage.getItem('ekmutho_donors');
    return saved ? JSON.parse(saved) : initialDonors;
  });

  const [beneficiaries, setBeneficiaries] = useState(() => {
    const saved = localStorage.getItem('ekmutho_beneficiaries');
    return saved ? JSON.parse(saved) : initialBeneficiaries;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('ekmutho_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [packages, setPackages] = useState(() => {
    const saved = localStorage.getItem('ekmutho_packages');
    return saved ? JSON.parse(saved) : initialPackages;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('ekmutho_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [selectedCampaign, setSelectedCampaign] = useState(() => {
    return localStorage.getItem('ekmutho_selected_campaign') || 'all';
  });

  // Toasts notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('ekmutho_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('ekmutho_donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('ekmutho_beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  useEffect(() => {
    localStorage.setItem('ekmutho_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('ekmutho_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('ekmutho_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('ekmutho_selected_campaign', selectedCampaign);
  }, [selectedCampaign]);

  // Filtered lists based on current campaign selection
  const filteredDonors = useMemo(() => {
    if (selectedCampaign === 'all') return donors;
    return donors.filter(d => d.campaignId === selectedCampaign);
  }, [donors, selectedCampaign]);

  const filteredExpenses = useMemo(() => {
    if (selectedCampaign === 'all') return expenses;
    return expenses.filter(e => e.campaignId === selectedCampaign);
  }, [expenses, selectedCampaign]);

  // Derived financial & KPI figures
  const totalCashCollected = useMemo(() => {
    return filteredDonors
      .filter(d => d.contributionType === 'cash')
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  }, [filteredDonors]);

  const totalProductDonationsValue = useMemo(() => {
    return filteredDonors
      .filter(d => d.contributionType === 'product')
      .reduce((sum, d) => sum + (Number(d.productDetails?.estimatedValue) || 0), 0);
  }, [filteredDonors]);

  const totalFundCollected = useMemo(() => {
    return totalCashCollected + totalProductDonationsValue;
  }, [totalCashCollected, totalProductDonationsValue]);

  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [filteredExpenses]);

  const cashBalance = useMemo(() => {
    return totalCashCollected - totalSpent;
  }, [totalCashCollected, totalSpent]);

  const totalFamiliesServed = useMemo(() => {
    if (selectedCampaign === 'all') {
      return beneficiaries.filter(b => b.status === 'Delivered' || (b.aidHistory && b.aidHistory.length > 0)).length;
    }
    return beneficiaries.filter(b =>
      b.aidHistory && b.aidHistory.some(a => a.campaignId === selectedCampaign)
    ).length;
  }, [beneficiaries, selectedCampaign]);

  const totalPackagesDistributed = useMemo(() => {
    return filteredExpenses.filter(e => e.isDistribution && e.type.includes('Package')).length;
  }, [filteredExpenses]);

  // Helper to get remaining stock for a product
  const getProductStock = (productId) => {
    const prod = inventory.find(p => p.id === productId);
    if (!prod) return 0;
    return (Number(prod.qtyPurchased) || 0) + (Number(prod.qtyDonated) || 0) - (Number(prod.qtyDistributed) || 0);
  };

  // Action: Add Campaign
  const addCampaign = (campaignData) => {
    const newCamp = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      status: campaignData.status || 'active'
    };
    setCampaigns(prev => [newCamp, ...prev]);
    addToast(`Campaign "${newCamp.name}" created successfully!`);
    return newCamp;
  };

  const updateCampaign = (updatedCamp) => {
    setCampaigns(prev => prev.map(c => c.id === updatedCamp.id ? updatedCamp : c));
    addToast(`Campaign "${updatedCamp.name}" updated!`);
  };

  const deleteCampaign = (id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    if (selectedCampaign === id) {
      setSelectedCampaign('all');
    }
    addToast('Campaign deleted.', 'info');
  };

  // Action: Add Donor
  const addDonor = (donorData) => {
    const nextReceiptNum = 1000 + donors.length + 1;
    const newDonor = {
      ...donorData,
      id: `DON-${Date.now().toString().slice(-4)}`,
      receiptId: `EH-REC-${nextReceiptNum}`,
      date: donorData.date || new Date().toISOString().split('T')[0]
    };

    // If direct product donation, optionally credit inventory
    if (newDonor.contributionType === 'product' && newDonor.productDetails?.productId) {
      const prodId = newDonor.productDetails.productId;
      const qty = Number(newDonor.productDetails.quantity) || 0;
      setInventory(prev => prev.map(item => {
        if (item.id === prodId) {
          return {
            ...item,
            qtyDonated: (Number(item.qtyDonated) || 0) + qty
          };
        }
        return item;
      }));
    }

    setDonors(prev => [newDonor, ...prev]);
    addToast(`Donation recorded from ${newDonor.donorName}! Receipt: ${newDonor.receiptId}`);
    return newDonor;
  };

  const deleteDonor = (id) => {
    const d = donors.find(x => x.id === id);
    setDonors(prev => prev.filter(x => x.id !== id));
    addToast(`Donation record ${d?.receiptId || ''} deleted.`, 'info');
  };

  // Action: Add Beneficiary
  const addBeneficiary = (data) => {
    const nextFamNum = String(beneficiaries.length + 1).padStart(3, '0');
    const newBeneficiary = {
      ...data,
      id: `BEN-${Date.now().toString().slice(-4)}`,
      familyId: `EH-FAM-${nextFamNum}`,
      tokenNumber: `TKN-${nextFamNum}`,
      status: data.status || 'Pending',
      aidHistory: []
    };
    setBeneficiaries(prev => [newBeneficiary, ...prev]);
    addToast(`Family ${newBeneficiary.headName} registered with Token ${newBeneficiary.tokenNumber}`);
    return newBeneficiary;
  };

  const updateBeneficiary = (updated) => {
    setBeneficiaries(prev => prev.map(b => b.id === updated.id ? updated : b));
    addToast(`Updated record for ${updated.headName}`);
  };

  const deleteBeneficiary = (id) => {
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
    addToast('Beneficiary record removed.', 'info');
  };

  // Action: Inventory Products
  const addProduct = (prodData) => {
    const newProd = {
      ...prodData,
      id: `PROD-${Date.now().toString().slice(-4)}`,
      qtyPurchased: Number(prodData.qtyPurchased) || 0,
      qtyDonated: Number(prodData.qtyDonated) || 0,
      qtyDistributed: 0,
      unitCost: Number(prodData.unitCost) || 0,
      minAlertStock: Number(prodData.minAlertStock) || 10
    };
    setInventory(prev => [...prev, newProd]);
    addToast(`Product "${newProd.name}" added to inventory.`);
    return newProd;
  };

  const updateProduct = (updatedProd) => {
    setInventory(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    addToast(`Product "${updatedProd.name}" updated.`);
  };

  const deleteProduct = (id) => {
    setInventory(prev => prev.filter(p => p.id !== id));
    addToast('Product removed from inventory.', 'info');
  };

  // Action: Packages / Bundles
  const addPackage = (pkgData) => {
    const newPkg = {
      ...pkgData,
      id: `PKG-${Date.now().toString().slice(-4)}`
    };
    setPackages(prev => [...prev, newPkg]);
    addToast(`Relief package bundle "${newPkg.name}" created!`);
    return newPkg;
  };

  const updatePackage = (updatedPkg) => {
    setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));
    addToast(`Package "${updatedPkg.name}" updated.`);
  };

  const deletePackage = (id) => {
    setPackages(prev => prev.filter(p => p.id !== id));
    addToast('Package bundle removed.', 'info');
  };

  // Action: Add Expense (General Market Purchase, Logistics, etc.)
  const addExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      id: `EXP-${Date.now().toString().slice(-4)}`,
      amount: Number(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      isDistribution: false
    };

    // If wholesale purchase items are provided, auto-increment inventory
    if (expenseData.addToInventory && expenseData.items && expenseData.items.length > 0) {
      setInventory(prev => prev.map(item => {
        const matchingPurchasedItem = expenseData.items.find(pi => pi.productId === item.id);
        if (matchingPurchasedItem) {
          const addedQty = Number(matchingPurchasedItem.quantity) || 0;
          return {
            ...item,
            qtyPurchased: (Number(item.qtyPurchased) || 0) + addedQty
          };
        }
        return item;
      }));
    }

    setExpenses(prev => [newExpense, ...prev]);
    addToast(`Expense ৳${newExpense.amount} logged (${newExpense.type})`);
    return newExpense;
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    addToast('Expense record removed.', 'info');
  };

  // Action: Distribute Aid (Package, Cash, or Items)
  const distributeAid = ({
    beneficiaryId,
    campaignId,
    distributionType, // 'package' | 'cash' | 'custom'
    packageId,
    customItems = [],
    cashAmount = 0,
    handledBy = 'Volunteer Team',
    note = ''
  }) => {
    const beneficiary = beneficiaries.find(b => b.id === beneficiaryId);
    if (!beneficiary) {
      throw new Error('Please select a valid beneficiary family.');
    }

    const campaign = campaigns.find(c => c.id === campaignId) || campaigns[0];

    // Determine items to deduct
    let itemsToDeduct = [];
    let packageInfo = null;

    if (distributionType === 'package') {
      packageInfo = packages.find(p => p.id === packageId);
      if (!packageInfo) {
        throw new Error('Please select a valid relief package.');
      }
      itemsToDeduct = packageInfo.items;
    } else if (distributionType === 'custom') {
      itemsToDeduct = customItems;
    }

    // Check inventory stock (prevent negative stock!)
    for (const item of itemsToDeduct) {
      const prod = inventory.find(p => p.id === item.productId);
      if (!prod) continue;
      const currentAvailable = (Number(prod.qtyPurchased) || 0) + (Number(prod.qtyDonated) || 0) - (Number(prod.qtyDistributed) || 0);
      const needed = Number(item.quantity) || 0;
      if (needed > currentAvailable) {
        throw new Error(`Insufficient stock for "${prod.name}". Available: ${currentAvailable} ${prod.unit}, required: ${needed} ${prod.unit}.`);
      }
    }

    // Deduct stock from inventory
    if (itemsToDeduct.length > 0) {
      setInventory(prev => prev.map(prod => {
        const itemToDeduct = itemsToDeduct.find(i => i.productId === prod.id);
        if (itemToDeduct) {
          const deductQty = Number(itemToDeduct.quantity) || 0;
          return {
            ...prod,
            qtyDistributed: (Number(prod.qtyDistributed) || 0) + deductQty
          };
        }
        return prod;
      }));
    }

    // Create aid history entry
    const aidEntry = {
      id: `AID-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      campaignId: campaign.id,
      campaignName: campaign.name,
      type: distributionType === 'cash' ? 'Cash Aid' : (packageInfo ? 'Package' : 'Custom Relief Items'),
      description: distributionType === 'cash'
        ? `Direct Cash Assistance (৳${cashAmount})`
        : (packageInfo ? `${packageInfo.name} (${itemsToDeduct.map(i => `${i.quantity} ${i.unit} ${i.productName}`).join(', ')})` : itemsToDeduct.map(i => `${i.quantity} ${i.unit} ${i.productName}`).join(', ')),
      amount: distributionType === 'cash' ? Number(cashAmount) : 0,
      handledBy
    };

    // Update Beneficiary status to Delivered and push aid history
    setBeneficiaries(prev => prev.map(b => {
      if (b.id === beneficiaryId) {
        return {
          ...b,
          status: 'Delivered',
          aidHistory: [aidEntry, ...(b.aidHistory || [])]
        };
      }
      return b;
    }));

    // Log in Expenses as distribution record
    const distributionExpense = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      campaignId: campaign.id,
      type: distributionType === 'cash' ? 'Beneficiary Cash Aid' : 'Beneficiary Package Distribution',
      category: distributionType === 'cash' ? 'Direct Cash Aid' : 'Aid Distribution',
      amount: distributionType === 'cash' ? Number(cashAmount) : 0,
      paymentMethod: 'Hand Cash',
      handledBy,
      linkedBeneficiaryId: beneficiary.id,
      linkedBeneficiaryName: `${beneficiary.headName} (${beneficiary.tokenNumber})`,
      note: note || `Aid handed to ${beneficiary.headName} against Token ${beneficiary.tokenNumber}`,
      items: itemsToDeduct.map(i => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        unit: i.unit
      })),
      isDistribution: true
    };

    setExpenses(prev => [distributionExpense, ...prev]);
    addToast(`Aid successfully distributed to ${beneficiary.headName}!`);
    return { aidEntry, distributionExpense };
  };

  // Reset to initial sample data
  const resetToSampleData = () => {
    setCampaigns(initialCampaigns);
    setDonors(initialDonors);
    setBeneficiaries(initialBeneficiaries);
    setInventory(initialInventory);
    setPackages(initialPackages);
    setExpenses(initialExpenses);
    setSelectedCampaign('all');
    localStorage.clear();
    addToast('Sample Ramadan Iftar data has been reloaded!');
  };

  // Clear all data for a completely clean start
  const clearAllData = () => {
    const blankCampaign = [
      {
        id: 'camp-default',
        name: 'Ramadan Relief Drive 2026',
        banglaName: 'রমজান ত্রাণ কর্মসূচি',
        description: 'New blank campaign ready for setup.',
        targetAmount: 100000,
        targetFamilies: 50,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'active',
        category: 'Ramadan & Food Relief',
        bannerColor: 'emerald'
      }
    ];
    setCampaigns(blankCampaign);
    setDonors([]);
    setBeneficiaries([]);
    setInventory([]);
    setPackages([]);
    setExpenses([]);
    setSelectedCampaign('all');
    localStorage.clear();
    addToast('All records cleared. Fresh blank slate ready.', 'info');
  };

  const value = {
    campaigns,
    donors,
    beneficiaries,
    inventory,
    packages,
    expenses,
    selectedCampaign,
    setSelectedCampaign,
    filteredDonors,
    filteredExpenses,
    totalCashCollected,
    totalProductDonationsValue,
    totalFundCollected,
    totalSpent,
    cashBalance,
    totalFamiliesServed,
    totalPackagesDistributed,
    totalBeneficiariesCount: beneficiaries.length,
    getProductStock,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addDonor,
    deleteDonor,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    addProduct,
    updateProduct,
    deleteProduct,
    addPackage,
    updatePackage,
    deletePackage,
    addExpense,
    deleteExpense,
    distributeAid,
    resetToSampleData,
    clearAllData,
    toasts,
    addToast,
    removeToast
  };

  return (
    <CharityContext.Provider value={value}>
      {children}
    </CharityContext.Provider>
  );
};

export const useCharity = () => {
  const context = useContext(CharityContext);
  if (!context) {
    throw new Error('useCharity must be used within a CharityProvider');
  }
  return context;
};
