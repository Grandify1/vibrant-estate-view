
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from './ImageUpload';

interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position?: string;
  image_url?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

interface AgentFormProps {
  agent?: Agent;
  onSubmit: (agentData: any) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export const AgentForm: React.FC<AgentFormProps> = ({
  agent,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = React.useState({
    first_name: agent?.first_name || '',
    last_name: agent?.last_name || '',
    email: agent?.email || '',
    phone: agent?.phone || '',
    position: agent?.position || '',
    image_url: agent?.image_url || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleImageUpload = (urls: string | string[]) => {
    const imageUrl = Array.isArray(urls) ? urls[0] : urls;
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Makler bearbeiten' : 'Neuen Makler hinzufügen'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Vorname*</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Nachname*</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Profilbild</Label>
            <ImageUpload
              onImageChange={handleImageUpload}
              initialImage={formData.image_url}
              maxHeight={400}
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit">
              {isEditing ? 'Makler aktualisieren' : 'Makler hinzufügen'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AgentForm;
