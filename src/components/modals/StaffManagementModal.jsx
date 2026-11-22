import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  UserPlus,
  UserCog
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCharity } from '../../context/CharityContext';
import { formatDate } from '../../utils/formatters';

export const StaffManagementModal = ({ isOpen, onClose, onEditStaffProfile }) => {
  const {
    staff,
    approveStaffMember,
    rejectStaffMember,
    removeStaffMember,
    updateStaffRole,
    addStaffMemberDirectly
  } = useCharity();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'roster' | 'add'

  // Direct add form state
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('Field Volunteer');
  const [newArea, setNewArea] = useState('Central Hub');
  const [newNotes, setNewNotes] = useState('');

  if (!isOpen) return null;

  const pendingList = staff.filter(s => s.status === 'pending');
  const approvedList = staff.filter(s => s.status === 'approved');

  const handleDirectAdd = (e) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) return;

    addStaffMemberDirectly({
      fullName: newFullName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim() || 'N/A',
      role: newRole,
      area: newArea.trim() || 'General Field Team',
      notes: newNotes.trim()
    });

    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
    setActiveTab('roster');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Staff & Volunteer Access Management"
      subtitle="Engr. Arman Hossain (Admin & CEO) • কর্মী ও স্বেচ্ছাসেবক অনুমোদন ও দায়িত্ব বণ্টন"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Top Summary Badges */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Roster
            </span>
            <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
              {staff.length} Persons
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Active / Approved
            </span>
            <span className="text-xl font-black text-emerald-800 font-mono mt-0.5 block">
              {approvedList.length} Staff
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border text-center ${
              pendingList.length > 0
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider block ${
                pendingList.length > 0 ? 'text-amber-800' : 'text-slate-400'
              }`}
            >
              Pending Approvals
            </span>
            <span
              className={`text-xl font-black font-mono mt-0.5 block ${
                pendingList.length > 0 ? 'text-amber-700 animate-pulse' : 'text-slate-700'
              }`}
            >
              {pendingList.length} Applicants
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approvals ({pendingList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'roster'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Active Team Roster ({approvedList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Staff Directly</span>
          </button>
        </div>

        {/* Tab 1: Pending Approvals */}
        {activeTab === 'pending' && (
          <div className="space-y-3">
            {pendingList.length > 0 ? (
              pendingList.map((cand) => (
                <div
                  key={cand.id}
                  className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 border border-amber-300 shrink-0 flex items-center justify-center font-bold text-sm text-amber-900 mt-0.5">
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
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
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
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <p className="font-semibold text-slate-700">No Pending Applications</p>
                <p className="text-[11px]">All registered staff and volunteers have been reviewed.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Active Staff Team Roster */}
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

        {/* Tab 3: Direct Registration */}
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
                <label className="block text-slate-600 font-bold mb-1">Email Address *</label>
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
                <label className="block text-slate-600 font-bold mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition"
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
