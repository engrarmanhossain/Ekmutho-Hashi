import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Calendar,
  Users,
  Target,
  CheckCircle2,
  Edit2,
  Trash2,
  Filter,
  Sparkles
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const CampaignsView = () => {
  const {
    campaigns,
    selectedCampaign,
    setSelectedCampaign,
    donors,
    expenses,
    beneficiaries,
    addCampaign,
    updateCampaign,
    deleteCampaign
  } = useCharity();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetFamilies, setTargetFamilies] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');

  const openAddModal = () => {
    setEditingCampaign(null);
    setName('');
    setBanglaName('');
    setDescription('');
    setTargetAmount('');
    setTargetFamilies('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (camp) => {
    setEditingCampaign(camp);
    setName(camp.name);
    setBanglaName(camp.banglaName || '');
    setDescription(camp.description || '');
    setTargetAmount(camp.targetAmount || '');
    setTargetFamilies(camp.targetFamilies || '');
    setStartDate(camp.startDate || '');
    setEndDate(camp.endDate || '');
    setStatus(camp.status || 'active');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      name: name.trim(),
      banglaName: banglaName.trim(),
      description: description.trim(),
      targetAmount: Number(targetAmount) || 0,
      targetFamilies: Number(targetFamilies) || 0,
      startDate,
      endDate,
      status
    };

    if (editingCampaign) {
      updateCampaign({ ...editingCampaign, ...data });
    } else {
      addCampaign(data);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Relief Campaigns & Drives
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
              {campaigns.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            রমজান ইফতার, শীতবস্ত্র বা বন্যা ত্রাণের জন্য পৃথক তহবিল ও কার্যক্রম পরিচালনা করুন
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaigns.map((camp) => {
          // Calculate stats for this specific campaign
          const campDonations = donors.filter(d => d.campaignId === camp.id);
          const campCollected = campDonations.reduce((sum, d) => {
            const cash = d.contributionType === 'cash' ? (Number(d.amount) || 0) : 0;
            const inKind = Number(d.productDetails?.estimatedValue) || 0;
            return sum + cash + inKind;
          }, 0);

          const campExpenses = expenses.filter(e => e.campaignId === camp.id);
          const campSpent = campExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

          const campFamiliesServed = beneficiaries.filter(b =>
            b.aidHistory && b.aidHistory.some(a => a.campaignId === camp.id)
          ).length;

          const progressPercent = camp.targetAmount > 0
            ? Math.min(100, Math.round((campCollected / camp.targetAmount) * 100))
            : 0;

          const isSelected = selectedCampaign === camp.id;

          return (
            <div
              key={camp.id}
              className={`rounded-2xl bg-white border p-5 shadow-xs transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        camp.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : camp.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {camp.status}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-2 leading-snug">
                      {camp.name}
                    </h3>
                    {camp.banglaName && (
                      <p className="text-xs text-amber-600 font-semibold">{camp.banglaName}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(camp)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                      title="Edit campaign"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {campaigns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setCampaignToDelete(camp)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {camp.description || 'Grassroots relief distribution for underprivileged families.'}
                </p>

                {/* Progress bar towards target */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Fund Goal Progress</span>
                    <span className="font-bold text-slate-900">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progressPercent >= 100
                          ? 'bg-emerald-500'
                          : progressPercent >= 60
                          ? 'bg-teal-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Stats Breakdown */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Collected / Target
                    </span>
                    <span className="font-bold text-emerald-700 text-sm block">
                      {formatCurrency(campCollected)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Goal: {formatCurrency(camp.targetAmount)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Families Served
                    </span>
                    <span className="font-bold text-teal-700 text-sm block">
                      {campFamiliesServed} Families
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Target: {camp.targetFamilies} Families
                    </span>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {formatDate(camp.startDate)} {camp.endDate ? `— ${formatDate(camp.endDate)}` : '(Ongoing)'}
                  </span>
                </div>
              </div>

              {/* Set as Active Filter button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCampaign(isSelected ? 'all' : camp.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-50 text-teal-800 border border-teal-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>{isSelected ? '✓ Filter Active on Dashboard' : 'Filter Dashboard to this Drive'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Campaign Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCampaign ? 'Edit Campaign Drive' : 'Create New Campaign Drive'}
        subtitle="রমজান ইফতার সামগ্রী, শীতবস্ত্র বা বিশেষ ত্রাণ কর্মসূচি তৈরি করুন"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Campaign Name (English) *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramadan Iftar Samogri Drive 2026"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Campaign Name in Bengali (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={banglaName}
              onChange={(e) => setBanglaName(e.target.value)}
              placeholder="e.g. রমজান ইফতার সামগ্রী বিতরণ ২০২৬"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Fund Goal (৳ Taka)
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Families Count
              </label>
              <input
                type="number"
                value={targetFamilies}
                onChange={(e) => setTargetFamilies(e.target.value)}
                placeholder="e.g. 100"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="active">Active (চলমান)</option>
                <option value="completed">Completed (সম্পন্ন)</option>
                <option value="upcoming">Upcoming (আসন্ন)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description & Objectives
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Providing essential Ramadan food boxes to 100 day laborers and widow families."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
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
              {editingCampaign ? 'Save Changes' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Campaign Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(campaignToDelete)}
        onClose={() => setCampaignToDelete(null)}
        onConfirm={() => {
          if (campaignToDelete) {
            deleteCampaign(campaignToDelete.id);
          }
        }}
        title={`Delete "${campaignToDelete?.name}"?`}
        message="Are you sure you want to remove this campaign? Records linked to it will remain in system ledger."
        confirmText="Yes, Delete Campaign"
        isDestructive={true}
      />
    </div>
  );
};
