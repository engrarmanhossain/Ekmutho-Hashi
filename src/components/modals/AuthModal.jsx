import React, { useState } from 'react';
import {
  User,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCharity } from '../../context/CharityContext';

export const AuthModal = ({ isOpen, onClose, onOpenConnectModal }) => {
  const {
    isCloudConnected,
    user,
    signUpVolunteer,
    signInVolunteer,
    signOutVolunteer
  } = useCharity();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }
        await signUpVolunteer({
          email: email.trim(),
          password,
          fullName: fullName.trim()
        });
        setSuccessMsg('Account created successfully! You are now logged in as a verified volunteer.');
        setTimeout(() => onClose(), 1500);
      } else {
        await signInVolunteer({
          email: email.trim(),
          password
        });
        setSuccessMsg('Welcome back! You are now authenticated.');
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutVolunteer();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Volunteer Account' : isSignUp ? 'Register Volunteer' : 'Volunteer Login'}
      subtitle="স্বেচ্ছাসেবক একাউন্ট লগইন ও অ্যাক্সেস পোর্টাল"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* If user is already logged in */}
        {user ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                {(user.user_metadata?.full_name || user.email || 'V')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">
                  {user.user_metadata?.full_name || 'Volunteer Member'}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-teal-200 text-teal-900 mt-1 uppercase">
                  Verified Volunteer
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>✓ All aid distributions you record will automatically carry your volunteer stamp.</p>
              <p>✓ Changes sync directly with the cloud database across other volunteers' phones.</p>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
              >
                Sign Out from this Device
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* If Cloud is not connected yet */}
            {!isCloudConnected && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Cloud className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Connect Supabase Project First</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  To enable multi-phone volunteer authentication, connect your Supabase project URL and API key.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenConnectModal();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 transition"
                >
                  ⚡ Connect Supabase Now
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Your Full Name (স্বেচ্ছাসেবকের নাম) *</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed / Rafiqul Islam"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="volunteer@ekmuthohashi.org"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password *</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-98 rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : isSignUp ? (
                  <UserPlus className="w-4 h-4" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>{isSignUp ? 'Create Volunteer Account' : 'Sign In as Volunteer'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 underline"
                >
                  {isSignUp
                    ? 'Already have an account? Sign In here'
                    : 'New volunteer? Register an account here'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
};
