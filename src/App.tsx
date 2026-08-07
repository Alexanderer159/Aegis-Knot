import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { LocalUserProvider, useLocalUser } from "@/hooks/useLocalUser";
import Auth from "@/pages/Auth";
import KnotSetup from "@/pages/KnotSetup";
import Grupo from "@/pages/Grupo";
import MapaPage from "@/pages/MapaPage";
import Insumos from "@/pages/Insumos";
import Activity from "@/pages/Activity";
import Vault from "@/pages/Vault";
import Config from "@/pages/Config";
import NotFound from "@/pages/NotFound";
import { SyncProvider } from "@/hooks/useSyncQueue";

const queryClient = new QueryClient();

function Gate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isSetup, loading: userLoading } = useLocalUser();

  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary font-heading text-xl">AEGIS KNOT</div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!isSetup) return <Navigate to="/setup" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <LocalUserProvider>
          <SyncProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/setup" element={<KnotSetup />} />
              <Route element={<Gate><AppLayout /></Gate>}>
                <Route path="/" element={<Grupo />} />
                <Route path="/map" element={<MapaPage />} />
                <Route path="/supplies" element={<Insumos />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/vault" element={<Vault />} />
                <Route path="/config" element={<Config />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </SyncProvider>
        </LocalUserProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;