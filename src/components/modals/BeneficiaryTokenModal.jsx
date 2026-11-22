import React from 'react';
import { Printer, X, ShieldCheck } from 'lucide-react';
import { useCharity } from '../../context/CharityContext';

export const BeneficiaryTokenModal = ({ isOpen, onClose, beneficiary }) => {
  const { campaigns, selectedCampaign } = useCharity();

  if (!isOpen || !beneficiary) return null;

  const currentCamp = campaigns.find(c => c.id === selectedCampaign) || campaigns[0];

  const handlePrint = () => {
    window.print();
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
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3.5 bg-slate-50 no-print">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" /> Beneficiary Relief Token Card
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Token Card</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Token Slip Body */}
          <div className="p-6 bg-white print-break-inside-avoid">
            <div className="border-2 border-dashed border-teal-700 rounded-2xl p-5 bg-gradient-to-br from-teal-50/40 via-white to-amber-50/30 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-teal-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-300 bg-white p-0.5 shrink-0">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      Ekmutho Hashi
                    </h3>
                    <p className="text-xs font-bold text-amber-600">একমুঠো হাসি • ত্রাণ টোকেন</p>
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

              {/* Family details table */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-800">
                <div className="col-span-2 bg-white/80 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Head of Family (পরিবার প্রধান)
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {beneficiary.headName}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Guardian: {beneficiary.guardianName}
                  </span>
                </div>

                <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Area / Ward (এলাকা)
                  </span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {beneficiary.area}
                  </span>
                </div>

                <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Mobile Number
                  </span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {beneficiary.mobile || 'N/A'}
                  </span>
                </div>

                <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Family Size (সদস্য)
                  </span>
                  <span className="font-bold text-slate-900">
                    {beneficiary.familyMembers} Persons
                  </span>
                </div>

                <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Category (শ্রেণী)
                  </span>
                  <span className="font-bold text-teal-800">
                    {beneficiary.priorityCategory}
                  </span>
                </div>
              </div>

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
                  <div className="w-24 border-b border-slate-400 mb-1" />
                  <span>Distribution Lead</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
