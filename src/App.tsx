import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Diagnostic from "./pages/Diagnostic";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Dashboard from "./pages/Dashboard";
import Session from "./pages/Session";
import Settings from "./pages/Settings";
import Success from "./pages/Success";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import MentionsLegales from "./pages/MentionsLegales";
import CGV from "./pages/CGV";
import Confidentialite from "./pages/Confidentialite";
import Leaderboard from "./pages/Leaderboard";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        {/* Global Background with Orbs & Noise */}
        <div className="fixed inset-0 bg-nivo-bg -z-10">
          {/* Orb 1 - Purple */}
          <div 
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-orb-float"
          />
          {/* Orb 2 - Cobalt */}
          <div 
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] animate-orb-float"
            style={{ animationDelay: '-10s' }}
          />
          {/* Noise Texture */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/success" element={<Success />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/diagnostic" element={
              <ProtectedRoute>
                <Diagnostic />
              </ProtectedRoute>
            } />
            <Route path="/session/:routineId" element={
              <ProtectedRoute>
                <Session />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
