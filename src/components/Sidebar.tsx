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
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-neutral-800 bg-neutral-950 text-neutral-100 select-none dark:bg-black dark:border-neutral-800 light:bg-neutral-50 light:border-neutral-200">
      {/* Brand Header */}
      <div className="p-4 border-b border-neutral-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white text-black font-black flex items-center justify-center text-sm tracking-tighter">
              WP
            </div>
            <div>
              <span className="text-base font-extrabold uppercase tracking-wider block text-white light:text-black">
                WP Master
              </span>
              <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest block">
                Control Panel
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddSiteModal}
            className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-850 transition-colors"
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
                  ? 'bg-neutral-900 text-sky-400 border border-neutral-800 light:bg-neutral-200 light:text-sky-700'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60 light:hover:text-black light:hover:bg-neutral-100'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-neutral-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="p-3 border-t border-neutral-800 space-y-2.5">
        <PWAInstallButton variant="full" />

        {/* User Card & Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="truncate pr-2">
            <div className="text-xs font-bold text-white truncate light:text-neutral-900">
              {user?.name || 'Master Admin'}
            </div>
            <div className="text-[10px] text-neutral-500 truncate font-mono">
              {user?.email || 'admin@wpmaster.local'}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 transition-colors"
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
