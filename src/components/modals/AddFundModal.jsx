import React, { useState } from 'react';
import { HeartHandshake } from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { Modal } from '../common/Modal';

export const AddFundModal = ({ isOpen, onClose, onReceiptCreated }) => {
  const { campaigns, inventory, addDonor, selectedCampaign } = useCharity();

  const [donorName, setDonorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [phone, setPhone] = useState('');
  const [reference, setReference] = useState('Friend / Colleague');
  const [campaignId, setCampaignId] = useState(
    selectedCampaign !== 'all' ? selectedCampaign : (campaigns[0]?.id || '')
  );
  const [contributionType, setContributionType] = useState('cash'); // 'cash' | 'product'
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  // For direct product donation
  const [productId, setProductId] = useState(inventory[0]?.id || '');
  const [productQuantity, setProductQuantity] = useState('');
  const [productUnit, setProductUnit] = useState('kg');
  const [estimatedValue, setEstimatedValue] = useState('');

  const handleProductChange = (prodId) => {
    setProductId(prodId);
    const prod = inventory.find(p => p.id === prodId);
    if (prod) {
      setProductUnit(prod.unit);
      if (productQuantity) {
        setEstimatedValue(Number(productQuantity) * Number(prod.unitCost));
      }
    }
  };

  const handleQuantityChange = (qty) => {
    setProductQuantity(qty);
    const prod = inventory.find(p => p.id === productId);
    if (prod && qty) {
      setEstimatedValue(Number(qty) * Number(prod.unitCost));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalDonorName = isAnonymous ? 'Anonymous' : (donorName.trim() || 'Well-wisher');

    if (contributionType === 'cash') {
      if (!amount || Number(amount) <= 0) {
        alert('Please enter a valid donation amount.');
        return;
      }
    } else {
      if (!productQuantity || Number(productQuantity) <= 0) {
        alert('Please enter a valid product quantity.');
        return;
      }
    }

    const selectedProd = inventory.find(p => p.id === productId);

    const donorRecord = addDonor({
      donorName: finalDonorName,
      phone: phone.trim() || 'N/A',
      reference,
      campaignId,
      contributionType,
      amount: contributionType === 'cash' ? Number(amount) : 0,
      paymentMethod,
      transactionId: transactionId.trim(),
      date,
      note: note.trim(),
      productDetails: contributionType === 'product' ? {
        productId,
        productName: selectedProd?.name || 'In-Kind Item',
        quantity: Number(productQuantity),
        unit: productUnit,
        estimatedValue: Number(estimatedValue) || 0
      } : null
    });

    // Reset fields
    setDonorName('');
    setIsAnonymous(false);
    setPhone('');
    setAmount('');
    setTransactionId('');
    setNote('');
    setProductQuantity('');
    setEstimatedValue('');

    onClose();
    if (onReceiptCreated) {
      onReceiptCreated(donorRecord);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Donor Contribution"
      subtitle="তহবিল জমা ও অনুদান এন্ট্রি - Cash or In-Kind Relief Items"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campaign Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Campaign / Drive *
          </label>
          <select
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Contribution Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setContributionType('cash')}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              contributionType === 'cash'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cash / Money (টাকা)
          </button>
          <button
            type="button"
            onClick={() => setContributionType('product')}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              contributionType === 'product'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct Product Donation (পণ্য)
          </button>
        </div>

        {/* Donor Name & Anonymous Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Donor Name *
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span>Keep Anonymous (বেনামী)</span>
            </label>
          </div>
          <input
            type="text"
            disabled={isAnonymous}
            value={isAnonymous ? 'Anonymous (বেনামী দাতা)' : donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="e.g. Engr. Mahmudul Hasan / Haji Shamsul Alam"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white disabled:bg-slate-100 disabled:text-slate-500 focus:ring-2 focus:ring-emerald-500"
            required={!isAnonymous}
          />
        </div>

        {/* Phone & Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone / Mobile
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 017xxxxxxxx"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Donor Reference / Source
            </label>
            <select
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Group Member">Group Member (সংগঠনের সদস্য)</option>
              <option value="Friend / Colleague">Friend / Colleague (বন্ধু / সহকর্মী)</option>
              <option value="Local Well-wisher">Local Well-wisher (এলাকার শুভাকাঙ্ক্ষী)</option>
              <option value="Overseas Expatriate">Overseas Expatriate (প্রবাসী)</option>
              <option value="Local Trader / Merchant">Local Trader / Merchant (ব্যবসায়ী)</option>
              <option value="Corporate / Organization">Corporate / Organization (প্রতিষ্ঠান)</option>
            </select>
          </div>
        </div>

        {/* Dynamic fields based on contribution type */}
        {contributionType === 'cash' ? (
          <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Amount (৳ Taka) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">৳</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full pl-8 pr-3.5 py-2.5 text-base font-bold text-slate-900 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Hand Cash">Hand Cash (হাতে নগদ)</option>
                  <option value="bKash">bKash (বিকাশ)</option>
                  <option value="Nagad">Nagad (নগদ)</option>
                  <option value="Rocket">Rocket (রকেট)</option>
                  <option value="Bank Transfer">Bank Transfer (ব্যাংক একাউন্ট)</option>
                </select>
              </div>
            </div>

            {paymentMethod !== 'Hand Cash' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Transaction ID / TrxID (Optional)
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. BK9X8721A or Check / Deposit Slip No."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
            <p className="text-xs text-amber-900 font-semibold">
              Direct Relief Product Donation (Will be credited to inventory stock):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Item *
                </label>
                <select
                  value={productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  {inventory.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Quantity ({productUnit}) *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={productQuantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Value (৳ Taka)
              </label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                placeholder="Estimated market value"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>
        )}

        {/* Date & Note */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Purpose / Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Zakat fund / Sadaqah for 5 families"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
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
            className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Save & Generate Receipt</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
