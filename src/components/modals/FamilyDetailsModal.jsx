import React from 'react';
import { Users, Phone, MapPin, CreditCard, Gift, Printer, History, Calendar } from 'lucide-react';
import { Modal } from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { formatDate, formatCurrency } from '../../utils/formatters';

export const FamilyDetailsModal = ({
  isOpen,
  onClose,
  beneficiary,
  onOpenDistribute,
  onOpenToken
}) => {
  if (!isOpen || !beneficiary) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={beneficiary.headName}
      subtitle={`Family ID: ${beneficiary.familyId} • Token: ${beneficiary.tokenNumber}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Top Status & Category Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <StatusBadge status={beneficiary.status} />
            <PriorityBadge priority={beneficiary.priorityCategory} />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenToken(beneficiary);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Token Slip</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDistribute(beneficiary.id);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Distribute Aid</span>
            </button>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Guardian / Father / Husband
            </span>
            <p className="font-bold text-slate-800">{beneficiary.guardianName || 'N/A'}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile Number
            </span>
            <p className="font-bold text-slate-800 font-mono">{beneficiary.mobile || 'N/A'}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Area / Village / Ward
            </span>
            <p className="font-bold text-slate-800">{beneficiary.area || 'N/A'}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" /> National ID (NID)
            </span>
            <p className="font-bold text-slate-800 font-mono">{beneficiary.nid || 'Not Provided'}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Family Household Size
            </span>
            <p className="font-bold text-slate-800">{beneficiary.familyMembers} Family Members</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Field Verification Notes
            </span>
            <p className="text-xs text-slate-600 italic">{beneficiary.notes || 'Verified through community volunteer survey.'}</p>
          </div>
        </div>

        {/* Aid History Timeline */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Assistance & Distribution History
            </h4>
          </div>

          {beneficiary.aidHistory && beneficiary.aidHistory.length > 0 ? (
            <div className="space-y-2.5">
              {beneficiary.aidHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                        {item.type}
                      </span>
                      <span className="font-medium text-slate-700">{item.campaignName}</span>
                    </div>
                    <p className="text-slate-800 font-semibold">{item.description}</p>
                    <p className="text-[11px] text-slate-500">Handled by: {item.handledBy}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-slate-500 sm:justify-end text-[11px]">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    {item.amount > 0 && (
                      <span className="font-black text-emerald-700 text-sm mt-1 block">
                        {formatCurrency(item.amount)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
              No relief packages distributed to this family yet. Status is pending or token given.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
