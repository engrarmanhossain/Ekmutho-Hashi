import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  RefreshCw,
  X,
  ShieldCheck,
  Edit3,
  Check,
  RotateCcw,
  Clock,
  FileText,
  MapPin,
  Phone,
  Users
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { downloadElementAsPDF } from '../../utils/pdfUtils';

export const BeneficiaryTokenModal = ({ isOpen, onClose, beneficiary }) => {
  const {
    campaigns,
    selectedCampaign,
    orgSettings,
    addToast,
    updateBeneficiary,
    approveBeneficiary,
    permissions,
    isUserAdmin,
    user
  } = useCharity();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    headName: '',
    guardianName: '',
    area: '',
    mobile: '',
    familyMembers: 1,
    priorityCategory: 'Extreme Poverty',
    distributionSlot: '',
    tokenNotes: ''
  });

  useEffect(() => {
    if (beneficiary) {
      setFormData({
        headName: beneficiary.headName || '',
        guardianName: beneficiary.guardianName || '',
        area: beneficiary.area || '',
        mobile: beneficiary.mobile || '',
        familyMembers: beneficiary.familyMembers || 1,
        priorityCategory: beneficiary.priorityCategory || 'Extreme Poverty',
        distributionSlot: beneficiary.distributionSlot || '',
        tokenNotes: beneficiary.tokenNotes || ''
      });
      setIsEditing(false);
    }
  }, [beneficiary]);

  if (!isOpen || !beneficiary) return null;

  const currentCamp = campaigns.find(c => c.id === selectedCampaign) || campaigns[0];

  const canEditToken = Boolean(
    user && (permissions?.canManageBeneficiaries || permissions?.canDistributeAid || isUserAdmin)
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const safeName = (formData.headName || beneficiary.headName || 'Beneficiary').replace(/[^a-zA-Z0-9_\u0980-\u09FF]/g, '_');
      const filename = `${beneficiary.tokenNumber}_${safeName}_Relief_Token.pdf`;
      await downloadElementAsPDF('printable-token-card', filename);
      if (addToast) addToast(`Token PDF downloaded: ${filename}`, 'success');
    } catch (err) {
      console.error('PDF download error:', err);
      if (addToast) addToast('Could not generate PDF. Please try Print -> Save as PDF.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.headName.trim()) {
      if (addToast) addToast('Family Head name cannot be empty', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const updatedBeneficiary = {
        ...beneficiary,
        headName: formData.headName.trim(),
        guardianName: formData.guardianName.trim(),
        area: formData.area.trim(),
        mobile: formData.mobile.trim(),
        familyMembers: Number(formData.familyMembers) || 1,
        priorityCategory: formData.priorityCategory,
        distributionSlot: formData.distributionSlot.trim(),
        tokenNotes: formData.tokenNotes.trim()
      };

      if (updateBeneficiary) {
        await updateBeneficiary(updatedBeneficiary);
      }
      setIsEditing(false);
      if (addToast) addToast('Token details & notes updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating token details:', err);
      if (addToast) addToast('Failed to save changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      headName: beneficiary.headName || '',
      guardianName: beneficiary.guardianName || '',
      area: beneficiary.area || '',
      mobile: beneficiary.mobile || '',
      familyMembers: beneficiary.familyMembers || 1,
      priorityCategory: beneficiary.priorityCategory || 'Extreme Poverty',
      distributionSlot: beneficiary.distributionSlot || '',
      tokenNotes: beneficiary.tokenNotes || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs no-print"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div
          className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-lg border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Action Toolbar */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3.5 bg-slate-50 no-print flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" /> Beneficiary Relief Token Card
            </span>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Quick Admin Approve Button if pending */}
              {isUserAdmin && (beneficiary.approvalStatus === 'pending' || beneficiary.status === 'Pending Approval') && (
                <button
                  type="button"
                  onClick={() => approveBeneficiary(beneficiary.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg shadow-xs transition cursor-pointer"
                  title="Approve this family & authorize relief token"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Approve Token</span>
                </button>
              )}

              {/* Staff Edit Token Controls */}
              {canEditToken && (
                isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-lg shadow-xs transition disabled:opacity-60 cursor-pointer"
                      title="Save token updates"
                    >
                      {isSaving ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>{isSaving ? 'Saving...' : 'Save Token'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-xs transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg shadow-xs transition cursor-pointer"
                    title="Edit token details, booth or instructions"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Edit Token</span>
                  </button>
                )
              )}

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloading || isEditing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg shadow-xs transition disabled:opacity-60 cursor-pointer"
                title="Download relief token card as PDF file"
              >
                {isDownloading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">{isDownloading ? 'Generating...' : 'Download PDF'}</span>
                <span className="sm:hidden">PDF</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                disabled={isEditing}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-xs transition cursor-pointer disabled:opacity-60"
                title="Print token card"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Token Slip Body */}
          <div className="p-4 sm:p-6 bg-white print-break-inside-avoid">
            <div
              id="printable-token-card"
              className="border-2 border-dashed border-teal-700 rounded-2xl p-5 bg-gradient-to-br from-teal-50/40 via-white to-amber-50/30 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-teal-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-300 bg-white p-0.5 shrink-0 flex items-center justify-center">
                    <img
                      src={orgSettings?.logoUrl || '/logo.png'}
                      alt={orgSettings?.name || 'Ekmutho Hashi'}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {orgSettings?.name || 'Ekmutho Hashi'}
                    </h3>
                    <p className="text-xs font-bold text-amber-600">{orgSettings?.banglaName || 'একমুঠো হাসি'} • ত্রাণ টোকেন</p>
                    <p className="text-[10px] text-slate-500">Relief Distribution Card</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-teal-800 tracking-wider font-mono">
                    {beneficiary.tokenNumber}
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono">
                    ID: {beneficiary.familyId}
                  </p>
                </div>
              </div>

              {/* Campaign tag */}
              <div className="mt-3 py-1 px-2.5 rounded-md bg-teal-800 text-white text-[11px] font-bold text-center">
                {currentCamp?.name || 'Ramadan Iftar Distribution 2026'}
              </div>

              {/* Executive Admin Approval Status on Token */}
              {(beneficiary.approvalStatus === 'pending' || beneficiary.status === 'Pending Approval') ? (
                <div className="mt-2.5 py-1.5 px-2.5 rounded-md bg-amber-500/20 text-amber-900 border border-amber-400 text-[11px] font-bold text-center flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Awaiting Executive Admin Approval • অনুমোদনের জন্য অপেক্ষমান</span>
                </div>
              ) : (
                <div className="mt-2.5 py-1 px-2.5 rounded-md bg-emerald-50 text-emerald-950 border border-emerald-300 text-[10px] font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Authorized Token</span>
                  </span>
                  <span className="font-semibold text-emerald-800">
                    Approved by Admin: {beneficiary.approvedBy || 'Engr. Arman Hossain'}
                  </span>
                </div>
              )}

              {/* Family details table */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-800">
                <div className="col-span-2 bg-white/80 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Head of Family (পরিবার প্রধান) *
                  </span>
                  {isEditing ? (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={formData.headName}
                        onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
                        className="w-full px-2.5 py-1 text-sm font-bold text-slate-900 border border-teal-300 rounded-lg bg-teal-50/30 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        placeholder="Head of Family Full Name"
                      />
                      <input
                        type="text"
                        value={formData.guardianName}
                        onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs text-slate-700 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        placeholder="Guardian / Spouse / Father Name"
                      />
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-black text-slate-900">
                        {formData.headName}
                      </span>
                      {formData.guardianName && (
                        <span className="text-[11px] text-slate-500 block">
                          Guardian: {formData.guardianName}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Area / Ward (এলাকা)
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-2 py-1 text-xs font-semibold text-slate-800 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      placeholder="e.g. Ward 3, Railgate"
                    />
                  ) : (
                    <span className="font-semibold text-slate-800 truncate block">
                      {formData.area}
                    </span>
                  )}
                </div>

                <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Mobile Number
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-2 py-1 text-xs font-mono text-slate-800 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      placeholder="017xxxxxxxx"
                    />
                  ) : (
                    <span className="font-semibold text-slate-800 font-mono block">
                      {formData.mobile || 'N/A'}
                    </span>
                  )}
                </div>

                <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Family Size (সদস্য)
                  </span>
                  {isEditing ? (
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={formData.familyMembers}
                      onChange={(e) => setFormData({ ...formData, familyMembers: e.target.value })}
                      className="w-full px-2 py-1 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                  ) : (
                    <span className="font-bold text-slate-900 block">
                      {formData.familyMembers} Persons
                    </span>
                  )}
                </div>

                <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Category (শ্রেণী)
                  </span>
                  {isEditing ? (
                    <select
                      value={formData.priorityCategory}
                      onChange={(e) => setFormData({ ...formData, priorityCategory: e.target.value })}
                      className="w-full px-1.5 py-1 text-xs font-bold text-teal-800 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="Extreme Poverty">Extreme Poverty (হতদরিদ্র)</option>
                      <option value="Widow / Female-led">Widow / Female-led (বিধবা / নারী প্রধান)</option>
                      <option value="Daily Wage Laborer">Daily Wage Laborer (দিনমজুর)</option>
                      <option value="Disabled / Sick">Disabled / Sick (প্রতিবন্ধী / অসুস্থ)</option>
                      <option value="Elderly">Elderly (বয়োজ্যেষ্ঠ)</option>
                      <option value="Displaced / River Erosion">Displaced (নদীভাঙন কবলিত)</option>
                      <option value="General Needy">General Needy (সাধারণ দুস্থ)</option>
                    </select>
                  ) : (
                    <span className="font-bold text-teal-800 block">
                      {formData.priorityCategory}
                    </span>
                  )}
                </div>
              </div>

              {/* Distribution Booth / Counter / Slot (Editable by staff) */}
              {(isEditing || formData.distributionSlot) && (
                <div className="mt-3 bg-teal-50/80 p-2.5 rounded-lg border border-teal-300 text-xs text-teal-950">
                  <span className="text-[10px] text-teal-800 uppercase font-bold flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-teal-700" />
                    Distribution Booth / Time Slot (বিতরণ বুথ ও সময়সূচী):
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.distributionSlot}
                      onChange={(e) => setFormData({ ...formData, distributionSlot: e.target.value })}
                      placeholder="e.g. Booth #2 • 3:30 PM - 5:00 PM (বুথ ২, বিকাল ৩:৩০)"
                      className="w-full px-2.5 py-1 text-xs font-medium text-teal-900 border border-teal-300 rounded-lg bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                  ) : (
                    <div className="font-bold text-teal-900 flex items-center gap-1.5">
                      <span className="bg-white px-2 py-0.5 rounded border border-teal-200 shadow-2xs font-mono">
                        {formData.distributionSlot}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Staff / Special Token Note (Editable by staff) */}
              {(isEditing || formData.tokenNotes) && (
                <div className="mt-3 bg-amber-50/80 p-2.5 rounded-lg border border-amber-300 text-xs text-slate-800">
                  <span className="text-[10px] text-amber-900 uppercase font-bold flex items-center gap-1 mb-1">
                    <FileText className="w-3 h-3 text-amber-700" />
                    Staff Instruction / Special Note (বিশেষ নির্দেশনা / মন্তব্য):
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={formData.tokenNotes}
                      onChange={(e) => setFormData({ ...formData, tokenNotes: e.target.value })}
                      placeholder="Write any special distribution notes, packaging allocations, or verification remarks..."
                      className="w-full px-2.5 py-1 text-xs font-medium text-slate-800 border border-amber-300 rounded-lg bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                  ) : (
                    <p className="font-semibold text-slate-800 leading-relaxed">
                      {formData.tokenNotes}
                    </p>
                  )}
                </div>
              )}

              {/* Simulated Barcode */}
              <div className="mt-4 py-2 bg-white rounded-lg border border-slate-200 text-center flex flex-col items-center justify-center">
                <div className="h-9 flex items-center gap-1">
                  {[...Array(38)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full ${
                        i % 3 === 0
                          ? 'w-1 bg-slate-900'
                          : i % 2 === 0
                          ? 'w-0.5 bg-slate-800'
                          : 'w-1.5 bg-slate-900'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-[10px] tracking-widest text-slate-500 mt-1">
                  * {beneficiary.familyId} - {beneficiary.tokenNumber} *
                </span>
              </div>

              {/* Notice & Instructions */}
              <div className="mt-4 text-[10px] text-slate-600 space-y-1 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                <p className="font-bold text-amber-900">
                  নির্দেশনা / Instructions:
                </p>
                <p>১. ত্রাণ সামগ্রী সংগ্রহের সময় এই মূল টোকেন কার্ডটি সাথে আনুন।</p>
                <p>২. প্রতি পরিবারের জন্য একটি টোকেন প্রযোজ্য। হস্তান্তরযোগ্য নয়।</p>
                <p>৩. অনুগ্রহ করে সুশৃঙ্খলভাবে লাইনে দাঁড়িয়ে সাহায্য গ্রহণ করুন।</p>
              </div>

              {/* Footer Signatures */}
              <div className="mt-6 pt-4 border-t border-slate-300 flex items-end justify-between text-[11px] text-slate-500">
                <div className="text-center">
                  <div className="w-24 border-b border-slate-400 mb-1" />
                  <span>Area Volunteer</span>
                </div>
                <div className="text-center">
                  <div className="w-36 border-b border-slate-400 mb-1" />
                  <span className="font-bold text-slate-800 block">{orgSettings?.president || 'Engr. Arman Hossain'}</span>
                  <span className="text-[10px] text-slate-500 font-semibold block">{orgSettings?.designation || 'Admin, President & CEO'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
