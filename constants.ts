import { CartItem, ShippingOption, Vendor } from './types';

export const VENDORS: Record<string, Vendor> = {
  'v1': {
    id: 'v1',
    name: 'TechHub Solutions',
    rating: 4.8,
    avatar: 'https://picsum.photos/id/4/50/50'
  },
  'v2': {
    id: 'v2',
    name: 'Urban Threads',
    rating: 4.5,
    avatar: 'https://picsum.photos/id/64/50/50'
  }
};

export const INITIAL_CART: CartItem[] = [
  {
    id: 'p1',
    title: 'Pro Mirrorless Camera Kit',
    price: 1299.00,
    image: 'https://picsum.photos/id/250/200/200',
    vendorId: 'v1',
    description: 'High resolution 4K photo and video professional camera.',
    quantity: 1
  },
  {
    id: 'p2',
    title: '85mm f/1.4 Portrait Lens',
    price: 850.00,
    image: 'https://picsum.photos/id/250/200/200', // Reusing placeholder
    vendorId: 'v1',
    description: 'Perfect for shallow depth of field portraits.',
    quantity: 1
  },
  {
    id: 'p3',
    title: 'Organic Cotton Hoodie',
    price: 59.99,
    image: 'https://picsum.photos/id/338/200/200',
    vendorId: 'v2',
    description: 'Sustainably sourced, ultra-soft comfort wear.',
    quantity: 2
  }
];

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'free', name: 'Standard Delivery', price: 0, duration: '5-7 business days' },
  { id: 'express', name: 'Express Shipping', price: 15.00, duration: '2-3 business days' },
  { id: 'overnight', name: 'Next Day Air', price: 35.00, duration: '1 business day' },
];

export const INITIAL_USER_DETAILS = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  zip: '',
  country: 'United States',
  billingSameAsShipping: true,
  billingFirstName: '',
  billingLastName: '',
  billingAddress: '',
  billingCity: '',
  billingZip: '',
  billingCountry: 'United States'
};