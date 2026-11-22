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
  Users,
  ChevronDown,
  ShieldAlert,
  UserCog,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCharity } from '../../context/CharityContext';

export const ProfileSettingsModal = ({
  isOpen,
  onClose,
  onOpenStaffManagement,
  targetStaffMember = null
}) => {
  const { user, staff, updateStaffProfile, isUserAdmin } = useCharity();

  // Find default selected staff: targetStaffMember or logged-in user or first staff
  const initialStaffId = targetStaffMember?.id ||
    staff.find(s => s.email?.toLowerCase() === user?.email?.toLowerCase() || s.id === user?.id)?.id ||
    staff[0]?.id;

  const [selectedStaffId, setSelectedStaffId] = useState(initialStaffId);

  // Active target staff being edited
  const currentStaff = staff.find(s => s.id === selectedStaffId) ||
    staff.find(s => s.email?.toLowerCase() === user?.email?.toLowerCase()) ||
    staff[0];

  const isEditingSelf = currentStaff?.email?.toLowerCase() === user?.email?.toLowerCase() || currentStaff?.id === user?.id;
  const isChief = currentStaff?.email === 'arman@ekmuthohashi.org' || currentStaff?.role?.includes('CEO');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Field Volunteer');
  const [status, setStatus] = useState('approved');
  const [area, setArea] = useState('');
  const [notes, setNotes] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize form when selectedStaffId or isOpen changes
  useEffect(() => {
    if (targetStaffMember) {
      setSelectedStaffId(targetStaffMember.id);
    }
  }, [targetStaffMember, isOpen]);

  useEffect(() => {
    if (currentStaff) {
      setFullName(currentStaff.fullName || '');
      setEmail(currentStaff.email || '');
      setPhone(currentStaff.phone === 'N/A' ? '' : (currentStaff.phone || ''));
      setRole(currentStaff.role || 'Field Volunteer');
      setStatus(currentStaff.status || 'approved');
      setArea(currentStaff.area || 'Central Hub');
      setNotes(currentStaff.notes || '');
      setAvatarUrl(currentStaff.avatarUrl || null);
      setPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [selectedStaffId, currentStaff, isOpen]);

  if (!isOpen) return null;

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Photo size exceeds 3MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setAvatarUrl(base64);
        setErrorMsg('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter full name.');
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
      id: currentStaff.id,
      fullName: fullName.trim(),
      email: isUserAdmin ? email.trim().toLowerCase() : currentStaff.email,
      phone: phone.trim() || 'N/A',
      role: isUserAdmin ? role : currentStaff.role,
      status: isUserAdmin ? status : currentStaff.status,
      area: area.trim() || 'General Field Team',
      notes: notes.trim(),
      avatarUrl: avatarUrl || null
    };

    if (password) {
      updatedData.password = password;
    }

    updateStaffProfile(updatedData, currentStaff.id);
    setSuccessMsg(`Profile settings for ${fullName} updated successfully!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUserAdmin ? "Staff Profile & Permission Settings" : "My Profile Settings"}
      subtitle={isUserAdmin ? "Engr. Arman Hossain (Admin) • সকল স্টাফ ও স্বেচ্ছাসেবকের প্রোফাইল ও ছবি নিয়ন্ত্রণ" : "স্বেচ্ছাসেবক প্রোফাইল ও একাউন্ট আপডেট"}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {/* ADMIN ONLY: Staff Selector Dropdown to configure ANY staff member */}
        {isUserAdmin && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-teal-500/10 border border-amber-300/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <UserCog className="w-4 h-4 text-amber-600" />
                <span>Select Staff Member Profile to Configure (স্টাফ নির্বাচন):</span>
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                Admin Full Access
              </span>
            </div>

            <div className="relative">
              <select
                value={currentStaff?.id || ''}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full pl-3.5 pr-8 py-2 text-xs sm:text-sm font-bold rounded-xl border border-amber-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 cursor-pointer appearance-none shadow-xs"
              >
                {staff.map((s) => {
                  const isArman = s.email === 'arman@ekmuthohashi.org' || s.role.includes('CEO');
                  return (
                    <option key={s.id} value={s.id}>
                      {isArman ? '[CEO] ' : ''}{s.fullName} ({s.role}) • {s.staffId || s.id} {s.status === 'pending' ? ' [PENDING]' : ''}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>

            <p className="text-[10px] text-amber-900/80">
              You have administrative authority to modify profile photo, roles, contact details, operational area, and status for this staff member.
            </p>
          </div>
        )}

        {/* Profile Header & Picture Upload Section */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 ${
            isChief
              ? 'bg-gradient-to-r from-amber-50 to-amber-100/70 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 min-w-0 text-center sm:text-left w-full">
            {/* Avatar Preview with Camera Overlay */}
            <div className="relative group shrink-0">
              <div
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shadow-sm flex items-center justify-center font-black text-2xl relative bg-white ${
                  isChief ? 'border-amber-400 ring-4 ring-amber-300/40' : 'border-teal-400 ring-4 ring-teal-200/50'
                }`}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : isChief ? (
                  <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center">
                    <ShieldCheck className="w-9 h-9" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-600 to-teal-700 text-white flex items-center justify-center">
                    {fullName[0]?.toUpperCase() || 'S'}
                  </div>
                )}
              </div>

              {/* Upload Overlay Button */}
              <label
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-slate-900 hover:bg-black text-white shadow-md cursor-pointer transition active:scale-90"
                title="Upload Profile Picture"
              >
                <Camera className="w-4 h-4 text-amber-300" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Profile Info & Avatar Actions */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 truncate">
                <span className="font-extrabold text-slate-900 text-base truncate">{fullName}</span>
              </div>
              <p className="text-xs text-slate-500 font-mono truncate">{currentStaff?.email}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="font-mono text-[10px] font-bold text-slate-400">
                  ID: {currentStaff?.staffId || currentStaff?.id}
                </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {isChief ? 'President & CEO' : status === 'approved' ? 'Verified Staff' : status === 'pending' ? 'Pending Approval' : 'Suspended'}
                </span>
              </div>

              {/* Picture Action Buttons */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2.5">
                <label className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer shadow-2xs transition">
                  <Upload className="w-3 h-3 text-teal-600" />
                  <span>{avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Profile Picture"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {isUserAdmin && onOpenStaffManagement && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenStaffManagement();
              }}
              className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-xl transition shadow-xs shrink-0 hidden sm:inline-block"
            >
              Staff Roster
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

        {/* Profile Fields */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name (পূর্ণ নাম) *</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-semibold"
                required
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
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address {isUserAdmin && '(Admin Editable)'}</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => isUserAdmin && setEmail(e.target.value)}
                disabled={!isUserAdmin}
                className={`w-full px-3.5 py-2 text-xs font-mono rounded-xl border ${
                  isUserAdmin
                    ? 'border-slate-300 bg-white'
                    : 'border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Assigned Role {isUserAdmin && '(Admin Permitted)'}</span>
              </label>
              {isUserAdmin && !isChief ? (
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Field Volunteer">Field Volunteer (মাঠপর্যায়ের স্বেচ্ছাসেবক)</option>
                  <option value="Field Distribution Coordinator">Distribution Coordinator (ত্রাণ বিতরণ সমন্বয়ক)</option>
                  <option value="Logistics & Wholesale Procurement">Logistics Lead (পাইকারি ক্রয় ও পরিবহন)</option>
                  <option value="Area Survey & Verification Lead">Survey & Verification Lead (পরিবার যাচাই)</option>
                  <option value="Accountant & Treasurer">Accountant & Treasurer (হিসাব ও কোষাধ্যক্ষ)</option>
                  <option value="Admin">Admin (প্রশাসক)</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={role}
                  disabled
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-100 text-slate-700 cursor-not-allowed"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {isUserAdmin && !isChief && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>Account Status</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="approved">Approved & Active (অনুমোদিত ও সক্রিয়)</option>
                  <option value="pending">Pending Approval (অনুমোদনের অপেক্ষায়)</option>
                  <option value="suspended">Suspended (স্থগিত)</option>
                </select>
              </div>
            )}
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

        {/* Change / Reset Password */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {isUserAdmin && !isEditingSelf
                ? `Set / Reset Password for ${fullName}`
                : 'Update Password (Optional)'}
            </span>
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
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
