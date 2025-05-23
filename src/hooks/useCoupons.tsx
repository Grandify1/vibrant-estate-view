
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Coupon } from '@/types/subscription';

export const useCoupons = () => {
  const [loading, setLoading] = useState(false);

  const validateCoupon = async (code: string, userEmail?: string): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> => {
    setLoading(true);
    
    try {
      // For now, we'll use a hardcoded validation for the freetest100 coupon
      // This will be replaced once the database tables are created
      if (code.toLowerCase() === 'freetest100') {
        // Check if user already used this coupon (simplified check for now)
        if (userEmail) {
          // In a real implementation, this would check the coupon_usage table
          const existingUsage = localStorage.getItem(`coupon_used_${code}_${userEmail}`);
          if (existingUsage) {
            return { valid: false, message: 'Sie haben diesen Coupon bereits verwendet' };
          }
        }

        const coupon: Coupon = {
          id: 'freetest100-id',
          code: 'freetest100',
          discount_type: 'free',
          discount_value: 0,
          max_uses: 1000,
          current_uses: 0,
          valid_from: new Date().toISOString(),
          valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
          active: true
        };

        return { valid: true, coupon };
      }

      return { valid: false, message: 'Coupon-Code ungültig' };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return { valid: false, message: 'Fehler beim Validieren des Coupons' };
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (couponId: string, userEmail: string) => {
    try {
      // For now, store coupon usage in localStorage
      // This will be replaced with proper database storage once tables are created
      if (couponId === 'freetest100-id') {
        localStorage.setItem(`coupon_used_freetest100_${userEmail}`, 'true');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Fehler beim Anwenden des Coupons');
      return false;
    }
  };

  return {
    validateCoupon,
    applyCoupon,
    loading
  };
};
