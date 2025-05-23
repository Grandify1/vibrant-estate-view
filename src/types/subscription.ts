
export interface Subscription {
  id: string;
  user_id?: string;
  email: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan_type: 'starter' | 'professional';
  status: string;
  amount: number;
  currency: string;
  coupon_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed' | 'free';
  discount_value: number;
  max_uses?: number;
  current_uses: number;
  valid_from: string;
  valid_until?: string;
  active: boolean;
}

export interface PlanDetails {
  id: 'starter' | 'professional';
  name: string;
  price: number;
  originalPrice: number;
  currency: string;
  features: string[];
}
