import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  PackageCheck,
  AlertTriangle,
  HeartHandshake,
  ArrowRight,
  Gift,
  PlusCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useCharity } from '../../context/CharityContext';
import { StatCard } from '../common/StatCard';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
import { StatusBadge, PaymentMethodBadge } from '../common/Badge';

export const DashboardView = ({
  setActiveTab,
  onOpenAddFund,
  onOpenAddExpense,
  onOpenDistributeAid,
  onOpenReceipt,
  onOpenToken
}) => {
  const {
    campaigns,
    selectedCampaign,
    totalFundCollected,
    totalCashCollected,
    totalProductDonationsValue,
    totalSpent,
    cashBalance,
    totalFamiliesServed,
    totalPackagesDistributed,
    totalBeneficiariesCount,
    filteredDonors,
    filteredExpenses,
    inventory,
    getProductStock,
    beneficiaries,
    orgSettings,
    viewMode,
    permissions
  } = useCharity();

  const currentCamp = campaigns.find(c => c.id === selectedCampaign);

  // Financial Chart Data (Collections vs Spending)
  const barChartData = [
    {
      name: 'Cash In',
      amount: totalCashCollected,
      fill: '#059669' // emerald-600
    },
    {
      name: 'Spent Out',
      amount: totalSpent,
      fill: '#ea580c' // amber-600
    },
    {
      name: 'Remaining Balance',
      amount: Math.max(0, cashBalance),
      fill: '#0d9488' // teal-600
    }
  ];

  // Category Breakdown for Spending
  const expenseCategories = filteredExpenses.reduce((acc, curr) => {
    const cat = curr.category || curr.type || 'Other';
    acc[cat] = (acc[cat] || 0) + (curr.amount || 0);
    return acc;
  }, {});

  const pieColors = ['#059669', '#0284c7', '#d97706', '#dc2626', '#8b5cf6', '#0d9488'];
  const pieChartData = Object.entries(expenseCategories)
    .filter(([_, val]) => val > 0)
    .map(([name, value], idx) => ({
      name,
      value,
      color: pieColors[idx % pieColors.length]
    }));

  // Low stock inventory items
  const lowStockItems = inventory.filter(item => {
    const stock = getProductStock(item.id);
    return stock <= (item.minAlertStock || 15);
  });

  const isPublicMode = viewMode === 'public' || permissions?.isPublic;

  // Recent 10 activities (merged donors + expenses + distributions)
  const mergedActivities = [
    ...filteredDonors.map(d => ({
      id: d.id,
      type: 'donation',
      title: isPublicMode ? 'Fund Contribution Received' : `Fund Received: ${d.donorName}`,
      subtitle: isPublicMode
        ? (d.contributionType === 'cash' ? 'Donor Contribution (নগদ অনুদান)' : 'In-Kind Food/Relief Item Contribution')
        : (d.contributionType === 'cash' ? `${formatCurrency(d.amount)} via ${d.paymentMethod}` : `In-Kind: ${d.productDetails?.quantity} ${d.productDetails?.unit} ${d.productDetails?.productName}`),
      amount: d.contributionType === 'cash' ? d.amount : d.productDetails?.estimatedValue,
      date: d.date,
      badge: d.contributionType === 'cash' ? 'Fund In' : 'Product In',
      badgeColor: 'emerald',
      raw: d
    })),
    ...filteredExpenses.map(e => ({
      id: e.id,
      type: e.isDistribution ? 'distribution' : 'expense',
      title: e.isDistribution
        ? (isPublicMode ? 'Food & Relief Aid Distributed' : `Aid Distributed to ${e.linkedBeneficiaryName || 'Family'}`)
        : `Expense: ${e.type}`,
      subtitle: isPublicMode && e.isDistribution
        ? 'Relief package handed over to verified family'
        : (e.note || (e.isDistribution ? 'Relief package handed over' : 'Market purchase / Logistics')),
      amount: e.amount,
      date: e.date,
      badge: e.isDistribution ? 'Aid Delivered' : 'Expense Out',
      badgeColor: e.isDistribution ? 'teal' : 'amber',
      raw: e
    }))
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Welcome & Campaign Status Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {currentCamp ? currentCamp.name : `${orgSettings?.name || 'Ekmutho Hashi'} • Ramadan 2026`}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {orgSettings?.name || 'Ekmutho Hashi'}{' '}
              <span className="text-amber-400 font-sans">| {orgSettings?.banglaName || 'একমুঠো হাসি'}</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {orgSettings?.slogan || 'Transparent, grassroots relief distribution dashboard for underprivileged families in Bangladesh. Tracking every Taka of donor contributions directly to food packs on the ground.'}
            </p>
          </div>

          {/* Quick Buttons or Public Mode Information */}
          <div className="flex flex-wrap items-center gap-3">
            {permissions.canAddFund && (
              <button
                type="button"
                onClick={onOpenAddFund}
                className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 transition flex items-center gap-2 active:scale-98"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Record Donation</span>
              </button>
            )}

            {permissions.canDistributeAid && (
              <button
                type="button"
                onClick={onOpenDistributeAid}
                className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-950/40 transition flex items-center gap-2 active:scale-98"
              >
                <Gift className="w-4 h-4" />
                <span>Distribute Aid</span>
              </button>
            )}

            {permissions.isPublic && (
              <div className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-white/10 border border-white/20 text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Public Relief Ledger</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Funds Raised"
          banglaTitle="মোট সংগৃহীত তহবিল"
          value={formatCurrency(totalFundCollected)}
          subtext={`Cash: ${formatCurrency(totalCashCollected)} | In-Kind: ${formatCurrency(totalProductDonationsValue)}`}
          icon={TrendingUp}
          color="emerald"
        />

        <StatCard
          title="Total Spent"
          banglaTitle="মোট খরচ"
          value={formatCurrency(totalSpent)}
          subtext="Wholesale market & logistics"
          icon={TrendingDown}
          color="amber"
        />

        <StatCard
          title="Cash Balance"
          banglaTitle="অবশিষ্ট নগদ তহবিল"
          value={formatCurrency(cashBalance)}
          subtext="Available for relief goods"
          icon={Wallet}
          color={cashBalance >= 0 ? 'teal' : 'rose'}
        />

        <StatCard
          title="Families Served"
          banglaTitle="সাহায্যপ্রাপ্ত পরিবার"
          value={`${formatNumber(totalFamiliesServed)} / ${formatNumber(totalBeneficiariesCount)}`}
          subtext="Verified needy households"
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Packages Distributed"
          banglaTitle="বিতরণকৃত ইফতার বক্স"
          value={formatNumber(totalPackagesDistributed)}
          subtext="Full family food packs"
          icon={PackageCheck}
          color="emerald"
        />
      </div>

      {/* Low Stock Alerts (if any) */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Low Inventory Alert ({lowStockItems.length} items need replenishment)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                {lowStockItems.map(i => `${i.name}: ${getProductStock(i.id)} ${i.unit} left`).join(' • ')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAddExpense}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 transition"
          >
            + Purchase Bulk Stock
          </button>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collections vs Spending Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Financial Summary (Fund In vs Spent Out)
              </h3>
              <p className="text-xs text-slate-500">
                Transparent comparison of cash collections against expenses
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              ৳ Bangladeshi Taka
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Amount']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Category Pie / Donut */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Expenditure Breakdown
            </h3>
            <p className="text-xs text-slate-500">Distribution by operational area</p>
          </div>

          {pieChartData.length > 0 ? (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1.5 text-xs">
                {pieChartData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="truncate max-w-[130px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              No expenses recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Feed & Quick Relief Inventory Glance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent 10 Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent Activity Feed (সর্বশেষ কার্যক্রম)
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>View All Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {mergedActivities.length > 0 ? (
              mergedActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        act.badgeColor === 'emerald'
                          ? 'bg-emerald-50 text-emerald-600'
                          : act.badgeColor === 'teal'
                          ? 'bg-teal-50 text-teal-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {act.type === 'donation' && <HeartHandshake className="w-4 h-4" />}
                      {act.type === 'distribution' && <Gift className="w-4 h-4" />}
                      {act.type === 'expense' && <TrendingDown className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{act.title}</p>
                      <p className="text-slate-500 truncate mt-0.5">{act.subtitle}</p>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatDate(act.date)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {act.amount !== undefined && act.amount > 0 && (
                      <span
                        className={`font-black text-sm block ${
                          act.badgeColor === 'emerald'
                            ? 'text-emerald-700'
                            : act.badgeColor === 'amber'
                            ? 'text-amber-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {act.badgeColor === 'emerald' ? '+' : '-'} {formatCurrency(act.amount)}
                      </span>
                    )}
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${
                        act.badgeColor === 'emerald'
                          ? 'bg-emerald-100 text-emerald-800'
                          : act.badgeColor === 'teal'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {act.badge}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No recent activities found.</p>
            )}
          </div>
        </div>

        {/* Quick Stock Status Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Relief Stock Balance
            </h3>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              Inventory
            </button>
          </div>

          <div className="space-y-2.5">
            {inventory.slice(0, 6).map((item) => {
              const stock = getProductStock(item.id);
              const isLow = stock <= (item.minAlertStock || 15);

              return (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400">
                      Distributed: {item.qtyDistributed} {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-black font-mono ${
                        isLow
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {stock} {item.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <span>View All Products & Package Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
