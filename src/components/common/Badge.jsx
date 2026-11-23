import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'sm', className = '' }) => {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
    amber: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/10',
    blue: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/10',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10',
    teal: 'bg-teal-50 text-teal-700 border-teal-200 ring-teal-500/10',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10'
  };

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[11px] font-medium',
    sm: 'px-2.5 py-1 text-xs font-semibold',
    md: 'px-3 py-1.5 text-sm font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ring-1 ring-inset ${
        variantStyles[variant] || variantStyles.neutral
      } ${sizeStyles[size] || sizeStyles.sm} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return <Badge variant="emerald">Delivered (বিতরণ সম্পন্ন)</Badge>;
    case 'token given':
      return <Badge variant="teal">Token Authorized (টোকেন প্রাপ্ত)</Badge>;
    case 'pending approval':
      return <Badge variant="amber">Pending Approval (অনুমোদন অপেক্ষমান)</Badge>;
    case 'rejected':
      return <Badge variant="rose">Rejected (বাতিল)</Badge>;
    case 'pending':
      return <Badge variant="neutral">Pending (অপেক্ষমান)</Badge>;
    case 'active':
      return <Badge variant="emerald">Active (চলমান)</Badge>;
    case 'completed':
      return <Badge variant="blue">Completed (সম্পন্ন)</Badge>;
    default:
      return <Badge variant="neutral">{status || 'Unknown'}</Badge>;
  }
};

export const ApprovalBadge = ({ status }) => {
  const norm = (status || 'approved').toLowerCase();
  if (norm === 'approved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Approved by Admin
      </span>
    );
  }
  if (norm === 'pending' || norm === 'pending approval') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Awaiting Admin Approval
      </span>
    );
  }
  if (norm === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {status || 'Unknown'}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  switch (priority) {
    case 'Widow / Elderly':
      return <Badge variant="purple">Widow / Elderly (বিধবা / বয়োজ্যেষ্ঠ)</Badge>;
    case 'Disabled':
      return <Badge variant="rose">Disabled (প্রতিবন্ধী)</Badge>;
    case 'Orphan Support':
      return <Badge variant="blue">Orphan Support (এতিম পরিবার)</Badge>;
    case 'Day Laborer':
      return <Badge variant="amber">Day Laborer (দিনমজুর / রিকশাচালক)</Badge>;
    case 'Low-Income Family':
      return <Badge variant="teal">Low-Income (নিম্নবিত্ত পরিবার)</Badge>;
    default:
      return <Badge variant="neutral">{priority}</Badge>;
  }
};

export const PaymentMethodBadge = ({ method }) => {
  const clean = method?.toLowerCase() || '';
  if (clean.includes('bkash')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-pink-700 border border-pink-200">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span> bKash
      </span>
    );
  }
  if (clean.includes('nagad')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Nagad
      </span>
    );
  }
  if (clean.includes('rocket')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Rocket
      </span>
    );
  }
  if (clean.includes('bank')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Bank
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hand Cash
    </span>
  );
};
