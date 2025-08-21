import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../utils/ProtectedRoute';
import Users from "../pages/UsersPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
