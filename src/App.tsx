
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Embed from "./pages/Embed";
import PropertyDetail from "./pages/PropertyDetail";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import { PropertiesProvider } from "./hooks/useProperties";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PropertiesProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/embed" element={<Embed />} />
              <Route path="/property/:propertyId" element={<PropertyDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PropertiesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
