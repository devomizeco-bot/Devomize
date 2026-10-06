import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WordPressSite } from '../types';
import { api } from '../lib/api';
import {
  Server,
  Plus,
  RefreshCw,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Package,
  ShoppingBag,
  Globe,
  Radio,
  Lock,
} from 'lucide-react';

export const SitesView: React.FC = () => {
  const {
    sites,
    isSitesLoading,
    selectedSiteId,
    setSelectedSiteId,
    openAddSiteModal,
    removeSite,
    testSite,
    syncSite,
    refreshSites,
    setActiveTab,
    showToast,
  } = useApp();

  const [testingSiteId, setTestingSiteId] = useState<string | null>(null);
  const [syncingSiteId, setSyncingSiteId] = useState<string | null>(null);

  // Edit site modal
  const [editingSite, setEditingSite] = useState<WordPressSite | null>(null);
  const [editName, setEditName] = useState('');
  const [editAdminUrl, setEditAdminUrl] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTestConnection = async (site: WordPressSite) => {
    try {
      setTestingSiteId(site.id);
      await testSite(site.id);
    } finally {
      setTestingSiteId(null);
    }
  };

  const handleSyncNow = async (site: WordPressSite) => {
    try {
      setSyncingSiteId(site.id);
      await syncSite(site.id);
    } finally {
      setSyncingSiteId(null);
    }
  };

  const handleRemove = async (site: WordPressSite) => {
    if (confirm(`Are you sure you want to disconnect and remove "${site.name}"?`)) {
      await removeSite(site.id);
    }
  };

  const openEditModal = (site: WordPressSite) => {
    setEditingSite(site);
    setEditName(site.name);
    setEditAdminUrl(site.adminUrl);
    setEditUsername(site.username);
    setEditPassword('');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSite) return;

    try {
      setIsUpdating(true);
      await api.updateSite(editingSite.id, {
        name: editName,
        adminUrl: editAdminUrl,
        username: editUsername,
        password: editPassword || undefined,
      });
      showToast('Website configuration updated', 'success');
      await refreshSites();
      setEditingSite(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to update site', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">
            Connected WordPress Sites
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Centralized multi-site connection hub ({sites.length} Active Sites)
          </p>
        </div>

        <button
          type="button"
          onClick={openAddSiteModal}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded bg-sky-500 hover:bg-sky-400 text-black transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add WordPress Site</span>
        </button>
      </div>

      {/* Sites Grid */}
      {isSitesLoading ? (
        <div className="p-8 text-center text-xs text-neutral-500 uppercase tracking-wider">
          Loading connected sites...
        </div>
      ) : sites.length === 0 ? (
        <div className="p-12 text-center rounded border border-dashed border-neutral-800 bg-neutral-950/40">
          <Server className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            No WordPress Websites Connected
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Connect your first WordPress & WooCommerce site to start managing products, orders, and settings.
          </p>
          <button
            onClick={openAddSiteModal}
            className="mt-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-sky-500 text-black hover:bg-sky-400"
          >
            Connect Site Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => {
            const isSelected = selectedSiteId === site.id;
            const isTesting = testingSiteId === site.id;
            const isSyncing = syncingSiteId === site.id;

            return (
              <div
                key={site.id}
                className={`p-4 rounded-lg border bg-neutral-950 flex flex-col justify-between transition-colors ${
                  isSelected
                    ? 'border-sky-500/80 shadow-lg shadow-sky-950/20'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-white uppercase tracking-wider truncate">
                          {site.name}
                        </h3>
                        {isSelected && (
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-sky-950 border border-sky-800 text-sky-400">
                            Active
                          </span>
                        )}
                      </div>
                      <a
                        href={site.adminUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-neutral-400 hover:text-sky-400 font-mono inline-flex items-center gap-1 mt-0.5"
                      >
                        <Globe className="w-3 h-3 shrink-0" />
                        <span className="truncate">{site.siteUrl}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          site.status === 'connected'
                            ? 'bg-emerald-400'
                            : site.status === 'syncing'
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-rose-400'
                        }`}
                      />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        {site.status}
                      </span>
                    </div>
                  </div>

                  {/* Versions & Meta */}
                  <div className="flex items-center gap-2 py-2 border-y border-neutral-850 text-[10px] text-neutral-400 font-mono">
                    <span>WP {site.wpVersion || '6.7'}</span>
                    <span>·</span>
                    <span>WC {site.wcVersion || 'Active'}</span>
                    <span>·</span>
                    <span>{site.username}</span>
                  </div>

                  {/* Metrics preview */}
                  <div className="grid grid-cols-2 gap-2 my-3">
                    <div className="p-2 rounded bg-neutral-900/60 border border-neutral-850">
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400 uppercase font-semibold">
                        <Package className="w-3 h-3 text-sky-400" />
                        <span>Products</span>
                      </div>
                      <div className="text-base font-bold font-mono text-white mt-0.5">
                        {site.productsCount}
                      </div>
                    </div>

                    <div className="p-2 rounded bg-neutral-900/60 border border-neutral-850">
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400 uppercase font-semibold">
                        <ShoppingBag className="w-3 h-3 text-emerald-400" />
                        <span>Orders</span>
                      </div>
                      <div className="text-base font-bold font-mono text-white mt-0.5">
                        {site.ordersCount}
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-neutral-500 font-mono">
                    Last Synced: {new Date(site.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 mt-3 border-t border-neutral-850 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleTestConnection(site)}
                      disabled={isTesting}
                      className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
                      title="Test REST API Connection"
                    >
                      {isTesting ? 'Testing...' : 'Test'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSyncNow(site)}
                      disabled={isSyncing}
                      className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider rounded bg-neutral-900 hover:bg-neutral-800 text-sky-400 border border-neutral-800 transition-colors"
                      title="Synchronize Data"
                    >
                      {isSyncing ? 'Syncing...' : 'Sync'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSiteId(site.id);
                        setActiveTab('dashboard');
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded bg-sky-500 hover:bg-sky-400 text-black transition-colors"
                    >
                      Manage
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(site)}
                      className="p-1 rounded text-neutral-400 hover:text-white"
                      title="Edit Site Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemove(site)}
                      className="p-1 rounded text-neutral-400 hover:text-rose-400"
                      title="Disconnect Site"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Site Modal */}
      {editingSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-5 shadow-2xl text-neutral-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white pb-2 border-b border-neutral-800">
              Edit Site: {editingSite.name}
            </h3>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  WordPress Admin URL
                </label>
                <input
                  type="text"
                  value={editAdminUrl}
                  onChange={(e) => setEditAdminUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white font-mono focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  WordPress Username
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Update Password / App Password (leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingSite(null)}
                  className="px-3 py-1.5 text-xs uppercase font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 text-xs uppercase font-bold bg-sky-500 hover:bg-sky-400 text-black rounded"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
