import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { AuditLog } from '../types';
import { X, Activity, RefreshCw, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

export const AuditLogDrawer: React.FC = () => {
  const { isAuditDrawerOpen, toggleAuditDrawer } = useApp();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAuditLogs(60);
      setLogs(data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuditDrawerOpen) {
      fetchLogs();
    }
  }, [isAuditDrawerOpen]);

  if (!isAuditDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md h-full bg-neutral-950 border-l border-neutral-800 text-neutral-100 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">System Audit Trail</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={fetchLogs}
              className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={toggleAuditDrawer}
              className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-xs text-neutral-500 uppercase tracking-wider">
              No audit records found
            </div>
          ) : (
            logs.map((log) => {
              const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });
              const dateStr = new Date(log.timestamp).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={log.id}
                  className="p-3 rounded border border-neutral-800/80 bg-neutral-900/40 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white tracking-wide uppercase">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {dateStr} {timeStr}
                    </span>
                  </div>

                  {log.siteName && (
                    <div className="text-[11px] text-sky-400 font-medium truncate">
                      {log.siteName}
                    </div>
                  )}

                  <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                    {log.details}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-neutral-800 bg-neutral-900/50 text-center text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
          Security Log Layer · End-to-End Auditing
        </div>
      </div>
    </div>
  );
};
