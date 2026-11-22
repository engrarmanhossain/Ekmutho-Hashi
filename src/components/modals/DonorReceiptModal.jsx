import React from 'react';
import { Printer, Download, CheckCircle2, X } from 'lucide-react';
import { formatCurrency, formatDate, numberToWordsBDT } from '../../utils/formatters';
import { useCharity } from '../../context/CharityContext';

export const DonorReceiptModal = ({ isOpen, onClose, donor }) => {
  const { campaigns } = useCharity();

  if (!isOpen || !donor) return null;

  const campaign = campaigns.find(c => c.id === donor.campaignId);

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
          className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-xl border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Action Toolbar */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3.5 bg-slate-50 no-print">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Official Money Receipt
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
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

          {/* Printable Receipt Paper Body */}
          <div className="p-8 bg-white print-break-inside-avoid" id="printable-receipt">
            {/* Header with Logo */}
            <div className="flex items-start justify-between border-b-2 border-emerald-700 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-300 shadow-sm shrink-0 bg-white p-1">
                  <img
                    src="/logo.png"
                    alt="Ekmutho Hashi"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Ekmutho Hashi
                  </h2>
                  <p className="text-sm font-bold text-amber-600 font-sans">একমুঠো হাসি</p>
                  <p className="text-xs text-slate-500">
                    Community Charity & Relief Organization, Bangladesh
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Reg / Ref: Volunteer Social Action Network
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black tracking-wider uppercase border border-emerald-300">
                  Money Receipt
                </span>
                <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                  No: {donor.receiptId}
                </p>
                <p className="text-xs text-slate-500">
                  Date: {formatDate(donor.date)}
                </p>
              </div>
            </div>

            {/* Campaign Banner */}
            <div className="mt-4 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-between">
              <span><strong>Drive / Cause:</strong> {campaign?.name || 'General Relief Fund'}</span>
              <span className="text-slate-500 font-mono text-[11px]">{donor.campaignId}</span>
            </div>

            {/* Main Receipt Fields */}
            <div className="mt-6 space-y-4 text-sm text-slate-800">
              <div className="border-b border-dotted border-slate-300 pb-2 flex items-baseline justify-between">
                <span className="text-xs text-slate-500 uppercase font-semibold">Received With Thanks From:</span>
                <span className="text-base font-bold text-slate-900">{donor.donorName}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-dotted border-slate-300 pb-2">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block">Phone / Mobile:</span>
                  <span className="font-medium text-slate-800">{donor.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block">Donor Category:</span>
                  <span className="font-medium text-slate-800">{donor.reference || 'Well-wisher'}</span>
                </div>
              </div>

              {donor.contributionType === 'cash' ? (
                <>
                  <div className="grid grid-cols-2 gap-4 border-b border-dotted border-slate-300 pb-2">
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-semibold block">Payment Mode:</span>
                      <span className="font-semibold text-slate-800">{donor.paymentMethod}</span>
                      {donor.transactionId && (
                        <span className="block text-xs text-slate-500 font-mono">
                          TrxID: {donor.transactionId}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-semibold block">Purpose / Note:</span>
                      <span className="font-medium text-slate-800">{donor.note || 'Relief Contribution'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-800 uppercase font-bold block tracking-wider">
                        Amount Received:
                      </span>
                      <p className="text-xs text-emerald-700 italic mt-0.5">
                        In Words: {numberToWordsBDT(donor.amount)}
                      </p>
                    </div>
                    <div className="text-2xl font-black text-emerald-800 font-mono">
                      {formatCurrency(donor.amount)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-800 uppercase font-bold tracking-wider">
                      In-Kind Product Donation:
                    </span>
                    <span className="text-xs font-bold text-amber-800">
                      Est. Value: {formatCurrency(donor.productDetails?.estimatedValue || 0)}
                    </span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    {donor.productDetails?.quantity} {donor.productDetails?.unit} of {donor.productDetails?.productName}
                  </p>
                  <p className="text-xs text-slate-600 italic">
                    Note: {donor.note || 'Direct relief stock contribution received at hub'}
                  </p>
                </div>
              )}
            </div>

            {/* Signature & Seal Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-1.5" />
                <p className="font-semibold text-slate-700">Donor Signature</p>
              </div>

              {/* Official Seal Simulation */}
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-600/50 flex flex-col items-center justify-center p-1 text-center -rotate-6 text-[9px] text-emerald-800 font-bold uppercase leading-tight">
                <span>একমুঠো হাসি</span>
                <span className="text-[7px] text-slate-500">VERIFIED</span>
                <span>CHARITY BD</span>
              </div>

              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-1.5" />
                <p className="font-semibold text-slate-700">Authorized Receiver</p>
                <p className="text-[10px] text-slate-400">Ekmutho Hashi Volunteer</p>
              </div>
            </div>

            <p className="text-center text-[10px] text-slate-400 mt-6 italic">
              "Every single penny goes directly to the underprivileged without any administrative deductions."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
