import React from 'react';
import { useApp } from '../context/AppContext';
import { SiteSelector } from './SiteSelector';
import { PWAInstallButton } from './PWAInstallButton';
import { Sun, Moon, Activity, Plus } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme, toggleAuditDrawer, openAddSiteModal } = useApp();

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between dark:bg-black/90 dark:border-neutral-800 light:bg-white/90 light:border-neutral-200">
      {/* Left: Mobile Title + Global Site Selector */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-md">
        <div className="md:hidden flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded bg-white text-black font-black flex items-center justify-center text-xs tracking-tighter">
            WP
          </div>
          <span className="font-bold text-sm tracking-wide uppercase hidden xs:inline">
            WP Master
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
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-neutral-900 hover:bg-neutral-800 text-sky-400 border border-neutral-800 transition-colors"
          title="Add WordPress Website"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Site</span>
        </button>

        <PWAInstallButton variant="compact" />

        <button
          type="button"
          onClick={toggleAuditDrawer}
          className="p-2 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
          title="Audit Trail"
        >
          <Activity className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
        </button>
      </div>
    </header>
  );
};
