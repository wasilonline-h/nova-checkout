import React from 'react';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { CartItem, ShippingOption } from '../types';
import { SHIPPING_OPTIONS } from '../constants';

interface Props {
  cart: CartItem[];
  shippingSelections: Record<string, string>;
  step: number;
  onNext: () => void;
  onBack: () => void;
}

export const SummarySidebar: React.FC<Props> = ({ cart, shippingSelections, step, onNext, onBack }) => {
  
  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const shippingTotal = Object.entries(shippingSelections).reduce((sum, [vendorId, optionId]) => {
    // Only count shipping if the vendor has items in cart (basic check)
    // In a real app, we'd ensure mapping is strict.
    const option = SHIPPING_OPTIONS.find(o => o.id === optionId);
    return sum + (option?.price || 0);
  }, 0);

  const tax = subtotal * 0.08; // Mock 8% tax
  const total = subtotal + shippingTotal + tax;

  return (
    <div className="sticky top-8 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          Order Summary
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-slate-600 text-sm">
            <span>Subtotal ({cart.length} items)</span>
            <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600 text-sm">
            <span>Shipping</span>
            <span className="font-medium text-slate-900">
               {step < 2 && shippingTotal === 0 ? 'Calculated next step' : `$${shippingTotal.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-slate-600 text-sm">
            <span>Estimated Tax</span>
            <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 mb-6">
          <div className="flex justify-between items-end">
            <span className="font-bold text-slate-800 text-lg">Total</span>
            <span className="font-bold text-indigo-600 text-2xl">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onNext}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            {step === 3 ? 'Pay & Place Order' : 'Continue to Next Step'}
            {step === 3 ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
          
          {step > 0 && (
            <button 
              onClick={onBack}
              className="w-full bg-white text-slate-500 hover:text-slate-800 py-2.5 rounded-xl text-sm font-medium transition"
            >
              Return to previous step
            </button>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Mock Trust Badges */}
           <div className="h-6 w-10 bg-slate-200 rounded"></div>
           <div className="h-6 w-10 bg-slate-200 rounded"></div>
           <div className="h-6 w-10 bg-slate-200 rounded"></div>
           <div className="h-6 w-10 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Dokan/Marketplace Info */}
      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-2">Marketplace Guarantee</h4>
        <p className="text-xs text-indigo-800 leading-relaxed">
          Your order contains items from multiple vendors. You will receive separate packages. All transactions are secured by Nova Protection.
        </p>
      </div>
    </div>
  );
};
