import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './stores/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CollectionsPage from './pages/collections/CollectionsPage';
import CollectionDetailPage from './pages/collections/CollectionDetailPage';
import ProfilePage from './pages/profile/ProfilePage';
import DominiChatPage from './pages/DominiChatPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  const { user, setUser, clearUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthChange = async (event: string, session: any) => {
      try {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user);
          }
        } else if (event === 'SIGNED_OUT') {
          clearUser();
          localStorage.removeItem('supabase.auth.token');
        } else if (event === 'USER_DELETED' || event === 'USER_UPDATED') {
          if (session?.user) {
            setUser(session.user);
          } else {
            clearUser();
          }
        }
      } catch (error) {
        clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session?.user) {
          setUser(session.user);
        } else {
          clearUser();
        }
      } catch (error) {
        clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, clearUser]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/collections" replace />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/collections" replace />} />
      </Route>

      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/collections"
          element={user ? <CollectionsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/collections/:id"
          element={user ? <CollectionDetailPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/chat"
          element={user ? <DominiChatPage /> : <Navigate to="/login" replace />}
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;