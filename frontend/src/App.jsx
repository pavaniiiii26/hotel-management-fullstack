import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import MenuPage from './pages/MenuPage';
import AddMenuPage from './pages/AddMenuPage';
import StaffPage from './pages/StaffPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/staff" element={<StaffPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu/add"
            element={
              <ProtectedRoute>
                <AddMenuPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
