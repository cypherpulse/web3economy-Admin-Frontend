import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import DashboardLayout from "@/components/admin/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Events from "@/pages/admin/Events";
import Creators from "@/pages/admin/Creators";
import Projects from "@/pages/admin/Projects";
import Resources from "@/pages/admin/Resources";
import Blogs from "@/pages/admin/Blogs";
import Showcase from "@/pages/admin/Showcase";
import Newsletter from "@/pages/admin/Newsletter";
import Contacts from "@/pages/admin/Contacts";
import Admins from "@/pages/admin/Admins";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="events" element={<Events />} />
              <Route path="creators" element={<Creators />} />
              <Route path="projects" element={<Projects />} />
              <Route path="resources" element={<Resources />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="showcase" element={<Showcase />} />
              <Route path="newsletter" element={<Newsletter />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="admins" element={<Admins />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
