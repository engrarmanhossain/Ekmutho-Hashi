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
  RefreshCw,
  Crown,
  Sparkles
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

  // Quick fill Admin & CEO credentials
  const handleQuickAdminLogin = async () => {
    setEmail('arman@ekmuthohashi.org');
    setPassword('arman2026**');
    setLoading(true);
    setErrorMsg('');
    try {
      await signInVolunteer({
        email: 'arman@ekmuthohashi.org',
        password: 'arman2026**'
      });
      setSuccessMsg('Logged in as Engr. Arman Hossain (Admin, President & CEO)!');
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

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
        if (email.trim().toLowerCase() === 'arman@ekmuthohashi.org') {
          setSuccessMsg('Logged in as Engr. Arman Hossain (Admin, President & CEO)!');
        } else {
          setSuccessMsg('Registration submitted! Awaiting approval by Engr. Arman Hossain (Admin & CEO) before dashboard access.');
        }
        setTimeout(() => onClose(), 2200);
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

  const isAdmin = user?.user_metadata?.is_admin || user?.email === 'arman@ekmuthohashi.org';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? (isAdmin ? 'Admin & Leadership Profile' : 'Volunteer Account') : isSignUp ? 'Register Volunteer' : 'Leadership & Volunteer Login'}
      subtitle="একমুঠো হাসি • এডমিন, সভাপতি ও স্বেচ্ছাসেবক লগইন পোর্টাল"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* If user is already logged in */}
        {user ? (
          <div className="space-y-4 py-2">
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
                isAdmin
                  ? 'bg-gradient-to-r from-amber-50 to-amber-100/60 border-amber-300'
                  : 'bg-teal-50 border-teal-200'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-sm ${
                  isAdmin
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white ring-4 ring-amber-300/40'
                    : 'bg-teal-600 text-white'
                }`}
              >
                {isAdmin ? <Crown className="w-7 h-7" /> : (user.user_metadata?.full_name || user.email || 'V')[0].toUpperCase()}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-extrabold text-slate-900 text-base truncate">
                    {user.user_metadata?.full_name || (isAdmin ? 'Engr. Arman Hossain' : 'Volunteer Member')}
                  </p>
                  {isAdmin && <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />}
                </div>

                <p className="text-xs text-slate-600 font-mono truncate">{user.email}</p>

                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      isAdmin
                        ? 'bg-amber-200 text-amber-900 border border-amber-300'
                        : 'bg-teal-200 text-teal-900'
                    }`}
                  >
                    {isAdmin ? 'Admin, President & CEO' : 'Verified Field Volunteer'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-semibold text-slate-800">
                {isAdmin
                  ? 'Organization Authority Active: All reports, receipts, and field dispatches carry your executive authorization.'
                  : 'Verified volunteer access enabled for field relief distribution.'}
              </p>
              <p className="text-[11px] text-slate-500">
                Logged in device: Mobile / Web App • Database synchronization ready.
              </p>
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
            {/* Quick Login Button as Admin, President & CEO */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 border-2 border-amber-300/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase tracking-wider">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>Admin & Leadership Access</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-800">
                  Authorized
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                <strong>Engr. Arman Hossain</strong> (Admin, President & CEO)
                <span className="block font-mono text-[10px] text-slate-500">arman@ekmuthohashi.org</span>
              </p>
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                disabled={loading}
                className="w-full py-2 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-sm transition flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Crown className="w-3.5 h-3.5 text-amber-200" />
                <span>1-Click Login as Engr. Arman Hossain</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold uppercase text-slate-400">
                Or Sign In with Credentials
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

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
                  placeholder="arman@ekmuthohashi.org"
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
                  placeholder="Enter password"
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
