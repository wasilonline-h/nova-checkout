import React from 'react';
import { CreditCard, Wallet, Banknote, ShieldCheck } from 'lucide-react';
import { PaymentGateway } from '../../types';

interface Props {
  gateways: PaymentGateway[];
  selectedMethod: string;
  onSelect: (id: string) => void;
}

export const PaymentStep: React.FC<Props> = ({ gateways, selectedMethod, onSelect }) => {

  if (gateways.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">No payment methods available. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Payment Method</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Method Selector */}
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {gateways.map(gateway => (
            <button
              key={gateway.id}
              onClick={() => onSelect(gateway.id)}
              className={`flex-1 min-w-[120px] py-4 px-4 font-medium text-sm flex flex-col md:flex-row items-center justify-center gap-2 transition ${selectedMethod === gateway.id
                  ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
            >
              {/* Icon Logic based on ID or fallback */}
              {gateway.id === 'cod' ? <Banknote className="w-4 h-4" /> :
                gateway.id.includes('card') || gateway.id === 'stripe' ? <CreditCard className="w-4 h-4" /> :
                  <Wallet className="w-4 h-4" />
              }
              <span>{gateway.title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start gap-3 mb-6">
            <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-indigo-900">Secure Payment</h4>
              <p className="text-xs text-indigo-700 mt-0.5">
                Transactions are secured and encrypted. You will be paying via {gateways.find(g => g.id === selectedMethod)?.title}.
              </p>
            </div>
          </div>

          <div className="text-center py-4">
            <p className="text-slate-600 mb-4">{gateways.find(g => g.id === selectedMethod)?.description}</p>

            {selectedMethod === 'cod' && (
              <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-lg border border-yellow-100 inline-block">
                Pay cash when your order is delivered to your doorstep.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

