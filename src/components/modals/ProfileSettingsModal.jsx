import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  MapPin,
  Lock,
  Save,
  CheckCircle2,
  Crown,
  BadgeAlert,
  Sparkles
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCharity } from '../../context/CharityContext';

export const ProfileSettingsModal = ({ isOpen, onClose, onOpenStaffManagement }) => {
  const { user, staff, updateStaffProfile } = useCharity();

  const currentStaff = staff.find(
    s => s.email?.toLowerCase() === user?.email?.toLowerCase() || s.id === user?.id
  );

  const isAdmin = user?.user_metadata?.is_admin || user?.email === 'arman@ekmuthohashi.org';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [notes, setNotes] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || currentStaff?.fullName || 'Volunteer Member');
      setPhone(currentStaff?.phone || user.user_metadata?.phone || '');
      setArea(currentStaff?.area || 'Central Hub');
      setNotes(currentStaff?.notes || '');
    }
  }, [user, currentStaff, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (password && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const updatedData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      area: area.trim(),
      notes: notes.trim()
    };

    updateStaffProfile(updatedData);
    setSuccessMsg('Profile settings saved successfully!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const currentRole = currentStaff?.role || (isAdmin ? 'Admin, President & CEO' : 'Field Volunteer');
  const staffId = currentStaff?.staffId || (isAdmin ? 'EH-STAFF-001' : 'EH-VOLUNTEER');
  const staffStatus = currentStaff?.status || (isAdmin ? 'approved' : 'approved');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Staff Profile & Account Settings"
      subtitle="স্বেচ্ছাসেবক ও কর্মকর্তা প্রোফাইল আপডেট"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {/* Profile Header Badge */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            isAdmin
              ? 'bg-gradient-to-r from-amber-50 to-amber-100/70 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xs shrink-0 ${
                isAdmin
                  ? 'bg-amber-500 text-white ring-4 ring-amber-300/40'
                  : 'bg-teal-600 text-white'
              }`}
            >
              {isAdmin ? <Crown className="w-7 h-7" /> : fullName[0]?.toUpperCase() || 'V'}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base">{fullName}</span>
                {isAdmin && <Sparkles className="w-4 h-4 text-amber-600" />}
              </div>
              <p className="text-xs text-slate-500 font-mono">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-[10px] font-bold text-slate-400">
                  ID: {staffId}
                </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    staffStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isAdmin ? '👑 President & CEO' : staffStatus === 'approved' ? '✓ Verified Staff' : 'Pending Approval'}
                </span>
              </div>
            </div>
          </div>

          {isAdmin && onOpenStaffManagement && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenStaffManagement();
              }}
              className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-xl transition shadow-xs"
            >
              Staff Approvals
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Profile Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Name (পূর্ণ নাম) *</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Mobile Phone</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Assigned Role</span>
              </label>
              <input
                type="text"
                value={currentRole}
                disabled
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-100 text-slate-700 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {isAdmin ? 'Organization Master Role' : 'Role managed by Engr. Arman Hossain'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Operational Branch / Area</span>
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Mirpur & Kallyanpur Hub"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Field Bio / Responsibility Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. In charge of token verification and distribution logistics in Ward 3."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Change Password (Optional) */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Update Password (Optional)</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password (min 6 chars)"
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition flex items-center gap-1.5 active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
