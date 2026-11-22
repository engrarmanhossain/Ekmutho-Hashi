import React, { useState, useMemo } from 'react';
import { Gift, AlertCircle, CheckCircle2, PackageCheck, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCharity } from '../../context/CharityContext';
import { Modal } from '../common/Modal';

export const DistributeAidModal = ({
  isOpen,
  onClose,
  initialBeneficiaryId = null,
  onAidDistributed
}) => {
  const {
    campaigns,
    beneficiaries,
    packages,
    inventory,
    getProductStock,
    distributeAid,
    selectedCampaign
  } = useCharity();

  const [beneficiaryId, setBeneficiaryId] = useState(initialBeneficiaryId || '');
  const [campaignId, setCampaignId] = useState(
    selectedCampaign !== 'all' ? selectedCampaign : (campaigns[0]?.id || '')
  );
  const [distributionType, setDistributionType] = useState('package'); // 'package' | 'cash' | 'custom'
  const [packageId, setPackageId] = useState(packages[0]?.id || '');
  const [cashAmount, setCashAmount] = useState('1500');
  const [handledBy, setHandledBy] = useState('Tanvir Ahmed');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Custom items list if distributionType === 'custom'
  const [customItems, setCustomItems] = useState([
    { productId: inventory[0]?.id || '', quantity: '1' }
  ]);

  // Keep beneficiaryId in sync if passed
  React.useEffect(() => {
    if (initialBeneficiaryId) {
      setBeneficiaryId(initialBeneficiaryId);
    } else if (beneficiaries.length > 0 && !beneficiaryId) {
      // Default to first pending or token-given beneficiary
      const pendingOne = beneficiaries.find(b => b.status !== 'Delivered') || beneficiaries[0];
      setBeneficiaryId(pendingOne.id);
    }
  }, [initialBeneficiaryId, beneficiaries]);

  const selectedPkg = useMemo(() => {
    return packages.find(p => p.id === packageId);
  }, [packages, packageId]);

  // Stock feasibility check
  const stockCheck = useMemo(() => {
    if (distributionType === 'cash') {
      return { canDistribute: true, shortages: [] };
    }

    const itemsToCheck = distributionType === 'package'
      ? (selectedPkg?.items || [])
      : customItems.map(ci => {
          const prod = inventory.find(p => p.id === ci.productId);
          return {
            productId: ci.productId,
            productName: prod?.name || 'Item',
            quantity: Number(ci.quantity) || 0,
            unit: prod?.unit || 'unit'
          };
        });

    const shortages = [];
    for (const item of itemsToCheck) {
      const available = getProductStock(item.productId);
      if (item.quantity > available) {
        shortages.push({
          name: item.productName,
          needed: item.quantity,
          available,
          unit: item.unit
        });
      }
    }

    return {
      canDistribute: shortages.length === 0,
      shortages
    };
  }, [distributionType, selectedPkg, customItems, inventory, getProductStock]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!beneficiaryId) {
      setErrorMsg('Please select a recipient family.');
      return;
    }

    if (!stockCheck.canDistribute) {
      setErrorMsg('Cannot distribute due to insufficient stock in one or more items.');
      return;
    }

    try {
      const result = distributeAid({
        beneficiaryId,
        campaignId,
        distributionType,
        packageId,
        customItems: customItems.map(ci => {
          const prod = inventory.find(p => p.id === ci.productId);
          return {
            productId: ci.productId,
            productName: prod?.name || 'Item',
            quantity: Number(ci.quantity) || 0,
            unit: prod?.unit || 'unit'
          };
        }),
        cashAmount: Number(cashAmount) || 0,
        handledBy: handledBy.trim() || 'Volunteer Team',
        note: note.trim()
      });

      // Confetti celebration for grassroots success!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (err) {
        // Safe fallback if canvas not available
      }

      onClose();
      if (onAidDistributed) {
        onAidDistributed(result);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to distribute aid.');
    }
  };

  const selectedBeneficiaryObj = beneficiaries.find(b => b.id === beneficiaryId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Distribute Relief Aid to Family"
      subtitle="সুবিধাভোগী পরিবারের মাঝে ইফতার সামগ্রী বা নগদ সহায়তা বিতরণ"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Campaign Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Relief Campaign / Drive *
          </label>
          <select
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            required
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Beneficiary Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Recipient Beneficiary Family *
          </label>
          <select
            value={beneficiaryId}
            onChange={(e) => setBeneficiaryId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            required
          >
            <option value="">-- Choose Family --</option>
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.id}>
                [{b.tokenNumber}] {b.headName} • {b.area} ({b.priorityCategory}) - Status: {b.status}
              </option>
            ))}
          </select>

          {selectedBeneficiaryObj && (
            <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900">{selectedBeneficiaryObj.headName}</span>
                <span className="text-slate-500 ml-2 font-mono">Token: {selectedBeneficiaryObj.tokenNumber}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Area: {selectedBeneficiaryObj.area} | Members: {selectedBeneficiaryObj.familyMembers}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  selectedBeneficiaryObj.status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedBeneficiaryObj.status === 'Token Given'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  Current: {selectedBeneficiaryObj.status}
                </span>
                {selectedBeneficiaryObj.status === 'Delivered' && (
                  <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
                    Notice: Already received aid earlier.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Distribution Aid Type Toggle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Aid Type to Hand Over *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setDistributionType('package')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                distributionType === 'package'
                  ? 'bg-white text-teal-800 shadow-xs ring-1 ring-teal-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📦 Relief Package Box
            </button>
            <button
              type="button"
              onClick={() => setDistributionType('cash')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                distributionType === 'cash'
                  ? 'bg-white text-teal-800 shadow-xs ring-1 ring-teal-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💵 Cash Aid (নগদ টাকা)
            </button>
            <button
              type="button"
              onClick={() => setDistributionType('custom')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                distributionType === 'custom'
                  ? 'bg-white text-teal-800 shadow-xs ring-1 ring-teal-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛒 Custom Items
            </button>
          </div>
        </div>

        {/* Package Content & Stock Deduction Preview */}
        {distributionType === 'package' && (
          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                Select Package Bundle *
              </label>
              <span className="text-[11px] text-teal-700 font-medium">
                Auto-deducts included items from Stock
              </span>
            </div>

            <select
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium"
            >
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} ({pkg.banglaName || ''})
                </option>
              ))}
            </select>

            {selectedPkg && (
              <div className="space-y-2 mt-2 pt-2 border-t border-teal-200/80">
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Items inside bundle & Stock Availability:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedPkg.items.map((item, idx) => {
                    const available = getProductStock(item.productId);
                    const isDeficit = item.quantity > available;

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border flex items-center justify-between ${
                          isDeficit
                            ? 'bg-rose-50 border-rose-300 text-rose-800'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{item.productName}</p>
                          <p className="text-[11px] text-slate-500">
                            Required: {item.quantity} {item.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              isDeficit
                                ? 'bg-rose-200 text-rose-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            In Stock: {available} {item.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cash Aid Input */}
        {distributionType === 'cash' && (
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Cash Amount to Hand Over (৳ Taka) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">৳</span>
              <input
                type="number"
                min="100"
                step="50"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full pl-8 pr-3.5 py-2.5 text-base font-bold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500">
              This cash aid will be registered in the expense ledger and added to the beneficiary's aid history.
            </p>
          </div>
        )}

        {/* Custom Items */}
        {distributionType === 'custom' && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Custom Stock Relief Items
            </p>
            {customItems.map((ci, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  value={ci.productId}
                  onChange={(e) => {
                    const updated = [...customItems];
                    updated[idx].productId = e.target.value;
                    setCustomItems(updated);
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  {inventory.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Available: {getProductStock(p.id)} {p.unit})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="0.5"
                  step="any"
                  value={ci.quantity}
                  onChange={(e) => {
                    const updated = [...customItems];
                    updated[idx].quantity = e.target.value;
                    setCustomItems(updated);
                  }}
                  placeholder="Qty"
                  className="w-24 px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                />
              </div>
            ))}
          </div>
        )}

        {/* Shortage Alert */}
        {!stockCheck.canDistribute && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Cannot Proceed: Insufficient Inventory Stock!</p>
              <p className="mt-0.5 text-[11px]">
                Please purchase more items from the wholesale market via <strong>+ Add Expense</strong> before dispatching this package.
              </p>
            </div>
          </div>
        )}

        {/* Handled by & Note */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Handled By (Volunteer) *
            </label>
            <input
              type="text"
              value={handledBy}
              onChange={(e) => setHandledBy(e.target.value)}
              placeholder="e.g. Tanvir Ahmed, Sadik Hasan"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Distribution Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Verified NID, token collected"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stockCheck.canDistribute}
            className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition flex items-center gap-2 ${
              stockCheck.canDistribute
                ? 'bg-teal-600 hover:bg-teal-700 active:scale-98'
                : 'bg-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Confirm & Distribute Aid</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
