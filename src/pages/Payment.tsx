
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Loader2, Tag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useCoupons } from '@/hooks/useCoupons';
import { PlanDetails, Coupon } from '@/types/subscription';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { validateCoupon, applyCoupon, loading: couponLoading } = useCoupons();
  
  const selectedPlan = searchParams.get('plan') || 'starter';
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const plans: Record<string, PlanDetails> = {
    starter: {
      id: 'starter',
      name: 'Starter',
      price: 19,
      originalPrice: 19,
      currency: 'EUR',
      features: [
        'Bis zu 50 Immobilien',
        'Grundlegende Anpassung',
        'E-Mail Support',
        'Standard Hosting'
      ]
    },
    professional: {
      id: 'professional',
      name: 'Professional',
      price: 39,
      originalPrice: 39,
      currency: 'EUR',
      features: [
        'Unbegrenzte Immobilien',
        'Vollständige Anpassung',
        'Prioritäts-Support',
        'Premium Hosting',
        'Analytics Dashboard'
      ]
    }
  };

  const currentPlan = plans[selectedPlan] || plans.starter;
  const finalPrice = appliedCoupon?.discount_type === 'free' ? 0 : currentPlan.price;

  const handleCouponValidation = async () => {
    if (!couponCode.trim()) {
      toast.error('Bitte geben Sie einen Coupon-Code ein');
      return;
    }

    const result = await validateCoupon(couponCode.trim(), user?.email);
    
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      toast.success('Coupon erfolgreich angewendet!');
    } else {
      toast.error(result.message || 'Ungültiger Coupon-Code');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon entfernt');
  };

  const handlePayment = async () => {
    setPaymentLoading(true);

    try {
      if (finalPrice === 0 && appliedCoupon) {
        // Free with coupon - record usage and go to registration
        if (user?.email && appliedCoupon) {
          await applyCoupon(appliedCoupon.id, user.email);
        }
        
        toast.success('Kostenloses Paket aktiviert!');
        navigate('/auth?tab=register&plan=' + currentPlan.id + '&payment=success');
        return;
      }

      // Regular Stripe payment
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          plan: currentPlan.id,
          coupon_code: appliedCoupon?.code
        }
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Fehler bei der Zahlung. Bitte versuchen Sie es erneut.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zur Startseite
          </Button>
          <h1 className="text-3xl font-bold text-center">Paket auswählen</h1>
          <p className="text-gray-600 text-center mt-2">
            Schließen Sie Ihre Bestellung ab
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {currentPlan.name} Paket
              <Badge variant="secondary">{currentPlan.currency} {finalPrice}/Monat</Badge>
            </CardTitle>
            <CardDescription>
              Ihre ausgewählten Leistungen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features */}
            <div>
              <h3 className="font-medium mb-3">Enthaltene Leistungen:</h3>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Coupon Section */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Coupon-Code einlösen
              </h3>
              
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon-Code eingeben"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCouponValidation()}
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleCouponValidation}
                    disabled={couponLoading}
                  >
                    {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Anwenden'}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">
                      Coupon "{appliedCoupon.code}" angewendet
                      {appliedCoupon.discount_type === 'free' && ' - Kostenlos!'}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeCoupon}>
                    Entfernen
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            {/* Price Summary */}
            <div>
              <div className="flex justify-between items-center">
                <span>Originalpreis:</span>
                <span>{currentPlan.currency} {currentPlan.originalPrice}/Monat</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Coupon-Rabatt:</span>
                  <span>
                    {appliedCoupon.discount_type === 'free' 
                      ? `- ${currentPlan.currency} ${currentPlan.originalPrice}` 
                      : `- ${currentPlan.currency} ${appliedCoupon.discount_value}`}
                  </span>
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Gesamt:</span>
                <span>{currentPlan.currency} {finalPrice}/Monat</span>
              </div>
            </div>

            {/* Payment Button */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={handlePayment}
              disabled={paymentLoading}
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verarbeitung...
                </>
              ) : finalPrice === 0 ? (
                'Kostenloses Paket aktivieren'
              ) : (
                `${finalPrice}€/Monat - Jetzt bezahlen`
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              {finalPrice === 0 
                ? 'Ihr kostenloses Paket wird sofort aktiviert.'
                : 'Sie werden zu Stripe weitergeleitet, um die Zahlung sicher abzuschließen.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
