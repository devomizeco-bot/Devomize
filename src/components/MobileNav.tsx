import React, { useState } from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Server,
  MoreHorizontal,
  Users,
  Globe,
  Settings,
  LogOut,
  Sun,
  Moon,
  X,
  ShieldCheck,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, user, logout, theme, toggleTheme } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'sites', label: 'Sites', icon: Server },
  ];

  return (
    <>
      {/* Bottom Sticky Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-md px-2 flex items-center justify-around pb-safe transition-colors">
        {mainTabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setIsMoreOpen(false);
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] h-12 py-1 px-2 rounded transition-colors ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}

        {/* More button */}
        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 py-1 px-2 rounded transition-colors ${
            ['users', 'browser', 'settings'].includes(activeTab) || isMoreOpen
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase tracking-wider">More</span>
        </button>
      </nav>

      {/* More Bottom Sheet Drawer */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-150">
          <div
            className="w-full bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 rounded-t-2xl p-5 shadow-2xl text-neutral-900 dark:text-neutral-100 max-h-[85vh] overflow-y-auto pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  DEVOMIZE Controls
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 rounded text-neutral-500 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('users');
                  setIsMoreOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-semibold uppercase tracking-wider border ${
                  activeTab === 'users'
                    ? 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sky-600 dark:text-sky-400'
                    : 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Users className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                <span>WordPress Users</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('browser');
                  setIsMoreOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-semibold uppercase tracking-wider border ${
                  activeTab === 'browser'
                    ? 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sky-600 dark:text-sky-400'
                    : 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Globe className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                <span>Internal Admin Browser</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('settings');
                  setIsMoreOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-semibold uppercase tracking-wider border ${
                  activeTab === 'settings'
                    ? 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sky-600 dark:text-sky-400'
                    : 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Settings className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                <span>Control Panel Settings</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
              <PWAInstallButton variant="full" />

              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      {user?.name || user?.email?.split('@')[0] || 'Admin'}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">{user?.email || ''}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2 rounded bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
                    title="Toggle Theme"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreOpen(false);
                      logout();
                    }}
                    className="p-2 rounded bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-rose-500 dark:text-rose-400"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
