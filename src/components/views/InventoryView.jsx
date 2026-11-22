import React, { useState } from 'react';
import {
  PackageCheck,
  Plus,
  Boxes,
  AlertTriangle,
  Download,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { exportToCSV } from '../../utils/exportUtils';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const InventoryView = ({ onOpenAddExpense }) => {
  const {
    inventory,
    packages,
    getProductStock,
    addProduct,
    updateProduct,
    deleteProduct,
    addPackage,
    updatePackage,
    deletePackage
  } = useCharity();

  // Active sub-tab: 'products' | 'packages'
  const [activeTab, setActiveTab] = useState('products');

  // Product modal
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState(null);
  const [prodToDelete, setProdToDelete] = useState(null);

  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Grains & Pulses');
  const [prodUnit, setProdUnit] = useState('kg');
  const [prodQtyPurchased, setProdQtyPurchased] = useState('0');
  const [prodQtyDonated, setProdQtyDonated] = useState('0');
  const [prodUnitCost, setProdUnitCost] = useState('100');
  const [prodMinAlert, setProdMinAlert] = useState('20');
  const [prodNotes, setProdNotes] = useState('');

  // Package modal
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [pkgToDelete, setPkgToDelete] = useState(null);

  const [pkgName, setPkgName] = useState('');
  const [pkgBanglaName, setPkgBanglaName] = useState('');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgItems, setPkgItems] = useState([
    { productId: inventory[0]?.id || '', quantity: 1 }
  ]);

  // Open Product Modal
  const openAddProductModal = () => {
    setEditingProd(null);
    setProdName('');
    setProdCategory('Grains & Pulses');
    setProdUnit('kg');
    setProdQtyPurchased('0');
    setProdQtyDonated('0');
    setProdUnitCost('100');
    setProdMinAlert('20');
    setProdNotes('');
    setIsProdModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProd(prod);
    setProdName(prod.name);
    setProdCategory(prod.category || 'Grains & Pulses');
    setProdUnit(prod.unit || 'kg');
    setProdQtyPurchased(String(prod.qtyPurchased || 0));
    setProdQtyDonated(String(prod.qtyDonated || 0));
    setProdUnitCost(String(prod.unitCost || 0));
    setProdMinAlert(String(prod.minAlertStock || 20));
    setProdNotes(prod.notes || '');
    setIsProdModalOpen(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const data = {
      name: prodName.trim(),
      category: prodCategory,
      unit: prodUnit,
      qtyPurchased: Number(prodQtyPurchased) || 0,
      qtyDonated: Number(prodQtyDonated) || 0,
      unitCost: Number(prodUnitCost) || 0,
      minAlertStock: Number(prodMinAlert) || 10,
      notes: prodNotes.trim()
    };

    if (editingProd) {
      updateProduct({ ...editingProd, ...data });
    } else {
      addProduct(data);
    }
    setIsProdModalOpen(false);
  };

  // Open Package Modal
  const openAddPkgModal = () => {
    setEditingPkg(null);
    setPkgName('Ramadan Special Relief Box');
    setPkgBanglaName('রমজান বিশেষ উপহার বক্স');
    setPkgDescription('Assorted family relief items for 10-15 days.');
    setPkgItems(
      inventory.slice(0, 4).map(p => ({
        productId: p.id,
        quantity: 1
      }))
    );
    setIsPkgModalOpen(true);
  };

  const openEditPkgModal = (pkg) => {
    setEditingPkg(pkg);
    setPkgName(pkg.name);
    setPkgBanglaName(pkg.banglaName || '');
    setPkgDescription(pkg.description || '');
    setPkgItems(pkg.items.map(i => ({ productId: i.productId, quantity: i.quantity })));
    setIsPkgModalOpen(true);
  };

  const handlePkgSubmit = (e) => {
    e.preventDefault();
    if (!pkgName.trim()) return;

    const formattedItems = pkgItems
      .filter(i => i.productId && Number(i.quantity) > 0)
      .map(i => {
        const prod = inventory.find(p => p.id === i.productId);
        return {
          productId: i.productId,
          productName: prod?.name || 'Item',
          quantity: Number(i.quantity),
          unit: prod?.unit || 'unit'
        };
      });

    if (formattedItems.length === 0) {
      alert('Please include at least one valid item in the package bundle.');
      return;
    }

    const payload = {
      name: pkgName.trim(),
      banglaName: pkgBanglaName.trim(),
      description: pkgDescription.trim(),
      items: formattedItems
    };

    if (editingPkg) {
      updatePackage({ ...editingPkg, ...payload });
    } else {
      addPackage(payload);
    }
    setIsPkgModalOpen(false);
  };

  // Export Inventory CSV
  const handleExportCSV = () => {
    const data = inventory.map(item => {
      const stock = getProductStock(item.id);
      return {
        'Product Name': item.name,
        'Category': item.category,
        'Unit': item.unit,
        'Qty Purchased': item.qtyPurchased,
        'Qty Donated': item.qtyDonated,
        'Qty Distributed': item.qtyDistributed,
        'Available Stock': stock,
        'Unit Cost (BDT)': item.unitCost,
        'Estimated Asset Value (BDT)': stock * (item.unitCost || 0),
        'Low Stock Threshold': item.minAlertStock,
        'Notes': item.notes || ''
      };
    });

    exportToCSV(data, `ekmutho_hashi_inventory_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Total inventory estimated market value
  const totalStockValue = inventory.reduce((sum, item) => {
    const stock = getProductStock(item.id);
    return sum + (stock * (Number(item.unitCost) || 0));
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Relief Stock & Package Builder
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {inventory.length} Stock Products
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ছোলা, খেজুর, তেল ও চালের স্টক পর্যবেক্ষণ এবং সমন্বিত ইফতার বক্স তৈরি
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Stock CSV</span>
          </button>

          {activeTab === 'products' ? (
            <button
              type="button"
              onClick={openAddProductModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Product</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={openAddPkgModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Build New Package</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher: Products Stock vs Package Bundles */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`pb-3 font-bold text-sm transition relative flex items-center gap-2 ${
              activeTab === 'products'
                ? 'text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Warehouse Stock ({inventory.length} Items)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('packages')}
            className={`pb-3 font-bold text-sm transition relative flex items-center gap-2 ${
              activeTab === 'packages'
                ? 'text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Relief Package Bundles ({packages.length} Pre-built)</span>
          </button>
        </div>

        <div className="pb-3 text-xs text-slate-500 hidden sm:block">
          Total Warehouse Asset Value: <strong className="text-emerald-700 font-mono">{formatCurrency(totalStockValue)}</strong>
        </div>
      </div>

      {/* Tab 1: Products Stock Table */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Item Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4 text-center">Purchased</th>
                    <th className="py-3.5 px-4 text-center">Donated</th>
                    <th className="py-3.5 px-4 text-center">Distributed</th>
                    <th className="py-3.5 px-4 text-center">Remaining Stock</th>
                    <th className="py-3.5 px-4">Unit Cost</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {inventory.map((item) => {
                    const remaining = getProductStock(item.id);
                    const isLow = remaining <= (item.minAlertStock || 15);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{item.name}</span>
                          <span className="text-[11px] text-slate-400 italic">
                            {item.notes || 'Warehouse storage'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {item.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono">
                          {formatNumber(item.qtyPurchased)} {item.unit}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono">
                          {formatNumber(item.qtyDonated)} {item.unit}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                          {formatNumber(item.qtyDistributed)} {item.unit}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black font-mono ${
                              remaining <= 0
                                ? 'bg-rose-100 text-rose-800'
                                : isLow
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isLow && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                            {remaining} {item.unit}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                          {formatCurrency(item.unitCost)} / {item.unit}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditProductModal(item)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                              title="Edit item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setProdToDelete(item)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Package Bundles Grid */}
      {activeTab === 'packages' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {packages.map((pkg) => {
              // Calculate estimated total cost of package
              const totalCost = pkg.items.reduce((sum, item) => {
                const prod = inventory.find(p => p.id === item.productId);
                return sum + ((Number(item.quantity) || 0) * (Number(prod?.unitCost) || 0));
              }, 0);

              // Calculate how many packages can be prepared right now based on stock
              let maxPossiblePackages = 99999;
              pkg.items.forEach(item => {
                const stock = getProductStock(item.productId);
                const possible = Math.floor(stock / (Number(item.quantity) || 1));
                if (possible < maxPossiblePackages) {
                  maxPossiblePackages = possible;
                }
              });
              if (maxPossiblePackages === 99999) maxPossiblePackages = 0;

              return (
                <div
                  key={pkg.id}
                  className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                        <PackageCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                          {pkg.name}
                        </h3>
                        {pkg.banglaName && (
                          <p className="text-xs text-amber-600 font-semibold">{pkg.banglaName}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditPkgModal(pkg)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {packages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setPkgToDelete(pkg)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {pkg.description || 'Standard relief bundle for needy households.'}
                  </p>

                  {/* Included Items Formula */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Included Relief Items Formula:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {pkg.items.map((item, idx) => {
                        const stock = getProductStock(item.productId);
                        return (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between"
                          >
                            <span className="font-semibold text-slate-800">
                              {item.quantity} {item.unit} {item.productName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({stock} {item.unit} avl)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Calculated Box Cost
                      </span>
                      <span className="text-base font-black text-emerald-700 font-mono">
                        {formatCurrency(totalCost)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Available to Dispatch Now
                      </span>
                      <span
                        className={`text-base font-black font-mono ${
                          maxPossiblePackages > 0 ? 'text-teal-700' : 'text-rose-600'
                        }`}
                      >
                        {maxPossiblePackages} Complete Boxes
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Modal (Add / Edit) */}
      <Modal
        isOpen={isProdModalOpen}
        onClose={() => setIsProdModalOpen(false)}
        title={editingProd ? 'Edit Inventory Item' : 'Add Relief Product to Stock'}
        subtitle="পণ্য তথ্য, ইউনিট ও হোলসেল ক্রয়মূল্য নির্ধারণ"
      >
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              placeholder="e.g. Chola / Chickpeas (ছোলা)"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="Grains & Pulses">Grains & Pulses (ডাল, চাল, ছোলা)</option>
                <option value="Dates & Sweets">Dates & Sweets (খেজুর, চিনি, সেমাই)</option>
                <option value="Oil & Spices">Oil & Spices (তেল, মশলা)</option>
                <option value="Dry Food">Dry Food (মুড়ি, বিস্কুট)</option>
                <option value="Essentials">General Essentials (সাবান, বস্ত্র)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Unit of Measure
              </label>
              <select
                value={prodUnit}
                onChange={(e) => setProdUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="kg">kg (কিলোগ্রাম)</option>
                <option value="liter">liter (লিটার)</option>
                <option value="pack">pack (প্যাকেট)</option>
                <option value="piece">piece (পিস / সংখ্যা)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Qty Purchased
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={prodQtyPurchased}
                onChange={(e) => setProdQtyPurchased(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Qty Donated
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={prodQtyDonated}
                onChange={(e) => setProdQtyDonated(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Unit Cost (৳ Taka)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={prodUnitCost}
                onChange={(e) => setProdUnitCost(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Low Stock Alert Threshold ({prodUnit})
            </label>
            <input
              type="number"
              min="1"
              value={prodMinAlert}
              onChange={(e) => setProdMinAlert(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Source / Wholesale Market Notes
            </label>
            <input
              type="text"
              value={prodNotes}
              onChange={(e) => setProdNotes(e.target.value)}
              placeholder="e.g. Moulvibazar wholesale market sack"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsProdModalOpen(false)}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition"
            >
              {editingProd ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Package Builder Modal */}
      <Modal
        isOpen={isPkgModalOpen}
        onClose={() => setIsPkgModalOpen(false)}
        title={editingPkg ? 'Edit Relief Package' : 'Relief Package / Bundle Builder'}
        subtitle="মানসম্মত ইফতার বক্স বা খাদ্য প্যাকেটের ফর্মুলা নির্ধারণ"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handlePkgSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Package Name *
              </label>
              <input
                type="text"
                value={pkgName}
                onChange={(e) => setPkgName(e.target.value)}
                placeholder="e.g. 1 Standard Ramadan Iftar Box"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bangla Name (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={pkgBanglaName}
                onChange={(e) => setPkgBanglaName(e.target.value)}
                placeholder="e.g. ১টি আদর্শ রমজান ইফতার বক্স"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={pkgDescription}
              onChange={(e) => setPkgDescription(e.target.value)}
              placeholder="e.g. 2kg Chola + 1kg Khejur + 1L Oil + 1kg Sugar + 1kg Muri for family"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Items Formula Builder */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Included Items in 1 Box:
              </span>
              <button
                type="button"
                onClick={() => setPkgItems([...pkgItems, { productId: inventory[0]?.id || '', quantity: 1 }])}
                className="text-xs font-bold text-amber-800 hover:text-amber-900"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-2">
              {pkgItems.map((item, idx) => {
                const prod = inventory.find(p => p.id === item.productId);
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={item.productId}
                      onChange={(e) => {
                        const updated = [...pkgItems];
                        updated[idx].productId = e.target.value;
                        setPkgItems(updated);
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      {inventory.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.unit})
                        </option>
                      ))}
                    </select>

                    <div className="w-28 relative">
                      <input
                        type="number"
                        min="0.25"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => {
                          const updated = [...pkgItems];
                          updated[idx].quantity = e.target.value;
                          setPkgItems(updated);
                        }}
                        className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 bg-white text-right pr-7"
                        placeholder="Qty"
                        required
                      />
                      <span className="absolute right-2 top-2 text-[10px] text-slate-400">
                        {prod?.unit || ''}
                      </span>
                    </div>

                    {pkgItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPkgItems(pkgItems.filter((_, i) => i !== idx))}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPkgModalOpen(false)}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition"
            >
              {editingPkg ? 'Save Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Product Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(prodToDelete)}
        onClose={() => setProdToDelete(null)}
        onConfirm={() => {
          if (prodToDelete) deleteProduct(prodToDelete.id);
        }}
        title={`Remove "${prodToDelete?.name}"?`}
        message="Are you sure you want to delete this inventory item? Ensure no packages are referencing it."
        confirmText="Yes, Remove Product"
        isDestructive={true}
      />

      {/* Delete Package Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(pkgToDelete)}
        onClose={() => setPkgToDelete(null)}
        onConfirm={() => {
          if (pkgToDelete) deletePackage(pkgToDelete.id);
        }}
        title={`Delete "${pkgToDelete?.name}"?`}
        message="Are you sure you want to delete this package template?"
        confirmText="Yes, Delete Package"
        isDestructive={true}
      />
    </div>
  );
};
