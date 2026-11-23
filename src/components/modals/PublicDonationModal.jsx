import React, { useState } from 'react';
import {
  Heart,
  Copy,
  Check,
  CreditCard,
  Building,
  Phone,
  Send,
  ShieldCheck,
  HandHeart
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCharity } from '../../context/CharityContext';

export const PublicDonationModal = ({ isOpen, onClose }) => {
  const { orgSettings, addToast, addDonor, campaigns, selectedCampaign } = useCharity();
  const [copiedKey, setCopiedKey] = useState(null);

  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdRecord, setCreatedRecord] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast(`Copied ${key} account details to clipboard!`, 'info');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handlePledge = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      addToast('Please enter a valid donation amount (টাকার পরিমাণ লিখুন).', 'error');
      return;
    }

    try {
      const newRec = await addDonor({
        donorName: donorName.trim() || 'Well-Wisher (শুভাকাঙ্ক্ষী)',
        phone: donorPhone.trim() || 'N/A',
        amount: Number(amount),
        contributionType: 'cash',
        paymentMethod: paymentMethod,
        transactionId: trxId.trim() || undefined,
        note: note.trim() || undefined,
        campaignId: selectedCampaign === 'all' ? (campaigns[0]?.id || 'camp-1') : selectedCampaign,
        approvalStatus: 'pending',
        status: 'Pending Verification',
        submittedBy: 'Public Online Portal',
        submittedAt: new Date().toISOString()
      });

      setCreatedRecord(newRec);
      setIsSubmitted(true);
      addToast(`Donation pledge of ৳${amount} submitted! Sent to Executive Admin for verification.`, 'success');
    } catch (err) {
      console.error('Error submitting donation:', err);
      addToast('Failed to record donation. Please try again.', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Support Community Relief Drive"
      subtitle={`${orgSettings.name} | ${orgSettings.banglaName} • রমজান খাদ্য ও ত্রাণ তহবিলে অনুদান`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Cause Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wider">
                100% Transparent Relief
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight">
              আপনার একমুঠো দানে এক পরিবারের মুখে ফুটবে হাসি
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Every single Taka is accounted for in this live transparency ledger. Choose any verified channel below to send your contribution.
            </p>
          </div>
        </div>

        {/* Payment Channels Grid */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-teal-600" />
            <span>Official Mobile Banking & Bank Accounts</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* bKash */}
            <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wider block">
                  bKash Payment / Send Money
                </span>
                <span className="text-xs font-black text-slate-900 font-mono">
                  {orgSettings.bkashNumber || '01711-002233'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(orgSettings.bkashNumber?.split(' ')[0] || '01711002233', 'bKash')}
                className="p-1.5 text-pink-700 hover:bg-pink-100 rounded-lg transition"
                title="Copy number"
              >
                {copiedKey === 'bKash' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Nagad */}
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">
                  Nagad
                </span>
                <span className="text-xs font-black text-slate-900 font-mono">
                  {orgSettings.nagadNumber || '01711-002233'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(orgSettings.nagadNumber?.split(' ')[0] || '01711002233', 'Nagad')}
                className="p-1.5 text-orange-700 hover:bg-orange-100 rounded-lg transition"
                title="Copy number"
              >
                {copiedKey === 'Nagad' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Rocket */}
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                  Rocket
                </span>
                <span className="text-xs font-black text-slate-900 font-mono">
                  {orgSettings.rocketNumber || '01711-002233-7'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(orgSettings.rocketNumber || '017110022337', 'Rocket')}
                className="p-1.5 text-purple-700 hover:bg-purple-100 rounded-lg transition"
                title="Copy number"
              >
                {copiedKey === 'Rocket' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Direct Bank Account */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Bank Wire / Online Transfer
                </span>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
                  {orgSettings.bankDetails}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(orgSettings.bankDetails, 'Bank')}
                className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition shrink-0"
                title="Copy Bank info"
              >
                {copiedKey === 'Bank' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Payment Confirmation & Trx Notification Form */}
        {isSubmitted ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-xs">
              <Check className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 mb-1.5">
                Pending Admin Verification (এডমিন যাচাই অপেক্ষমান)
              </span>
              <h4 className="text-base font-black text-slate-900">অনুদান তথ্য সফলভাবে জমা হয়েছে!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Tracking Receipt: <span className="font-mono font-bold text-teal-800">{createdRecord?.receiptId || 'EH-REC-PENDING'}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Executive Admin <strong>Engr. Arman Hossain</strong> will verify the transaction details and confirm this donation on the public ledger.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePledge} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 uppercase tracking-wider block">
                Send Us Transaction Info for Official Receipt (অনুদান ও ট্রানজেকশন তথ্য)
              </span>
              <span className="text-[10px] text-teal-700 font-bold">100% Transparent</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Payment Channel / Mode *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Bank Transfer">Bank Wire / Online Transfer</option>
                  <option value="Hand Cash">Hand Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Donated Amount (৳) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Donor Name (or Anonymous)
                </label>
                <input
                  type="text"
                  placeholder="Your Name (ঐচ্ছিক)"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Mobile Number (মোবাইল)
                </label>
                <input
                  type="text"
                  placeholder="01712-345678"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Transaction ID / TrxID (ট্রানজেকশন আইডি)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9JA7B82KL or Bank Ref No."
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono uppercase"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Donation Info (অনুদান সাবমিট করুন)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
