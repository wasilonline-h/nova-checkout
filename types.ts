export interface Vendor {
  id: string;
  name: string;
  rating: number;
  avatar: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  vendorId: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export interface UserDetails {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  billingSameAsShipping: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingCity: string;
  billingZip: string;
  billingCountry: string;
}

export enum CheckoutStep {
  CART = 0,
  DETAILS = 1,
  SHIPPING = 2,
  PAYMENT = 3,
}

export interface CheckoutState {
  step: CheckoutStep;
  cart: CartItem[];
  details: UserDetails;
  shippingSelection: Record<string, string>; // vendorId -> shippingOptionId
}