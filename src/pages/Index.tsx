
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50">
      <div className="text-center mb-16 px-4">
        <h1 className="text-4xl font-bold mb-4 text-estate-dark">Immobilien CMS</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Ein einfaches Content-Management-System für Immobilien mit Admin-Portal und Embed-Element für Ihre Website.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-estate-light/20 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-estate">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Admin-Portal</h2>
          <p className="text-gray-600 mb-6">
            Verwalten Sie Ihre Immobilien mit einem einfachen, passwortgeschützten Admin-Portal. Erstellen, bearbeiten, archivieren und löschen Sie Immobilien.
          </p>
          <Link to="/admin">
            <Button>
              Zum Admin-Portal
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-estate-light/20 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-estate">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Embed-Element</h2>
          <p className="text-gray-600 mb-6">
            Binden Sie Ihre Immobilien mit einem einfachen Embed-Code in Ihre eigene Website ein. Modern und responsiv für alle Geräte.
          </p>
          <Link to="/embed">
            <Button>
              Zur Embed-Vorschau
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-16 max-w-4xl w-full px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">So funktioniert es</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-estate-dark font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Einrichten</h3>
            <p className="text-gray-600">
              Legen Sie ein Passwort für das Admin-Portal fest und beginnen Sie mit der Verwaltung Ihrer Immobilien.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-estate-dark font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Erfassen</h3>
            <p className="text-gray-600">
              Erfassen Sie Ihre Immobilien mit allen Details, Bildern, Grundrissen und Beschreibungen.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-estate-dark font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Einbinden</h3>
            <p className="text-gray-600">
              Kopieren Sie den Embed-Code und fügen Sie ihn auf Ihrer Website ein, um Ihre Immobilien zu präsentieren.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
