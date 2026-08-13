import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EditorialNavbar from './components/EditorialNavbar';
import WelcomePage from './pages/WelcomePage';
import CustomerMenuPage from './pages/CustomerMenuPage';
import KitchenPage from './pages/KitchenPage';
import StaffEditorialPage from './pages/StaffEditorialPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AddMenuPage from './pages/AddMenuPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <EditorialNavbar />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/menu" element={<CustomerMenuPage />} />
        <Route path="/staff" element={<StaffEditorialPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

