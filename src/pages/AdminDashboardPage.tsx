import { useEffect, useState, type FormEvent } from 'react';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import { api } from '../api/client';
import type {
  AdminOverviewData,
  OrderStatus,
  Product,
  ProductCategory,
} from '../types';
import { formatINR, formatShortDate } from '../utils/format';

interface AdminDashboardPageProps {
  adminEmail: string;
  products: Product[];
  onProductsChanged: () => void;
  onAdminLogout: () => void;
}

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
];

const CATEGORIES: ProductCategory[] = [
  'T-shirts',
  'Shirts',
  'Tops',
  'Casual Wear',
  'Everyday Essentials',
];

export function AdminDashboardPage({
  adminEmail,
  products,
  onProductsChanged,
  onAdminLogout,
}: AdminDashboardPageProps) {
  const [tab, setTab] = useState<'overview' | 'orders' | 'products' | 'community'>('overview');
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Product Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('Shirts');
  const [newPrice, setNewPrice] = useState('1200');
  const [newFabric, setNewFabric] = useState('100% Organic Cotton');
  const [newBatchRemaining, setNewBatchRemaining] = useState('100');
  const [newDescription, setNewDescription] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);

  // Inline Edit Price
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editBatch, setEditBatch] = useState('');

  const loadOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminOverview();
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status.');
    }
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSavingProduct(true);
    setError(null);
    try {
      await api.addProduct({
        name: newName.trim(),
        category: newCategory,
        price: Number(newPrice) || 1200,
        fabric: newFabric.trim(),
        batchRemaining: Number(newBatchRemaining) || 100,
        batchTotal: Number(newBatchRemaining) || 100,
        description:
          newDescription.trim() ||
          'Limited-batch sustainable everyday garment built for campus and studio wear.',
      });
      setNewName('');
      setNewDescription('');
      onProductsChanged();
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create product.');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleSaveEdit = async (productId: string) => {
    try {
      await api.updateProduct(productId, {
        price: Number(editPrice),
        batchRemaining: Number(editBatch),
      });
      setEditingId(null);
      onProductsChanged();
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update product.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.deleteProduct(productId);
      onProductsChanged();
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete product.');
    }
  };

  if (loading && !overview) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-sm text-[#635E56]">
        Loading Urban Loom Operations Dashboard...
      </div>
    );
  }

  const maxUnits = Math.max(
    1,
    ...(overview?.popularProducts.map((p) => p.unitsSold) || [1]),
  );

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2DDD3]">
        <div>
          <p className="text-xs font-medium text-[#4B5842]">
            Signed in as {adminEmail}
          </p>
          <h1 className="font-editorial text-3xl font-medium text-[#1A1917]">
            Urban Loom MVP Operations &amp; Sales Dashboard
          </h1>
        </div>

        <button
          type="button"
          onClick={onAdminLogout}
          className="px-4 py-2 text-xs font-medium border border-[#D8D1C5] rounded-md text-[#8B2E2E] hover:bg-[#FDF2F2] inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Admin</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-[#FDF2F2] border border-[#E5B8B8] rounded-md text-xs text-[#8B2E2E]">
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E2DDD3] pb-4">
        {[
          { id: 'overview', label: 'Sales & MVP Analytics' },
          { id: 'orders', label: `Orders & Pre-orders (${overview?.orders.length || 0})` },
          { id: 'products', label: `Catalogue Products (${products.length})` },
          { id: 'community', label: 'Feedback & Pop-ups' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id as typeof tab)}
            className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
              tab === item.id
                ? 'bg-[#1A1917] text-white'
                : 'bg-white border border-[#E2DDD3] text-[#635E56] hover:text-[#1A1917]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E2DDD3] rounded-lg p-5 space-y-1">
            <p className="text-xs text-[#635E56]">Total Demo Sales Value</p>
            <p className="font-mono tabular-nums text-2xl font-semibold text-[#1A1917]">
              {formatINR(overview.metrics.totalDemoSalesValue)}
            </p>
            <p className="text-[11px] text-[#4B5842]">
              Avg order {formatINR(overview.metrics.avgOrderValue)}
            </p>
          </div>

          <div className="bg-white border border-[#E2DDD3] rounded-lg p-5 space-y-1">
            <p className="text-xs text-[#635E56]">Orders / Pre-orders</p>
            <p className="font-mono tabular-nums text-2xl font-semibold text-[#1A1917]">
              {overview.metrics.totalOrders}{' '}
              <span className="text-sm font-normal text-[#635E56]">
                ({overview.metrics.totalPreOrders} pre-orders)
              </span>
            </p>
            <p className="text-[11px] text-[#635E56]">
              {overview.metrics.totalCustomers} unique customers
            </p>
          </div>

          <div className="bg-white border border-[#E2DDD3] rounded-lg p-5 space-y-1">
            <p className="text-xs text-[#635E56]">Fabric Quality Benchmark</p>
            <p className="font-mono tabular-nums text-2xl font-semibold text-[#4B5842]">
              {overview.metrics.positiveFabricPercent}%
            </p>
            <p className="text-[11px] text-[#635E56]">
              Avg {overview.metrics.avgFabricQuality}/5 (MVP target &gt;80%)
            </p>
          </div>

          <div className="bg-white border border-[#E2DDD3] rounded-lg p-5 space-y-1">
            <p className="text-xs text-[#635E56]">Pop-up &amp; Swatch Leads</p>
            <p className="font-mono tabular-nums text-2xl font-semibold text-[#1A1917]">
              {overview.metrics.totalPopupRegistrations}
            </p>
            <p className="text-[11px] text-[#635E56]">
              {overview.newsletterCount} newsletter subscribers
            </p>
          </div>
        </div>
      )}

      {/* TAB 1: Overview & Charts */}
      {tab === 'overview' && overview && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white border border-[#E2DDD3] rounded-lg p-6 space-y-5">
            <div>
              <h2 className="font-editorial text-xl font-medium text-[#1A1917]">
                Product-Wise Sales &amp; Demand
              </h2>
              <p className="text-xs text-[#635E56]">
                Units reserved across demo orders and pre-orders (testing the ~₹1,200 price point).
              </p>
            </div>

            <div className="space-y-4">
              {overview.popularProducts.map((prod) => (
                <div key={prod.productId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#1A1917]">{prod.name}</span>
                    <span className="font-mono tabular-nums text-[#635E56]">
                      {prod.unitsSold} units · {formatINR(prod.revenue)}
                    </span>
                  </div>
                  <div className="h-2.5 bg-[#EFECE6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4B5842] rounded-full"
                      style={{ width: `${Math.max(4, (prod.unitsSold / maxUnits) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-[#E2DDD3] rounded-lg p-6 space-y-5">
            <h2 className="font-editorial text-xl font-medium text-[#1A1917]">
              MVP Hypothesis Summary
            </h2>
            <p className="text-xs text-[#635E56] leading-relaxed">
              Core assumption: <strong className="text-[#1A1917]">Will Gen Z college students purchase
              sustainable everyday clothing at ~₹1,200 per garment?</strong>
            </p>
            <div className="space-y-3 text-xs border-t border-[#EFECE6] pt-4">
              <div className="flex justify-between">
                <span className="text-[#635E56]">Pre-order Share of Total Orders</span>
                <span className="font-mono tabular-nums font-semibold text-[#1A1917]">
                  {overview.metrics.totalOrders > 0
                    ? Math.round(
                        (overview.metrics.totalPreOrders / overview.metrics.totalOrders) * 100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#635E56]">Most Popular Garment</span>
                <span className="font-medium text-[#1A1917]">
                  {overview.popularProducts[0]?.name || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#635E56]">Positive Fabric Quality Rate</span>
                <span className="font-mono tabular-nums font-semibold text-[#4B5842]">
                  {overview.metrics.positiveFabricPercent}% (Goal: &gt;80%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orders */}
      {tab === 'orders' && overview && (
        <div className="bg-white border border-[#E2DDD3] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F7F5F0] border-b border-[#E2DDD3] text-[#635E56]">
                  <th className="py-3 px-4 font-medium">Reference</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium">City</th>
                  <th className="py-3 px-4 font-medium">Type</th>
                  <th className="py-3 px-4 font-medium">Items</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {overview.orders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="py-3 px-4 font-mono font-medium text-[#1A1917]">
                      {ord.referenceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#1A1917]">{ord.customerName}</p>
                      <p className="text-[11px] text-[#635E56]">{ord.email}</p>
                    </td>
                    <td className="py-3 px-4 text-[#635E56]">{ord.city}</td>
                    <td className="py-3 px-4 capitalize text-[#635E56]">{ord.orderType}</td>
                    <td className="py-3 px-4 text-[#1A1917]">
                      {ord.items.map((i) => `${i.name} (${i.size}×${i.quantity})`).join(', ')}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums font-medium text-[#1A1917]">
                      {formatINR(ord.total)}
                    </td>
                    <td className="py-3 px-4 text-[#635E56]">{formatShortDate(ord.createdAt)}</td>
                    <td className="py-3 px-4">
                      <select
                        aria-label={`Update status for ${ord.referenceNumber}`}
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className="px-2 py-1 bg-[#F7F5F0] border border-[#D8D1C5] rounded-sm text-xs text-[#1A1917]"
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Manage Products */}
      {tab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleAddProduct}
            className="lg:col-span-4 bg-white border border-[#E2DDD3] rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1917]">
              <Plus className="w-4 h-4 text-[#4B5842]" />
              <span>Add New Product</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A1917] mb-1">Garment Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Indigo Hemp Studio Shirt"
                className="w-full px-3 py-2 text-xs border border-[#D8D1C5] rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1A1917] mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                  className="w-full px-3 py-2 text-xs border border-[#D8D1C5] rounded-md"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1917] mb-1">Price (INR)</label>
                <input
                  type="number"
                  min={499}
                  max={4999}
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-[#D8D1C5] rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1A1917] mb-1">Fabric Spec</label>
                <input
                  type="text"
                  value={newFabric}
                  onChange={(e) => setNewFabric(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D8D1C5] rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1917] mb-1">Batch Units</label>
                <input
                  type="number"
                  min={1}
                  value={newBatchRemaining}
                  onChange={(e) => setNewBatchRemaining(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-[#D8D1C5] rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A1917] mb-1">Description</label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Fit, weight, and sustainability notes"
                className="w-full px-3 py-2 text-xs border border-[#D8D1C5] rounded-md"
              />
            </div>

            <button
              type="submit"
              disabled={savingProduct}
              className="w-full py-2.5 px-4 bg-[#4B5842] text-white text-xs font-medium rounded-md hover:bg-[#3B4634]"
            >
              {savingProduct ? 'Adding Product...' : 'Add to Catalogue'}
            </button>
          </form>

          <div className="lg:col-span-8 bg-white border border-[#E2DDD3] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F7F5F0] border-b border-[#E2DDD3] text-[#635E56]">
                    <th className="py-3 px-4 font-medium">Product</th>
                    <th className="py-3 px-4 font-medium">Category</th>
                    <th className="py-3 px-4 font-medium">Price</th>
                    <th className="py-3 px-4 font-medium">Batch Left</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  {products.map((prod) => (
                    <tr key={prod.id}>
                      <td className="py-3 px-4 font-medium text-[#1A1917]">{prod.name}</td>
                      <td className="py-3 px-4 text-[#635E56]">{prod.category}</td>
                      <td className="py-3 px-4 font-mono tabular-nums">
                        {editingId === prod.id ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-20 px-2 py-1 border border-[#D8D1C5] rounded-sm"
                          />
                        ) : (
                          formatINR(prod.price)
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums">
                        {editingId === prod.id ? (
                          <input
                            type="number"
                            value={editBatch}
                            onChange={(e) => setEditBatch(e.target.value)}
                            className="w-16 px-2 py-1 border border-[#D8D1C5] rounded-sm"
                          />
                        ) : (
                          prod.batchRemaining
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        {editingId === prod.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(prod.id)}
                              className="text-[#4B5842] font-medium hover:underline"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="text-[#635E56] hover:underline"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(prod.id);
                                setEditPrice(String(prod.price));
                                setEditBatch(String(prod.batchRemaining));
                              }}
                              className="text-[#1A1917] hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              aria-label={`Delete ${prod.name}`}
                              className="text-[#8B2E2E] hover:underline inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Feedback & Pop-up Registrations */}
      {tab === 'community' && overview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-[#E2DDD3] rounded-lg p-6 space-y-4">
            <h2 className="font-editorial text-xl font-medium text-[#1A1917]">
              Customer Feedback ({overview.feedback.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {overview.feedback.map((fb) => (
                <div key={fb.id} className="p-3.5 bg-[#F7F5F0] rounded-md text-xs space-y-1">
                  <div className="flex justify-between font-medium text-[#1A1917]">
                    <span>
                      {fb.customerName} ({fb.city})
                    </span>
                    <span className="font-mono text-[#4B5842]">Fabric {fb.fabricQuality}/5</span>
                  </div>
                  <p className="text-[#635E56]">{fb.suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E2DDD3] rounded-lg p-6 space-y-4">
            <h2 className="font-editorial text-xl font-medium text-[#1A1917]">
              Campus Pop-Up &amp; Fabric Sample Requests ({overview.popupRegistrations.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {overview.popupRegistrations.map((reg) => (
                <div key={reg.id} className="p-3.5 bg-[#F7F5F0] rounded-md text-xs space-y-1">
                  <div className="flex justify-between font-medium text-[#1A1917]">
                    <span>{reg.name}</span>
                    <span className="text-[#4B5842]">{reg.requestType}</span>
                  </div>
                  <p className="text-[#635E56]">
                    {reg.email} · {reg.preferredLocation}
                  </p>
                  {reg.notes && <p className="text-[#635E56] italic">{reg.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
