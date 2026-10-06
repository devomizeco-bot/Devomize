import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  ExternalLink,
  ShieldAlert,
  Sliders,
  Package,
  ShoppingBag,
  Palette,
  FileText,
  Image,
  Lock,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

export const BrowserView: React.FC = () => {
  const { currentSite, sites, selectedSiteId, setSelectedSiteId, showToast } = useApp();

  const activeSite = currentSite || sites[0] || null;
  const [currentPath, setCurrentPath] = useState('/wp-admin/');
  const [history, setHistory] = useState<string[]>(['/wp-admin/']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [key, setKey] = useState(0);
  const [isIframeBlocked, setIsIframeBlocked] = useState(false);
  const [restrictionReason, setRestrictionReason] = useState<string>('');
  const [isCheckingEmbed, setIsCheckingEmbed] = useState(false);

  const fullUrl = activeSite ? `${activeSite.siteUrl}${currentPath}` : '';

  useEffect(() => {
    if (activeSite) {
      checkEmbeddability();
    }
  }, [activeSite?.id, currentPath]);

  const checkEmbeddability = async () => {
    if (!activeSite) return;
    try {
      setIsCheckingEmbed(true);
      const res = await api.checkBrowserEmbeddable(activeSite.id);
      setIsIframeBlocked(!res.allowIframe);
      setRestrictionReason(res.restrictionReason || '');
    } catch {
      setIsIframeBlocked(false);
    } finally {
      setIsCheckingEmbed(false);
    }
  };

  const navigateTo = (path: string) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(path);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setCurrentPath(path);
    setKey((prev) => prev + 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setCurrentPath(history[newIdx]);
      setKey((prev) => prev + 1);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setCurrentPath(history[newIdx]);
      setKey((prev) => prev + 1);
    }
  };

  const handleReload = () => {
    setKey((prev) => prev + 1);
    showToast('Reloading workspace', 'info');
  };

  const quickNav = [
    { label: 'Admin Dashboard', path: '/wp-admin/', icon: Globe },
    { label: 'Woo Orders', path: '/wp-admin/edit.php?post_type=shop_order', icon: ShoppingBag },
    { label: 'Woo Products', path: '/wp-admin/edit.php?post_type=product', icon: Package },
    { label: 'Plugins', path: '/wp-admin/plugins.php', icon: Sliders },
    { label: 'Themes & Customizer', path: '/wp-admin/themes.php', icon: Palette },
    { label: 'General Settings', path: '/wp-admin/options-general.php', icon: Sliders },
    { label: 'Pages', path: '/wp-admin/edit.php?post_type=page', icon: FileText },
    { label: 'Media Library', path: '/wp-admin/upload.php', icon: Image },
  ];

  if (!activeSite) {
    return (
      <div className="p-12 text-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        <Globe className="w-8 h-8 text-neutral-400 dark:text-neutral-600 mx-auto mb-2" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">No Site Selected</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Select or connect a WordPress website to open the internal administration browser.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden shadow-sm">
      {/* Top Browser Bar */}
      <div className="p-2.5 bg-neutral-50 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleBack}
            disabled={historyIndex === 0}
            className="p-1.5 rounded text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
            title="Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReload}
            className="p-1.5 rounded text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            title="Refresh Frame"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 min-w-[220px] max-w-xl flex items-center gap-2 px-3 py-1.5 rounded bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-300 font-mono text-[11px]">
          <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="text-sky-600 dark:text-sky-400 shrink-0 font-bold">{activeSite.name}</span>
          <span className="text-neutral-400 dark:text-neutral-600">/</span>
          <span className="truncate flex-1 text-neutral-600 dark:text-neutral-400">{fullUrl}</span>
        </div>

        {/* External Launch & Selector */}
        <div className="flex items-center gap-2">
          {sites.length > 1 && (
            <select
              value={activeSite.id}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="px-2 py-1 text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-800 dark:text-neutral-300 uppercase tracking-wide focus:outline-none"
            >
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}

          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase tracking-wider text-xs transition-colors shrink-0"
            title="Launch WP Admin in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Tab</span>
          </a>
        </div>
      </div>

      {/* Quick Admin Short-links */}
      <div className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
        <span className="text-[10px] text-neutral-500 uppercase shrink-0 font-mono">Quick Nav:</span>
        {quickNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigateTo(item.path)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors shrink-0 ${
                isActive
                  ? 'bg-neutral-200 dark:bg-neutral-900 text-sky-700 dark:text-sky-400 border border-neutral-300 dark:border-neutral-800 font-bold'
                  : 'hover:text-black dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-900/60'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Embedded Workspace or Security-Compliant Fallback */}
      <div className="flex-1 bg-neutral-100 dark:bg-black relative overflow-hidden">
        {isIframeBlocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200">
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-3 text-sky-600 dark:text-sky-400">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Remote Host Security Policy Active
            </h3>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mt-1 mb-4 leading-relaxed">
              WordPress server (<span className="text-neutral-900 dark:text-white font-mono">{activeSite.siteUrl}</span>) enforces browser header policies (<span className="font-mono text-neutral-700 dark:text-neutral-300">{restrictionReason || 'X-Frame-Options: SAMEORIGIN'}</span>) preventing nested framing.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 mb-6">
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase tracking-wider text-xs transition-colors shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch {activeSite.name} Admin in New Tab</span>
              </a>
            </div>

            {/* Direct Sections Grid */}
            <div className="w-full max-w-lg border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900/60 text-left">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Direct Admin Entry Points:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {quickNav.slice(0, 6).map((q) => (
                  <a
                    key={q.path}
                    href={`${activeSite.siteUrl}${q.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center justify-between transition-colors font-medium"
                  >
                    <span className="truncate">{q.label}</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400 dark:text-neutral-500 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <iframe
            key={key}
            src={fullUrl}
            title={`WordPress Admin - ${activeSite.name}`}
            className="w-full h-full border-none bg-white dark:bg-neutral-950"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
            onError={() => setIsIframeBlocked(true)}
          />
        )}
      </div>
    </div>
  );
};
