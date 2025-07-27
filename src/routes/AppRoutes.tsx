import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard"; 
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

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
    </Routes>
  );
};

export default AppRoutes;
