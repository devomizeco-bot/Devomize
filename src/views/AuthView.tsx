import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Mail, User, Phone, Loader2, ArrowRight } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, signup } = useApp();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLoginMode) {
        const res = await login(email.trim(), password);
        if (!res.success) {
          setError(res.error || 'Invalid credentials');
        }
      } else {
        if (!name.trim()) {
          setError('Name is required');
          setIsLoading(false);
          return;
        }
        const res = await signup(name.trim(), phone.trim(), email.trim(), password);
        if (!res.success) {
          setError(res.error || 'Failed to create account');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black text-neutral-100 select-none">
      <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded bg-white text-black font-black flex items-center justify-center text-base tracking-tighter mx-auto mb-2.5">
            WP
          </div>
          <h1 className="text-lg font-black uppercase tracking-wider text-white">
            WP Master Control Panel
          </h1>
          <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
            {isLoginMode ? 'Single-Owner Central Authentication' : 'Create Master Admin Account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLoginMode && (
            <>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Admin Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded focus:border-sky-500 focus:outline-none text-white font-medium placeholder-neutral-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded focus:border-sky-500 focus:outline-none text-white font-mono placeholder-neutral-600"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded focus:border-sky-500 focus:outline-none text-white font-mono placeholder-neutral-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded focus:border-sky-500 focus:outline-none text-white placeholder-neutral-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 rounded bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLoginMode ? (
              <>
                <span>Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Toggle Login / Signup */}
        <div className="mt-5 pt-4 border-t border-neutral-850 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError(null);
            }}
            className="text-xs text-neutral-400 hover:text-white uppercase font-semibold tracking-wider transition-colors"
          >
            {isLoginMode ? "Don't have an account? Sign Up" : 'Already registered? Login'}
          </button>
        </div>

        {/* Hint for initial evaluation */}
        {isLoginMode && (
          <div className="mt-4 p-2 rounded bg-neutral-900/60 border border-neutral-850 text-[10px] text-neutral-500 text-center font-mono">
            Default credentials: admin@wpmaster.local / admin123
          </div>
        )}
      </div>
    </div>
  );
};
