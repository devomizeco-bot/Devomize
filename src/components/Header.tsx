import React from 'react';
import { useApp } from '../context/AppContext';
import { SiteSelector } from './SiteSelector';
import { PWAInstallButton } from './PWAInstallButton';
import { Sun, Moon, Activity, Plus } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme, toggleAuditDrawer, openAddSiteModal } = useApp();

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Left: Mobile Title + Global Site Selector */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-md">
        <div className="md:hidden flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded bg-black dark:bg-white text-white dark:text-black font-black flex items-center justify-center text-xs tracking-tighter">
            D
          </div>
          <span className="font-extrabold text-sm tracking-wider uppercase hidden xs:inline">
            DEVOMIZE
          </span>
        </div>

        <div className="w-full max-w-xs">
          <SiteSelector />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={openAddSiteModal}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-neutral-100 hover:bg-neutral-200 text-sky-600 border border-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-sky-400 dark:border-neutral-800 transition-colors"
          title="Add WordPress Website"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Site</span>
        </button>

        <PWAInstallButton variant="compact" />

        <button
          type="button"
          onClick={toggleAuditDrawer}
          className="p-2 rounded text-neutral-600 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-colors"
          title="Audit Trail"
        >
          <Activity className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded text-neutral-600 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-700" />
          )}
        </button>
      </div>
    </header>
  );
};
