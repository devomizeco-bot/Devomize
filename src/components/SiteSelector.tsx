import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, ChevronDown, Check, Plus, Server } from 'lucide-react';

interface SiteSelectorProps {
  className?: string;
  isCompact?: boolean;
}

export const SiteSelector: React.FC<SiteSelectorProps> = ({ className = '', isCompact = false }) => {
  const { sites, selectedSiteId, setSelectedSiteId, openAddSiteModal } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedSite = sites.find((s) => s.id === selectedSiteId);
  const label = selectedSiteId === 'all' ? 'All Websites' : selectedSite?.name || 'Select Website';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium transition-colors border rounded-md cursor-pointer select-none text-left w-full
          bg-neutral-900/60 hover:bg-neutral-800/80 text-neutral-100 border-neutral-800
          dark:bg-neutral-950 dark:border-neutral-800 dark:hover:border-neutral-700
          light:bg-neutral-100 light:border-neutral-300 light:text-neutral-900 light:hover:bg-neutral-200
        `}
        aria-label="Select WordPress website"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          <Globe className="w-4 h-4 shrink-0 text-sky-400" />
          <span className="truncate tracking-wide uppercase font-semibold text-xs sm:text-sm">
            {label}
          </span>
          {selectedSiteId === 'all' && (
            <span className="text-[10px] text-neutral-400 border border-neutral-700/80 px-1 py-0.2 rounded font-mono">
              {sites.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 text-neutral-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 mt-1.5 w-72 max-w-[90vw] z-50 py-1.5 border shadow-2xl rounded-md backdrop-blur-md
            bg-neutral-950/95 border-neutral-800 text-neutral-200
            dark:bg-black/95 dark:border-neutral-800
            light:bg-white light:border-neutral-300 light:text-neutral-800 light:shadow-lg
          `}
        >
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-neutral-400 border-b border-neutral-800/60 flex items-center justify-between">
            <span>WordPress Instances</span>
            <span>{sites.length} Sites</span>
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {/* All Websites option */}
            <button
              type="button"
              onClick={() => {
                setSelectedSiteId('all');
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-neutral-800/60 transition-colors ${
                selectedSiteId === 'all' ? 'text-sky-400 bg-sky-950/20' : ''
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Server className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="font-semibold tracking-wide uppercase">All Websites (Aggregate)</span>
              </div>
              {selectedSiteId === 'all' && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
            </button>

            {/* Individual sites */}
            {sites.map((site) => {
              const isSelected = selectedSiteId === site.id;
              return (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => {
                    setSelectedSiteId(site.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-neutral-800/60 transition-colors ${
                    isSelected ? 'text-sky-400 bg-sky-950/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        site.status === 'connected'
                          ? 'bg-emerald-500'
                          : site.status === 'syncing'
                          ? 'bg-amber-400 animate-pulse'
                          : 'bg-rose-500'
                      }`}
                      title={site.status}
                    />
                    <div className="truncate">
                      <div className="font-semibold truncate">{site.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono truncate">{site.siteUrl}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="pt-1.5 mt-1 border-t border-neutral-800/60 px-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openAddSiteModal();
              }}
              className="w-full py-1.5 px-2.5 text-xs font-medium flex items-center justify-center gap-1.5 rounded text-sky-400 hover:bg-sky-950/40 border border-dashed border-sky-800/50 transition-colors uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect New Site</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
