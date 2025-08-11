import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
