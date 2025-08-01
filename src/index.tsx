import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { AdminLogin } from "./components/auth/AdminLogin";
import { Dashboard } from "./pages/Dashboard";
import { MacbookPro } from "./screens/MacbookPro";
import AdminLayout from "./screens/Admin/AdminLayout";
import AdminDashboard from "./screens/Admin/Dashboard";
import UserList from "./screens/Admin/UserList";
import ActivityList from "./screens/Admin/ActivityList";
import ActivityForm from "./screens/Admin/ActivityForm";
import EventSettings from "./screens/Admin/EventSettings";
import ScreenManagement from "./screens/Admin/ScreenManagement";
import MediaLibrary from "./screens/Admin/MediaLibrary";
import HistoryLog from "./screens/Admin/HistoryLog";
import "./i18n"; // Import i18n configuration

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <AuthProvider>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
        <BrowserRouter>
          <Routes>
            {/* Route publique - page d'accueil */}
            <Route path="/" element={<MacbookPro />} />
            
            {/* Routes d'authentification */}
            <Route path="/auth/login" element={<LoginForm />} />
            <Route path="/auth/register" element={<RegisterForm />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Routes protégées */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Routes d'administration protégées */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserList />} />
              <Route path="activities" element={<ActivityList />} />
              <Route path="activities/:id" element={<ActivityForm />} />
              <Route path="event" element={<EventSettings />} />
              <Route path="screens" element={<ScreenManagement />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="settings" element={<HistoryLog />} />
            </Route>
            
            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  </StrictMode>,
);