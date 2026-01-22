import React from 'react';
import { Minus, Plus, Trash2, Store } from 'lucide-react';
import { CartItem, Vendor } from '../../types';

interface Props {
  cart: CartItem[];
  vendors: Record<string, Vendor>;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
}

export const CartView: React.FC<Props> = ({ cart, vendors, updateQuantity, removeItem }) => {
  // Group items by vendor
  const groupedItems = cart.reduce((acc, item) => {
    if (!acc[item.vendorId]) acc[item.vendorId] = [];
    acc[item.vendorId].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-slate-700">Your cart is empty</h3>
        <p className="text-slate-500 mt-2">Looks like you haven't added any products yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Shopping Cart</h2>
      
      {Object.entries(groupedItems).map(([vendorId, items]) => {
        const vendor = vendors[vendorId];
        return (
          <div key={vendorId} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Vendor Header */}
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                   <img src={vendor?.avatar} alt={vendor?.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    {vendor?.name || 'Unknown Vendor'}
                    <span className="text-xs font-normal bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Dokan Verified</span>
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    <span>Vendor Rating: {vendor?.rating} / 5.0</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Package {Object.keys(groupedItems).indexOf(vendorId) + 1} of {Object.keys(groupedItems).length}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex gap-4 md:gap-6 group">
                  <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                    </div>
                    <div className="text-lg font-semibold text-slate-900 mt-2">${item.price.toFixed(2)}</div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-indigo-600 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-indigo-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
