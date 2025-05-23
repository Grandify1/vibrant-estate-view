
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Coupon } from '@/types/subscription';

export const useCoupons = () => {
  const [loading, setLoading] = useState(false);

  const validateCoupon = async (code: string, userEmail?: string): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> => {
    setLoading(true);
    
    try {
      // Fetch coupon from database
      const { data: couponData, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toLowerCase())
        .eq('active', true)
        .single();
      
      if (couponError || !couponData) {
        console.log('Coupon not found or error:', couponError);
        return { valid: false, message: 'Ungültiger Coupon-Code' };
      }
      
      // Check if coupon is valid (dates)
      const now = new Date();
      if (couponData.valid_from && new Date(couponData.valid_from) > now) {
        return { valid: false, message: 'Coupon ist noch nicht gültig' };
      }
      
      if (couponData.valid_until && new Date(couponData.valid_until) < now) {
        return { valid: false, message: 'Coupon ist abgelaufen' };
      }
      
      // Check usage limits
      if (couponData.max_uses && couponData.current_uses >= couponData.max_uses) {
        return { valid: false, message: 'Coupon wurde zu oft verwendet' };
      }
      
      // Check if user already used this coupon
      if (userEmail) {
        const { data: usageData, error: usageError } = await supabase
          .from('coupon_usage')
          .select('*')
          .eq('coupon_id', couponData.id)
          .eq('user_email', userEmail)
          .maybeSingle();
          
        if (usageData) {
          return { valid: false, message: 'Sie haben diesen Coupon bereits verwendet' };
        }
      }
      
      const coupon: Coupon = {
        id: couponData.id,
        code: couponData.code,
        discount_type: couponData.discount_type,
        discount_value: couponData.discount_value,
        max_uses: couponData.max_uses,
        current_uses: couponData.current_uses,
        valid_from: couponData.valid_from,
        valid_until: couponData.valid_until,
        active: couponData.active
      };
      
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
      // Insert coupon usage record
      const { error: usageError } = await supabase
        .from('coupon_usage')
        .insert({
          coupon_id: couponId,
          user_email: userEmail
        });
        
      if (usageError) {
        console.error('Error recording coupon usage:', usageError);
        return false;
      }
      
      // Increment usage counter
      const { error: updateError } = await supabase.functions.invoke('increment-coupon-usage', {
        body: { coupon_id: couponId }
      });
      
      if (updateError) {
        console.error('Error incrementing coupon usage:', updateError);
      }
      
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
