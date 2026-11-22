import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Download,
  Plus,
  Gift,
  Search,
  Filter,
  Trash2,
  TrendingDown,
  ShoppingBag,
  Truck,
  Users
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV } from '../../utils/exportUtils';
import { PaymentMethodBadge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const ExpensesView = ({ onOpenAddExpense, onOpenDistributeAid }) => {
  const {
    expenses,
    campaigns,
    deleteExpense,
    selectedCampaign,
    permissions
  } = useCharity();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, market, logistics, distribution, cashaid
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Filtered Expenses
  const filteredList = useMemo(() => {
    return expenses.filter((e) => {
      // Campaign
      if (selectedCampaign !== 'all' && e.campaignId !== selectedCampaign) {
        return false;
      }
      // Type
      if (filterType !== 'all') {
        if (filterType === 'distribution' && !e.isDistribution) return false;
        if (filterType === 'expense' && e.isDistribution) return false;
        if (filterType === 'market' && !e.type.includes('Market')) return false;
        if (filterType === 'logistics' && !e.type.includes('Logistics') && !e.type.includes('Packaging')) return false;
        if (filterType === 'cashaid' && !e.type.includes('Cash Aid')) return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mNote = e.note?.toLowerCase().includes(q);
        const mType = e.type?.toLowerCase().includes(q);
        const mBen = e.linkedBeneficiaryName?.toLowerCase().includes(q);
        const mBy = e.handledBy?.toLowerCase().includes(q);
        return mNote || mType || mBen || mBy;
      }
      return true;
    });
  }, [expenses, selectedCampaign, filterType, searchQuery]);

  // Aggregate stats
  const totalMonetarySpent = useMemo(() => {
    return filteredList.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [filteredList]);

  const totalDistributionsCount = useMemo(() => {
    return filteredList.filter(e => e.isDistribution).length;
  }, [filteredList]);

  const handleExportCSV = () => {
    const exportData = filteredList.map((e) => {
      const camp = campaigns.find(c => c.id === e.campaignId);
      const itemsStr = e.items && e.items.length > 0
        ? e.items.map(i => `${i.quantity} ${i.unit} ${i.productName}`).join('; ')
        : 'N/A';

      return {
        'Expense ID': e.id,
        'Date': e.date,
        'Campaign': camp?.name || e.campaignId,
        'Category / Type': e.type,
        'Is Distribution': e.isDistribution ? 'Yes' : 'No',
        'Beneficiary': e.linkedBeneficiaryName || 'N/A',
        'Amount (BDT)': e.amount,
        'Items Distributed / Purchased': itemsStr,
        'Payment Method': e.paymentMethod,
        'Handled By': e.handledBy,
        'Memo / Note': e.note
      };
    });

    exportToCSV(exportData, `ekmutho_hashi_expenses_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Expenses & Distribution Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {filteredList.length} Entries
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            পাইকারি বাজার ক্রয়, ভ্যান ভাড়া, প্যাকেজিং এবং পরিবারভিত্তিক ত্রাণ বিতরণের হিসাব
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {permissions.canAddExpense && (
            <button
              type="button"
              onClick={onOpenAddExpense}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition active:scale-98"
            >
              <TrendingDown className="w-4 h-4" />
              <span>+ Add Expense</span>
            </button>
          )}

          {permissions.canDistributeAid && (
            <button
              type="button"
              onClick={onOpenDistributeAid}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition active:scale-98"
            >
              <Gift className="w-4 h-4" />
              <span>+ Distribute Aid</span>
            </button>
          )}
        </div>
      </div>

      {/* Mini KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Cash Spent (Filtered)
            </span>
            <span className="text-xl font-black text-amber-700 font-mono mt-0.5 block">
              {formatCurrency(totalMonetarySpent)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Aid Distribution Logs
            </span>
            <span className="text-xl font-black text-teal-800 font-mono mt-0.5 block">
              {totalDistributionsCount} Distributions Handed
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
            <Gift className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Log Records
            </span>
            <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">
              {filteredList.length} Transactions
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Memo note, Beneficiary name, Volunteer..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-amber-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white"
          >
            <option value="all">All Entries (Expenses & Distributions)</option>
            <option value="expense">Cash Expenses Only</option>
            <option value="market">Market Wholesale Purchases</option>
            <option value="logistics">Transport & Packaging</option>
            <option value="distribution">Package Aid Distributions</option>
            <option value="cashaid">Direct Cash Aid Distributions</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Type & Purpose</th>
                <th className="py-3.5 px-4">Beneficiary / Destination</th>
                <th className="py-3.5 px-4">Items Included</th>
                <th className="py-3.5 px-4">Amount / Cost</th>
                <th className="py-3.5 px-4">Payment & By</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.length > 0 ? (
                filteredList.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-500">
                        {formatDate(item.date)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              item.isDistribution
                                ? 'bg-teal-100 text-teal-800'
                                : item.type.includes('Market')
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-1">
                          {item.note || 'Relief operational expense'}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        {item.linkedBeneficiaryName ? (
                          <div className="flex items-center gap-1.5 font-bold text-teal-900">
                            <Users className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{item.linkedBeneficiaryName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Wholesale / Vendor</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {item.items && item.items.length > 0 ? (
                          <div className="space-y-0.5">
                            {item.items.map((it, idx) => (
                              <span
                                key={idx}
                                className="inline-block text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded mr-1 mb-1"
                              >
                                {it.quantity} {it.unit} {it.productName}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Direct Payment / No items</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {item.amount > 0 ? (
                          <span className="font-black text-amber-700 font-mono text-sm block">
                            {formatCurrency(item.amount)}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs italic font-mono">
                            ৳0 (Stock Package)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <PaymentMethodBadge method={item.paymentMethod} />
                        <span className="block text-[11px] text-slate-500 mt-1">
                          By: {item.handledBy}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {permissions.isAdmin && (
                          <button
                            type="button"
                            onClick={() => setExpenseToDelete(item)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No expense or distribution records match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Expense Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(expenseToDelete)}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={() => {
          if (expenseToDelete) deleteExpense(expenseToDelete.id);
        }}
        title="Delete Expense / Distribution Log?"
        message={`Are you sure you want to delete this log entry (${expenseToDelete?.type})?`}
        confirmText="Yes, Delete"
        isDestructive={true}
      />
    </div>
  );
};
