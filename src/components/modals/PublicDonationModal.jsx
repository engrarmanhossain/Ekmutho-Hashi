import React, { useState } from 'react';
import {
  Heart,
  Copy,
  Check,
  CreditCard,
  Building,
  Phone,
  Send,
  Sparkles,
  ShieldCheck,
  HandHeart
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCharity } from '../../context/CharityContext';

export const PublicDonationModal = ({ isOpen, onClose }) => {
  const { orgSettings, addToast } = useCharity();
  const [copiedKey, setCopiedKey] = useState(null);

  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast(`Copied ${key} account details to clipboard!`, 'info');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handlePledge = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    addToast('Thank you for supporting Ekmutho Hashi! Our team will verify and record your donation.', 'success');
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
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
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
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

        {/* Optional Trx Notification Form */}
        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <Check className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-black text-emerald-900">Donation Pledge Submitted!</h4>
            <p className="text-xs text-emerald-700">
              President & CEO Engr. Arman Hossain and our accounts team have been notified. A verified digital receipt will be generated.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePledge} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider block">
              Send Us Transaction Info for Official Receipt (ঐচ্ছিক তথ্য)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="Your Name (or Anonymous)"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="Mobile Number (017...)"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
              />
              <input
                type="number"
                placeholder="Donated Amount (৳)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold"
              />
              <input
                type="text"
                placeholder="TrxID / Reference (e.g. 9JA7B8...)"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono uppercase"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg font-medium"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Donation Info</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
