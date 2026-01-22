import { CartItem, Vendor } from '../types';

// AI Concierge Service - Returns helpful cart analysis
// In production, this can be connected to any AI API via WordPress settings

export const analyzeCartContext = async (
  cart: CartItem[],
  vendors: Record<string, Vendor>,
  query?: string
): Promise<string> => {
  // Check if we're in WordPress with an API key configured
  const wpData = (window as any).NovaCheckoutData;
  const apiKey = wpData?.apiKey;

  if (!apiKey) {
    // Return helpful placeholder responses when AI is not configured
    if (!query) {
      const vendorCount = Object.keys(vendors).length;
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      return `Your cart has ${itemCount} item(s) from ${vendorCount} vendor(s). Each vendor will ship separately. Need help? Ask me anything!`;
    }

    // Generic helpful responses for common queries
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('shipping') || lowerQuery.includes('delivery')) {
      return 'Shipping times vary by vendor and method selected. Standard delivery is 5-7 business days, Express is 2-3 days, and Next Day Air delivers within 1 business day.';
    }
    if (lowerQuery.includes('return') || lowerQuery.includes('refund')) {
      return 'Return policies vary by vendor. Most vendors offer 30-day returns for unused items. Contact the specific vendor for their return policy.';
    }
    if (lowerQuery.includes('payment') || lowerQuery.includes('pay')) {
      return 'We accept all major credit cards and PayPal. Your payment is securely processed and encrypted.';
    }

    return 'I\'m here to help with your checkout! Ask me about shipping, returns, or any other questions.';
  }

  // If API key is configured, you can add AI integration here
  // For now, return helpful message
  return 'AI Assistant is ready to help! Ask me anything about your order.';
};