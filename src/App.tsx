
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
import CompanySetup from "./pages/CompanySetup";
import { AuthProvider } from "./hooks/useAuth";
import { PropertiesProvider } from "./hooks/useProperties";
import { AgentsProvider } from "./hooks/useAgents";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <PropertiesProvider>
            <AgentsProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/company-setup" element={<CompanySetup />} />
                <Route path="/embed" element={<Embed />} />
                <Route path="/property/:propertyId" element={<PropertyDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AgentsProvider>
          </PropertiesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
