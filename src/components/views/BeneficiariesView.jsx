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
  MapPin
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { StatusBadge, PriorityBadge } from '../common/Badge';
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
    permissions
  } = useCharity();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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
  const [status, setStatus] = useState('Pending');
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
    setStatus('Pending');
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
    setNotes(b.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!headName.trim()) return;

    const payload = {
      headName: headName.trim(),
      guardianName: guardianName.trim(),
      mobile: mobile.trim() || 'N/A',
      area: area.trim(),
      nid: nid.trim(),
      familyMembers: Number(familyMembers) || 1,
      priorityCategory,
      status,
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
      if (filterCategory !== 'all' && b.priorityCategory !== filterCategory) {
        return false;
      }
      if (filterStatus !== 'all' && b.status !== filterStatus) {
        return false;
      }
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
  }, [beneficiaries, filterCategory, filterStatus, searchQuery]);

  // Status Counts
  const deliveredCount = beneficiaries.filter(b => b.status === 'Delivered').length;
  const tokenGivenCount = beneficiaries.filter(b => b.status === 'Token Given').length;
  const pendingCount = beneficiaries.filter(b => b.status === 'Pending').length;

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
              {beneficiaries.length} Families Registered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            যাচাইকৃত দরিদ্র ও অসহায় পরিবারের তালিকা, টোকেন স্লিপ এবং ত্রাণ বিতরণ হিস্ট্রি
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

          {permissions.canAddBeneficiary && (
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>+ Register New Family</span>
            </button>
          )}
        </div>
      </div>

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
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            Delivered (বিতরণ সম্পন্ন)
          </span>
          <span className="text-xl font-black text-emerald-700 font-mono mt-0.5 block">
            {deliveredCount} Families
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
            Token Given (টোকেন প্রাপ্ত)
          </span>
          <span className="text-xl font-black text-amber-700 font-mono mt-0.5 block">
            {tokenGivenCount} Families
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Pending (অপেক্ষমান)
          </span>
          <span className="text-xl font-black text-slate-600 font-mono mt-0.5 block">
            {pendingCount} Families
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
          {/* Priority Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white"
          >
            <option value="all">All Priority Categories</option>
            <option value="Widow / Elderly">Widow / Elderly (বিধবা / বয়োজ্যেষ্ঠ)</option>
            <option value="Disabled">Disabled (প্রতিবন্ধী)</option>
            <option value="Day Laborer">Day Laborer (দিনমজুর / রিকশাচালক)</option>
            <option value="Orphan Support">Orphan Support (এতিম পরিবার)</option>
            <option value="Low-Income Family">Low-Income Family (নিম্নবিত্ত পরিবার)</option>
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white"
          >
            <option value="all">All Distribution Statuses</option>
            <option value="Delivered">Delivered (বিতরণ সম্পন্ন)</option>
            <option value="Token Given">Token Given (টোকেন প্রাপ্ত)</option>
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
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBeneficiaries.length > 0 ? (
                filteredBeneficiaries.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenToken(b)}
                          className="font-mono font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 hover:bg-teal-100 transition"
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
                        className="font-bold text-slate-900 hover:text-teal-700 text-left transition"
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

                    <td className="py-3.5 px-4">
                      <StatusBadge status={b.status} />
                      {b.aidHistory && b.aidHistory.length > 0 && (
                        <span className="block text-[10px] text-emerald-700 font-semibold mt-0.5">
                          {b.aidHistory.length} aid package received
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Token Print */}
                        <button
                          type="button"
                          onClick={() => onOpenToken(b)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
                          title="Print Relief Token Slip"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Distribute Aid button */}
                        {permissions.canDistributeAid && (
                          <button
                            type="button"
                            onClick={() => onOpenDistributeAid(b.id)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Distribute Aid to this family"
                          >
                            <Gift className="w-4 h-4" />
                          </button>
                        )}

                        {/* View full details */}
                        <button
                          type="button"
                          onClick={() => onOpenFamilyDetails(b)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                          title="View Profile & Aid History"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        {permissions.canAddBeneficiary && (
                          <button
                            type="button"
                            onClick={() => openEditModal(b)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
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
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete beneficiary"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
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
        subtitle="সুবিধাভোগী পরিবারের তথ্য এন্ট্রি ও টোকেন বরাদ্দ"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Head of Family Name (পরিবার প্রধান) *
              </label>
              <input
                type="text"
                value={headName}
                onChange={(e) => setHeadName(e.target.value)}
                placeholder="e.g. Mst. Rokeya Begum / Md. Sirajul"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Father / Husband's Name (পিতা / স্বামীর নাম)
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
                Mobile Number
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 017xxxxxxxx"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                National ID / NID (Optional)
              </label>
              <input
                type="text"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                placeholder="e.g. 19782692019283"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Area / Village / Ward *
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

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Household Members Count
              </label>
              <input
                type="number"
                min="1"
                max="25"
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
                <option value="Pending">Pending (অপেক্ষমান)</option>
                <option value="Token Given">Token Given (টোকেন প্রাপ্ত)</option>
                <option value="Delivered">Delivered (বিতরণ সম্পন্ন)</option>
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
              placeholder="e.g. Visited by volunteer Rafiq; husband paralyzed, family in acute distress."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition"
            >
              {editingBeneficiary ? 'Save Updates' : 'Register Family'}
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
          }
        }}
        title={`Delete Family ${beneficiaryToDelete?.headName}?`}
        message={`Are you sure you want to remove token ${beneficiaryToDelete?.tokenNumber} (${beneficiaryToDelete?.headName})?`}
        confirmText="Yes, Delete Record"
        isDestructive={true}
      />
    </div>
  );
};
