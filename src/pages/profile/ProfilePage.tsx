import { useState, useEffect } from 'react';
import { User, EditIcon, ShieldCheck, Key } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (password !== confirmPassword) {
      setError('Hasła nie są zgodne.');
      return;
    }
    
    if (password.length < 8) {
      setError('Hasło musi mieć co najmniej 8 znaków.');
      return;
    }
    
    // Reset states
    setError(null);
    setSuccess(null);
    setIsUpdating(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      setSuccess('Hasło zostało pomyślnie zaktualizowane.');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas aktualizacji hasła.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Profil użytkownika</h1>
      
      <div className="card mb-6">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Informacje o koncie</h2>
            <p className="text-sm text-gray-500">
              Podstawowe informacje o Twoim koncie
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adres email
            </label>
            <div className="flex">
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="flex-1 h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                aria-label="Adres email użytkownika"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              ID użytkownika
            </label>
            <input
              id="userId"
              type="text"
              value={user?.id || ''}
              disabled
              className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              aria-label="ID użytkownika"
            />
          </div>
          
          <div className="mb-2">
            <label htmlFor="registrationDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data rejestracji
            </label>
            <input
              id="registrationDate"
              type="text"
              value={user?.created_at ? new Date(user.created_at).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : ''}
              disabled
              className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              aria-label="Data rejestracji użytkownika"
            />
          </div>
        </div>
      </div>
      
      <div className="card mb-6">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
            <Key className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Zmiana hasła</h2>
            <p className="text-sm text-gray-500">
              Zaktualizuj swoje hasło, aby zabezpieczyć konto
            </p>
          </div>
        </div>
        
        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleUpdatePassword}>
          <div className="mb-4">
            <Input
              label="Nowe hasło"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              fullWidth
              required
            />
          </div>
          
          <div className="mb-4">
            <Input
              label="Potwierdź nowe hasło"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              fullWidth
              required
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            isLoading={isUpdating}
            disabled={!password || !confirmPassword}
          >
            Zaktualizuj hasło
          </Button>
        </form>
      </div>
      
      <div className="card">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
            <ShieldCheck className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Bezpieczeństwo konta</h2>
            <p className="text-sm text-gray-500">
              Informacje dotyczące bezpieczeństwa Twojego konta
            </p>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-700">Dwustopniowa weryfikacja</p>
              <p className="text-xs text-gray-500">Dodatkowa warstwa zabezpieczeń dla Twojego konta</p>
            </div>
            <div>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                Niedostępne w MVP
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-700">Historia logowań</p>
              <p className="text-xs text-gray-500">Przeglądaj historię logowań na Twoje konto</p>
            </div>
            <div>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                Niedostępne w MVP
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Sesje aktywne</p>
              <p className="text-xs text-gray-500">Zarządzaj aktywnymi sesjami na różnych urządzeniach</p>
            </div>
            <div>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                Niedostępne w MVP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;