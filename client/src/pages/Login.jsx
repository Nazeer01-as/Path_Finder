import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, LogIn, Lock, Mail, AlertCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillCredentials = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glow spots */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-stone-900/90 backdrop-blur-xl rounded-3xl border border-stone-800 shadow-2xl shadow-black/50 p-8 sm:p-10 space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Path<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Finder</span>
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-normal">
            Sign in to access your personalized pathway & saved opportunities
          </p>
        </div>

        {/* Demo Account Pills for evaluation */}
        <div className="p-3.5 bg-stone-800/60 border border-stone-700/60 rounded-2xl space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-amber-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Quick Demo Autofill:
            </span>
            <span className="text-[10px] text-stone-400 font-medium">1-Click Evaluation</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('student@pathfinder.com', 'Student@123')}
              className="flex-1 py-2 px-2.5 bg-stone-900 text-amber-300 rounded-xl text-xs font-bold border border-stone-700 hover:bg-stone-800 transition-all shadow-2xs cursor-pointer active:scale-98"
            >
              Student Demo
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@pathfinder.com', 'Admin@123')}
              className="flex-1 py-2 px-2.5 bg-stone-800 text-stone-200 rounded-xl text-xs font-bold hover:bg-stone-700 border border-stone-700 transition-all shadow-2xs cursor-pointer active:scale-98"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 text-xs font-medium text-rose-300 bg-rose-950/30 border border-rose-800/50 rounded-xl animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-stone-100 placeholder:text-stone-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-stone-100 placeholder:text-stone-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer active:scale-98"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In to Platform
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-stone-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-amber-400 hover:text-amber-300 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
