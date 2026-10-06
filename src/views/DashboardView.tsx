import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { DashboardStats } from '../types';
import {
  Eye,
  Package,
  DollarSign,
  ShoppingBag,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Users,
  Calendar,
  ArrowUpRight,
  Plus,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { selectedSiteId, currentSite, sites, openAddSiteModal, setActiveTab } = useApp();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [period, setPeriod] = useState<string>('7days');
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'orders' | 'views'>('revenue');
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await api.getDashboardStats(selectedSiteId, period);
      setStats(data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedSiteId, period]);

  const periods = [
    { id: 'today', label: 'Today' },
    { id: '7days', label: '7 Days' },
    { id: '30days', label: '30 Days' },
    { id: 'month', label: 'This Month' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold uppercase tracking-wider text-white">
              {selectedSiteId === 'all' ? 'All Connected Stores Overview' : currentSite?.name || 'Store Dashboard'}
            </h1>
            {selectedSiteId !== 'all' && currentSite && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-sky-400">
                WP {currentSite.wpVersion || '6.7'}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time synchronization across {selectedSiteId === 'all' ? `${sites.length} WordPress websites` : 'WordPress REST API'}
          </p>
        </div>

        {/* Date Filter & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-neutral-900 rounded border border-neutral-800">
            {periods.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
                  period === p.id
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fetchStats}
            className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Total Sales */}
        <div className="p-3.5 rounded border border-neutral-800 bg-neutral-950 text-neutral-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono">
            ${stats ? stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
          </div>
          <span className="text-[10px] text-neutral-500 uppercase mt-1">Confirmed Revenue</span>
        </div>

        {/* Total Orders */}
        <div className="p-3.5 rounded border border-neutral-800 bg-neutral-950 text-neutral-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono">
            {stats?.totalOrders ?? 0}
          </div>
          <span className="text-[10px] text-neutral-500 uppercase mt-1">Across Selected Scope</span>
        </div>

        {/* Total Products */}
        <div className="p-3.5 rounded border border-neutral-800 bg-neutral-950 text-neutral-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono">
            {stats?.totalProducts ?? 0}
          </div>
          <span className="text-[10px] text-neutral-500 uppercase mt-1">Catalog Listings</span>
        </div>

        {/* Total Views */}
        <div className="p-3.5 rounded border border-neutral-800 bg-neutral-950 text-neutral-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono">
            {stats?.totalViews ? stats.totalViews.toLocaleString() : 'N/A'}
          </div>
          <span className="text-[10px] text-neutral-500 uppercase mt-1">Store Traffic</span>
        </div>

        {/* Registered Users */}
        <div className="p-3.5 rounded border border-neutral-800 bg-neutral-950 text-neutral-100 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Registered Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono">
            {stats?.registeredUsers ?? 0}
          </div>
          <span className="text-[10px] text-neutral-500 uppercase mt-1">WP Accounts & Customers</span>
        </div>
      </div>

      {/* Secondary Status Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        <div className="p-2.5 rounded border border-neutral-850 bg-neutral-950/70 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Pending</div>
            <div className="text-lg font-bold font-mono text-white">{stats?.pendingOrders ?? 0}</div>
          </div>
          <Clock className="w-4 h-4 text-amber-400/70" />
        </div>

        <div className="p-2.5 rounded border border-neutral-850 bg-neutral-950/70 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-400">Processing</div>
            <div className="text-lg font-bold font-mono text-white">{stats?.processingOrders ?? 0}</div>
          </div>
          <RefreshCw className="w-4 h-4 text-sky-400/70" />
        </div>

        <div className="p-2.5 rounded border border-neutral-850 bg-neutral-950/70 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Completed</div>
            <div className="text-lg font-bold font-mono text-white">{stats?.completedOrders ?? 0}</div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-400/70" />
        </div>

        <div className="p-2.5 rounded border border-neutral-850 bg-neutral-950/70 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Cancelled</div>
            <div className="text-lg font-bold font-mono text-white">{stats?.cancelledOrders ?? 0}</div>
          </div>
          <XCircle className="w-4 h-4 text-neutral-500" />
        </div>

        <div className="p-2.5 rounded border border-neutral-850 bg-neutral-950/70 flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">Refunded</div>
            <div className="text-lg font-bold font-mono text-white">{stats?.refundedOrders ?? 0}</div>
          </div>
          <RotateCcw className="w-4 h-4 text-rose-400/70" />
        </div>
      </div>

      {/* Analytics Graph */}
      <div className="p-4 rounded border border-neutral-800 bg-neutral-950 text-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Store Performance Analytics
            </h2>
            <p className="text-xs text-neutral-400">
              Synchronized WooCommerce metrics over selected timeline
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-0.5 rounded bg-neutral-900 border border-neutral-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveMetric('revenue')}
              className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
                activeMetric === 'revenue'
                  ? 'bg-neutral-800 text-sky-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Revenue ($)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('orders')}
              className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
                activeMetric === 'orders'
                  ? 'bg-neutral-800 text-sky-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Orders
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('views')}
              className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
                activeMetric === 'views'
                  ? 'bg-neutral-800 text-sky-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Views
            </button>
          </div>
        </div>

        {/* SVG Interactive Chart */}
        {stats?.chartData && stats.chartData.length > 0 ? (
          <div className="w-full pt-2">
            <div className="h-56 w-full relative">
              {(() => {
                const points = stats.chartData;
                const values = points.map((p) => p[activeMetric]);
                const maxVal = Math.max(...values, 10);
                const minVal = 0;
                const range = maxVal - minVal;

                const width = 1000;
                const height = 200;
                const padding = 20;

                const coordinates = points.map((p, index) => {
                  const x = padding + (index / (points.length - 1 || 1)) * (width - padding * 2);
                  const y = height - padding - ((p[activeMetric] - minVal) / range) * (height - padding * 2);
                  return { x, y, data: p };
                });

                const pathString = coordinates.reduce((acc, curr, idx) => {
                  return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
                }, '');

                const areaString = `${pathString} L ${coordinates[coordinates.length - 1].x} ${height - padding} L ${coordinates[0].x} ${height - padding} Z`;

                return (
                  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                      const y = height - padding - pct * (height - padding * 2);
                      const gridVal = Math.round(minVal + pct * range);
                      return (
                        <g key={idx}>
                          <line
                            x1={padding}
                            y1={y}
                            x2={width - padding}
                            y2={y}
                            stroke="#262626"
                            strokeDasharray="3 3"
                            strokeWidth="1"
                          />
                          <text
                            x={padding - 5}
                            y={y + 3}
                            fill="#737373"
                            fontSize="9"
                            fontFamily="JetBrains Mono"
                            textAnchor="end"
                          >
                            {activeMetric === 'revenue' ? `$${gridVal}` : gridVal}
                          </text>
                        </g>
                      );
                    })}

                    {/* Shaded Area */}
                    <path d={areaString} fill="url(#chartGradient)" />

                    {/* Line */}
                    <path d={pathString} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Interactive Points */}
                    {coordinates.map((pt, idx) => (
                      <g key={idx} className="group cursor-pointer">
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4"
                          fill="#000000"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          className="transition-transform group-hover:scale-150"
                        />
                        {/* Tooltip on hover */}
                        <title>
                          {`${pt.data.label}: ${activeMetric === 'revenue' ? `$${pt.data[activeMetric]}` : pt.data[activeMetric]}`}
                        </title>
                      </g>
                    ))}

                    {/* X-Axis labels */}
                    {coordinates.map((pt, idx) => {
                      // show every N label if many points
                      const shouldShow = points.length <= 8 || idx % Math.ceil(points.length / 7) === 0 || idx === points.length - 1;
                      if (!shouldShow) return null;
                      return (
                        <text
                          key={idx}
                          x={pt.x}
                          y={height - 2}
                          fill="#737373"
                          fontSize="9"
                          fontFamily="sans-serif"
                          textAnchor="middle"
                        >
                          {pt.data.label}
                        </text>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-neutral-500 uppercase tracking-wider">
            Loading analytics data...
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className="p-4 rounded border border-neutral-800 bg-neutral-950 text-left hover:border-neutral-700 transition-colors group"
        >
          <div className="flex items-center justify-between text-neutral-400 group-hover:text-white">
            <span className="text-xs font-bold uppercase tracking-wider">Manage Products</span>
            <ArrowUpRight className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            View stock quantities, update prices, and create new WooCommerce listings.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded border border-neutral-800 bg-neutral-950 text-left hover:border-neutral-700 transition-colors group"
        >
          <div className="flex items-center justify-between text-neutral-400 group-hover:text-white">
            <span className="text-xs font-bold uppercase tracking-wider">Manage Orders</span>
            <ArrowUpRight className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Change order statuses with real two-way sync, view customer details, and call directly.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('browser')}
          className="p-4 rounded border border-neutral-800 bg-neutral-950 text-left hover:border-neutral-700 transition-colors group"
        >
          <div className="flex items-center justify-between text-neutral-400 group-hover:text-white">
            <span className="text-xs font-bold uppercase tracking-wider">Internal WP Browser</span>
            <ArrowUpRight className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Directly configure plugins, themes, and page builder settings inside control panel.
          </p>
        </button>
      </div>
    </div>
  );
};
