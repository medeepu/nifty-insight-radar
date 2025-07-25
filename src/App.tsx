import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Calculator from "./pages/Calculator";
import Signals from "./pages/Signals";
import Backtesting from "./pages/Backtesting";
import MLInsights from "./pages/MLInsights";
import Logs from "./pages/Logs";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="signals" element={<Signals />} />
            <Route path="backtest" element={<Backtesting />} />
            <Route path="ml" element={<MLInsights />} />
            <Route path="logs" element={<Logs />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
