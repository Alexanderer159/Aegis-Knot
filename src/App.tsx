import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LocalUserProvider } from "@/hooks/useLocalUser";
import Dashboard from "@/pages/Dashboard";
import Grupo from "@/pages/Grupo";
import MapaPage from "@/pages/MapaPage";
import Insumos from "@/pages/Insumos";
import Vault from "@/pages/Vault";
import Config from "@/pages/Config";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LocalUserProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/grupo" element={<Grupo />} />
              <Route path="/mapa" element={<MapaPage />} />
              <Route path="/insumos" element={<Insumos />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/config" element={<Config />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LocalUserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
