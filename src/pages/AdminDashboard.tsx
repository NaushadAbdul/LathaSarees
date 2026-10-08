import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Package,
  ShoppingBag,
  Settings,
  Database,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import { useStore, OrderRecord } from '../context/StoreContext';
import { BRAND_IMAGES, Product } from '../data/catalog';

const PRESET_IMAGES = [
  { label: 'Crimson Banarasi Saree', url: BRAND_IMAGES.sareeBanarasiCrimson },
  { label: 'Emerald Kanchipuram Saree', url: BRAND_IMAGES.sareeKanchipuramEmerald },
  { label: 'Bridal Wine Zari Saree', url: BRAND_IMAGES.heroBridal },
  { label: 'Temple Kemp Jhumkas', url: BRAND_IMAGES.jewelryTempleJhumka },
  { label: 'Lakshmi Temple Necklace', url: BRAND_IMAGES.jewelryLakshmiNecklace },
  { label: 'Nizam Kundan Bangles', url: BRAND_IMAGES.jewelryKundanBangles },
];

export const AdminDashboard: React.FC = () => {
  const {
    user,
    isAdmin,
    loginWithGoogle,
    products,
    orders,
    settings,
    adminSaveProduct,
    adminDeleteProduct,
    adminUpdateOrderStatus,
    adminUpdateSettings,
    adminSeedCatalog,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>(
    'products'
  );

  // Product Form State
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Sarees' | 'Jewelry'>('Sarees');
  const [subcategory, setSubcategory] = useState('Banarasi');
  const [price, setPrice] = useState(12900);
  const [originalPrice, setOriginalPrice] = useState(16500);
  const [stock, setStock] = useState(8);
  const [sku, setSku] = useState('LTH-NEW-009');
  const [fabric, setFabric] = useState('Pure Mulberry Silk');
  const [occasion, setOccasion] = useState('Wedding & Festive');
  const [weave, setWeave] = useState('Handloom Zari');
  const [colorsInput, setColorsInput] = useState('Deep Wine, Antique Gold');
  const [thumbnail, setThumbnail] = useState(BRAND_IMAGES.sareeBanarasiCrimson);
  const [description, setDescription] = useState(
    'Handcrafted heirloom creation curated exclusively for Latha Sarees & Jewelry patrons.'
  );
  const [featured, setFeatured] = useState(true);
  const [newArrival, setNewArrival] = useState(true);

  // Settings State
  const [announcementText, setAnnouncementText] = useState(
    settings.announcementText
  );
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    settings.freeShippingThreshold
  );
  const [codEnabled, setCodEnabled] = useState(settings.codEnabled);

  if (!user) {
    return (
      <div className="bg-[#F7F0E6] min-h-[75vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#FFFDFC] border border-[#B99A62]/40 p-8 text-center space-y-5">
          <ShieldAlert className="w-10 h-10 text-[#5A2630] mx-auto" />
          <h1 className="font-serif-luxury text-3xl text-[#33221C]">
            Boutique Admin Portal
          </h1>
          <p className="text-xs text-[#806B5E]">
            Sign in with the authorized administrator Google account to manage products, inventory, orders, and announcement settings.
          </p>
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-3.5 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em]"
          >
            SIGN IN AS ADMINISTRATOR
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-[#F7F0E6] min-h-[75vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#FFFDFC] border border-[#B99A62]/40 p-8 text-center space-y-4">
          <ShieldAlert className="w-10 h-10 text-[#5A2630] mx-auto" />
          <h1 className="font-serif-luxury text-3xl text-[#33221C]">
            Restricted Access
          </h1>
          <p className="text-xs text-[#806B5E]">
            Signed in as <strong>{user.email}</strong>. Only verified boutique administrators can modify catalog and order records.
          </p>
        </div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled' && o.status !== 'Returned')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const handleEditProduct = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setCategory(p.category);
    setSubcategory(p.subcategory);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice);
    setStock(p.stock);
    setSku(p.sku);
    setFabric(p.fabric);
    setOccasion(p.occasion);
    setWeave(p.weave);
    setColorsInput(p.colors.join(', '));
    setThumbnail(p.thumbnail);
    setDescription(p.description);
    setFeatured(p.featured);
    setNewArrival(p.newArrival);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(undefined);
    setName('');
    setCategory('Sarees');
    setSubcategory('Banarasi');
    setPrice(12900);
    setOriginalPrice(16500);
    setStock(8);
    setSku(`LTH-SAR-${Math.floor(100 + Math.random() * 900)}`);
    setFabric('Pure Mulberry Silk');
    setOccasion('Wedding & Festive');
    setWeave('Handloom Zari');
    setColorsInput('Deep Wine, Antique Gold');
    setThumbnail(BRAND_IMAGES.sareeBanarasiCrimson);
    setDescription(
      'Handcrafted heirloom creation curated exclusively for Latha Sarees & Jewelry patrons.'
    );
    setFeatured(true);
    setNewArrival(true);
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const calcDiscount =
      originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    await adminSaveProduct({
      id: editingId,
      name,
      slug,
      description,
      category,
      subcategory,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discount: calcDiscount,
      images: [thumbnail],
      thumbnail,
      stock: Number(stock),
      sku,
      colors: colorsInput
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      fabric,
      occasion,
      weave,
      featured,
      newArrival,
      rating: 4.9,
      reviewCount: 15,
    });
    resetForm();
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminUpdateSettings({
      announcementText,
      freeShippingThreshold: Number(freeShippingThreshold),
      codEnabled,
    });
  };

  return (
    <div className="bg-[#F7F0E6] min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-[1360px] mx-auto space-y-8">
        {/* Top Header & Sync Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#B99A62]/30 pb-6">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#5A2630] font-semibold">
              LATHA SAREES & JEWELRY · MANAGEMENT
            </p>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#33221C]">
              Boutique Admin Console
            </h1>
          </div>

          <button
            type="button"
            onClick={adminSeedCatalog}
            className="px-5 py-2.5 bg-[#B99A62] text-[#33221C] text-xs font-semibold tracking-[0.14em] flex items-center gap-2 hover:bg-[#c9ab74] transition-colors"
          >
            <Database className="w-4 h-4" />
            Sync Signature Catalog to Firestore
          </button>
        </div>

        {/* KPI Statistics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
          <div className="bg-[#FFFDFC] border border-[#B99A62]/30 p-5">
            <span className="text-xs text-[#806B5E]">Total Revenue</span>
            <p className="font-serif-luxury text-3xl font-semibold text-[#33221C] mt-1">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-[#FFFDFC] border border-[#B99A62]/30 p-5">
            <span className="text-xs text-[#806B5E]">Total Orders</span>
            <p className="font-serif-luxury text-3xl font-semibold text-[#33221C] mt-1">
              {orders.length}
            </p>
          </div>
          <div className="bg-[#FFFDFC] border border-[#B99A62]/30 p-5">
            <span className="text-xs text-[#806B5E]">Catalog Pieces</span>
            <p className="font-serif-luxury text-3xl font-semibold text-[#33221C] mt-1">
              {products.length}
            </p>
          </div>
          <div className="bg-[#FFFDFC] border border-[#B99A62]/30 p-5">
            <span className="text-xs text-[#806B5E] flex items-center gap-1">
              Low Stock Pieces (≤ 5)
              {lowStockCount > 0 && (
                <AlertTriangle className="w-3.5 h-3.5 text-[#5A2630]" />
              )}
            </span>
            <p className="font-serif-luxury text-3xl font-semibold text-[#5A2630] mt-1">
              {lowStockCount}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#B99A62]/30 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-[0.14em] flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-[#4A1C24] text-[#F7F0E6]'
                : 'bg-[#FFFDFC] text-[#33221C] border border-[#B99A62]/30'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Manage Sarees & Jewelry ({products.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-[0.14em] flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#4A1C24] text-[#F7F0E6]'
                : 'bg-[#FFFDFC] text-[#33221C] border border-[#B99A62]/30'
            }`}
          >
            <Package className="w-4 h-4" />
            Manage Orders ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-[0.14em] flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#4A1C24] text-[#F7F0E6]'
                : 'bg-[#FFFDFC] text-[#33221C] border border-[#B99A62]/30'
            }`}
          >
            <Settings className="w-4 h-4" />
            Store Announcement & Settings
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Add / Edit Product Form */}
            <div className="lg:col-span-5 bg-[#FFFDFC] border border-[#B99A62]/35 p-6 h-fit">
              <div className="flex items-center justify-between mb-4 border-b border-[#B99A62]/25 pb-3">
                <h2 className="font-serif-luxury text-2xl text-[#33221C] flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#B99A62]" />
                  {editingId ? 'Edit Catalog Piece' : 'Add Saree or Jewelry'}
                </h2>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-[#5A2630] underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProductSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium text-[#33221C] mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Royal Kanchipuram Zari Silk Saree"
                    className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#33221C] mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as 'Sarees' | 'Jewelry')
                      }
                      className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                    >
                      <option value="Sarees">Sarees</option>
                      <option value="Jewelry">Jewelry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-[#33221C] mb-1">
                      Subcategory *
                    </label>
                    <input
                      type="text"
                      required
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      placeholder="Banarasi, Jhumkas, Necklaces..."
                      className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-[#33221C] mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#33221C] mb-1">
                      Original MRP (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#33221C] mb-1">
                      Stock Qty
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#33221C] mb-1">
                      Fabric / Material
                    </label>
                    <input
                      type="text"
                      required
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#33221C] mb-1">
                      Weave / Craft
                    </label>
                    <input
                      type="text"
                      required
                      value={weave}
                      onChange={(e) => setWeave(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#33221C] mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#33221C] mb-1">
                      Colors (comma-separated)
                    </label>
                    <input
                      type="text"
                      required
                      value={colorsInput}
                      onChange={(e) => setColorsInput(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#33221C] mb-1">
                    Product Image (Select Studio Preset or Enter URL)
                  </label>
                  <select
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 mb-2"
                  >
                    {PRESET_IMAGES.map((img) => (
                      <option key={img.label} value={img.url}>
                        Studio Asset: {img.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#33221C] mb-1">
                    Editorial Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    minLength={10}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                  />
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="accent-[#4A1C24]"
                    />
                    <span>Featured on Home</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newArrival}
                      onChange={(e) => setNewArrival(e.target.checked)}
                      className="accent-[#4A1C24]"
                    />
                    <span>"NEW" Badge</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em] hover:bg-[#5A2630]"
                >
                  {editingId ? 'UPDATE PRODUCT' : 'PUBLISH TO CATALOG'}
                </button>
              </form>
            </div>

            {/* Right: Existing Catalog Table */}
            <div className="lg:col-span-7 bg-[#FFFDFC] border border-[#B99A62]/35 p-6 space-y-4">
              <h2 className="font-serif-luxury text-2xl text-[#33221C]">
                Active Catalog ({products.length})
              </h2>
              <div className="divide-y divide-[#B99A62]/20">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-16 object-cover bg-[#2C1814] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-serif-luxury text-base font-medium text-[#33221C] truncate">
                          {item.name}
                        </p>
                        <p className="text-[#806B5E] tabular-nums">
                          {item.category} · {item.subcategory} · ₹
                          {item.price.toLocaleString('en-IN')} · Stock: {item.stock}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(item)}
                        className="p-2 border border-[#B99A62]/40 text-[#33221C] hover:bg-[#EFE2D1]"
                        aria-label="Edit product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => adminDeleteProduct(item.id)}
                        className="p-2 border border-[#B99A62]/40 text-[#5A2630] hover:bg-[#EFE2D1]"
                        aria-label="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-[#FFFDFC] border border-[#B99A62]/35 p-6 space-y-4">
            <h2 className="font-serif-luxury text-2xl text-[#33221C]">
              Customer Orders ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <p className="text-xs text-[#806B5E] py-8 text-center">
                No customer orders recorded in Firestore yet.
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 bg-[#F7F0E6] border border-[#B99A62]/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-[#33221C] tabular-nums">
                        {ord.orderNumber} · {ord.customerName} ({ord.customerPhone})
                      </p>
                      <p className="text-[#806B5E]">
                        {ord.shippingAddress}, {ord.city}, {ord.state} - {ord.pincode}
                      </p>
                      <p className="text-[#33221C] font-medium">{ord.itemSummary}</p>
                      <p className="text-[#5A2630] font-semibold tabular-nums">
                        Total: ₹{ord.totalAmount.toLocaleString('en-IN')} ·{' '}
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          adminUpdateOrderStatus(
                            ord.id,
                            e.target.value as OrderRecord['status'],
                            ord.paymentStatus
                          )
                        }
                        className="px-3 py-2 bg-[#FFFDFC] border border-[#B99A62]/50 text-xs font-medium"
                      >
                        {[
                          'Pending',
                          'Confirmed',
                          'Processing',
                          'Shipped',
                          'Out for Delivery',
                          'Delivered',
                          'Cancelled',
                          'Returned',
                        ].map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STORE ANNOUNCEMENT & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl bg-[#FFFDFC] border border-[#B99A62]/35 p-6 sm:p-8">
            <h2 className="font-serif-luxury text-2xl text-[#33221C] mb-5">
              Top Announcement Bar & Checkout Settings
            </h2>
            <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  Top Announcement Bar Text
                </label>
                <input
                  type="text"
                  required
                  minLength={5}
                  maxLength={200}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40"
                />
              </div>

              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  Complimentary Shipping Threshold (₹)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40 tabular-nums"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={codEnabled}
                  onChange={(e) => setCodEnabled(e.target.checked)}
                  className="accent-[#4A1C24]"
                />
                <span className="font-medium text-[#33221C]">
                  Enable Cash on Delivery (COD) at Checkout
                </span>
              </label>

              <button
                type="submit"
                className="px-6 py-3 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em]"
              >
                SAVE STORE SETTINGS
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
