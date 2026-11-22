import React, { useState } from 'react';
import { TrendingDown, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCharity } from '../../context/CharityContext';
import { Modal } from '../common/Modal';

export const AddExpenseModal = ({ isOpen, onClose }) => {
  const { campaigns, inventory, addExpense, selectedCampaign } = useCharity();

  const [campaignId, setCampaignId] = useState(
    selectedCampaign !== 'all' ? selectedCampaign : (campaigns[0]?.id || '')
  );
  const [expenseType, setExpenseType] = useState('Market Purchase');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Hand Cash');
  const [handledBy, setHandledBy] = useState('Volunteer Team');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [addToInventory, setAddToInventory] = useState(true);

  // Purchased items list for Market Purchase
  const [purchasedItems, setPurchasedItems] = useState([
    { productId: inventory[0]?.id || '', quantity: '', unitCost: inventory[0]?.unitCost || 0 }
  ]);

  const handleAddItemRow = () => {
    const firstProd = inventory[0];
    setPurchasedItems([
      ...purchasedItems,
      { productId: firstProd?.id || '', quantity: '', unitCost: firstProd?.unitCost || 0 }
    ]);
  };

  const handleRemoveItemRow = (index) => {
    const updated = purchasedItems.filter((_, idx) => idx !== index);
    setPurchasedItems(updated);
    recalcTotal(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...purchasedItems];
    updated[index][field] = value;

    if (field === 'productId') {
      const prod = inventory.find(p => p.id === value);
      if (prod) {
        updated[index].unitCost = prod.unitCost;
      }
    }

    setPurchasedItems(updated);
    recalcTotal(updated);
  };

  const recalcTotal = (itemsList) => {
    if (expenseType === 'Market Purchase') {
      const total = itemsList.reduce((sum, item) => {
        const q = Number(item.quantity) || 0;
        const c = Number(item.unitCost) || 0;
        return sum + (q * c);
      }, 0);
      if (total > 0) {
        setAmount(total);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalAmount = Number(amount);
    if (!finalAmount || finalAmount <= 0) {
      alert('Please enter a valid expense amount.');
      return;
    }

    let itemsPayload = [];
    if (expenseType === 'Market Purchase' && purchasedItems.length > 0) {
      itemsPayload = purchasedItems
        .filter(i => Number(i.quantity) > 0 && i.productId)
        .map(i => {
          const prod = inventory.find(p => p.id === i.productId);
          const q = Number(i.quantity);
          const c = Number(i.unitCost) || (prod?.unitCost || 0);
          return {
            productId: i.productId,
            productName: prod?.name || 'Item',
            quantity: q,
            unit: prod?.unit || 'unit',
            unitCost: c,
            subtotal: q * c
          };
        });
    }

    addExpense({
      campaignId,
      type: expenseType,
      category: expenseType === 'Market Purchase' ? 'Relief Food Stock' : 'Logistics',
      amount: finalAmount,
      paymentMethod,
      handledBy: handledBy.trim() || 'Volunteer Team',
      date,
      note: note.trim(),
      items: itemsPayload,
      addToInventory: expenseType === 'Market Purchase' && addToInventory
    });

    // Reset form
    setAmount('');
    setNote('');
    setPurchasedItems([{ productId: inventory[0]?.id || '', quantity: '', unitCost: inventory[0]?.unitCost || 0 }]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Expense / Market Purchase"
      subtitle="বাজার খরচ, পরিবহন বা প্যাকেজিং ব্যয় অন্তর্ভুক্তি"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campaign & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Campaign / Drive *
            </label>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
              required
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Expense Category *
            </label>
            <select
              value={expenseType}
              onChange={(e) => setExpenseType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
            >
              <option value="Market Purchase">Market Wholesale Purchase (ত্রাণ পণ্য ক্রয়)</option>
              <option value="Transport & Logistics">Transport & Logistics (ভ্যান / পরিবহন ভাড়া)</option>
              <option value="Packaging & Printing">Packaging & Printing (ব্যাগ ও টোকেন খরচ)</option>
              <option value="Direct Cash Aid">Direct Family Cash Aid (নগদ আর্থিক সহায়তা)</option>
              <option value="Miscellaneous">Miscellaneous (অন্যান্য অনুষঙ্গিক খরচ)</option>
            </select>
          </div>
        </div>

        {/* If Market Purchase: Itemized Purchase Table with Auto Stock Increment */}
        {expenseType === 'Market Purchase' && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Wholesale Items Purchased
                </span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-emerald-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addToInventory}
                  onChange={(e) => setAddToInventory(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Automatically add quantities to Stock</span>
              </label>
            </div>

            <div className="space-y-2">
              {purchasedItems.map((item, idx) => {
                const prod = inventory.find(p => p.id === item.productId);
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      required
                    >
                      {inventory.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.unit})
                        </option>
                      ))}
                    </select>

                    <div className="w-24 relative">
                      <input
                        type="number"
                        min="1"
                        step="any"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-right pr-6"
                        required
                      />
                      <span className="absolute right-1.5 top-2 text-[10px] text-slate-400">
                        {prod?.unit || ''}
                      </span>
                    </div>

                    <div className="w-24 relative">
                      <input
                        type="number"
                        placeholder="Unit Cost"
                        value={item.unitCost}
                        onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                        className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-right"
                      />
                      <span className="absolute left-1.5 top-2 text-[10px] text-slate-400">৳</span>
                    </div>

                    {purchasedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAddItemRow}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Another Item</span>
            </button>
          </div>
        )}

        {/* Amount & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Total Amount (৳ Taka) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">৳</span>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full pl-8 pr-3.5 py-2.5 text-base font-bold text-slate-900 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Paid Via *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
            >
              <option value="Hand Cash">Hand Cash (হাতে নগদ)</option>
              <option value="bKash">bKash (বিকাশ)</option>
              <option value="Nagad">Nagad (নগদ)</option>
              <option value="Bank Transfer">Bank Transfer (ব্যাংক)</option>
            </select>
          </div>
        </div>

        {/* Handled by & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Handled By (Volunteer Name) *
            </label>
            <input
              type="text"
              value={handledBy}
              onChange={(e) => setHandledBy(e.target.value)}
              placeholder="e.g. Tanvir Ahmed, Rafiqul Islam"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Memo / Bill Voucher Note
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Moulvibazar wholesale memo #4829, 3 bags load"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <TrendingDown className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
