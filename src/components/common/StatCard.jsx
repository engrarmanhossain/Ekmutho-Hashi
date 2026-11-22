import React from 'react';

export const StatCard = ({
  title,
  banglaTitle,
  value,
  subtext,
  icon: Icon,
  color = 'emerald',
  trend,
  className = ''
}) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-500/10',
      iconText: 'text-emerald-600',
      border: 'border-emerald-100 hover:border-emerald-300',
      highlight: 'text-emerald-700'
    },
    amber: {
      bg: 'bg-amber-500/10',
      iconText: 'text-amber-600',
      border: 'border-amber-100 hover:border-amber-300',
      highlight: 'text-amber-700'
    },
    blue: {
      bg: 'bg-blue-500/10',
      iconText: 'text-blue-600',
      border: 'border-blue-100 hover:border-blue-300',
      highlight: 'text-blue-700'
    },
    rose: {
      bg: 'bg-rose-500/10',
      iconText: 'text-rose-600',
      border: 'border-rose-100 hover:border-rose-300',
      highlight: 'text-rose-700'
    },
    teal: {
      bg: 'bg-teal-500/10',
      iconText: 'text-teal-600',
      border: 'border-teal-100 hover:border-teal-300',
      highlight: 'text-teal-700'
    },
    slate: {
      bg: 'bg-slate-500/10',
      iconText: 'text-slate-700',
      border: 'border-slate-200 hover:border-slate-300',
      highlight: 'text-slate-800'
    }
  };

  const currentTheme = colorMap[color] || colorMap.slate;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border shadow-sm transition-all duration-200 ${currentTheme.border} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
            {title}
            {banglaTitle && <span className="block text-[11px] font-normal text-slate-400 normal-case">{banglaTitle}</span>}
          </p>
          <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            {value}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${currentTheme.bg} ${currentTheme.iconText}`}>
          {Icon && <Icon className="w-6 h-6 stroke-[2]" />}
        </div>
      </div>
      {(subtext || trend) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtext}</span>
          {trend && <span className={`font-semibold ${currentTheme.highlight}`}>{trend}</span>}
        </div>
      )}
    </div>
  );
};
