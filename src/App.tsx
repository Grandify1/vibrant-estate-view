
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Embed from "./pages/Embed";
import PropertyDetail from "./pages/PropertyDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PropertyFormPage from "./pages/PropertyFormPage";
import Payment from "./pages/Payment";
import { AuthProvider } from "./hooks/useAuth";
import { PropertiesProvider } from "./hooks/useProperties";
import { AgentsProvider } from "./hooks/useAgents";
import LandingPage from "./pages/LandingPage";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import { LanguageProvider } from "./context/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <PropertiesProvider>
            <AgentsProvider>
              <LanguageProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/impressum" element={<Impressum language="de" />} />
                  <Route path="/legal-notice" element={<Impressum language="en" />} />
                  <Route path="/datenschutz" element={<Datenschutz language="de" />} />
                  <Route path="/privacy-policy" element={<Datenschutz language="en" />} />
                  <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/properties/new" element={<PropertyFormPage />} />
                  <Route path="/admin/properties/edit/:id" element={<PropertyFormPage />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/embed" element={<Embed />} />
                  <Route path="/property/:propertyId" element={<PropertyDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </LanguageProvider>
            </AgentsProvider>
          </PropertiesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
