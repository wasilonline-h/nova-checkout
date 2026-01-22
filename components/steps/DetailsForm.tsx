import React from 'react';
import { UserDetails } from '../../types';

interface Props {
  details: UserDetails;
  updateDetails: (field: keyof UserDetails, value: string | boolean) => void;
}

export const DetailsForm: React.FC<Props> = ({ details, updateDetails }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Shipping Details</h2>
      
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">First Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
              value={details.firstName}
              onChange={(e) => updateDetails('firstName', e.target.value)}
              placeholder="e.g. John"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Last Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
              value={details.lastName}
              onChange={(e) => updateDetails('lastName', e.target.value)}
              placeholder="e.g. Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email Address</label>
          <input 
            type="email" 
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
            value={details.email}
            onChange={(e) => updateDetails('email', e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Street Address</label>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
            value={details.address}
            onChange={(e) => updateDetails('address', e.target.value)}
            placeholder="123 Main St, Apt 4B"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-sm font-medium text-slate-700">City</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
              value={details.city}
              onChange={(e) => updateDetails('city', e.target.value)}
              placeholder="New York"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">State / Region</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
              placeholder="NY"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Postal Code</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
              value={details.zip}
              onChange={(e) => updateDetails('zip', e.target.value)}
              placeholder="10001"
            />
          </div>
        </div>

        {/* Billing Toggle & Form */}
        <div className="pt-6 border-t border-slate-100 mt-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 mb-4">
            <label htmlFor="billing-toggle" className="text-sm font-medium text-slate-700 select-none cursor-pointer flex-1">
              Billing address is same as shipping
            </label>
            
            {/* Modern Toggle Switch */}
            <button
              id="billing-toggle"
              role="switch"
              aria-checked={details.billingSameAsShipping}
              onClick={() => updateDetails('billingSameAsShipping', !details.billingSameAsShipping)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                details.billingSameAsShipping ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  details.billingSameAsShipping ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {!details.billingSameAsShipping && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 pt-2 bg-slate-50/50 p-6 rounded-lg border border-slate-100 border-dashed">
              <div className="flex items-center gap-2 mb-2">
                 <div className="h-px bg-slate-200 flex-1"></div>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Billing Address</span>
                 <div className="h-px bg-slate-200 flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition bg-white"
                    value={details.billingFirstName}
                    onChange={(e) => updateDetails('billingFirstName', e.target.value)}
                    placeholder="e.g. John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition bg-white"
                    value={details.billingLastName}
                    onChange={(e) => updateDetails('billingLastName', e.target.value)}
                    placeholder="e.g. Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Street Address</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition bg-white"
                  value={details.billingAddress}
                  onChange={(e) => updateDetails('billingAddress', e.target.value)}
                  placeholder="123 Billing St"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-medium text-slate-700">City</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition bg-white"
                    value={details.billingCity}
                    onChange={(e) => updateDetails('billingCity', e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">State / Region</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition bg-white"
                    placeholder="NY"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Postal Code</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition bg-white"
                    value={details.billingZip}
                    onChange={(e) => updateDetails('billingZip', e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};