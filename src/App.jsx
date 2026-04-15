import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config';

import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home/Home';
import Join from './Pages/Join/Join';
import Gallery from './Pages/Gallery/Gallery';
import Contact from './Pages/Contact/Contact';
import Committee from './Pages/Committee/Committee';
import Login from './Pages/Login/Login';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';

const ADMIN_PATHS = ['/login', '/admin-dashboard'];

// ── Protected Route ──
const ProtectedRoute = ({ user, loading, children }) => {
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100dvh', background: '#070c0a',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '3px solid rgba(240,165,0,0.15)',
          borderTopColor: '#f0a500',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const location  = useLocation();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase auth state পরিবর্তন হলে update করবে
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdminPage = ADMIN_PATHS.includes(location.pathname);

  return (
    <div>
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* ── Public Routes ── */}
        <Route path="/"          element={<Home />} />
        <Route path="/join"      element={<Join />} />
        <Route path="/gallery"   element={<Gallery />} />
        <Route path="/contact"   element={<Contact />} />
        <Route path="/committee" element={<Committee />} />

        {/* ── Login: already logged in হলে dashboard এ পাঠাবে ── */}
        <Route
          path="/login"
          element={
            !loading && user
              ? <Navigate to="/admin-dashboard" replace />
              : <Login />
          }
        />

        {/* ── Protected Admin Dashboard ── */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── 404 Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminPage && <Footer />}
    </div>
  );
};

export default App;