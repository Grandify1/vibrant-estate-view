
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useCouponManagement, CouponForm, CouponWithUsage } from '@/hooks/useCouponManagement';
import { toast } from 'sonner';

const CouponManagement = () => {
  const { coupons, loading, loadCoupons, createCoupon, updateCoupon, deleteCoupon } = useCouponManagement();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponWithUsage | null>(null);

  const [formData, setFormData] = useState<CouponForm>({
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    description: '',
    usage_type: 'unlimited',
    max_uses: undefined,
    valid_from: '',
    valid_until: '',
    active: true
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      description: '',
      usage_type: 'unlimited',
      max_uses: undefined,
      valid_from: '',
      valid_until: '',
      active: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      toast.error('Coupon-Code ist erforderlich');
      return;
    }

    // Modify validation to allow deactivated coupons with zero value
    if (formData.active && formData.discount_type !== 'free' && formData.discount_value <= 0) {
      toast.error('Rabattwert muss bei aktiven Coupons größer als 0 sein');
      return;
    }

    const success = editingCoupon 
      ? await updateCoupon(editingCoupon.id, formData)
      : await createCoupon(formData);

    if (success) {
      setShowCreateDialog(false);
      setEditingCoupon(null);
      resetForm();
    }
  };

  const handleEdit = (coupon: CouponWithUsage) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      description: coupon.description || '',
      usage_type: coupon.usage_type,
      max_uses: coupon.max_uses,
      valid_from: coupon.valid_from ? coupon.valid_from.split('T')[0] : '',
      valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
      active: coupon.active
    });
    setShowCreateDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Coupon löschen möchten?')) {
      await deleteCoupon(id);
    }
  };

  const getUsageTypeLabel = (type: string) => {
    switch (type) {
      case 'single_use': return 'Einmalige Nutzung';
      case 'single_use_per_email': return 'Einmal pro E-Mail';
      case 'time_based': return 'Zeitbasiert';
      case 'unlimited': return 'Unbegrenzt';
      default: return type;
    }
  };

  const getDiscountTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage': return 'Prozent';
      case 'fixed': return 'Festbetrag';
      case 'free': return 'Kostenlos';
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Coupon-Verwaltung</CardTitle>
            <CardDescription>
              Erstellen und verwalten Sie Coupon-Codes für Rabatte
            </CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={(open) => {
            setShowCreateDialog(open);
            if (!open) {
              setEditingCoupon(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Neuer Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCoupon ? 'Coupon bearbeiten' : 'Neuen Coupon erstellen'}
                </DialogTitle>
                <DialogDescription>
                  Konfigurieren Sie die Coupon-Details und Gültigkeitsbedingungen
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Coupon-Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="z.B. SAVE20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount_type">Rabatt-Typ *</Label>
                    <Select 
                      value={formData.discount_type} 
                      onValueChange={(value: 'percentage' | 'fixed' | 'free') => {
                        setFormData({ 
                          ...formData, 
                          discount_type: value,
                          discount_value: value === 'free' ? 0 : formData.discount_value
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie den Rabatt-Typ" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="bg-white">
                        <SelectItem value="percentage">Prozent</SelectItem>
                        <SelectItem value="fixed">Festbetrag (€)</SelectItem>
                        <SelectItem value="free">Kostenlos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount_value">
                      Rabattwert * {formData.discount_type === 'percentage' ? '(%)' : formData.discount_type === 'fixed' ? '(€)' : ''}
                    </Label>
                    <Input
                      id="discount_value"
                      type="number"
                      min="0"
                      step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                      disabled={formData.discount_type === 'free'}
                      required={formData.discount_type !== 'free'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usage_type">Nutzungstyp</Label>
                    <Select 
                      value={formData.usage_type} 
                      onValueChange={(value: 'single_use' | 'single_use_per_email' | 'time_based' | 'unlimited') => 
                        setFormData({ ...formData, usage_type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie den Nutzungstyp" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="bg-white">
                        <SelectItem value="unlimited">Unbegrenzt</SelectItem>
                        <SelectItem value="single_use">Einmalige Nutzung</SelectItem>
                        <SelectItem value="single_use_per_email">Einmal pro E-Mail</SelectItem>
                        <SelectItem value="time_based">Zeitbasiert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(formData.usage_type === 'single_use' || formData.usage_type === 'single_use_per_email') && (
                  <div className="space-y-2">
                    <Label htmlFor="max_uses">Maximale Nutzung</Label>
                    <Input
                      id="max_uses"
                      type="number"
                      min="1"
                      value={formData.max_uses || ''}
                      onChange={(e) => setFormData({ ...formData, max_uses: parseInt(e.target.value) || undefined })}
                      placeholder="z.B. 100"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valid_from">Gültig ab</Label>
                    <Input
                      id="valid_from"
                      type="date"
                      value={formData.valid_from}
                      onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valid_until">Gültig bis</Label>
                    <Input
                      id="valid_until"
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optionale Beschreibung des Coupons"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Coupon aktiv</Label>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingCoupon ? 'Aktualisieren' : 'Erstellen'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Keine Coupons vorhanden. Erstellen Sie Ihren ersten Coupon.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Wert</TableHead>
                <TableHead>Nutzung</TableHead>
                <TableHead>Gültigkeitsdauer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-semibold">{coupon.code}</TableCell>
                  <TableCell>{getDiscountTypeLabel(coupon.discount_type)}</TableCell>
                  <TableCell>
                    {coupon.discount_type === 'free' 
                      ? 'Kostenlos' 
                      : `${coupon.discount_value}${coupon.discount_type === 'percentage' ? '%' : '€'}`}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{getUsageTypeLabel(coupon.usage_type)}</div>
                      {coupon.max_uses && (
                        <div className="text-gray-500">
                          {coupon.current_uses}/{coupon.max_uses} verwendet
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {coupon.valid_from && <div>Ab: {new Date(coupon.valid_from).toLocaleDateString()}</div>}
                      {coupon.valid_until && <div>Bis: {new Date(coupon.valid_until).toLocaleDateString()}</div>}
                      {!coupon.valid_from && !coupon.valid_until && <span className="text-gray-500">Unbegrenzt</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.active ? 'default' : 'secondary'}>
                      {coupon.active ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(coupon)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponManagement;
