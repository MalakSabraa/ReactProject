import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import AddTodo from "../pages/addTodo";
import EditTodo from "../pages/editTodo";
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../utils/ProtectedRoute';

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
        path="/addTodo"
        element={
          <ProtectedRoute>
            <AddTodo />
          </ProtectedRoute>
        }
      />

      <Route
        path="/editTodo"
        element={
          <ProtectedRoute>
            <EditTodo />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
