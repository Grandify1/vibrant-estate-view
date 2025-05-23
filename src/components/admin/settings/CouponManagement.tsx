
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

  // Define discount type options
  const discountTypeOptions = [
    { value: 'percentage', label: 'Prozent' },
    { value: 'fixed', label: 'Festbetrag (€)' },
    { value: 'free', label: 'Kostenlos' }
  ];

  // Define usage type options
  const usageTypeOptions = [
    { value: 'unlimited', label: 'Unbegrenzt' },
    { value: 'single_use', label: 'Einmalige Nutzung' },
    { value: 'single_use_per_email', label: 'Einmal pro E-Mail' },
    { value: 'time_based', label: 'Zeitbasiert' }
  ];

  useEffect(() => {
    console.log("CouponManagement: Component mounted, loading coupons...");
    loadCoupons();
  }, []);

  const resetForm = () => {
    console.log("Resetting coupon form to default values");
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
    
    console.log("Coupon form submission started with data:", formData);
    
    if (!formData.code.trim()) {
      toast.error('Coupon-Code ist erforderlich');
      return;
    }

    // Only validate discount value for active coupons that aren't free type
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
    console.log("Editing coupon:", coupon);
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
    const option = usageTypeOptions.find(opt => opt.value === type);
    return option?.label || type;
  };

  const getDiscountTypeLabel = (type: string) => {
    const option = discountTypeOptions.find(opt => opt.value === type);
    return option?.label || type;
  };

  // Debugging functions for dropdowns
  const handleDiscountTypeChange = (value: 'percentage' | 'fixed' | 'free') => {
    console.log("=== DISCOUNT TYPE DEBUG ===");
    console.log("Clicked discount type:", value);
    console.log("Available options:", discountTypeOptions);
    console.log("Current form data:", formData);
    
    setFormData({ 
      ...formData, 
      discount_type: value,
      discount_value: value === 'free' ? 0 : formData.discount_value
    });
    
    console.log("Updated form data will be:", {
      ...formData,
      discount_type: value,
      discount_value: value === 'free' ? 0 : formData.discount_value
    });
  };

  const handleUsageTypeChange = (value: 'single_use' | 'single_use_per_email' | 'time_based' | 'unlimited') => {
    console.log("=== USAGE TYPE DEBUG ===");
    console.log("Clicked usage type:", value);
    console.log("Available options:", usageTypeOptions);
    console.log("Current form data:", formData);
    
    setFormData({ ...formData, usage_type: value });
    
    console.log("Updated form data will be:", {
      ...formData,
      usage_type: value
    });
  };

  const handleSelectOpen = (selectType: string) => {
    console.log(`=== SELECT OPEN DEBUG: ${selectType} ===`);
    console.log("Select opened:", selectType);
    console.log("Available discount options:", discountTypeOptions);
    console.log("Available usage options:", usageTypeOptions);
  };

  // Debug dropdown options
  console.log("=== RENDER DEBUG ===");
  console.log("Discount type options:", discountTypeOptions);
  console.log("Usage type options:", usageTypeOptions);
  console.log("Current form data:", formData);

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
            console.log("Coupon dialog open state changed:", open);
            setShowCreateDialog(open);
            if (!open) {
              setEditingCoupon(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                console.log("Creating new coupon dialog opened");
                resetForm();
              }}>
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
                      onChange={(e) => {
                        console.log("Coupon code changed:", e.target.value);
                        setFormData({ ...formData, code: e.target.value.toUpperCase() });
                      }}
                      placeholder="z.B. SAVE20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount_type">Rabatt-Typ *</Label>
                    <div className="relative">
                      <Select 
                        value={formData.discount_type} 
                        onValueChange={handleDiscountTypeChange}
                        onOpenChange={(open) => {
                          console.log("=== DISCOUNT TYPE SELECT OPEN/CLOSE ===");
                          console.log("Open state:", open);
                          if (open) handleSelectOpen('discount_type');
                        }}
                      >
                        <SelectTrigger 
                          id="discount_type" 
                          className="w-full"
                          onClick={() => {
                            console.log("=== DISCOUNT TYPE TRIGGER CLICKED ===");
                            console.log("Current value:", formData.discount_type);
                            console.log("Options available:", discountTypeOptions);
                          }}
                        >
                          <SelectValue placeholder="Wählen Sie den Rabatt-Typ">
                            {formData.discount_type ? getDiscountTypeLabel(formData.discount_type) : "Wählen Sie den Rabatt-Typ"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white border border-gray-200 shadow-lg">
                          {discountTypeOptions.map((option) => {
                            console.log("Rendering discount type option:", option);
                            return (
                              <SelectItem 
                                key={option.value} 
                                value={option.value}
                                className="cursor-pointer hover:bg-gray-100 px-3 py-2"
                                onClick={() => {
                                  console.log("=== DISCOUNT ITEM CLICKED ===");
                                  console.log("Selected option:", option);
                                }}
                              >
                                {option.label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-xs text-blue-600 font-mono">
                      Debug: {discountTypeOptions.length} Optionen | Aktuell: {formData.discount_type}
                    </div>
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
                      onChange={(e) => {
                        console.log("Discount value changed:", e.target.value);
                        setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 });
                      }}
                      disabled={formData.discount_type === 'free'}
                      required={formData.discount_type !== 'free'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usage_type">Nutzungstyp</Label>
                    <div className="relative">
                      <Select 
                        value={formData.usage_type} 
                        onValueChange={handleUsageTypeChange}
                        onOpenChange={(open) => {
                          console.log("=== USAGE TYPE SELECT OPEN/CLOSE ===");
                          console.log("Open state:", open);
                          if (open) handleSelectOpen('usage_type');
                        }}
                      >
                        <SelectTrigger 
                          id="usage_type" 
                          className="w-full"
                          onClick={() => {
                            console.log("=== USAGE TYPE TRIGGER CLICKED ===");
                            console.log("Current value:", formData.usage_type);
                            console.log("Options available:", usageTypeOptions);
                          }}
                        >
                          <SelectValue placeholder="Wählen Sie den Nutzungstyp">
                            {formData.usage_type ? getUsageTypeLabel(formData.usage_type) : "Wählen Sie den Nutzungstyp"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white border border-gray-200 shadow-lg">
                          {usageTypeOptions.map((option) => {
                            console.log("Rendering usage type option:", option);
                            return (
                              <SelectItem 
                                key={option.value} 
                                value={option.value}
                                className="cursor-pointer hover:bg-gray-100 px-3 py-2"
                                onClick={() => {
                                  console.log("=== USAGE ITEM CLICKED ===");
                                  console.log("Selected option:", option);
                                }}
                              >
                                {option.label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-xs text-blue-600 font-mono">
                      Debug: {usageTypeOptions.length} Optionen | Aktuell: {formData.usage_type}
                    </div>
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
                      onChange={(e) => {
                        console.log("Max uses changed:", e.target.value);
                        setFormData({ ...formData, max_uses: parseInt(e.target.value) || undefined });
                      }}
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
                      onChange={(e) => {
                        console.log("Valid from changed:", e.target.value);
                        setFormData({ ...formData, valid_from: e.target.value });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valid_until">Gültig bis</Label>
                    <Input
                      id="valid_until"
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => {
                        console.log("Valid until changed:", e.target.value);
                        setFormData({ ...formData, valid_until: e.target.value });
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => {
                      console.log("Description changed:", e.target.value);
                      setFormData({ ...formData, description: e.target.value });
                    }}
                    placeholder="Optionale Beschreibung des Coupons"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => {
                      console.log("Active state changed:", checked);
                      setFormData({ ...formData, active: checked });
                    }}
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
