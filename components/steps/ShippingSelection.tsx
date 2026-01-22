import React from 'react';
import { Truck, Package, Clock } from 'lucide-react';
import { CartItem, ShippingOption, Vendor } from '../../types';
import { SHIPPING_OPTIONS } from '../../constants';

interface Props {
  cart: CartItem[];
  vendors: Record<string, Vendor>;
  selections: Record<string, string>;
  onSelect: (vendorId: string, optionId: string) => void;
}

export const ShippingSelection: React.FC<Props> = ({ cart, vendors, selections, onSelect }) => {
  // Group unique vendor IDs from cart
  const uniqueVendorIds = Array.from(new Set(cart.map(item => item.vendorId)));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Delivery Options</h2>
      
      <div className="space-y-6">
        {uniqueVendorIds.map(vendorId => {
          const vendor = vendors[vendorId];
          const selectedOption = selections[vendorId] || SHIPPING_OPTIONS[0].id;
          
          return (
            <div key={vendorId} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-full bg-slate-100 p-1">
                   <img src={vendor?.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                 </div>
                 <h3 className="font-semibold text-slate-900">Shipment from {vendor?.name}</h3>
              </div>

              <div className="space-y-3">
                {SHIPPING_OPTIONS.map(option => (
                  <label 
                    key={option.id}
                    className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedOption === option.id 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={`shipping-${vendorId}`} 
                      className="sr-only"
                      checked={selectedOption === option.id}
                      onChange={() => onSelect(vendorId, option.id)}
                    />
                    <div className="mr-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedOption === option.id ? 'border-indigo-600' : 'border-slate-300'
                      }`}>
                        {selectedOption === option.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${selectedOption === option.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                          {option.name}
                        </span>
                        <span className="font-bold text-slate-900">
                          {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" />
                          {option.id === 'express' ? 'FedEx' : option.id === 'overnight' ? 'DHL' : 'USPS'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {option.duration}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
