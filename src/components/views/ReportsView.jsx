import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShieldCheck,
  Calendar,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';
import { exportToCSV } from '../../utils/exportUtils';
import { PaymentMethodBadge } from '../common/Badge';

export const ReportsView = () => {
  const {
    campaigns,
    selectedCampaign,
    setSelectedCampaign,
    donors,
    expenses,
    inventory,
    beneficiaries,
    getProductStock
  } = useCharity();

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, in, out

  const currentCamp = campaigns.find(c => c.id === selectedCampaign);

  // Generate unified ledger rows with running cash balance
  const unifiedLedger = useMemo(() => {
    // Collect all cash inflows (cash donations only affect monetary balance)
    const inflows = donors
      .filter(d => d.contributionType === 'cash')
      .map(d => ({
        id: d.id,
        date: d.date,
        type: 'IN',
        category: 'Donor Contribution',
        description: `Received from ${d.donorName} (${d.receiptId}) - ${d.note || 'Relief fund'}`,
        paymentMethod: d.paymentMethod,
        inflow: Number(d.amount) || 0,
        outflow: 0,
        campaignId: d.campaignId,
        reference: d.receiptId,
        party: d.donorName
      }));

    // Collect all outflows (expenses with monetary amount > 0)
    const outflows = expenses
      .filter(e => (Number(e.amount) || 0) > 0)
      .map(e => ({
        id: e.id,
        date: e.date,
        type: 'OUT',
        category: e.type,
        description: e.note || (e.isDistribution ? `Cash aid to ${e.linkedBeneficiaryName}` : `${e.type} expenditure`),
        paymentMethod: e.paymentMethod,
        inflow: 0,
        outflow: Number(e.amount) || 0,
        campaignId: e.campaignId,
        reference: e.id,
        party: e.handledBy
      }));

    // Merge and sort chronologically (oldest first for correct running balance calculation)
    const combined = [...inflows, ...outflows].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate running balance
    let running = 0;
    const withRunningBalance = combined.map(item => {
      running += (item.inflow - item.outflow);
      return {
        ...item,
        runningBalance: running
      };
    });

    // Now filter by selected campaign, date range, and type if needed
    return withRunningBalance
      .filter(item => {
        if (selectedCampaign !== 'all' && item.campaignId !== selectedCampaign) return false;
        if (typeFilter === 'in' && item.type !== 'IN') return false;
        if (typeFilter === 'out' && item.type !== 'OUT') return false;
        if (dateFrom && item.date < dateFrom) return false;
        if (dateTo && item.date > dateTo) return false;
        return true;
      })
      .reverse(); // Show latest first in table view
  }, [donors, expenses, selectedCampaign, typeFilter, dateFrom, dateTo]);

  // Totals for filtered report
  const totalInflow = useMemo(() => {
    return unifiedLedger.reduce((sum, item) => sum + item.inflow, 0);
  }, [unifiedLedger]);

  const totalOutflow = useMemo(() => {
    return unifiedLedger.reduce((sum, item) => sum + item.outflow, 0);
  }, [unifiedLedger]);

  const netBalance = totalInflow - totalOutflow;

  // Payment method breakdown for transparency
  const paymentBreakdown = useMemo(() => {
    const methods = ['Hand Cash', 'bKash', 'Nagad', 'Rocket', 'Bank Transfer'];
    return methods.map(method => {
      const inAmt = donors
        .filter(d => d.contributionType === 'cash' && d.paymentMethod === method && (selectedCampaign === 'all' || d.campaignId === selectedCampaign))
        .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

      const outAmt = expenses
        .filter(e => e.paymentMethod === method && (selectedCampaign === 'all' || e.campaignId === selectedCampaign))
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      return {
        method,
        inflow: inAmt,
        outflow: outAmt,
        balance: inAmt - outAmt
      };
    });
  }, [donors, expenses, selectedCampaign]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const exportData = unifiedLedger.map((row) => {
      const camp = campaigns.find(c => c.id === row.campaignId);
      return {
        'Date': row.date,
        'Type': row.type === 'IN' ? 'Fund Inflow' : 'Expense Outflow',
        'Category': row.category,
        'Description': row.description,
        'Party / Volunteer': row.party,
        'Payment Method': row.paymentMethod,
        'Fund In (BDT)': row.inflow,
        'Expense Out (BDT)': row.outflow,
        'Running Balance (BDT)': row.runningBalance,
        'Campaign': camp?.name || row.campaignId,
        'Reference ID': row.reference
      };
    });

    exportToCSV(exportData, `ekmutho_hashi_financial_ledger_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Financial Ledger & Audit Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Transparent Accounts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            আয়-ব্যয়ের সমন্বিত খতিয়ান, রানিং ব্যালেন্স এবং সদস্যদের জন্য পূর্ণাঙ্গ হিসাব রিপোর্ট
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Ledger CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Audit Report</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar (hidden on print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Ledger Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50"
            >
              <option value="all">All In & Out Entries</option>
              <option value="in">Inflow (Fund Received) Only</option>
              <option value="out">Outflow (Expenses) Only</option>
            </select>
          </div>
        </div>

        {(dateFrom || dateTo || typeFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setDateFrom('');
              setDateTo('');
              setTypeFilter('all');
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 underline mt-4 sm:mt-0"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Inflow (Cash Fund Received)
            </span>
            <span className="text-2xl font-black text-emerald-700 font-mono mt-0.5 block">
              {formatCurrency(totalInflow)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Outflow (Cash Expenses)
            </span>
            <span className="text-2xl font-black text-amber-700 font-mono mt-0.5 block">
              {formatCurrency(totalOutflow)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Net Running Cash Balance
            </span>
            <span className="text-2xl font-black text-teal-800 font-mono mt-0.5 block">
              {formatCurrency(netBalance)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 text-teal-600">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Payment Method Balance Cards */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 no-print">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Cash & Mobile Banking Channel Balances
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          {paymentBreakdown.map((pm, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1">
              <span className="font-bold text-slate-800 block">{pm.method}</span>
              <p className="text-[11px] text-emerald-700">In: {formatCurrency(pm.inflow)}</p>
              <p className="text-[11px] text-amber-700">Out: {formatCurrency(pm.outflow)}</p>
              <div className="pt-1 border-t border-slate-200 font-mono font-black text-slate-900">
                Net: {formatCurrency(pm.balance)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unified Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden no-print">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Income & Expense Statement ({unifiedLedger.length} Records)
          </h3>
          <span className="text-xs text-slate-500">Chronological Running Balance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Description / Party</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4 text-right">Inflow (৳)</th>
                <th className="py-3.5 px-4 text-right">Outflow (৳)</th>
                <th className="py-3.5 px-4 text-right">Running Balance (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {unifiedLedger.length > 0 ? (
                unifiedLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-medium text-slate-500 whitespace-nowrap">
                      {formatDate(row.date)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          row.type === 'IN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {row.type === 'IN' ? 'Fund In' : 'Expense Out'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{row.description}</p>
                      <span className="text-[11px] text-slate-400">
                        {row.category} • Ref: {row.reference}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <PaymentMethodBadge method={row.paymentMethod} />
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                      {row.inflow > 0 ? `+${formatCurrency(row.inflow)}` : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-700">
                      {row.outflow > 0 ? `-${formatCurrency(row.outflow)}` : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900">
                      {formatCurrency(row.runningBalance)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No financial transactions recorded for this criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT-ONLY OFFICIAL AUDIT STATEMENT */}
      <div className="print-only p-8 bg-white text-slate-900 print-break-inside-avoid">
        {/* Printable Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl border border-slate-300 p-1">
              <img src="/logo.png" alt="Ekmutho Hashi" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Ekmutho Hashi | একমুঠো হাসি</h2>
              <p className="text-xs text-slate-600">Community Charity & Relief Organization, Bangladesh</p>
              <p className="text-xs font-semibold text-teal-800">
                Official Financial Audit & Relief Distribution Statement
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">Date Generated: {new Date().toLocaleDateString('en-GB')}</p>
            <p className="text-slate-500">Drive: {currentCamp?.name || 'All Campaigns'}</p>
            <p className="font-mono text-[10px]">Ref: AUDIT-{new Date().getFullYear()}-001</p>
          </div>
        </div>

        {/* Printable Summary KPI Table */}
        <div className="mt-6 grid grid-cols-4 gap-3 text-xs border border-slate-300 p-4 rounded-lg bg-slate-50">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Cash Collected</span>
            <span className="text-base font-black text-slate-900 font-mono">{formatCurrency(totalInflow)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Spent</span>
            <span className="text-base font-black text-slate-900 font-mono">{formatCurrency(totalOutflow)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Remaining Cash Balance</span>
            <span className="text-base font-black text-slate-900 font-mono">{formatCurrency(netBalance)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Families Served</span>
            <span className="text-base font-black text-slate-900 font-mono">
              {beneficiaries.filter(b => b.status === 'Delivered').length} / {beneficiaries.length}
            </span>
          </div>
        </div>

        {/* Itemized Transactions Table for Print */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Itemized Financial Ledger</h4>
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2 px-3 border-r border-slate-300">Date</th>
                <th className="py-2 px-3 border-r border-slate-300">Type</th>
                <th className="py-2 px-3 border-r border-slate-300">Description</th>
                <th className="py-2 px-3 border-r border-slate-300">Method</th>
                <th className="py-2 px-3 border-r border-slate-300 text-right">Inflow (৳)</th>
                <th className="py-2 px-3 border-r border-slate-300 text-right">Outflow (৳)</th>
                <th className="py-2 px-3 text-right">Balance (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {unifiedLedger.map((row) => (
                <tr key={row.id}>
                  <td className="py-1.5 px-3 border-r border-slate-200 whitespace-nowrap">{formatDate(row.date)}</td>
                  <td className="py-1.5 px-3 border-r border-slate-200 font-bold">{row.type}</td>
                  <td className="py-1.5 px-3 border-r border-slate-200">{row.description}</td>
                  <td className="py-1.5 px-3 border-r border-slate-200">{row.paymentMethod}</td>
                  <td className="py-1.5 px-3 border-r border-slate-200 text-right font-mono">
                    {row.inflow > 0 ? formatCurrency(row.inflow) : '—'}
                  </td>
                  <td className="py-1.5 px-3 border-r border-slate-200 text-right font-mono">
                    {row.outflow > 0 ? formatCurrency(row.outflow) : '—'}
                  </td>
                  <td className="py-1.5 px-3 text-right font-mono font-bold">{formatCurrency(row.runningBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Current Inventory Remaining for Print */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Relief Stock Status at Hand</h4>
          <div className="grid grid-cols-4 gap-2 text-xs border border-slate-300 p-3 rounded-lg">
            {inventory.map(item => (
              <div key={item.id} className="p-1.5 border border-slate-200 rounded">
                <span className="font-semibold block">{item.name}</span>
                <span className="font-mono text-slate-700">{getProductStock(item.id)} {item.unit} in stock</span>
              </div>
            ))}
          </div>
        </div>

        {/* Committee Verification Signatures */}
        <div className="mt-16 pt-6 border-t-2 border-slate-400 flex items-end justify-between text-xs text-slate-600">
          <div className="text-center">
            <div className="w-36 border-b border-slate-400 mb-1" />
            <p className="font-bold">Treasurer / Accounts</p>
            <p className="text-[10px]">Ekmutho Hashi</p>
          </div>

          <div className="text-center">
            <div className="w-36 border-b border-slate-400 mb-1" />
            <p className="font-bold">Distribution Lead</p>
            <p className="text-[10px]">Volunteer Team</p>
          </div>

          <div className="text-center">
            <div className="w-36 border-b border-slate-400 mb-1" />
            <p className="font-bold">President / Coordinator</p>
            <p className="text-[10px]">Ekmutho Hashi</p>
          </div>
        </div>
      </div>
    </div>
  );
};
