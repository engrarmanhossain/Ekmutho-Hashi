import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  UserPlus,
  Trash2,
  Mail,
  Phone,
  MapPin,
  UserCog,
  HeartHandshake,
  Heart,
  Receipt,
  XCircle,
  FileText,
  Sparkles,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCharity } from '../../context/CharityContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const StaffManagementModal = ({ isOpen, onClose, onEditStaffProfile }) => {
  const {
    staff,
    beneficiaries,
    donors,
    approveBeneficiary,
    rejectBeneficiary,
    approveDonor,
    rejectDonor,
    approveStaffMember,
    rejectStaffMember,
    removeStaffMember,
    updateStaffRole,
    addStaffMemberDirectly
  } = useCharity();

  const pendingBeneficiaries = beneficiaries.filter(
    b => b.approvalStatus === 'pending' || b.status === 'Pending Approval'
  );
  const pendingDonors = donors.filter(
    d => d.approvalStatus === 'pending' || d.status === 'Pending Verification'
  );
  const pendingStaff = staff.filter(s => s.status === 'pending');
  const approvedList = staff.filter(s => s.status === 'approved');

  // Choose default tab dynamically based on where pending items exist
  const [activeTab, setActiveTab] = useState(() => {
    if (pendingBeneficiaries.length > 0) return 'pending-relief';
    if (pendingDonors.length > 0) return 'pending-donations';
    if (pendingStaff.length > 0) return 'pending-staff';
    return 'roster';
  });

  // Direct add form state
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('Field Volunteer');
  const [newArea, setNewArea] = useState('Central Hub');
  const [newNotes, setNewNotes] = useState('');

  if (!isOpen) return null;

  const handleDirectAdd = (e) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) return;

    addStaffMemberDirectly({
      fullName: newFullName.trim(),
      email: newEmail.trim().toLowerCase(),
      password: newPassword.trim() || 'staff123456',
      phone: newPhone.trim() || 'N/A',
      role: newRole,
      area: newArea.trim() || 'General Field Team',
      notes: newNotes.trim()
    });

    setNewFullName('');
    setNewEmail('');
    setNewPassword('');
    setNewPhone('');
    setNewNotes('');
    setActiveTab('roster');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Executive Admin Approvals & Team Panel"
      subtitle="Engr. Arman Hossain (Admin & CEO) • ত্রাণ আবেদন, অনুদান যাচাই ও টিম কন্ট্রোল"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Top Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Pending Relief Applications */}
          <div
            onClick={() => setActiveTab('pending-relief')}
            className={`p-3 rounded-2xl border text-center cursor-pointer transition select-none ${
              pendingBeneficiaries.length > 0
                ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20 hover:bg-amber-100/70'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider block ${
                pendingBeneficiaries.length > 0 ? 'text-amber-800' : 'text-slate-400'
              }`}
            >
              Pending Relief
            </span>
            <span
              className={`text-lg font-black font-mono mt-0.5 block ${
                pendingBeneficiaries.length > 0 ? 'text-amber-700 animate-pulse' : 'text-slate-700'
              }`}
            >
              {pendingBeneficiaries.length} Families
            </span>
          </div>

          {/* Pending Online Donations */}
          <div
            onClick={() => setActiveTab('pending-donations')}
            className={`p-3 rounded-2xl border text-center cursor-pointer transition select-none ${
              pendingDonors.length > 0
                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/20 hover:bg-emerald-100/70'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider block ${
                pendingDonors.length > 0 ? 'text-emerald-800' : 'text-slate-400'
              }`}
            >
              Pending Donations
            </span>
            <span
              className={`text-lg font-black font-mono mt-0.5 block ${
                pendingDonors.length > 0 ? 'text-emerald-700 animate-pulse' : 'text-slate-700'
              }`}
            >
              {pendingDonors.length} Pledges
            </span>
          </div>

          {/* Pending Staff Applicants */}
          <div
            onClick={() => setActiveTab('pending-staff')}
            className={`p-3 rounded-2xl border text-center cursor-pointer transition select-none ${
              pendingStaff.length > 0
                ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-400/20 hover:bg-purple-100/70'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider block ${
                pendingStaff.length > 0 ? 'text-purple-800' : 'text-slate-400'
              }`}
            >
              Pending Staff
            </span>
            <span
              className={`text-lg font-black font-mono mt-0.5 block ${
                pendingStaff.length > 0 ? 'text-purple-700 animate-pulse' : 'text-slate-700'
              }`}
            >
              {pendingStaff.length} Applicants
            </span>
          </div>

          {/* Active Staff Roster */}
          <div
            onClick={() => setActiveTab('roster')}
            className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-center cursor-pointer hover:bg-teal-100/60 transition select-none"
          >
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
              Active Team
            </span>
            <span className="text-lg font-black text-teal-800 font-mono mt-0.5 block">
              {approvedList.length} Members
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('pending-relief')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'pending-relief'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Relief Applications ({pendingBeneficiaries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pending-donations')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'pending-donations'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Donations ({pendingDonors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pending-staff')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'pending-staff'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff ({pendingStaff.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'roster'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Active Team ({approvedList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'add'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Staff Directly</span>
          </button>
        </div>

        {/* Tab 1: Pending Relief Applications */}
        {activeTab === 'pending-relief' && (
          <div className="space-y-3">
            {pendingBeneficiaries.length > 0 ? (
              pendingBeneficiaries.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
                      <HeartHandshake className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {b.headName}
                        </span>
                        {b.guardianName && (
                          <span className="text-slate-500 text-xs">
                            (অভিভাবক: {b.guardianName})
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-200 text-amber-900 border border-amber-300 uppercase">
                          Awaiting Admin Approval
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200 font-mono">
                          {b.familyId || b.id}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px]">
                        <span className="flex items-center gap-1 font-mono font-bold text-slate-800">
                          <Phone className="w-3 h-3 text-slate-400" /> {b.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {b.address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" /> {b.familyMembers || 4} Members
                        </span>
                        <span className="font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.2 rounded">
                          {b.category || b.priorityCategory || 'Destitute'}
                        </span>
                      </div>

                      {b.hardshipDetails && (
                        <p className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-xl border border-amber-200/60 leading-relaxed">
                          <strong>Hardship Situation:</strong> "{b.hardshipDetails}"
                        </p>
                      )}

                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Submitted by: <strong>{b.submittedBy || 'Public Online Application'}</strong></span>
                        {b.submittedAt && <span>• {formatDate(b.submittedAt)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => approveBeneficiary(b.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Authorize Token</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const reason = window.prompt(`Decline reason for ${b.headName}:`, 'Criteria not met');
                        if (reason !== null) {
                          rejectBeneficiary(b.id, reason);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-white border border-rose-300 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 inline mr-1" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-xs space-y-1">
                <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1" />
                <p className="font-bold text-slate-800 text-sm">All Relief Applications Reviewed!</p>
                <p className="text-[11px] text-slate-500">
                  There are currently no needy families pending Executive Admin approval.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Pending Online Donations */}
        {activeTab === 'pending-donations' && (
          <div className="space-y-3">
            {pendingDonors.length > 0 ? (
              pendingDonors.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
                      <Heart className="w-5 h-5 text-rose-200 fill-rose-200" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {d.donorName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-200 text-emerald-900 border border-emerald-300 uppercase">
                          Pending Verification
                        </span>
                        <span className="font-mono text-xs text-teal-800 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                          {d.receiptId || d.id}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px]">
                        <span className="font-black text-emerald-700 text-sm font-mono">
                          {formatCurrency(d.amount)}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          <CreditCard className="w-3 h-3 text-teal-600" /> {d.paymentMethod}
                        </span>
                        {d.transactionId && (
                          <span className="font-mono text-[11px] font-bold text-slate-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                            TrxID: {d.transactionId}
                          </span>
                        )}
                        {d.phone && d.phone !== 'N/A' && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" /> {d.phone}
                          </span>
                        )}
                      </div>

                      {d.note && (
                        <p className="text-[11px] text-slate-600 bg-white/70 p-1.5 rounded-lg border border-slate-200">
                          "{d.note}"
                        </p>
                      )}

                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Submitted via: <strong>{d.submittedBy || 'Online Portal'}</strong></span>
                        {d.date && <span>• Date: {formatDate(d.date)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => approveDonor(d.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verify & Issue Receipt</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const reason = window.prompt(`Reason to reject donation from ${d.donorName}:`, 'Unverified transaction');
                        if (reason !== null) {
                          rejectDonor(d.id, reason);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-white border border-rose-300 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 inline mr-1" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-xs space-y-1">
                <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1" />
                <p className="font-bold text-slate-800 text-sm">All Donations Verified!</p>
                <p className="text-[11px] text-slate-500">
                  There are no incoming public donor pledges waiting for verification.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Staff & Volunteer Pending Approvals */}
        {activeTab === 'pending-staff' && (
          <div className="space-y-3">
            {pendingStaff.length > 0 ? (
              pendingStaff.map((cand) => (
                <div
                  key={cand.id}
                  className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-100 border border-purple-300 shrink-0 flex items-center justify-center font-bold text-sm text-purple-900 mt-0.5">
                      {cand.avatarUrl ? (
                        <img src={cand.avatarUrl} alt={cand.fullName} className="w-full h-full object-cover" />
                      ) : (
                        cand.fullName[0]?.toUpperCase() || 'P'
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {cand.fullName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-900 uppercase">
                          Awaiting Admin Permission
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px]">
                        <span className="flex items-center gap-1 font-mono">
                          <Mail className="w-3 h-3 text-slate-400" /> {cand.email}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" /> {cand.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {cand.area}
                        </span>
                      </div>

                      {cand.notes && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">
                          Application note: "{cand.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {onEditStaffProfile && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onEditStaffProfile(cand);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition flex items-center gap-1 shadow-2xs"
                        title="Configure applicant profile settings"
                      >
                        <UserCog className="w-3.5 h-3.5 text-teal-600" />
                        <span>Profile</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => approveStaffMember(cand.id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Access</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => rejectStaffMember(cand.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 transition"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-xs space-y-1">
                <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1" />
                <p className="font-bold text-slate-800 text-sm">No Pending Staff Applications</p>
                <p className="text-[11px] text-slate-500">All registered staff and volunteers have been reviewed.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Active Staff Team Roster */}
        {activeTab === 'roster' && (
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-500 tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5">Staff Name & Contact</th>
                    <th className="py-3 px-3">Role / Designation</th>
                    <th className="py-3 px-3">Branch Area</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {approvedList.map((member) => {
                    const isChief = member.email === 'arman@ekmuthohashi.org' || member.role.includes('CEO');

                    return (
                      <tr key={member.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center font-bold text-xs">
                              {member.avatarUrl ? (
                                <img src={member.avatarUrl} alt={member.fullName} className="w-full h-full object-cover" />
                              ) : isChief ? (
                                <span className="w-full h-full bg-amber-500 text-white flex items-center justify-center">
                                  <ShieldCheck className="w-4 h-4 text-white" />
                                </span>
                              ) : (
                                <span className="w-full h-full bg-teal-600 text-white flex items-center justify-center">
                                  {member.fullName[0]?.toUpperCase() || 'S'}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">{member.fullName}</span>
                                {isChief && <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono block">
                                {member.email} {member.phone !== 'N/A' && `• ${member.phone}`}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          {isChief ? (
                            <span className="font-black text-amber-800 text-[11px]">
                              Admin, President & CEO
                            </span>
                          ) : (
                            <select
                              value={member.role}
                              onChange={(e) => updateStaffRole(member.id, e.target.value)}
                              className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white font-medium"
                            >
                              <option value="Field Volunteer">Field Volunteer</option>
                              <option value="Field Distribution Coordinator">Distribution Coordinator</option>
                              <option value="Logistics & Wholesale Procurement">Logistics Lead</option>
                              <option value="Area Survey & Verification Lead">Survey & Verification Lead</option>
                              <option value="Accountant & Treasurer">Accountant & Treasurer</option>
                              <option value="Admin">Admin</option>
                            </select>
                          )}
                        </td>

                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {member.area}
                        </td>

                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Approved
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {onEditStaffProfile && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onEditStaffProfile(member);
                                }}
                                className="p-1.5 text-slate-500 hover:text-teal-700 rounded-lg hover:bg-teal-50 transition"
                                title={`Configure all profile settings for ${member.fullName}`}
                              >
                                <UserCog className="w-4 h-4" />
                              </button>
                            )}

                            {!isChief && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to remove ${member.fullName} from staff?`)) {
                                    (removeStaffMember || rejectStaffMember)(member.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                                title={`Remove ${member.fullName} from team`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Direct Registration */}
        {activeTab === 'add' && (
          <form onSubmit={handleDirectAdd} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Register Pre-Approved Volunteer / Staff Member
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Asif Mahmud"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Email Address (Login ID) *</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="asif@ekmuthohashi.org"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  Login Password (লগইন পাসওয়ার্ড) *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Set password (e.g. asif2026** - min 6 chars)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="Field Volunteer">Field Volunteer</option>
                  <option value="Field Distribution Coordinator">Distribution Coordinator</option>
                  <option value="Logistics & Wholesale Procurement">Logistics Lead</option>
                  <option value="Area Survey & Verification Lead">Survey & Verification Lead</option>
                  <option value="Accountant & Treasurer">Accountant & Treasurer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Branch / Area</label>
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  placeholder="e.g. Rayerbazar Hub"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Notes / Assignment</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Weekend Iftar packaging lead"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition cursor-pointer"
              >
                + Register Staff Member
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
