
import React from 'react';
import { useForm } from 'react-hook-form';
import { Agent, initialAgent } from '@/types/agent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface AgentFormProps {
  agent?: Agent;
  onSubmit: (data: Omit<Agent, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting: boolean;
}

const AgentForm: React.FC<AgentFormProps> = ({
  agent,
  onSubmit,
  onCancel,
  isEditing,
  isSubmitting
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: agent || {
      first_name: '',
      last_name: '',
      position: '',
      email: '',
      phone: '',
      image_url: null
    }
  });

  const imageUrl = watch('image_url');

  const handleImageUpload = (url: string) => {
    setValue('image_url', url);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  {imageUrl ? (
                    <AvatarImage src={imageUrl} />
                  ) : null}
                  <AvatarFallback>
                    {agent?.first_name && agent?.last_name 
                      ? `${agent.first_name.charAt(0)}${agent.last_name.charAt(0)}`.toUpperCase() 
                      : 'MA'}
                  </AvatarFallback>
                </Avatar>
                
                <ImageUpload 
                  initialImage={imageUrl || undefined}
                  onImageChange={handleImageUpload}
                  maxHeight={400}
                />
              </div>
              
              <div className="md:w-2/3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Vorname *</Label>
                    <Input 
                      id="first_name"
                      {...register('first_name', { required: 'Vorname ist erforderlich' })}
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-sm">{errors.first_name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Nachname *</Label>
                    <Input 
                      id="last_name"
                      {...register('last_name', { required: 'Nachname ist erforderlich' })}
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input 
                    id="position"
                    {...register('position')}
                    placeholder="z.B. Immobilienmakler, Vertriebsleiter"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail-Adresse *</Label>
                  <Input 
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'E-Mail ist erforderlich',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Ungültiges E-Mail-Format'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefonnummer</Label>
                  <Input 
                    id="phone"
                    {...register('phone')}
                    placeholder="+49 123 456789"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Abbrechen
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    Speichern...
                  </span>
                ) : isEditing ? 'Aktualisieren' : 'Erstellen'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AgentForm;
