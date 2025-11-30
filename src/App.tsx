import React from "react";
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
import PrimesChauffeur from "./pages/PrimesChauffeur";
import Notifications from "./pages/Notifications";
import Emails from "./pages/Emails";
import ArchivesBase from "./pages/ArchivesBase";
import ArchivesSortie from "./pages/ArchivesSortie";
import ArchivesOperation from "./pages/ArchivesOperation";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Install from "./pages/Install";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Page de login avec AuthProvider */}
            <Route path="/login" element={<Login />} />
            
            {/* Page d'installation PWA */}
            <Route path="/install" element={<Install />} />
            
            {/* Routes protégées avec layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/materiel" element={
              <ProtectedRoute>
                <Layout>
                  <Materiel />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/armateurs" element={
              <ProtectedRoute>
                <Layout>
                  <Armateurs />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/utilisateurs" element={
              <ProtectedRoute>
                <Layout>
                  <Utilisateurs />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/sorties" element={
              <ProtectedRoute>
                <Layout>
                  <SortieConteneur />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/base" element={
              <ProtectedRoute>
                <Layout>
                  <Base />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/detention" element={
              <ProtectedRoute>
                <Layout>
                  <Detention />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/facturation" element={
              <ProtectedRoute>
                <Layout>
                  <Facturation />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/operations" element={
              <ProtectedRoute>
                <Layout>
                  <Operations />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/ordres" element={
              <ProtectedRoute>
                <Layout>
                  <Ordre />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/primes" element={
              <ProtectedRoute>
                <Layout>
                  <PrimesChauffeur />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Layout>
                  <Notifications />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/emails" element={
              <ProtectedRoute>
                <Layout>
                  <Emails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/archives-base" element={
              <ProtectedRoute>
                <Layout>
                  <ArchivesBase />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/archives-sortie" element={
              <ProtectedRoute>
                <Layout>
                  <ArchivesSortie />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/archives-operation" element={
              <ProtectedRoute>
                <Layout>
                  <ArchivesOperation />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
