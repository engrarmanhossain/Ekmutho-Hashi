import React, { useState, useMemo } from 'react';
import {
  HeartHandshake,
  Search,
  Filter,
  Download,
  Plus,
  Printer,
  Trash2,
  FileSpreadsheet,
  Receipt,
  UserCheck
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV } from '../../utils/exportUtils';
import { PaymentMethodBadge, Badge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const DonorsView = ({ onOpenAddFund, onOpenReceipt }) => {
  const {
    donors,
    campaigns,
    deleteDonor,
    selectedCampaign,
    setSelectedCampaign,
    permissions
  } = useCharity();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, cash, product
  const [filterPayment, setFilterPayment] = useState('all');
  const [donorToDelete, setDonorToDelete] = useState(null);

  // Filtered Donors
  const filteredList = useMemo(() => {
    return donors.filter((d) => {
      // Campaign filter
      if (selectedCampaign !== 'all' && d.campaignId !== selectedCampaign) {
        return false;
      }
      // Contribution type filter
      if (filterType !== 'all' && d.contributionType !== filterType) {
        return false;
      }
      // Payment method filter
      if (filterPayment !== 'all' && d.paymentMethod !== filterPayment) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = d.donorName?.toLowerCase().includes(q);
        const matchesPhone = d.phone?.toLowerCase().includes(q);
        const matchesReceipt = d.receiptId?.toLowerCase().includes(q);
        const matchesRef = d.reference?.toLowerCase().includes(q);
        const matchesNote = d.note?.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesReceipt || matchesRef || matchesNote;
      }
      return true;
    });
  }, [donors, selectedCampaign, filterType, filterPayment, searchQuery]);

  // Aggregate stats
  const totalCashInFiltered = useMemo(() => {
    return filteredList
      .filter(d => d.contributionType === 'cash')
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  }, [filteredList]);

  const totalProductValFiltered = useMemo(() => {
    return filteredList
      .filter(d => d.contributionType === 'product')
      .reduce((sum, d) => sum + (Number(d.productDetails?.estimatedValue) || 0), 0);
  }, [filteredList]);

  const handleExportCSV = () => {
    const exportData = filteredList.map((d) => {
      const camp = campaigns.find(c => c.id === d.campaignId);
      return {
        'Receipt ID': d.receiptId,
        'Donor Name': d.donorName,
        'Phone Number': d.phone,
        'Reference': d.reference,
        'Campaign': camp?.name || d.campaignId,
        'Contribution Type': d.contributionType === 'cash' ? 'Cash' : 'Product In-Kind',
        'Cash Amount (BDT)': d.contributionType === 'cash' ? d.amount : 0,
        'Product Details': d.contributionType === 'product'
          ? `${d.productDetails?.quantity} ${d.productDetails?.unit} of ${d.productDetails?.productName} (Est. ৳${d.productDetails?.estimatedValue})`
          : '',
        'Payment Method': d.paymentMethod,
        'Transaction ID': d.transactionId || '',
        'Date': d.date,
        'Note / Purpose': d.note || ''
      };
    });

    exportToCSV(exportData, `ekmutho_hashi_donors_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Fund Collection & Donor Records
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {filteredList.length} Entries
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            সদস্য, শুভাকাঙ্ক্ষী ও সাধারণ দাতাদের অনুদান হিসাব ও মানি রিসিট প্রস্তুতকরণ
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

          {permissions.canAddFund && (
            <button
              type="button"
              onClick={onOpenAddFund}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record Donation</span>
            </button>
          )}
        </div>
      </div>

      {/* Aggregate Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Filtered Cash Collections
            </span>
            <span className="text-xl font-black text-emerald-700 font-mono mt-0.5 block">
              {formatCurrency(totalCashInFiltered)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <HeartHandshake className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Product Donations Value
            </span>
            <span className="text-xl font-black text-amber-700 font-mono mt-0.5 block">
              {formatCurrency(totalProductValFiltered)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Donor Records
            </span>
            <span className="text-xl font-black text-teal-800 font-mono mt-0.5 block">
              {filteredList.length} Donors
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
            <UserCheck className="w-5 h-5" />
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
            placeholder="Search by Donor Name, Phone, Receipt #, Reference..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Contribution type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white"
          >
            <option value="all">All Contributions (Cash & In-Kind)</option>
            <option value="cash">Cash Only</option>
            <option value="product">In-Kind Products Only</option>
          </select>

          {/* Payment Method filter */}
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white"
          >
            <option value="all">All Payment Modes</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Rocket">Rocket</option>
            <option value="Hand Cash">Hand Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Donors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Receipt ID</th>
                <th className="py-3.5 px-4">Donor Name & Contact</th>
                <th className="py-3.5 px-4">Campaign Drive</th>
                <th className="py-3.5 px-4">Contribution / Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.length > 0 ? (
                filteredList.map((donor) => {
                  const camp = campaigns.find(c => c.id === donor.campaignId);
                  const isAnon = donor.donorName.toLowerCase().includes('anonymous') || donor.donorName.includes('বেনামী');

                  return (
                    <tr key={donor.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        <button
                          type="button"
                          onClick={() => onOpenReceipt(donor)}
                          className="hover:text-emerald-700 hover:underline flex items-center gap-1"
                          title="Click to view printable receipt"
                        >
                          <Receipt className="w-3.5 h-3.5 text-slate-400" />
                          <span>{donor.receiptId}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{donor.donorName}</span>
                          {isAnon && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                              Anonymous
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          <span>{donor.phone !== 'N/A' ? donor.phone : 'No phone'}</span>
                          <span className="mx-1">•</span>
                          <span className="italic text-slate-400">{donor.reference}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800">{camp?.name || 'General Drive'}</span>
                        {donor.note && (
                          <p className="text-[11px] text-slate-500 italic truncate max-w-xs">{donor.note}</p>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {donor.contributionType === 'cash' ? (
                          <div>
                            <span className="font-black text-emerald-700 font-mono text-sm block">
                              {formatCurrency(donor.amount)}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold">Cash Contribution</span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-bold text-amber-800 block">
                              {donor.productDetails?.quantity} {donor.productDetails?.unit} {donor.productDetails?.productName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Est. Value: {formatCurrency(donor.productDetails?.estimatedValue || 0)}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <PaymentMethodBadge method={donor.paymentMethod} />
                        {donor.transactionId && (
                          <span className="block text-[10px] font-mono text-slate-500 mt-0.5">
                            Trx: {donor.transactionId}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(donor.date)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenReceipt(donor)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Print Money Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {permissions.isAdmin && (
                            <button
                              type="button"
                              onClick={() => setDonorToDelete(donor)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No donor records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Donor Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(donorToDelete)}
        onClose={() => setDonorToDelete(null)}
        onConfirm={() => {
          if (donorToDelete) {
            deleteDonor(donorToDelete.id);
          }
        }}
        title={`Delete Receipt ${donorToDelete?.receiptId}?`}
        message={`Are you sure you want to remove the donation record from ${donorToDelete?.donorName}? This will deduct the amount from total funds.`}
        confirmText="Yes, Delete Record"
        isDestructive={true}
      />
    </div>
  );
};
