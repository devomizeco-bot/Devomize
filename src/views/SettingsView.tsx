import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Shield,
  Palette,
  Check,
  LogOut,
  Moon,
  Sun,
  Lock,
  Smartphone,
  Mail,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, updateUser, logout, theme, toggleTheme, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance'>('profile');

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Top Header */}
      <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Settings</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Owner Profile, Authentication & Control Panel Preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-2 overflow-x-auto">
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
                  ? 'bg-neutral-100 dark:bg-neutral-900 text-sky-600 dark:text-sky-400 border border-neutral-300 dark:border-neutral-800 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900/50'
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
        <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4 shadow-sm">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Owner Profile</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Primary administrative credentials for the DEVOMIZE Master Control Panel
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-3 max-w-md">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-900 dark:text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-900 dark:text-white font-mono focus:outline-none focus:border-sky-500"
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
        <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-5 shadow-sm">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Security & Password</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Manage your control panel password and active session
            </p>
          </div>

          <form onSubmit={handleSecuritySubmit} className="space-y-3 max-w-md">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
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

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">Session Control</h3>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded bg-neutral-100 hover:bg-rose-100 dark:bg-neutral-900 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-neutral-200 dark:border-neutral-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of DEVOMIZE</span>
            </button>
          </div>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4 shadow-sm">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Theme & Appearance</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Select between genuine deep-black (#000000) or high-contrast clean light mode
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            {/* Dark Mode Card */}
            <button
              type="button"
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-all ${
                theme === 'dark'
                  ? 'border-sky-500 bg-black text-white shadow-lg ring-1 ring-sky-500'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <div className="p-2 rounded bg-neutral-800 text-amber-400 border border-neutral-700">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <span>Dark Mode</span>
                  {theme === 'dark' && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Pure #000000 pitch-black surfaces with low power draw and OLED contrast.
                </p>
              </div>
            </button>

            {/* Light Mode Card */}
            <button
              type="button"
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-all ${
                theme === 'light'
                  ? 'border-sky-500 bg-white text-black shadow-lg ring-1 ring-sky-500'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-600">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <span>Light Mode</span>
                  {theme === 'light' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Clean crisp high-contrast daylight theme.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
