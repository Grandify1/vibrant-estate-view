
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropertyForm from "@/components/admin/PropertyForm";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PropertyFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      
      <div className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="container mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Zurück zur Übersicht
          </Button>
          
          <PropertyForm id={id} />
        </div>
      </div>
    </div>
  );
};

export default PropertyFormPage;
