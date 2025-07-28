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
import NotFoundPage from './pages/NotFoundPage';

// Components
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  const { user, setUser, clearUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 Inicjalizacja aplikacji...');
    console.log('👤 Aktualny użytkownik:', user);
    
    // Handle auth state changes
    const handleAuthChange = async (event: string, session: any) => {
      console.log('🔄 Zmiana stanu autoryzacji:', event);
      console.log('📦 Sesja:', session);
      
      try {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            console.log('✅ Użytkownik zalogowany:', session.user);
            setUser(session.user);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 Użytkownik wylogowany');
          clearUser();
          // Clear any local storage or state that might contain stale tokens
          localStorage.removeItem('supabase.auth.token');
        } else if (event === 'USER_DELETED' || event === 'USER_UPDATED') {
          console.log('👤 Użytkownik zaktualizowany/usunięty:', event);
          // Handle user deletion or updates
          if (session?.user) {
            setUser(session.user);
          } else {
            clearUser();
          }
        }
      } catch (error) {
        console.error('❌ Błąd zmiany stanu autoryzacji:', error);
        // If there's an auth error, clear the user state to force re-authentication
        clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth listener
    console.log('👂 Ustawiam listener autoryzacji...');
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Initial session check
    const initializeAuth = async () => {
      console.log('🔍 Sprawdzam początkową sesję...');
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('📡 Odpowiedź getSession:', { session, error });
        
        if (error) {
          console.error('❌ Błąd getSession:', error);
          throw error;
        }

        if (session?.user) {
          console.log('✅ Znaleziono sesję:', session.user);
          setUser(session.user);
        } else {
          console.log('❌ Brak sesji');
          clearUser();
        }
      } catch (error) {
        console.error('❌ Błąd sprawdzania sesji:', error);
        clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup
    return () => {
      console.log('🧹 Czyszczenie listenera autoryzacji...');
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, clearUser]);

  console.log('🎯 Render App - isLoading:', isLoading, 'user:', user);

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
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;