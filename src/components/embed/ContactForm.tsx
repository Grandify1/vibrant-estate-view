
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ContactFormProps {
  propertyTitle: string;
  agentEmail?: string | null;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const PropertyContactForm: React.FC<ContactFormProps> = ({ propertyTitle, agentEmail }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const onSubmit = async (data: FormData) => {
    try {
      // In der realen Anwendung würde hier eine API-Anfrage gesendet werden
      console.log("Submitting form:", data);
      console.log(`Property: ${propertyTitle}`);
      console.log(`Agent email: ${agentEmail || 'No agent assigned'}`);
      
      // Simuliere eine Verzögerung
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Erfolg melden
      toast.success("Ihre Anfrage wurde erfolgreich gesendet!");
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
    }
  };
  
  return (
    <div>
      {isSuccess ? (
        <div className="text-center p-4">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-100 p-2">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h4 className="text-lg font-medium">Anfrage gesendet!</h4>
          <p className="text-gray-600 mt-2">
            Wir werden uns so schnell wie möglich bei Ihnen melden.
          </p>
          <Button 
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="mt-4"
          >
            Neue Anfrage
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Ihr Name"
              {...register("name", { required: "Name ist erforderlich" })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="ihre.email@beispiel.de"
              {...register("email", { 
                required: "E-Mail ist erforderlich",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Bitte geben Sie eine gültige E-Mail ein"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              placeholder="Ihre Telefonnummer"
              {...register("phone")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Nachricht *</Label>
            <Textarea
              id="message"
              placeholder={`Ich interessiere mich für "${propertyTitle}" und hätte gerne weitere Informationen.`}
              className="min-h-[120px]"
              {...register("message", { required: "Nachricht ist erforderlich" })}
            />
            {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
          </div>
          
          <Button 
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Wird gesendet...
              </span>
            ) : (
              'Anfrage senden'
            )}
          </Button>
          
          {agentEmail && (
            <p className="text-sm text-gray-500 text-center mt-2">
              Ihre Anfrage geht direkt an {agentEmail}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default PropertyContactForm;
