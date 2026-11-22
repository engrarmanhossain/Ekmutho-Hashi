import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  UploadCloud,
  RefreshCw,
  Key,
  Globe,
  Database,
  Trash2
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCharity } from '../../context/CharityContext';

export const SupabaseConnectModal = ({ isOpen, onClose }) => {
  const {
    isCloudConnected,
    supabaseUrl,
    supabaseKey,
    connectSupabase,
    disconnectSupabase,
    syncLocalToSupabase,
    pullFromSupabase,
    isCloudSyncing
  } = useCharity();

  const [url, setUrl] = useState(supabaseUrl || '');
  const [key, setKey] = useState(supabaseKey || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [testingStatus, setTestingStatus] = useState(null); // 'testing' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  const handleSaveAndConnect = async (e) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      setStatusMessage('Please enter both Supabase Project URL and Anon Public Key.');
      setTestingStatus('error');
      return;
    }

    setTestingStatus('testing');
    setStatusMessage('Connecting to Supabase...');

    try {
      const success = await connectSupabase(url.trim(), key.trim());
      if (success) {
        setTestingStatus('success');
        setStatusMessage('Connected successfully to Supabase! Multi-phone sync is active.');
      } else {
        setTestingStatus('error');
        setStatusMessage('Could not connect. Please check your URL and Anon Key.');
      }
    } catch (err) {
      setTestingStatus('error');
      setStatusMessage(err.message || 'Connection failed.');
    }
  };

  const handleCopySql = () => {
    const sqlScript = `-- Ekmutho Hashi Supabase Tables
CREATE TABLE IF NOT EXISTS public.campaigns (id TEXT PRIMARY KEY, name TEXT NOT NULL, bangla_name TEXT, description TEXT, target_amount NUMERIC DEFAULT 0, target_families INTEGER DEFAULT 0, start_date TEXT, end_date TEXT, status TEXT DEFAULT 'active', category TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.inventory (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT, unit TEXT NOT NULL, qty_purchased NUMERIC DEFAULT 0, qty_donated NUMERIC DEFAULT 0, qty_distributed NUMERIC DEFAULT 0, unit_cost NUMERIC DEFAULT 0, min_alert_stock NUMERIC DEFAULT 10, notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.packages (id TEXT PRIMARY KEY, name TEXT NOT NULL, bangla_name TEXT, campaign_id TEXT, description TEXT, items JSONB DEFAULT '[]'::jsonb, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.donors (id TEXT PRIMARY KEY, receipt_id TEXT NOT NULL, donor_name TEXT NOT NULL, phone TEXT, reference TEXT, campaign_id TEXT, contribution_type TEXT NOT NULL, amount NUMERIC DEFAULT 0, product_details JSONB, payment_method TEXT, transaction_id TEXT, date TEXT, note TEXT, recorded_by TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.beneficiaries (id TEXT PRIMARY KEY, family_id TEXT NOT NULL, token_number TEXT NOT NULL, head_name TEXT NOT NULL, guardian_name TEXT, mobile TEXT, area TEXT, nid TEXT, family_members INTEGER DEFAULT 1, priority_category TEXT, status TEXT DEFAULT 'Pending', notes TEXT, aid_history JSONB DEFAULT '[]'::jsonb, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.expenses (id TEXT PRIMARY KEY, date TEXT NOT NULL, campaign_id TEXT, type TEXT NOT NULL, category TEXT, amount NUMERIC DEFAULT 0, payment_method TEXT, handled_by TEXT, linked_beneficiary_id TEXT, linked_beneficiary_name TEXT, note TEXT, items JSONB DEFAULT '[]'::jsonb, is_distribution BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns, public.inventory, public.packages, public.donors, public.beneficiaries, public.expenses;`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supabase Cloud Sync & Mobile Access"
      subtitle="মাল্টি-ভলান্টিয়ার ফোন অ্যাক্সেস এবং ক্লাউড ডাটাবেজ সংযোগ"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Connection Status Badge */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            isCloudConnected
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                isCloudConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">
                  {isCloudConnected ? '🟢 Supabase Cloud Active' : '🟡 Offline / LocalStorage Mode'}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                  {isCloudConnected ? 'Live Realtime Sync' : 'Single Browser Only'}
                </span>
              </div>
              <p className="text-xs opacity-80 mt-0.5">
                {isCloudConnected
                  ? 'Changes made from any phone or computer sync instantly across all volunteers.'
                  : 'Connect your Supabase project so volunteers can log in and update from their smartphones.'}
              </p>
            </div>
          </div>

          {isCloudConnected && (
            <button
              type="button"
              onClick={disconnectSupabase}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 transition"
              title="Disconnect cloud"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSaveAndConnect} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Supabase Project URL *</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span>Supabase Anon Public API Key *</span>
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Found in your Supabase Dashboard: <strong>Project Settings → API → Project URL & Project API Keys (anon public)</strong>.
            </p>
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                testingStatus === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : testingStatus === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {testingStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {testingStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
              {testingStatus === 'testing' && <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />}
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleCopySql}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-2 rounded-xl transition"
              title="Copy SQL table creation script to paste in Supabase SQL editor"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSql ? '✓ Copied SQL Schema!' : 'Copy SQL Table Schema'}</span>
            </button>

            <button
              type="submit"
              disabled={testingStatus === 'testing'}
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Cloud className="w-4 h-4" />
              <span>{isCloudConnected ? 'Update Connection' : 'Connect & Activate Sync'}</span>
            </button>
          </div>
        </form>

        {/* Cloud Seed & Sync Section (if connected) */}
        {isCloudConnected && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-teal-600" />
                <span>Cloud Data Management</span>
              </span>
              {isCloudSyncing && (
                <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Syncing...
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600">
              Transfer existing local records into Supabase so all volunteers immediately see the pre-populated Ramadan Iftar drive data.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={syncLocalToSupabase}
                disabled={isCloudSyncing}
                className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Push Local Records to Cloud Database</span>
              </button>

              <button
                type="button"
                onClick={pullFromSupabase}
                disabled={isCloudSyncing}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh from Cloud</span>
              </button>
            </div>
          </div>
        )}

        {/* Step-by-Step Guide */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-1.5">
          <p className="font-bold flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
            <span>Quick 2-Minute Supabase Setup Instructions:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 pl-1 text-[11px] leading-relaxed">
            <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-semibold">supabase.com</a>.</li>
            <li>Go to <strong>SQL Editor</strong>, click <em>New query</em>, paste the schema (click button above to copy), and click <strong>Run</strong>.</li>
            <li>Go to <strong>Project Settings → API</strong>, copy your <strong>Project URL</strong> and <strong>anon public key</strong>.</li>
            <li>Paste them in the fields above and click <strong>Connect & Activate Sync</strong>!</li>
          </ol>
        </div>
      </div>
    </Modal>
  );
};
