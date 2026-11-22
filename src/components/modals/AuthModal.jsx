import React, { useState, useMemo } from 'react';
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
    staff,
    orgSettings,
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

  const trimmedEmail = email.trim().toLowerCase();
  const registeredUser = useMemo(() => {
    if (!trimmedEmail) return null;

    // Check Master Admin
    if (trimmedEmail === 'arman@ekmuthohashi.org' || trimmedEmail === 'arman') {
      const adminStaff = staff?.find(s => s.email?.toLowerCase() === 'arman@ekmuthohashi.org');
      return {
        name: adminStaff?.fullName || orgSettings?.president || 'Engr. Arman Hossain',
        avatarUrl: adminStaff?.avatarUrl || null,
        initial: 'A'
      };
    }

    // Check staff roster by email or username / staffId
    const found = staff?.find(s =>
      s.email?.toLowerCase() === trimmedEmail ||
      (s.staffId && s.staffId.toLowerCase() === trimmedEmail)
    );
    if (found) {
      return {
        name: found.fullName,
        avatarUrl: found.avatarUrl || null,
        initial: (found.fullName || 'S')[0].toUpperCase()
      };
    }

    return null;
  }, [trimmedEmail, staff, orgSettings]);

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
      title={user ? (isAdmin ? 'Admin & Leadership Profile' : 'Staff Profile') : isSignUp ? 'Register Staff Account' : 'Staff & Volunteer Sign In'}
      subtitle="একমুঠো হাসি • কর্মী ও স্বেচ্ছাসেবক লগইন পোর্টাল"
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
                {isAdmin ? <ShieldCheck className="w-7 h-7 text-white" /> : (user.user_metadata?.full_name || user.email || 'V')[0].toUpperCase()}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-extrabold text-slate-900 text-base truncate">
                    {user.user_metadata?.full_name || (isAdmin ? 'Engr. Arman Hossain' : 'Volunteer Member')}
                  </p>
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
                className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
              >
                Sign Out from this Device
              </button>
            </div>
          </div>
        ) : (
          <>
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

              {/* Show only picture and name top of email box when email is registered */}
              {!isSignUp && registeredUser && (
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-teal-50 border border-teal-200 transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-teal-600 text-white border-2 border-teal-500 shrink-0 flex items-center justify-center font-bold text-sm shadow-xs">
                    {registeredUser.avatarUrl ? (
                      <img
                        src={registeredUser.avatarUrl}
                        alt={registeredUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{registeredUser.initial}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-900 text-sm leading-tight truncate">
                      {registeredUser.name}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email or Username *</span>
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-mono"
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
                  placeholder="Enter login password"
                  minLength={6}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-mono"
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
                <span>{isSignUp ? 'Submit Staff Registration' : 'Sign In to Dashboard'}</span>
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
