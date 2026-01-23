import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/layout/Layout";

// Lazy load pages pour de meilleures performances
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Materiel = lazy(() => import("./pages/Materiel"));
const Armateurs = lazy(() => import("./pages/Armateurs"));
const Utilisateurs = lazy(() => import("./pages/Utilisateurs"));
const SortieConteneur = lazy(() => import("./pages/SortieConteneur"));
const Base = lazy(() => import("./pages/Base"));
const Detention = lazy(() => import("./pages/Detention"));
const Facturation = lazy(() => import("./pages/Facturation"));
const Operations = lazy(() => import("./pages/Operations"));
const Ordre = lazy(() => import("./pages/Ordre"));
const OrdresEnAttente = lazy(() => import("./pages/OrdresEnAttente"));
const PrimesChauffeur = lazy(() => import("./pages/PrimesChauffeur"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Emails = lazy(() => import("./pages/Emails"));
const ArchivesBase = lazy(() => import("./pages/ArchivesBase"));
const ArchivesSortie = lazy(() => import("./pages/ArchivesSortie"));
const ArchivesOperation = lazy(() => import("./pages/ArchivesOperation"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Install = lazy(() => import("./pages/Install"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - évite les refetch inutiles
      gcTime: 1000 * 60 * 30, // 30 minutes en cache
      refetchOnWindowFocus: false, // Pas de refetch au focus
      refetchOnMount: false, // Utilise le cache si disponible
      retry: 1, // Un seul retry
    },
  },
});

// Composant de chargement
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Layout protégé avec Outlet - Le Layout reste monté, seul le contenu change
const ProtectedLayout = () => (
  <ProtectedRoute>
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Pages publiques */}
              <Route path="/login" element={<Login />} />
              <Route path="/install" element={<Install />} />
              
              {/* Routes protégées avec layout persistant */}
              <Route element={<ProtectedLayout />}>
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
                <Route path="/ordres-attente" element={<OrdresEnAttente />} />
                <Route path="/primes" element={<PrimesChauffeur />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/emails" element={<Emails />} />
                <Route path="/archives-base" element={<ArchivesBase />} />
                <Route path="/archives-sortie" element={<ArchivesSortie />} />
                <Route path="/archives-operation" element={<ArchivesOperation />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;