import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Materiel from "./pages/Materiel";
import Armateurs from "./pages/Armateurs";
import Utilisateurs from "./pages/Utilisateurs";
import SortieConteneur from "./pages/SortieConteneur";
import Base from "./pages/Base";
import Detention from "./pages/Detention";
import Facturation from "./pages/Facturation";
import Operations from "./pages/Operations";
import Ordre from "./pages/Ordre";
import Notifications from "./pages/Notifications";
import Emails from "./pages/Emails";
import ArchivesBase from "./pages/ArchivesBase";
import ArchivesSortie from "./pages/ArchivesSortie";
import ArchivesOperation from "./pages/ArchivesOperation";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Page de login sans layout */}
            <Route path="/login" element={<Login />} />
            
            {/* Toutes les autres pages avec layout protégé */}
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/materiel" element={<Materiel />} />
                    <Route path="/armateurs" element={<Armateurs />} />
                    <Route path="/utilisateurs" element={<Utilisateurs />} />
                    <Route path="/sorties" element={<SortieConteneur />} />
                    <Route path="/base" element={<Base />} />
                    <Route path="/detention" element={<Detention />} />
                    <Route path="/facturation" element={<Facturation />} />
                    <Route path="/operations" element={<Operations />} />
                    <Route path="/ordres" element={<Ordre />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/emails" element={<Emails />} />
                    <Route path="/archives-base" element={<ArchivesBase />} />
                    <Route path="/archives-sortie" element={<ArchivesSortie />} />
                    <Route path="/archives-operation" element={<ArchivesOperation />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
