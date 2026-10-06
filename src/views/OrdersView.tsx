import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { WooOrder, OrderStatus } from '../types';
import {
  ShoppingBag,
  Search,
  Filter,
  Phone,
  Mail,
  ExternalLink,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  AlertCircle,
  X,
  CreditCard,
  MapPin,
  FileText,
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { selectedSiteId, sites, showToast } = useApp();
  const [orders, setOrders] = useState<WooOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<WooOrder | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [modalNewStatus, setModalNewStatus] = useState<OrderStatus>('processing');
  const [adminNote, setAdminNote] = useState('');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await api.getOrders(selectedSiteId, {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search,
      });
      setOrders(data);
    } catch {
      showToast('Failed to load orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedSiteId, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleQuickStatusChange = async (order: WooOrder, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(order.siteId, order.id, newStatus);
      showToast(`Order #${order.id} status synced to "${newStatus}"`, 'success');
      fetchOrders();
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const handleModalStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setIsUpdatingStatus(true);
      await api.updateOrderStatus(selectedOrder.siteId, selectedOrder.id, modalNewStatus, adminNote);
      showToast(`Order #${selectedOrder.id} status updated and synchronized`, 'success');
      setSelectedOrder({ ...selectedOrder, status: modalNewStatus });
      setAdminNote('');
      fetchOrders();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const openOrderModal = (order: WooOrder) => {
    setSelectedOrder(order);
    setModalNewStatus(order.status);
    setAdminNote('');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400 bg-emerald-950/30 border-emerald-800/60';
      case 'processing':
        return 'text-sky-400 bg-sky-950/30 border-sky-800/60';
      case 'pending':
        return 'text-amber-400 bg-amber-950/30 border-amber-800/60';
      case 'on-hold':
        return 'text-orange-400 bg-orange-950/30 border-orange-800/60';
      case 'cancelled':
        return 'text-neutral-400 bg-neutral-900 border-neutral-800';
      case 'refunded':
        return 'text-rose-400 bg-rose-950/30 border-rose-800/60';
      default:
        return 'text-neutral-400 bg-neutral-900 border-neutral-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Order Management</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Two-way WooCommerce synchronization ({orders.length} orders in view)
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Orders</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 p-3 rounded border border-neutral-800 bg-neutral-950">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Order #, customer name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded focus:border-sky-500 focus:outline-none text-white placeholder-neutral-500"
          />
        </form>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium bg-neutral-900 border border-neutral-800 rounded text-neutral-300 focus:outline-none uppercase tracking-wide cursor-pointer"
          >
            <option value="all">All Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-neutral-500 uppercase tracking-wider">
          Fetching WooCommerce orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center rounded border border-dashed border-neutral-800 bg-neutral-950/40">
          <ShoppingBag className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            No Orders Found
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            No WooCommerce orders found for the selected website and filters.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded border border-neutral-800 bg-neutral-950">
            <table className="w-full text-left text-xs text-neutral-300 border-collapse">
              <thead className="bg-neutral-900/60 uppercase font-semibold text-[11px] text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {orders.map((o) => {
                  const dateStr = new Date(o.date).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  });
                  const timeStr = new Date(o.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <tr key={o.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-white">
                        <button
                          type="button"
                          onClick={() => openOrderModal(o)}
                          className="hover:text-sky-400 transition-colors"
                        >
                          #{o.id}
                        </button>
                        {selectedSiteId === 'all' && (
                          <div className="text-[10px] text-neutral-500 font-sans">{o.siteName}</div>
                        )}
                      </td>
                      <td className="p-3 font-medium text-white max-w-xs">
                        <div className="truncate font-semibold">{o.customerName}</div>
                        <a
                          href={`mailto:${o.customerEmail}`}
                          className="text-[10px] text-neutral-500 hover:text-sky-400 block truncate"
                        >
                          {o.customerEmail}
                        </a>
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        {/* IMPORTANT: Phone number must be clickable with tel: launching native calling app */}
                        <a
                          href={`tel:${o.customerPhone}`}
                          className="inline-flex items-center gap-1 text-sky-400 hover:underline font-semibold"
                          title="Call customer via device phone app"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{o.customerPhone}</span>
                        </a>
                      </td>
                      <td className="p-3 text-[11px] text-neutral-400 font-mono">
                        <div>{dateStr}</div>
                        <div className="text-[10px] text-neutral-600">{timeStr}</div>
                      </td>
                      <td className="p-3 text-[11px]">
                        <span className="font-semibold text-neutral-200">
                          {o.items.reduce((s, i) => s + i.quantity, 0)} items
                        </span>
                        <div className="text-[10px] text-neutral-500 truncate max-w-[120px]">
                          {o.items[0]?.name}
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-white text-sm">
                        ${o.total.toFixed(2)}
                      </td>
                      <td className="p-3 text-[11px] text-neutral-400">{o.paymentMethod}</td>
                      <td className="p-3">
                        {/* Status Select with direct sync */}
                        <select
                          value={o.status}
                          onChange={(e) => handleQuickStatusChange(o, e.target.value as OrderStatus)}
                          className={`px-2 py-0.5 text-[10px] uppercase font-mono font-bold rounded border focus:outline-none cursor-pointer ${getStatusBadge(
                            o.status
                          )}`}
                        >
                          <option value="pending" className="bg-neutral-900 text-white">Pending</option>
                          <option value="processing" className="bg-neutral-900 text-white">Processing</option>
                          <option value="on-hold" className="bg-neutral-900 text-white">On Hold</option>
                          <option value="completed" className="bg-neutral-900 text-white">Completed</option>
                          <option value="cancelled" className="bg-neutral-900 text-white">Cancelled</option>
                          <option value="refunded" className="bg-neutral-900 text-white">Refunded</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openOrderModal(o)}
                            className="p-1 rounded text-neutral-400 hover:text-sky-400 hover:bg-neutral-900"
                            title="View Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`tel:${o.customerPhone}`}
                            className="p-1 rounded text-neutral-400 hover:text-emerald-400 hover:bg-neutral-900"
                            title="Call Customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-2.5">
            {orders.map((o) => (
              <div
                key={o.id}
                className="p-3.5 rounded border border-neutral-800 bg-neutral-950 flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <button
                      type="button"
                      onClick={() => openOrderModal(o)}
                      className="font-mono font-bold text-sm text-sky-400 hover:underline"
                    >
                      Order #{o.id}
                    </button>
                    <div className="font-semibold text-white text-xs mt-0.5">{o.customerName}</div>
                    {selectedSiteId === 'all' && (
                      <div className="text-[10px] text-neutral-400 font-medium">{o.siteName}</div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-white">
                      ${o.total.toFixed(2)}
                    </div>
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[9px] uppercase font-mono font-bold rounded border mt-1 ${getStatusBadge(
                        o.status
                      )}`}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-850">
                  {/* Clickable tel: link for mobile native phone app */}
                  <a
                    href={`tel:${o.customerPhone}`}
                    className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-semibold py-1 px-2 rounded bg-neutral-900 border border-neutral-800"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Customer</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => openOrderModal(o)}
                    className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider text-sky-400 border border-neutral-800"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-2xl text-neutral-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold uppercase tracking-wider text-white">
                    Order #{selectedOrder.id}
                  </h2>
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase font-mono font-bold rounded border ${getStatusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Placed on {new Date(selectedOrder.date).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Customer Contact & Call Customer Action */}
              <div className="p-3.5 rounded border border-neutral-800 bg-neutral-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Customer Info
                  </div>
                  <div className="font-bold text-sm text-white mt-0.5">{selectedOrder.customerName}</div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-neutral-300 font-mono">
                    <a
                      href={`mailto:${selectedOrder.customerEmail}`}
                      className="inline-flex items-center gap-1 hover:text-sky-400"
                    >
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{selectedOrder.customerEmail}</span>
                    </a>
                  </div>
                </div>

                {/* Prominent Clickable Phone Button */}
                <a
                  href={`tel:${selectedOrder.customerPhone}`}
                  className="flex items-center justify-center gap-2 px-3.5 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider text-xs transition-colors shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {selectedOrder.customerPhone}</span>
                </a>
              </div>

              {/* Order Status Synchronization Controller */}
              <div className="p-3.5 rounded border border-neutral-800 bg-neutral-900/40">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-400 mb-2">
                  WooCommerce Status Synchronization
                </div>
                <form onSubmit={handleModalStatusSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <select
                      value={modalNewStatus}
                      onChange={(e) => setModalNewStatus(e.target.value as OrderStatus)}
                      className="px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white uppercase font-semibold focus:outline-none flex-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>

                    <button
                      type="submit"
                      disabled={isUpdatingStatus}
                      className="px-4 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {isUpdatingStatus ? 'Syncing...' : 'Update & Sync Status'}
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Add admin note to order..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white placeholder-neutral-500 focus:outline-none"
                    />
                  </div>
                </form>
              </div>

              {/* Line Items Table */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Line Items
                </div>
                <div className="rounded border border-neutral-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-900/60 uppercase font-semibold text-[10px] text-neutral-400">
                      <tr>
                        <th className="p-2.5">Item</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Price</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-850">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2.5 font-medium text-white">{item.name}</td>
                          <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                          <td className="p-2.5 text-right font-mono text-neutral-300">
                            ${(item.total / (item.quantity || 1)).toFixed(2)}
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-white">
                            ${item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Addresses & Financial Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded border border-neutral-800 bg-neutral-900/30">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>Shipping Address</span>
                  </div>
                  <p className="text-neutral-300 text-xs">
                    {selectedOrder.shippingAddress.address1}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postcode}<br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>

                <div className="p-3 rounded border border-neutral-800 bg-neutral-900/30">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Financial Totals</span>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Shipping:</span>
                      <span>${selectedOrder.shipping.toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount:</span>
                        <span>-${selectedOrder.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-neutral-800">
                      <span>Total:</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.customerNote && (
                <div className="p-3 rounded border border-neutral-800 bg-neutral-900/30">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-amber-400" />
                    <span>Customer / Admin Notes</span>
                  </div>
                  <p className="text-neutral-300 whitespace-pre-line text-xs font-mono">
                    {selectedOrder.customerNote}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
