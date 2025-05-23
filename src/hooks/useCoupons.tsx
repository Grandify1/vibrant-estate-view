
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Coupon } from '@/types/subscription';

export const useCoupons = () => {
  const [loading, setLoading] = useState(false);

  const validateCoupon = async (code: string, userEmail?: string): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> => {
    setLoading(true);
    
    try {
      // Check if coupon exists and is active
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toLowerCase())
        .eq('active', true)
        .single();

      if (couponError || !coupon) {
        return { valid: false, message: 'Coupon-Code ungültig' };
      }

      // Check if coupon is still valid (date range)
      const now = new Date();
      const validFrom = new Date(coupon.valid_from);
      const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

      if (now < validFrom) {
        return { valid: false, message: 'Coupon ist noch nicht gültig' };
      }

      if (validUntil && now > validUntil) {
        return { valid: false, message: 'Coupon ist abgelaufen' };
      }

      // Check max uses
      if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
        return { valid: false, message: 'Coupon wurde bereits zu oft verwendet' };
      }

      // Check if user already used this coupon
      if (userEmail) {
        const { data: usage } = await supabase
          .from('coupon_usage')
          .select('id')
          .eq('coupon_id', coupon.id)
          .eq('user_email', userEmail)
          .single();

        if (usage) {
          return { valid: false, message: 'Sie haben diesen Coupon bereits verwendet' };
        }
      }

      return { valid: true, coupon };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return { valid: false, message: 'Fehler beim Validieren des Coupons' };
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (couponId: string, userEmail: string) => {
    try {
      // Record coupon usage
      const { error: usageError } = await supabase
        .from('coupon_usage')
        .insert({
          coupon_id: couponId,
          user_email: userEmail
        });

      if (usageError) throw usageError;

      // Update coupon usage count
      const { error: updateError } = await supabase.rpc('increment_coupon_usage', {
        coupon_id: couponId
      });

      if (updateError) throw updateError;

      return true;
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
