import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import { User, UserRole } from './types';
import UserApproval from './pages/admin/UserApproval';
import ProductManagement from './pages/admin/ProductManagement';
import BuyerHome from './pages/buyer/BuyerHome';
import BiddingPage from './pages/buyer/BiddingPage';

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  user, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  user: User | null; 
  requiredRole?: UserRole;
}) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />; // Redirect if wrong role
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={user ? <Navigate to={user.role === UserRole.ADMIN ? "/admin/products" : "/buyer/home"} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute user={user} requiredRole={UserRole.ADMIN}>
                <ProductManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/approvals" 
            element={
              <ProtectedRoute user={user} requiredRole={UserRole.ADMIN}>
                <UserApproval />
              </ProtectedRoute>
            } 
          />

          {/* Buyer Routes */}
          <Route 
            path="/buyer/home" 
            element={
              <ProtectedRoute user={user} requiredRole={UserRole.BUYER}>
                <BuyerHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buyer/product/:id" 
            element={
              <ProtectedRoute user={user} requiredRole={UserRole.BUYER}>
                {user && <BiddingPage user={user} />}
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;