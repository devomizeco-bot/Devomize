import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'compact' | 'full' }> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside standalone PWA mode, don't show the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Desktop / Android flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded uppercase tracking-wider transition-colors
          bg-neutral-800 hover:bg-neutral-700 text-sky-400 border border-neutral-700
          dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800
          ${variant === 'full' ? 'w-full justify-center py-2' : ''}
        `}
        title="Install WP Master as native app"
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded uppercase tracking-wider transition-colors
            bg-neutral-900 hover:bg-neutral-800 text-sky-400 border border-neutral-800
            ${variant === 'full' ? 'w-full justify-center py-2' : ''}
          `}
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-lg bg-neutral-950 border border-neutral-800 p-5 shadow-2xl text-neutral-100">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400">
                  Install on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-neutral-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-neutral-300">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-neutral-900 text-sky-400 border border-neutral-800">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">1. Tap Safari Share</span>
                    <p className="text-neutral-400 mt-0.5">Press the Share icon in the bottom Safari toolbar.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-neutral-900 text-sky-400 border border-neutral-800">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">2. Add to Home Screen</span>
                    <p className="text-neutral-400 mt-0.5">Scroll down and select "Add to Home Screen".</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2 rounded bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-200 border border-neutral-700 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
