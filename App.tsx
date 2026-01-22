import React, { useState } from 'react';
import { CheckoutStep, CartItem, UserDetails, CheckoutState } from './types';
import { VENDORS, INITIAL_CART, INITIAL_USER_DETAILS, SHIPPING_OPTIONS } from './constants';
import { CartView } from './components/steps/CartView';
import { DetailsForm } from './components/steps/DetailsForm';
import { ShippingSelection } from './components/steps/ShippingSelection';
import { PaymentStep } from './components/steps/PaymentStep';
import { SummarySidebar } from './components/SummarySidebar';
import { GeminiConcierge } from './components/GeminiConcierge';
import { CheckCircle2, ChevronRight, Package, Truck, CreditCard, PartyPopper, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<CheckoutState>({
    step: CheckoutStep.CART,
    cart: INITIAL_CART,
    details: INITIAL_USER_DETAILS,
    shippingSelection: {} // Initialize empty
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = async () => {
    if (state.step === CheckoutStep.CART && state.cart.length === 0) return;
    
    // Auto-select default shipping if not selected when moving to shipping step
    if (state.step === CheckoutStep.DETAILS) {
       const uniqueVendors = Array.from(new Set(state.cart.map(i => i.vendorId)));
       const newSelections = { ...state.shippingSelection };
       uniqueVendors.forEach(vid => {
         if (!newSelections[vid]) newSelections[vid] = SHIPPING_OPTIONS[0].id;
       });
       setState(prev => ({ ...prev, shippingSelection: newSelections, step: prev.step + 1 }));
       return;
    }

    if (state.step < CheckoutStep.PAYMENT) {
      setState(prev => ({ ...prev, step: prev.step + 1 }));
    } else {
      // Fake processing delay
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
      setIsSuccess(true);
    }
  };

  const handleBack = () => {
    if (state.step > CheckoutStep.CART) {
      setState(prev => ({ ...prev, step: prev.step - 1 }));
    }
  };

  // Cart Actions
  const updateQuantity = (id: string, delta: number) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(item => {
        if (item.id === id) {
          const newQ = item.quantity + delta;
          return newQ > 0 ? { ...item, quantity: newQ } : item;
        }
        return item;
      })
    }));
  };

  const removeItem = (id: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.id !== id)
    }));
  };

  const updateDetails = (field: keyof UserDetails, value: string | boolean) => {
    setState(prev => ({
      ...prev,
      details: { ...prev.details, [field]: value }
    }));
  };

  const updateShipping = (vendorId: string, optionId: string) => {
    setState(prev => ({
      ...prev,
      shippingSelection: { ...prev.shippingSelection, [vendorId]: optionId }
    }));
  };

  const steps = [
    { id: CheckoutStep.CART, label: 'Cart', icon: Package },
    { id: CheckoutStep.DETAILS, label: 'Details', icon: CheckCircle2 },
    { id: CheckoutStep.SHIPPING, label: 'Shipping', icon: Truck },
    { id: CheckoutStep.PAYMENT, label: 'Payment', icon: CreditCard },
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500 border border-slate-100 relative overflow-hidden">
          {/* Confetti Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-10 h-10 animate-bounce" />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Order Confirmed!</h2>
          <p className="text-slate-500 mb-8">
            Thank you for your purchase. Your order <span className="font-mono font-medium text-slate-800">#NOVA-8829</span> has been placed successfully.
          </p>

          <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border border-slate-100">
             <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
               <ShoppingBag className="w-4 h-4" /> Order Details
             </h3>
             <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex justify-between">
                  <span>Confirmation sent to:</span>
                  <span className="font-medium text-slate-900">{state.details.email || 'guest@example.com'}</span>
                </li>
                <li className="flex justify-between">
                  <span>Estimated Delivery:</span>
                  <span className="font-medium text-slate-900">3-5 Business Days</span>
                </li>
             </ul>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Nova Checkout</span>
          </div>
          <div className="text-sm text-slate-500 hidden md:block">
            Secure SSL Encryption
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Progress Bar */}
        <div className="mb-10 md:mb-16">
           <div className="flex items-center justify-between max-w-4xl mx-auto relative">
              {/* Connector Lines */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-indigo-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                style={{ width: `${(state.step / (steps.length - 1)) * 100}%` }}
              ></div>

              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isActive = idx <= state.step;
                const isCurrent = idx === state.step;
                
                return (
                  <div key={s.id} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                      isActive 
                        ? 'bg-indigo-600 border-indigo-100 text-white shadow-lg shadow-indigo-500/20 scale-110' 
                        : 'bg-white border-slate-200 text-slate-300'
                    }`}>
                      <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <span className={`text-xs md:text-sm font-medium transition-colors ${
                      isCurrent ? 'text-indigo-700' : isActive ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Loading Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
              <div className="flex flex-col items-center gap-3">
                 <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                 <span className="font-semibold text-indigo-900">Processing Secure Payment...</span>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {state.step === CheckoutStep.CART && (
              <CartView 
                cart={state.cart} 
                vendors={VENDORS} 
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            )}
            
            {state.step === CheckoutStep.DETAILS && (
              <DetailsForm 
                details={state.details} 
                updateDetails={updateDetails} 
              />
            )}
            
            {state.step === CheckoutStep.SHIPPING && (
              <ShippingSelection 
                cart={state.cart}
                vendors={VENDORS}
                selections={state.shippingSelection}
                onSelect={updateShipping}
              />
            )}
            
            {state.step === CheckoutStep.PAYMENT && (
              <PaymentStep />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
             <SummarySidebar 
               cart={state.cart} 
               shippingSelections={state.shippingSelection}
               step={state.step}
               onNext={handleNext}
               onBack={handleBack}
             />
          </div>
        </div>
      </main>

      {/* AI Assistant */}
      <GeminiConcierge cart={state.cart} vendors={VENDORS} />
    </div>
  );
};

export default App;