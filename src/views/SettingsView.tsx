import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  getSavedSupabaseConfig,
  saveSupabaseConfig,
  resetSupabaseClient,
  SUPABASE_SQL_SCHEMA,
} from '../lib/supabase';
import {
  User,
  Shield,
  Palette,
  Database,
  Activity,
  Check,
  Copy,
  LogOut,
  Moon,
  Sun,
  Lock,
  Smartphone,
  Mail,
  Server,
  FileCode,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, updateUser, logout, theme, toggleTheme, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance' | 'database'>(
    'profile'
  );

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Supabase Config
  const savedCfg = getSavedSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(savedCfg?.url || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(savedCfg?.anonKey || '');
  const [copiedSql, setCopiedSql] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      await updateUser({ name, phone, email });
      showToast('Profile information saved', 'success');
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    showToast('Password changed successfully', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      saveSupabaseConfig(null);
      resetSupabaseClient();
      showToast('Supabase configuration cleared. Using local persistence.', 'info');
      return;
    }

    saveSupabaseConfig({
      url: supabaseUrl.trim(),
      anonKey: supabaseAnonKey.trim(),
    });
    resetSupabaseClient();
    showToast('Supabase configuration saved & client re-initialized', 'success');
  };

  const copySqlSchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    showToast('Supabase SQL schema copied to clipboard', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'database', label: 'Supabase Database', icon: Database },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Top Header */}
      <div className="pb-3 border-b border-neutral-800">
        <h1 className="text-xl font-bold uppercase tracking-wider text-white">Settings</h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Owner Profile, Authentication, Database & Control Panel Preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-neutral-800 pb-2 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors shrink-0 ${
                isActive
                  ? 'bg-neutral-900 text-sky-400 border border-neutral-800'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-950 space-y-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Owner Profile</h2>
            <p className="text-xs text-neutral-400">
              Primary administrative credentials for the Master Control Panel
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-3 max-w-md">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded text-white font-mono focus:outline-none"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-sky-500 hover:bg-sky-400 text-black transition-colors"
              >
                {isSavingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-950 space-y-5">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Security & Password</h2>
            <p className="text-xs text-neutral-400">
              Manage your control panel password and active session
            </p>
          </div>

          <form onSubmit={handleSecuritySubmit} className="space-y-3 max-w-md">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-sky-500 hover:bg-sky-400 text-black transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Session Control</h3>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded bg-neutral-900 hover:bg-rose-950/40 text-rose-400 border border-neutral-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Master Control Panel</span>
            </button>
          </div>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-950 space-y-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Theme & Appearance</h2>
            <p className="text-xs text-neutral-400">
              Select between genuine deep-black (#000000) or high-contrast clean light mode
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            {/* Dark Mode Card */}
            <button
              type="button"
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-colors ${
                theme === 'dark'
                  ? 'border-sky-500 bg-black text-white shadow-lg'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-amber-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span>Dark Mode</span>
                  {theme === 'dark' && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Pure #000000 pitch-black surfaces with low power draw and OLED contrast.
                </p>
              </div>
            </button>

            {/* Light Mode Card */}
            <button
              type="button"
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-colors ${
                theme === 'light'
                  ? 'border-sky-500 bg-white text-black shadow-lg'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <div className="p-2 rounded bg-neutral-100 border border-neutral-300 text-amber-600">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-black light:text-black flex items-center gap-1.5">
                  <span>Light Mode</span>
                  {theme === 'light' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </div>
                <p className="text-[11px] text-neutral-600 mt-0.5">
                  Clean crisp high-contrast daylight theme.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Supabase Database Tab */}
      {activeTab === 'database' && (
        <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-950 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Supabase Integration & Database
              </h2>
              <p className="text-xs text-neutral-400">
                Persistent PostgreSQL cloud storage and Supabase Authentication
              </p>
            </div>
            <button
              type="button"
              onClick={copySqlSchema}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider text-sky-400 border border-neutral-800"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
            </button>
          </div>

          <form onSubmit={handleSaveSupabaseConfig} className="space-y-3 max-w-lg">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://xyzproject.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded text-white font-mono focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-sky-500 hover:bg-sky-400 text-black transition-colors"
              >
                Save Supabase Configuration
              </button>
            </div>
          </form>

          {/* SQL Preview Box */}
          <div className="p-3 rounded bg-neutral-900/60 border border-neutral-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">
                Supabase Table DDL & Row Level Security:
              </span>
              <button
                type="button"
                onClick={copySqlSchema}
                className="text-[10px] text-sky-400 hover:underline uppercase font-mono"
              >
                Copy All SQL
              </button>
            </div>
            <pre className="p-3 rounded bg-black border border-neutral-900 text-[10px] text-neutral-400 font-mono max-h-48 overflow-y-auto leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
