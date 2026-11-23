import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Printer,
  Gift,
  Eye,
  Edit2,
  Trash2,
  Download,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  Check
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { StatusBadge, PriorityBadge, ApprovalBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { exportToCSV } from '../../utils/exportUtils';

export const BeneficiariesView = ({
  onOpenDistributeAid,
  onOpenToken,
  onOpenFamilyDetails
}) => {
  const {
    beneficiaries,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    approveBeneficiary,
    rejectBeneficiary,
    permissions,
    isUserAdmin,
    user
  } = useCharity();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterApproval, setFilterApproval] = useState('all'); // all, approved, pending, rejected

  // Modal for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [beneficiaryToDelete, setBeneficiaryToDelete] = useState(null);

  // Form inputs
  const [headName, setHeadName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [mobile, setMobile] = useState('');
  const [area, setArea] = useState('');
  const [nid, setNid] = useState('');
  const [familyMembers, setFamilyMembers] = useState('4');
  const [priorityCategory, setPriorityCategory] = useState('Low-Income Family');
  const [status, setStatus] = useState('Token Given');
  const [approvalStatus, setApprovalStatus] = useState('approved');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingBeneficiary(null);
    setHeadName('');
    setGuardianName('');
    setMobile('');
    setArea('');
    setNid('');
    setFamilyMembers('4');
    setPriorityCategory('Low-Income Family');
    setStatus(isUserAdmin ? 'Token Given' : 'Pending Approval');
    setApprovalStatus(isUserAdmin ? 'approved' : 'pending');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBeneficiary(b);
    setHeadName(b.headName);
    setGuardianName(b.guardianName || '');
    setMobile(b.mobile || '');
    setArea(b.area || '');
    setNid(b.nid || '');
    setFamilyMembers(String(b.familyMembers || 4));
    setPriorityCategory(b.priorityCategory || 'Low-Income Family');
    setStatus(b.status || 'Pending');
    setApprovalStatus(b.approvalStatus || (b.status === 'Pending Approval' ? 'pending' : 'approved'));
    setNotes(b.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!headName.trim()) return;

    const chosenApproval = isUserAdmin ? approvalStatus : 'pending';
    const computedStatus = chosenApproval === 'pending'
      ? 'Pending Approval'
      : (status === 'Pending Approval' ? 'Token Given' : status);

    const payload = {
      headName: headName.trim(),
      guardianName: guardianName.trim(),
      mobile: mobile.trim() || 'N/A',
      area: area.trim(),
      nid: nid.trim(),
      familyMembers: Number(familyMembers) || 1,
      priorityCategory,
      status: computedStatus,
      approvalStatus: chosenApproval,
      notes: notes.trim()
    };

    if (editingBeneficiary) {
      updateBeneficiary({
        ...editingBeneficiary,
        ...payload
      });
    } else {
      addBeneficiary(payload);
    }

    setIsModalOpen(false);
  };

  // Filtered List
  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter((b) => {
      // Category filter
      if (filterCategory !== 'all' && b.priorityCategory !== filterCategory) {
        return false;
      }
      // Status filter
      if (filterStatus !== 'all' && b.status !== filterStatus) {
        return false;
      }
      // Approval Status filter
      if (filterApproval !== 'all') {
        const isApp = b.approvalStatus === 'approved' || (!b.approvalStatus && b.status !== 'Pending Approval');
        const isPend = b.approvalStatus === 'pending' || b.status === 'Pending Approval';
        const isRej = b.approvalStatus === 'rejected';

        if (filterApproval === 'approved' && !isApp) return false;
        if (filterApproval === 'pending' && !isPend) return false;
        if (filterApproval === 'rejected' && !isRej) return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mHead = b.headName?.toLowerCase().includes(q);
        const mToken = b.tokenNumber?.toLowerCase().includes(q);
        const mId = b.familyId?.toLowerCase().includes(q);
        const mArea = b.area?.toLowerCase().includes(q);
        const mPhone = b.mobile?.toLowerCase().includes(q);
        const mNid = b.nid?.toLowerCase().includes(q);
        return mHead || mToken || mId || mArea || mPhone || mNid;
      }
      return true;
    });
  }, [beneficiaries, filterCategory, filterStatus, filterApproval, searchQuery]);

  // Status & Approval Counts
  const deliveredCount = beneficiaries.filter(b => b.status === 'Delivered').length;
  const tokenGivenCount = beneficiaries.filter(b => b.status === 'Token Given').length;
  const pendingApprovalList = beneficiaries.filter(b => b.approvalStatus === 'pending' || b.status === 'Pending Approval');
  const pendingApprovalCount = pendingApprovalList.length;
  const approvedCount = beneficiaries.filter(b => b.approvalStatus === 'approved' || (!b.approvalStatus && b.status !== 'Pending Approval')).length;

  const handleExportCSV = () => {
    const exportData = filteredBeneficiaries.map((b) => ({
      'Token Number': b.tokenNumber,
      'Family ID': b.familyId,
      'Head of Family': b.headName,
      'Guardian Name': b.guardianName || '',
      'Mobile': b.mobile || '',
      'Area / Ward': b.area || '',
      'NID': b.nid || '',
      'Family Members': b.familyMembers,
      'Priority Category': b.priorityCategory,
      'Admin Approval': b.approvalStatus || (b.status === 'Pending Approval' ? 'pending' : 'approved'),
      'Approved By': b.approvedBy || 'N/A',
      'Distribution Status': b.status,
      'Aid Received Count': b.aidHistory ? b.aidHistory.length : 0,
      'Notes': b.notes || ''
    }));

    exportToCSV(exportData, `ekmutho_hashi_beneficiaries_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Beneficiary Needy Families
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
              {beneficiaries.length} Enlisted Families
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            দরিদ্র ও সুবিধাবঞ্চিত পরিবারের তালিকা, অ্যাডমিন অনুমোদন, টোকেন স্লিপ এবং ত্রাণ বিতরণ পোর্টাল
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {permissions.canAddBeneficiary && (
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Register New Family</span>
            </button>
          )}
        </div>
      </div>

      {/* ADMIN ONLY: Pending Approval Review Banner */}
      {permissions.isAdmin && pendingApprovalCount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-teal-500/15 border-2 border-amber-400 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-amber-950 truncate">
                  {pendingApprovalCount} Needy {pendingApprovalCount === 1 ? 'Family' : 'Families'} Awaiting Executive Admin Approval
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-600 text-white animate-pulse shrink-0">
                  Approval Required
                </span>
              </div>
              <p className="text-xs text-amber-900/80 mt-0.5 truncate">
                Field survey entries submitted by volunteers. Review survey details and authorize relief token dispatches.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFilterApproval(filterApproval === 'pending' ? 'all' : 'pending')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
              filterApproval === 'pending'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-200 hover:bg-amber-300 text-amber-950 border-amber-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{filterApproval === 'pending' ? 'Show All Families' : `Review Pending (${pendingApprovalCount})`}</span>
          </button>
        </div>
      )}

      {/* Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Enlisted
          </span>
          <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
            {beneficiaries.length} Families
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Delivered (বিতরণ সম্পন্ন)
          </span>
          <span className="text-xl font-black text-emerald-700 font-mono mt-0.5 block">
            {deliveredCount} Families
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-teal-200 shadow-xs">
          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Approved by Admin
          </span>
          <span className="text-xl font-black text-teal-700 font-mono mt-0.5 block">
            {approvedCount} Authorized
          </span>
        </div>

        <div className={`p-3.5 rounded-2xl border shadow-xs transition ${
          pendingApprovalCount > 0
            ? 'bg-amber-50/70 border-amber-300 text-amber-900'
            : 'bg-white border-slate-200 text-slate-600'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Awaiting Admin Approval
          </span>
          <span className="text-xl font-black font-mono mt-0.5 block">
            {pendingApprovalCount} Pending
          </span>
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
            placeholder="Search by Family Head, Token #, Area, NID, Phone..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-teal-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Admin Approval Filter */}
          <select
            value={filterApproval}
            onChange={(e) => setFilterApproval(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-amber-300 bg-amber-50 text-amber-900 focus:bg-white cursor-pointer"
          >
            <option value="all">All Approval States</option>
            <option value="approved">Approved by Admin (অনুমোদিত)</option>
            <option value="pending">Awaiting Admin Approval (অপেক্ষমান)</option>
            <option value="rejected">Rejected (বাতিল)</option>
          </select>

          {/* Priority Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white cursor-pointer"
          >
            <option value="all">All Priority Categories</option>
            <option value="Widow / Elderly">Widow / Elderly (বিধবা / বয়োজ্যেষ্ঠ)</option>
            <option value="Disabled">Disabled (প্রতিবন্ধী)</option>
            <option value="Day Laborer">Day Laborer (দিনমজুর / রিকশাচালক)</option>
            <option value="Orphan Support">Orphan Support (এতিম পরিবার)</option>
            <option value="Low-Income Family">Low-Income Family (নিম্নবিত্ত পরিবার)</option>
          </select>

          {/* Distribution Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white cursor-pointer"
          >
            <option value="all">All Distribution Statuses</option>
            <option value="Delivered">Delivered (বিতরণ সম্পন্ন)</option>
            <option value="Token Given">Token Given (টোকেন প্রাপ্ত)</option>
            <option value="Pending Approval">Pending Approval (অনুমোদন অপেক্ষমান)</option>
            <option value="Pending">Pending (অপেক্ষমান)</option>
          </select>
        </div>
      </div>

      {/* Beneficiaries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Token & ID</th>
                <th className="py-3.5 px-4">Head of Family</th>
                <th className="py-3.5 px-4">Area / Ward & Contact</th>
                <th className="py-3.5 px-4">Household Size</th>
                <th className="py-3.5 px-4">Priority Category</th>
                <th className="py-3.5 px-4">Admin Approval</th>
                <th className="py-3.5 px-4">Distribution</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBeneficiaries.length > 0 ? (
                filteredBeneficiaries.map((b) => {
                  const isPendingAdminApproval = b.approvalStatus === 'pending' || b.status === 'Pending Approval';
                  const isApproved = b.approvalStatus === 'approved' || (!b.approvalStatus && b.status !== 'Pending Approval');

                  return (
                    <tr
                      key={b.id}
                      className={`transition ${
                        isPendingAdminApproval ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenToken(b)}
                            className="font-mono font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 hover:bg-teal-100 transition cursor-pointer"
                            title="Print Token Card"
                          >
                            {b.tokenNumber}
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          {b.familyId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => onOpenFamilyDetails(b)}
                          className="font-bold text-slate-900 hover:text-teal-700 text-left transition cursor-pointer"
                        >
                          {b.headName}
                        </button>
                        <span className="text-[11px] text-slate-500 block">
                          {b.guardianName || 'Guardian not listed'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-800 font-medium truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{b.area}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                          {b.mobile !== 'N/A' ? b.mobile : 'No Mobile'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">
                          {b.familyMembers} Persons
                        </span>
                        {b.nid && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            NID: {b.nid.slice(0, 4)}...{b.nid.slice(-4)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={b.priorityCategory} />
                      </td>

                      {/* Admin Approval Column */}
                      <td className="py-3.5 px-4">
                        <ApprovalBadge status={b.approvalStatus || (b.status === 'Pending Approval' ? 'pending' : 'approved')} />
                        {isApproved && b.approvedBy && (
                          <span className="text-[10px] text-emerald-800 font-medium block mt-0.5">
                            By {b.approvedBy.split(' ')[0]} {b.approvedBy.split(' ')[1] || ''}
                          </span>
                        )}
                        {isPendingAdminApproval && b.submittedBy && (
                          <span className="text-[10px] text-amber-800 font-medium block mt-0.5">
                            Survey by: {b.submittedBy.split(' ')[0]}
                          </span>
                        )}
                      </td>

                      {/* Distribution Status Column */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={b.status} />
                        {b.aidHistory && b.aidHistory.length > 0 && (
                          <span className="block text-[10px] text-emerald-700 font-semibold mt-0.5">
                            {b.aidHistory.length} aid package received
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Quick Admin Approval Buttons for pending families */}
                          {permissions.isAdmin && isPendingAdminApproval && (
                            <>
                              <button
                                type="button"
                                onClick={() => approveBeneficiary(b.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition active:scale-95 cursor-pointer"
                                title="Approve Family Registration & Authorize Token"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => rejectBeneficiary(b.id)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition active:scale-95 cursor-pointer"
                                title="Reject Family Registration"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {/* Token Print */}
                          <button
                            type="button"
                            onClick={() => onOpenToken(b)}
                            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition cursor-pointer"
                            title="Print Relief Token Slip"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Distribute Aid button (Only for Approved families) */}
                          {permissions.canDistributeAid && isApproved && (
                            <button
                              type="button"
                              onClick={() => onOpenDistributeAid(b.id)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                              title="Distribute Aid to this family"
                            >
                              <Gift className="w-4 h-4" />
                            </button>
                          )}

                          {/* View full details */}
                          <button
                            type="button"
                            onClick={() => onOpenFamilyDetails(b)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="View Profile & Aid History"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          {permissions.canAddBeneficiary && (
                            <button
                              type="button"
                              onClick={() => openEditModal(b)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Edit details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete */}
                          {permissions.isAdmin && (
                            <button
                              type="button"
                              onClick={() => setBeneficiaryToDelete(b)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete beneficiary"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-xs">
                    No beneficiary families match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Beneficiary Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBeneficiary ? 'Edit Family Record' : 'Register Poor / Needy Family'}
        subtitle="সুবিধাভোগী পরিবারের তথ্য এন্ট্রি ও নির্বাহী অ্যাডমিন অনুমোদন"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Executive Admin Approval Workflow Notice / Selector */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Executive Admin Approval Status (অনুমোদন স্থিতি) *</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                {isUserAdmin ? 'Admin Control' : 'Pending Admin Verification'}
              </span>
            </div>

            {isUserAdmin ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                  approvalStatus === 'approved'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-400/40'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="approvalStatus"
                    value="approved"
                    checked={approvalStatus === 'approved'}
                    onChange={() => {
                      setApprovalStatus('approved');
                      if (status === 'Pending Approval') setStatus('Token Given');
                    }}
                    className="accent-emerald-600"
                  />
                  <div className="text-xs">
                    <span className="block font-bold">Approved by Admin</span>
                    <span className="text-[10px] text-emerald-700 font-normal">Release token immediately</span>
                  </div>
                </label>

                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                  approvalStatus === 'pending'
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold ring-1 ring-amber-400/40'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="approvalStatus"
                    value="pending"
                    checked={approvalStatus === 'pending'}
                    onChange={() => {
                      setApprovalStatus('pending');
                      setStatus('Pending Approval');
                    }}
                    className="accent-amber-600"
                  />
                  <div className="text-xs">
                    <span className="block font-bold">Pending Review</span>
                    <span className="text-[10px] text-amber-800 font-normal">Keep on hold for verification</span>
                  </div>
                </label>
              </div>
            ) : (
              <p className="text-xs text-amber-900 font-medium leading-relaxed">
                Field Survey Mode: This needy family's registration will be submitted as <strong>Pending Executive Approval</strong> by Engr. Arman Hossain (Admin, President & CEO) before relief distribution can take place.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Head of Family Name (পরিবার প্রধান) *
              </label>
              <input
                type="text"
                value={headName}
                onChange={(e) => setHeadName(e.target.value)}
                placeholder="e.g. Rohim Uddin / Rokeya Begum"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Guardian / Spouse / Father
              </label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Late Abdul Karim"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Phone / Mobile
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Area / Ward / Slum (এলাকা) *
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Mirpur 11 Slum, Ward 3"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                NID or Birth Certificate #
              </label>
              <input
                type="text"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                placeholder="10 / 17 digit NID number"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Total Family Members
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={familyMembers}
                onChange={(e) => setFamilyMembers(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority Category *
              </label>
              <select
                value={priorityCategory}
                onChange={(e) => setPriorityCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="Widow / Elderly">Widow / Elderly (বিধবা / বয়োজ্যেষ্ঠ)</option>
                <option value="Disabled">Disabled (প্রতিবন্ধী)</option>
                <option value="Day Laborer">Day Laborer (দিনমজুর / রিকশাচালক)</option>
                <option value="Orphan Support">Orphan Support (এতিম পরিবার)</option>
                <option value="Low-Income Family">Low-Income Family (নিম্নবিত্ত পরিবার)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Distribution Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="Token Given">Token Given (টোকেন প্রাপ্ত)</option>
                <option value="Pending Approval">Pending Approval (অনুমোদন অপেক্ষমান)</option>
                <option value="Delivered">Delivered (বিতরণ সম্পন্ন)</option>
                <option value="Pending">Pending (অপেক্ষমান)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Verification Notes / Situation
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Visited by volunteer; husband paralyzed, family in acute distress."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition cursor-pointer active:scale-95"
            >
              {editingBeneficiary ? 'Save Updates' : (isUserAdmin && approvalStatus === 'approved' ? 'Register & Approve Family' : 'Submit for Admin Approval')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(beneficiaryToDelete)}
        onClose={() => setBeneficiaryToDelete(null)}
        onConfirm={() => {
          if (beneficiaryToDelete) {
            deleteBeneficiary(beneficiaryToDelete.id);
            setBeneficiaryToDelete(null);
          }
        }}
        title={`Remove ${beneficiaryToDelete?.headName}?`}
        message="Are you sure you want to remove this family from the beneficiary roster? This cannot be undone."
        confirmText="Yes, Remove"
        isDestructive={true}
      />
    </div>
  );
};
