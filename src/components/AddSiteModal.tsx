import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Globe, Lock, User, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const AddSiteModal: React.FC = () => {
  const { isAddSiteModalOpen, closeAddSiteModal, addSite } = useApp();

  const [siteName, setSiteName] = useState('');
  const [adminUrl, setAdminUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authType, setAuthType] = useState<'application_password' | 'standard'>('application_password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAddSiteModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!siteName.trim()) {
      setError('Please provide a Site Name.');
      return;
    }
    if (!adminUrl.trim()) {
      setError('Please provide the WordPress Admin URL.');
      return;
    }
    if (!username.trim()) {
      setError('Please provide the WordPress Username.');
      return;
    }
    if (!password) {
      setError('Please enter the WordPress Password or Application Password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await addSite({
        name: siteName.trim(),
        adminUrl: adminUrl.trim(),
        username: username.trim(),
        password,
        authType,
      });
      // Reset form
      setSiteName('');
      setAdminUrl('');
      setUsername('');
      setPassword('');
      closeAddSiteModal();
    } catch (err: any) {
      setError(err.message || 'Failed to connect WordPress website. Check credentials and URL.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-2xl text-neutral-100 dark:bg-black dark:border-neutral-800">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-white">
              Connect WordPress Site
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Secure REST API Integration & Server-Side Encryption
            </p>
          </div>
          <button
            type="button"
            onClick={closeAddSiteModal}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Site Name
            </label>
            <input
              type="text"
              placeholder="e.g. My Store"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded focus:border-sky-500 focus:outline-none text-white font-medium placeholder-neutral-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              WordPress Admin URL
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="https://example.com/wp-admin"
                value={adminUrl}
                onChange={(e) => setAdminUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded focus:border-sky-500 focus:outline-none text-white font-mono placeholder-neutral-500"
                required
              />
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Enter your WordPress dashboard URL (with or without /wp-admin).
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                WordPress Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded focus:border-sky-500 focus:outline-none text-white placeholder-neutral-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setAuthType(
                      authType === 'application_password' ? 'standard' : 'application_password'
                    )
                  }
                  className="text-[10px] uppercase text-sky-400 hover:underline font-mono"
                >
                  {authType === 'application_password' ? 'App Password' : 'Standard'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded focus:border-sky-500 focus:outline-none text-white placeholder-neutral-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-neutral-900/60 border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Exposure Credential Architecture</span>
            </div>
            <p>
              Credentials are encrypted using AES-256-GCM on the secure backend and never exposed
              to the client browser. WordPress Application Passwords can be generated in WP Admin &gt; Users &gt; Profile.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={closeAddSiteModal}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded bg-sky-500 hover:bg-sky-400 text-black flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Add Site</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
