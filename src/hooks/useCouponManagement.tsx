
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CouponForm {
  code: string;
  discount_type: 'percentage' | 'fixed' | 'free';
  discount_value: number;
  description?: string;
  usage_type: 'single_use' | 'single_use_per_email' | 'time_based' | 'unlimited';
  max_uses?: number;
  valid_from?: string;
  valid_until?: string;
  active: boolean;
}

export interface CouponWithUsage {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed' | 'free';
  discount_value: number;
  description?: string;
  usage_type: 'single_use' | 'single_use_per_email' | 'time_based' | 'unlimited';
  max_uses?: number;
  current_uses: number;
  valid_from?: string;
  valid_until?: string;
  active: boolean;
  created_at: string;
}

export const useCouponManagement = () => {
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState<CouponWithUsage[]>([]);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data as CouponWithUsage[] || []);
    } catch (error: any) {
      console.error('Error loading coupons:', error);
      toast.error('Fehler beim Laden der Coupons: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async (couponData: CouponForm): Promise<boolean> => {
    setLoading(true);
    try {
      // Prepare the data with proper null handling for dates
      const insertData = {
        code: couponData.code.toUpperCase(),
        discount_type: couponData.discount_type,
        discount_value: couponData.discount_value,
        description: couponData.description || null,
        usage_type: couponData.usage_type,
        max_uses: couponData.max_uses || null,
        // Convert empty strings to null for timestamp fields
        valid_from: couponData.valid_from && couponData.valid_from.trim() !== '' ? couponData.valid_from : null,
        valid_until: couponData.valid_until && couponData.valid_until.trim() !== '' ? couponData.valid_until : null,
        active: couponData.active,
        current_uses: 0
      };

      console.log('Creating coupon with data:', insertData);

      const { error } = await supabase
        .from('coupons')
        .insert(insertData);

      if (error) throw error;
      
      toast.success('Coupon erfolgreich erstellt');
      await loadCoupons();
      return true;
    } catch (error: any) {
      console.error('Error creating coupon:', error);
      if (error.code === '23505') {
        toast.error('Ein Coupon mit diesem Code existiert bereits');
      } else {
        toast.error('Fehler beim Erstellen des Coupons: ' + error.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCoupon = async (id: string, updates: Partial<CouponForm>): Promise<boolean> => {
    setLoading(true);
    try {
      // Prepare updates with proper null handling
      const finalUpdates = {
        ...updates,
        code: updates.code ? updates.code.toUpperCase() : updates.code,
        // Convert empty strings to null for timestamp fields
        valid_from: updates.valid_from !== undefined 
          ? (updates.valid_from && updates.valid_from.trim() !== '' ? updates.valid_from : null)
          : undefined,
        valid_until: updates.valid_until !== undefined 
          ? (updates.valid_until && updates.valid_until.trim() !== '' ? updates.valid_until : null)
          : undefined
      };
      
      console.log('Updating coupon with data:', finalUpdates);
      
      const { error } = await supabase
        .from('coupons')
        .update(finalUpdates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Coupon erfolgreich aktualisiert');
      await loadCoupons();
      return true;
    } catch (error: any) {
      console.error('Error updating coupon:', error);
      toast.error('Fehler beim Aktualisieren des Coupons: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // First check if coupon has been used
      const { data: coupon, error: fetchError } = await supabase
        .from('coupons')
        .select('current_uses')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      if (coupon && coupon.current_uses > 0) {
        const confirmation = window.confirm(
          `Dieser Coupon wurde bereits ${coupon.current_uses} mal verwendet. Sind Sie sicher, dass Sie ihn löschen möchten? Dies könnte Auswirkungen auf bestehende Buchungen haben.`
        );
        
        if (!confirmation) {
          setLoading(false);
          return false;
        }
      }

      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Coupon erfolgreich gelöscht');
      await loadCoupons();
      return true;
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      toast.error('Fehler beim Löschen des Coupons: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    coupons,
    loading,
    loadCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon
  };
};
