import React, { useState } from 'react';
import {
  User,
  Users,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  HeartHandshake,
  AlertCircle,
  Send,
  ShieldCheck,
  Clock,
  Sparkles,
  RefreshCw,
  Building2
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCharity } from '../../context/CharityContext';

export const PublicBeneficiaryApplyModal = ({ isOpen, onClose }) => {
  const { orgSettings, addBeneficiary, addToast } = useCharity();

  const [headName, setHeadName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [nid, setNid] = useState('');
  const [familyMembers, setFamilyMembers] = useState(4);
  const [category, setCategory] = useState('Ultra Poor');
  const [hardshipDetails, setHardshipDetails] = useState('');
  
  // Applicant details (self or on behalf)
  const [applyType, setApplyType] = useState('self'); // 'self' | 'representative'
  const [repName, setRepName] = useState('');
  const [repPhone, setRepPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setHeadName('');
    setGuardianName('');
    setPhone('');
    setAddress('');
    setNid('');
    setFamilyMembers(4);
    setCategory('Ultra Poor');
    setHardshipDetails('');
    setApplyType('self');
    setRepName('');
    setRepPhone('');
    setIsSubmitting(false);
    setSubmittedData(null);
    setErrorMsg('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!headName.trim()) {
      setErrorMsg('Please enter the family head name (পরিবার প্রধানের নাম).');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter a valid mobile number for relief coordination.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter the family address or area.');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitterTag = applyType === 'representative' && repName.trim()
        ? `Public Portal (Applied by: ${repName.trim()}${repPhone ? ` • ${repPhone.trim()}` : ''})`
        : 'Public Online Application (Self)';

      const payload = {
        headName: headName.trim(),
        guardianName: guardianName.trim() || undefined,
        phone: phone.trim(),
        address: address.trim(),
        nid: nid.trim() || undefined,
        familyMembers: Number(familyMembers) || 4,
        category: category || 'Ultra Poor',
        hardshipDetails: hardshipDetails.trim() || undefined,
        approvalStatus: 'pending',
        status: 'Pending Approval',
        submittedBy: submitterTag,
        submittedAt: new Date().toISOString()
      };

      const created = await addBeneficiary(payload);
      setSubmittedData(created || payload);
      addToast('Relief application submitted successfully! Awaiting Admin review.', 'success');
    } catch (err) {
      console.error('Error submitting relief application:', err);
      setErrorMsg(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Apply for Relief Aid & Food Rations"
      subtitle={`${orgSettings?.name || 'Ekmutho Hashi'} • দুস্থ ও সুবিধাবঞ্চিত পরিবারের নাম নিবন্ধন ও যাচাইকরণ`}
      maxWidth="max-w-2xl"
    >
      {submittedData ? (
        /* Confirmation Screen */
        <div className="py-4 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider mb-2">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Submitted • Awaiting Admin Approval
              </span>
              <h3 className="text-lg font-black text-slate-900">
                ত্রাণ সহায়তার আবেদন সফলভাবে জমা হয়েছে
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                আপনার আবেদনটি আমাদের ডেটাবেসে অন্তর্ভুক্ত হয়েছে এবং নির্বাহী অনুমোদনের জন্য প্রেরণ করা হয়েছে।
              </p>
            </div>
          </div>

          {/* Tracking Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Family Tracking ID
              </span>
              <span className="text-sm font-mono font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                {submittedData.familyId || 'EH-FAM-PENDING'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Family Head Name (পরিবার প্রধান):</span>
                <span className="font-extrabold text-slate-800 text-sm">{submittedData.headName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Contact Mobile (মোবাইল):</span>
                <span className="font-mono font-bold text-slate-800">{submittedData.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Area / Address (ঠিকানা):</span>
                <span className="font-semibold text-slate-700">{submittedData.address}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Category (ক্যাটাগরি):</span>
                <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                  {submittedData.category}
                </span>
              </div>
            </div>

            {/* Admin Verification Notice */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Executive Admin Approval Workflow</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                As per <strong>Ekmutho Hashi</strong> transparency governance, all field relief tokens must be authorized by <strong>Engr. Arman Hossain (Admin, President & CEO)</strong>. Once verified, our field volunteers will dispatch the relief package and issue your official authorized Token Slip.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-teal-600 hover:bg-teal-700 active:scale-98 transition shadow-sm"
            >
              Close & Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* Application Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header Description & Verification Notice */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1 min-w-0">
              <h4 className="font-extrabold text-slate-900 leading-tight">
                দুস্থ ও অসহায় পরিবারের জন্য খাদ্য ও ত্রাণ আবেদন
              </h4>
              <p className="text-slate-600 leading-relaxed">
                একমুঠো হাসি প্রকৃত অসচ্ছল, দিনমজুর ও সুবিধাবঞ্চিত পরিবারকে জরুরি খাদ্য ও রমজান সামগ্রী প্রদান করে। আবেদনের পর এডমিন যাচাইকরণ শেষে ত্রাণ কার্ড / টোকেন প্রদান করা হবে।
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Applicant Role Selector */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Application Submitted By (আবেদনকারী কে?)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setApplyType('self')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition text-left flex items-center gap-2 ${
                  applyType === 'self'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>Applying for My Family (নিজের পরিবারের জন্য)</span>
              </button>

              <button
                type="button"
                onClick={() => setApplyType('representative')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition text-left flex items-center gap-2 ${
                  applyType === 'representative'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>On Behalf of a Needy Neighbor (প্রতিবেশীর পক্ষে)</span>
              </button>
            </div>

            {applyType === 'representative' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 animate-in fade-in duration-150">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Your Name (আপনার নাম) *
                  </label>
                  <input
                    type="text"
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    placeholder="e.g. Arif Hossain"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    required={applyType === 'representative'}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Your Contact Phone (আপনার মোবাইল)
                  </label>
                  <input
                    type="tel"
                    value={repPhone}
                    onChange={(e) => setRepPhone(e.target.value)}
                    placeholder="e.g. 01712-000000"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Family Beneficiary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Family Head Name (পরিবার প্রধান) *</span>
              </label>
              <input
                type="text"
                value={headName}
                onChange={(e) => setHeadName(e.target.value)}
                placeholder="e.g. Rehena Begum / মো: জসিম উদ্দিন"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Guardian / Spouse / Father (অভিভাবক)</span>
              </label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Late Abdul Karim (মৃত আব্দুল করিম)"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Mobile Number (যোগাযোগের মোবাইল) *</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 01712-345678"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Total Family Members (পরিবারের সদস্য সংখ্যা) *</span>
              </label>
              <input
                type="number"
                min={1}
                max={25}
                value={familyMembers}
                onChange={(e) => setFamilyMembers(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                <span>Priority Category (ক্যাটাগরি) *</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-medium cursor-pointer"
                required
              >
                <option value="Ultra Poor">Ultra Poor / Destitute (হতদরিদ্র)</option>
                <option value="Widow">Widow / Single Mother (বিধবা / স্বামী পরিত্যক্তা)</option>
                <option value="Day Laborer">Day Laborer / Daily Wage (দিনমজুর / রিকশাচালক)</option>
                <option value="Disabled">Disabled / Physical Impairment (প্রতিবন্ধী পরিবার)</option>
                <option value="Orphan Family">Orphan Family (এতিম পরিবার)</option>
                <option value="Elderly / Sick">Elderly / Chronic Illness (বয়োবৃদ্ধ ও অসুস্থ)</option>
                <option value="Disaster Affected">Disaster / Flood Affected (দুর্যোগে ক্ষতিগ্রস্ত)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>NID or Birth Certificate # (ঐচ্ছিক)</span>
              </label>
              <input
                type="text"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                placeholder="e.g. 1985269123456789"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Address / Village / Ward (এলাকা ও বিস্তারিত ঠিকানা) *</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. মিরপুর ১১, ব্লক-সি, রোড নং ৪, ঢাকা"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Hardship & Need Description (অসহায়ত্ব ও বর্তমান পরিস্থিতি)</span>
            </label>
            <textarea
              rows={2}
              value={hardshipDetails}
              onChange={(e) => setHardshipDetails(e.target.value)}
              placeholder="e.g. পরিবারের আয়ের কোনো নির্দিষ্ট মাধ্যম নেই, ঘরে খাবার সংকট রয়েছে..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Transparency & Approval Guarantee Footer */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-slate-600 text-xs">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Executive Admin <strong>Engr. Arman Hossain</strong> will verify this application. No fees are ever required for relief registration.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-98 transition shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Submitting Application...' : 'Submit Relief Application (আবেদন জমা দিন)'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
