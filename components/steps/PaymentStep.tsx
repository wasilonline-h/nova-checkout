import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck } from 'lucide-react';

export const PaymentStep: React.FC = () => {
  const [method, setMethod] = useState<'card' | 'paypal'>('card');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Payment</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Method Selector */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setMethod('card')}
            className={`flex-1 py-4 font-medium text-sm flex items-center justify-center gap-2 transition ${
              method === 'card' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Credit Card
          </button>
          <button 
             onClick={() => setMethod('paypal')}
             className={`flex-1 py-4 font-medium text-sm flex items-center justify-center gap-2 transition ${
              method === 'paypal' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className="italic font-bold">PayPal</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {method === 'card' ? (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-indigo-900">Secure Encrypted Transaction</h4>
                  <p className="text-xs text-indigo-700 mt-0.5">Your financial data is never stored on our servers. Processed via Stripe.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Card Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition font-mono"
                      placeholder="0000 0000 0000 0000"
                    />
                    <CreditCard className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Expiration Date</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition font-mono"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">CVC</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition font-mono"
                        placeholder="123"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Cardholder Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
                    placeholder="Full Name on Card"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="font-bold italic text-xl">P</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Pay with PayPal</h3>
              <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">You will be redirected to PayPal to complete your purchase securely.</p>
              <button className="mt-6 bg-[#0070BA] text-white px-8 py-3 rounded-full font-medium hover:bg-[#003087] transition shadow-lg shadow-blue-200">
                Proceed to PayPal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
