import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { SiteSelector } from './SiteSelector';
import { PWAInstallButton } from './PWAInstallButton';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Server,
  Globe,
  Settings,
  LogOut,
  Sun,
  Moon,
  Plus,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, user, logout, theme, toggleTheme, openAddSiteModal } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'sites', label: 'Sites', icon: Server },
    { id: 'browser', label: 'Browser', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 select-none transition-colors">
      {/* Brand Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-black dark:bg-white text-white dark:text-black font-black flex items-center justify-center text-sm tracking-tighter">
              D
            </div>
            <div>
              <span className="text-base font-black uppercase tracking-wider block text-neutral-900 dark:text-white">
                DEVOMIZE
              </span>
              <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest block">
                WP Control Panel
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddSiteModal}
            className="p-1.5 rounded text-neutral-600 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-colors"
            title="Add Site"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Global Site Selector in Sidebar */}
        <SiteSelector />
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                isActive
                  ? 'bg-neutral-100 text-sky-600 border border-neutral-200 dark:bg-neutral-900 dark:text-sky-400 dark:border-neutral-800 font-bold'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900/60'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-sky-600 dark:text-sky-400' : 'text-neutral-400 dark:text-neutral-500'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2.5">
        <PWAInstallButton variant="full" />

        {/* User Card & Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="truncate pr-2">
            <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
              {user?.name || user?.email?.split('@')[0] || 'Admin'}
            </div>
            <div className="text-[10px] text-neutral-500 truncate font-mono">
              {user?.email || ''}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded text-neutral-600 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900 transition-colors"
              title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-neutral-700" />
              )}
            </button>
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded text-neutral-600 hover:text-rose-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-rose-400 dark:hover:bg-neutral-900 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
