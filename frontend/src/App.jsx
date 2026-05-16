import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useStore } from './store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FloatingCreateButton from './components/FloatingCreateButton';
import CreateReminderPanel from './components/CreateReminderPanel';

// Pages
import Dashboard from './pages/Dashboard';
import Reminders from './pages/Reminders';
import Calendar from './pages/Calendar';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import CreateWorkspace from './pages/CreateWorkspace';

import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useStore();
  if (authLoading) return <div className="h-screen w-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function AppLayout() {
  const location = useLocation();
  const { sidebarCollapsed } = useStore();
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-screen overflow-hidden flex bg-background text-foreground selection:bg-primary/20 selection:text-primary relative">
        <Sidebar />
        <motion.div 
          animate={{ marginLeft: sidebarCollapsed ? 84 : 280 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0 pt-5 md:pt-6 lg:pt-8 px-4 md:px-6 lg:px-8"
        >
          <Header />
          <main className="flex-1 pb-24 mt-6 md:mt-8">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create" element={<CreateWorkspace />} />
              </Routes>
            </AnimatePresence>
          </main>
        </motion.div>
        <FloatingCreateButton />
        <CreateReminderPanel />
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  const { theme, fetchMe } = useStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <Router>
      <AppLayout />
      <Toaster 
        theme={theme} 
        position="bottom-right" 
        richColors 
        closeButton
        toastOptions={{
          className: 'rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl font-sans'
        }}
      />
    </Router>
  );
}
