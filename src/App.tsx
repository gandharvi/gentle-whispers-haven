
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ConversationPage from "./pages/ConversationPage";
import DrawingPage from "./pages/DrawingPage";
import GroundingPage from "./pages/GroundingPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import FeelingWheelPage from "./pages/FeelingWheelPage";
import LeafCatcherPage from "./pages/LeafCatcherPage";
import { ThemeProvider } from "./components/ThemeProvider";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/conversation" element={<ConversationPage />} />
              <Route path="/drawing" element={<DrawingPage />} />
              <Route path="/grounding" element={<GroundingPage />} />
              <Route path="/index" element={<Index />} />
              <Route path="/feeling-wheel" element={<FeelingWheelPage />} />
              <Route path="/leaf-catcher" element={<LeafCatcherPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
