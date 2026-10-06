import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { WordPressUser } from '../types';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  RefreshCw,
  Mail,
  Calendar,
  ShoppingBag,
  ExternalLink,
  DollarSign,
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const { selectedSiteId, sites, showToast } = useApp();
  const [users, setUsers] = useState<WordPressUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await api.getUsers(selectedSiteId, {
        role: roleFilter !== 'all' ? roleFilter : undefined,
        search,
      });
      setUsers(data);
    } catch {
      showToast('Failed to load WordPress users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedSiteId, roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'text-rose-400 bg-rose-950/30 border-rose-800/60';
      case 'shop_manager':
        return 'text-amber-400 bg-amber-950/30 border-amber-800/60';
      case 'customer':
        return 'text-sky-400 bg-sky-950/30 border-sky-800/60';
      default:
        return 'text-neutral-400 bg-neutral-900 border-neutral-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-neutral-900 dark:text-white">User Management</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            WordPress Accounts & WooCommerce Customers ({users.length} Users)
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white self-start sm:self-auto transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search users by name, username, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded focus:border-sky-500 focus:outline-none text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500"
          />
        </form>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-800 dark:text-neutral-300 focus:outline-none uppercase tracking-wide cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="administrator">Administrator</option>
            <option value="shop_manager">Shop Manager</option>
            <option value="customer">Customer</option>
            <option value="subscriber">Subscriber</option>
          </select>
        </div>
      </div>

      {/* User Content */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-neutral-500 uppercase tracking-wider">
          Fetching WordPress user accounts...
        </div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40">
          <Users className="w-8 h-8 text-neutral-400 dark:text-neutral-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-300">
            No Users Found
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            No users match your selected filters.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
            <table className="w-full text-left text-xs text-neutral-700 dark:text-neutral-300 border-collapse">
              <thead className="bg-neutral-50 dark:bg-neutral-900/60 uppercase font-semibold text-[11px] text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  {selectedSiteId === 'all' && <th className="p-3">Store</th>}
                  <th className="p-3">Role</th>
                  <th className="p-3">Registered</th>
                  <th className="p-3">Orders / Spent</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {users.map((u) => {
                  const regDate = new Date(u.registeredDate).toLocaleDateString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                  return (
                    <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors">
                      <td className="p-3 font-semibold text-neutral-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 text-xs uppercase">
                            {u.name.charAt(0)}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">{u.username}</td>
                      <td className="p-3">
                        <a
                          href={`mailto:${u.email}`}
                          className="text-neutral-700 dark:text-neutral-300 hover:text-sky-600 dark:hover:text-sky-400 font-mono text-[11px]"
                        >
                          {u.email}
                        </a>
                      </td>
                      {selectedSiteId === 'all' && (
                        <td className="p-3 text-[11px] text-neutral-600 dark:text-neutral-400">{u.siteName}</td>
                      )}
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] uppercase font-mono font-bold rounded border ${getRoleBadge(
                            u.role
                          )}`}
                        >
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">{regDate}</td>
                      <td className="p-3 text-[11px] font-mono">
                        {u.ordersCount !== undefined ? (
                          <span className="text-neutral-900 dark:text-white font-medium">
                            {u.ordersCount} orders (${u.totalSpent || 0})
                          </span>
                        ) : (
                          <span className="text-neutral-400 dark:text-neutral-500">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="capitalize text-[11px] text-neutral-700 dark:text-neutral-300">Active</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-2.5">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col gap-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 text-xs uppercase">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-neutral-900 dark:text-white">{u.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">@{u.username}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded border ${getRoleBadge(
                      u.role
                    )}`}
                  >
                    {u.role.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                  <a href={`mailto:${u.email}`} className="text-sky-600 dark:text-sky-400 text-xs font-mono">
                    {u.email}
                  </a>
                  {u.ordersCount !== undefined && (
                    <span className="font-mono text-neutral-900 dark:text-white text-[11px]">{u.ordersCount} orders</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
