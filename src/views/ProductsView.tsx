import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { WooProduct, StockStatus, ProductStatus } from '../types';
import {
  Package,
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { selectedSiteId, sites, showToast } = useApp();
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<WooProduct | null>(null);

  // Form Fields
  const [formSiteId, setFormSiteId] = useState(selectedSiteId === 'all' ? sites[0]?.id || '' : selectedSiteId);
  const [name, setName] = useState('');
  const [regularPrice, setRegularPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [sku, setSku] = useState('');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [stockStatus, setStockStatus] = useState<StockStatus>('instock');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<ProductStatus>('publish');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await api.getProducts(selectedSiteId, {
        search,
        stockStatus: stockFilter !== 'all' ? stockFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
      });
      setProducts(data);
    } catch {
      showToast('Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedSiteId, stockFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormSiteId(selectedSiteId === 'all' ? sites[0]?.id || '' : selectedSiteId);
    setName('');
    setRegularPrice('');
    setSalePrice('');
    setSku('');
    setStockQuantity('15');
    setStockStatus('instock');
    setCategory('Apparel');
    setTags('');
    setImageUrl('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80');
    setStatus('publish');
    setDescription('');
    setShortDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: WooProduct) => {
    setEditingProduct(p);
    setFormSiteId(p.siteId);
    setName(p.name);
    setRegularPrice(String(p.regularPrice));
    setSalePrice(p.salePrice ? String(p.salePrice) : '');
    setSku(p.sku);
    setStockQuantity(p.stockQuantity !== null ? String(p.stockQuantity) : '');
    setStockStatus(p.stockStatus);
    setCategory(p.category);
    setTags(p.tags.join(', '));
    setImageUrl(p.images[0] || '');
    setStatus(p.status);
    setDescription(p.description);
    setShortDescription(p.shortDescription);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !regularPrice) {
      showToast('Name and regular price are required', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingProduct) {
        // Edit
        await api.updateProduct(editingProduct.siteId, editingProduct.id, {
          name,
          regularPrice: Number(regularPrice),
          salePrice: salePrice ? Number(salePrice) : null,
          sku,
          stockQuantity: stockQuantity ? Number(stockQuantity) : null,
          stockStatus,
          category,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          images: imageUrl ? [imageUrl] : [],
          status,
          description,
          shortDescription,
        });
        showToast('Product updated successfully on WordPress', 'success');
      } else {
        // Create
        await api.createProduct(formSiteId, {
          targetSiteId: formSiteId,
          name,
          regularPrice: Number(regularPrice),
          salePrice: salePrice ? Number(salePrice) : null,
          sku,
          stockQuantity: stockQuantity ? Number(stockQuantity) : null,
          stockStatus,
          category,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          images: imageUrl ? [imageUrl] : [],
          status,
          description,
          shortDescription,
        });
        showToast('Product published to WordPress/WooCommerce', 'success');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (p: WooProduct) => {
    if (!confirm(`Delete product "${p.name}" from WordPress?`)) return;
    try {
      await api.deleteProduct(p.siteId, p.id);
      showToast(`Product "${p.name}" deleted`, 'info');
      fetchProducts();
    } catch {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleDuplicate = async (p: WooProduct) => {
    try {
      await api.createProduct(p.siteId, {
        targetSiteId: p.siteId,
        name: `${p.name} (Copy)`,
        regularPrice: p.regularPrice,
        salePrice: p.salePrice,
        sku: `${p.sku}-COPY`,
        stockQuantity: p.stockQuantity,
        stockStatus: p.stockStatus,
        category: p.category,
        tags: p.tags,
        images: p.images,
        status: 'draft',
        description: p.description,
        shortDescription: p.shortDescription,
      });
      showToast('Product duplicated as draft', 'success');
      fetchProducts();
    } catch {
      showToast('Failed to duplicate product', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Product Management</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Synchronized WooCommerce Catalog ({products.length} Products)
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded bg-sky-500 hover:bg-sky-400 text-black transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 p-3 rounded border border-neutral-800 bg-neutral-950">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search products by title, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded focus:border-sky-500 focus:outline-none text-white placeholder-neutral-500"
          />
        </form>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium bg-neutral-900 border border-neutral-800 rounded text-neutral-300 focus:outline-none uppercase tracking-wide cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
            <option value="onbackorder">On Backorder</option>
          </select>

          <button
            type="button"
            onClick={fetchProducts}
            className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
            title="Refresh Products"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Content: Desktop Table & Mobile Cards */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-neutral-500 uppercase tracking-wider">
          Loading WooCommerce Catalog...
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center rounded border border-dashed border-neutral-800 bg-neutral-950/40">
          <Package className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            No Products Found
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            No products match your current website or search criteria.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-neutral-900 hover:bg-neutral-800 text-sky-400 border border-neutral-800"
          >
            Create First Product
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded border border-neutral-800 bg-neutral-950">
            <table className="w-full text-left text-xs text-neutral-300 border-collapse">
              <thead className="bg-neutral-900/60 uppercase font-semibold text-[11px] text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="p-3 w-12">Image</th>
                  <th className="p-3">Product Name</th>
                  {selectedSiteId === 'all' && <th className="p-3">Store</th>}
                  <th className="p-3">SKU</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="p-3">
                      <div className="w-10 h-10 rounded bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center">
                        {p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-neutral-600" />
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-medium text-white max-w-xs">
                      <div className="truncate font-semibold">{p.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono truncate">{p.slug}</div>
                    </td>
                    {selectedSiteId === 'all' && (
                      <td className="p-3 text-[11px] text-neutral-400 font-medium truncate">
                        {p.siteName}
                      </td>
                    )}
                    <td className="p-3 font-mono text-[11px] text-neutral-400">{p.sku}</td>
                    <td className="p-3 font-mono">
                      {p.salePrice ? (
                        <div>
                          <span className="text-emerald-400 font-bold">${p.salePrice}</span>{' '}
                          <span className="text-neutral-500 line-through text-[10px]">${p.regularPrice}</span>
                        </div>
                      ) : (
                        <span className="text-white">${p.regularPrice}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.stockStatus === 'instock'
                              ? 'bg-emerald-400'
                              : p.stockStatus === 'onbackorder'
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        <span className="capitalize text-[11px]">
                          {p.stockQuantity !== null ? `${p.stockQuantity} in stock` : p.stockStatus}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-[11px] text-neutral-400">{p.category}</td>
                    <td className="p-3">
                      <span className="uppercase text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1 rounded text-neutral-400 hover:text-sky-400 hover:bg-neutral-900"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p)}
                          className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-900"
                          title="Duplicate Product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-900"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-2.5">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded border border-neutral-800 bg-neutral-950 flex flex-col gap-2.5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-neutral-600 m-auto mt-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-white truncate">{p.name}</div>
                    <div className="text-[11px] text-neutral-400 font-mono">SKU: {p.sku}</div>
                    {selectedSiteId === 'all' && (
                      <div className="text-[10px] text-sky-400">{p.siteName}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-white">
                      ${p.salePrice || p.regularPrice}
                    </div>
                    {p.salePrice && (
                      <div className="text-[10px] text-neutral-500 line-through">
                        ${p.regularPrice}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-850">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        p.stockStatus === 'instock'
                          ? 'bg-emerald-400'
                          : p.stockStatus === 'onbackorder'
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                    />
                    <span>{p.stockQuantity !== null ? `${p.stockQuantity} in stock` : p.stockStatus}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(p)}
                      className="px-2 py-1 rounded bg-neutral-900 text-sky-400 text-xs font-semibold uppercase"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicate(p)}
                      className="px-2 py-1 rounded bg-neutral-900 text-neutral-300 text-xs font-semibold uppercase"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="p-1 rounded text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-2xl text-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h2 className="text-base font-bold uppercase tracking-wider text-white">
                {editingProduct ? 'Edit WooCommerce Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4">
              {/* Target Website Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Target WordPress Website
                </label>
                <select
                  value={formSiteId}
                  onChange={(e) => setFormSiteId(e.target.value)}
                  disabled={!!editingProduct}
                  className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none uppercase"
                >
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.siteUrl})
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Minimalist Wool Overshirt"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              {/* Prices & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Regular Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="120.00"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Sale Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="99.00"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    placeholder="PRD-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* Stock Quantity, Stock Status, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="25"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Stock Status
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                    className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white"
                  >
                    <option value="instock">In Stock</option>
                    <option value="outofstock">Out of Stock</option>
                    <option value="onbackorder">On Backorder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Publish Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProductStatus)}
                    className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white uppercase"
                  >
                    <option value="publish">Publish</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>
              </div>

              {/* Category, Tags, Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apparel, Footwear, Tech"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="minimal, cotton, black"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary shown on catalog pages..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed product specifications, materials, and care instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded bg-sky-500 hover:bg-sky-400 text-black flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Save Changes' : 'Publish Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
