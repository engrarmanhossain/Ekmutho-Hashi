import React, { useState, useEffect } from 'react';
import {
  Building2,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  FileText,
  UserCheck,
  CheckCircle2,
  Save,
  RotateCcw,
  CreditCard,
  Sliders,
  Crop
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { ImageAdjusterModal } from '../common/ImageAdjusterModal';
import { useCharity } from '../../context/CharityContext';

export const OrgSettingsModal = ({ isOpen, onClose }) => {
  const { orgSettings, updateOrgSettings, resetOrgSettings, isUserAdmin } = useCharity();

  const [formData, setFormData] = useState({
    name: '',
    banglaName: '',
    slogan: '',
    logoUrl: '',
    email: '',
    phone: '',
    address: '',
    regNumber: '',
    president: '',
    designation: '',
    bkashNumber: '',
    nagadNumber: '',
    rocketNumber: '',
    bankDetails: ''
  });

  const [logoPreview, setLogoPreview] = useState('/logo.png');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Image Adjuster state
  const [adjusterImage, setAdjusterImage] = useState(null);
  const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);

  useEffect(() => {
    if (orgSettings) {
      setFormData({
        name: orgSettings.name || 'Ekmutho Hashi',
        banglaName: orgSettings.banglaName || 'একমুঠো হাসি',
        slogan: orgSettings.slogan || 'হৃদয় দিয়ে মানুষের পাশে — একমুঠো হাসি',
        logoUrl: orgSettings.logoUrl || '/logo.png',
        email: orgSettings.email || 'arman@ekmuthohashi.org',
        phone: orgSettings.phone || '+880 1711-002233',
        address: orgSettings.address || 'Mirpur-1 & Kallyanpur Hub, Dhaka-1216, Bangladesh',
        regNumber: orgSettings.regNumber || 'REG-BD-2026-EHMH',
        president: orgSettings.president || 'Engr. Arman Hossain',
        designation: orgSettings.designation || 'Admin, President & CEO',
        bkashNumber: orgSettings.bkashNumber || '01711-002233 (Merchant)',
        nagadNumber: orgSettings.nagadNumber || '01711-002233 (Personal)',
        rocketNumber: orgSettings.rocketNumber || '01711-002233-7',
        bankDetails: orgSettings.bankDetails || 'Islami Bank Bangladesh Ltd, Mirpur Branch, A/C: 2050-1122-3344'
      });
      setLogoPreview(orgSettings.logoUrl || '/logo.png');
    }
  }, [orgSettings, isOpen]);

  if (!isOpen) return null;

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 8MB. Please select a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setAdjusterImage(base64);
        setIsAdjusterOpen(true);
        setErrorMsg('');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAdjustCurrentLogo = () => {
    if (logoPreview) {
      setAdjusterImage(logoPreview);
      setIsAdjusterOpen(true);
    }
  };

  const handleSaveAdjustedLogo = (croppedDataUrl) => {
    setLogoPreview(croppedDataUrl);
    setFormData(prev => ({ ...prev, logoUrl: croppedDataUrl }));
    setSuccessMsg('Logo adjusted! Click "Save Changes" below to apply across dashboard.');
  };

  const handleRestoreDefaultLogo = () => {
    setLogoPreview('/logo.png');
    setFormData(prev => ({ ...prev, logoUrl: '/logo.png' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Organization name cannot be empty.');
      return;
    }

    updateOrgSettings(formData);
    setSuccessMsg('Organization profile and logo saved successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1100);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all organization name, branding, and contact details back to default?')) {
      resetOrgSettings();
      setLogoPreview('/logo.png');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Organization Profile & Branding Settings"
      subtitle="Engr. Arman Hossain (Admin, President & CEO) • লোগো ও প্রাতিষ্ঠানিক তথ্য কনফিগারেশন"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Admin Executive Header Notice */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-teal-500/10 border border-amber-300/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-amber-950 flex items-center gap-1">
                Executive Admin Control Panel
              </span>
              <p className="text-[11px] text-amber-900/80">
                Changes made here immediately update all navigation bars, public receipts, cards, and printed audit reports.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
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

        {/* Section 1: Logo & Branding Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
            <span>Organization Logo (লোগো পরিবর্তন ও প্রিভিউ)</span>
          </span>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Live Logo Preview Box */}
            <div className="w-full sm:w-44 h-24 rounded-xl border border-slate-300 bg-white p-2.5 flex flex-col items-center justify-center shadow-xs relative group overflow-hidden shrink-0">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Organization Logo"
                  className="max-h-full max-w-full object-contain filter drop-shadow-sm transition group-hover:scale-105 duration-200"
                />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>

            {/* Logo Actions */}
            <div className="flex-1 w-full space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-98">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleAdjustCurrentLogo}
                    className="px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    title="Crop, zoom, rotate or reposition the logo image"
                  >
                    <Sliders className="w-3.5 h-3.5 text-teal-600" />
                    <span>Adjust Logo</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRestoreDefaultLogo}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Restore Official 3D Logo</span>
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Or Direct Image URL
                </label>
                <input
                  type="text"
                  value={formData.logoUrl.startsWith('data:') ? '(Custom Uploaded Image Data)' : formData.logoUrl}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, logoUrl: e.target.value }));
                    setLogoPreview(e.target.value);
                  }}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Organization Name & Slogan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Organization Name (English) *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Ekmutho Hashi"
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Organization Name (বাংলা) *
            </label>
            <input
              type="text"
              value={formData.banglaName}
              onChange={(e) => setFormData(prev => ({ ...prev, banglaName: e.target.value }))}
              placeholder="e.g. একমুঠো হাসি"
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-bold font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Slogan / Humanitarian Mission (স্লোগান)
          </label>
          <input
            type="text"
            value={formData.slogan}
            onChange={(e) => setFormData(prev => ({ ...prev, slogan: e.target.value }))}
            placeholder="হৃদয় দিয়ে মানুষের পাশে — একমুঠো হাসি"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-medium"
          />
        </div>

        {/* Section 3: Official Contact & Headquarters */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Official Address & Registration Details</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Official Hotline / Mobile</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-bold mb-1">HQ / Central Hub Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Charity / NGO Reg. Number</label>
              <input
                type="text"
                value={formData.regNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, regNumber: e.target.value }))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">President & CEO Signature Name</label>
              <input
                type="text"
                value={formData.president}
                onChange={(e) => setFormData(prev => ({ ...prev, president: e.target.value }))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Public Donation Channels (Shown in Public View) */}
        <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2.5">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-amber-600" />
            <span>Public Donation Payment Channels (পাবলিক ডোনেশন একাউন্ট)</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">bKash Number</label>
              <input
                type="text"
                value={formData.bkashNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, bkashNumber: e.target.value }))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Nagad Number</label>
              <input
                type="text"
                value={formData.nagadNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, nagadNumber: e.target.value }))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Rocket Number</label>
              <input
                type="text"
                value={formData.rocketNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, rocketNumber: e.target.value }))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-600 font-bold mb-1">Bank Account Transfer Details</label>
              <input
                type="text"
                value={formData.bankDetails}
                onChange={(e) => setFormData(prev => ({ ...prev, bankDetails: e.target.value }))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-[11px]"
              />
            </div>
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
            className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition flex items-center gap-1.5 active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save Organization Profile</span>
          </button>
        </div>
      </form>

      {/* Interactive Image Adjuster / Crop Modal */}
      <ImageAdjusterModal
        isOpen={isAdjusterOpen}
        onClose={() => setIsAdjusterOpen(false)}
        imageSrc={adjusterImage}
        onSave={handleSaveAdjustedLogo}
        aspectType="square"
        title="Adjust & Crop Organization Logo"
      />
    </Modal>
  );
};
