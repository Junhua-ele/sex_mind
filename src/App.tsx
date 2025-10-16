import React, {useEffect} from "react";
import {Toaster} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/login";
import Index from "./pages/home";
import Assessment from "./pages/assessment";
import Results from "./pages/results";
import Guide from "./pages/guide";
import Science from "./pages/science";
import History from "./pages/history";
import NotFound from "./pages/404";
import BackToTopButton from "@/components/BackToTopButton"; 

const queryClient = new QueryClient();

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return null;
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster richColors />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/guide" element={<ProtectedRoute><Guide /></ProtectedRoute>} />
            <Route path="/science" element={<ProtectedRoute><Science /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* ✅ 固定在右上角的返回顶部按钮 */}
          <BackToTopButton />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;