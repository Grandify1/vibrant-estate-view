
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface PropertyContactFormProps {
  propertyTitle: string;
}

export default function PropertyContactForm({ propertyTitle }: PropertyContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: `Ich interessiere mich für die Immobilie "${propertyTitle}" und bitte um Kontaktaufnahme.`
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus.");
      setIsSubmitting(false);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      console.log("Anfrage gesendet:", formData);
      toast.success("Ihre Anfrage wurde erfolgreich gesendet!");
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };
  
  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-green-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2">Vielen Dank für Ihre Anfrage!</h3>
        <p className="text-gray-600 mb-4">Wir werden uns schnellstmöglich bei Ihnen melden.</p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          Neue Anfrage
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-medium mb-2">Kontaktieren Sie uns</h3>
        <p className="text-gray-600 mb-6">
          Haben Sie Interesse an dieser Immobilie? Füllen Sie das Formular aus und wir setzen uns umgehend mit Ihnen in Verbindung.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-estate" />
            <span>+49 (0) 123 456789</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-3 text-estate" />
            <span>info@ihre-immobilien.de</span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-estate/10 rounded-lg">
          <h4 className="font-medium">Ihr Immobilienberater</h4>
          <div className="flex items-center mt-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Immobilienberater" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <p className="font-medium">Max Mustermann</p>
              <p className="text-sm text-gray-600">Immobilienberater</p>
              <p className="text-sm text-estate mt-1">+49 (0) 123 456789</p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Vorname *</Label>
              <Input 
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nachname *</Label>
              <Input 
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">E-Mail *</Label>
            <Input 
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefon *</Label>
            <Input 
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="message">Nachricht</Label>
            <Textarea 
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wird gesendet..." : "Anfrage senden"}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Durch Absenden dieses Formulars stimmen Sie unserer Datenschutzerklärung zu.
          </p>
        </form>
      </div>
    </div>
  );
}
