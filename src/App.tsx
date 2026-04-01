import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PostsProvider } from '@/context/PostsContext';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import ActionPlan from '@/pages/ActionPlan';
import GetInvolved from '@/pages/GetInvolved';
import DelegateDashboard from '@/pages/DelegateDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import Login from '@/pages/Login';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9d100]"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  if (!requireAdmin && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  
  return (
    <div className="min-h-screen bg-white">
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? '' : 'pt-16'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/action-plan" element={<ActionPlan />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DelegateDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <Router>
          <AppContent />
        </Router>
      </PostsProvider>
    </AuthProvider>
  );
}

export default App;
