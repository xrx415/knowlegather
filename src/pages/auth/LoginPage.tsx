import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log('🔐 Rozpoczynam proces logowania...');
    console.log('📧 Email:', email);
    console.log('🔑 Hasło:', password ? '***' : 'brak');
    console.log('🌐 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('🔑 Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '***' : 'brak');
    
    try {
      console.log('🔄 Wywołuję supabase.auth.signInWithPassword...');
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('📡 Odpowiedź z Supabase:', { error, data });
      
      if (error) {
        console.error('❌ Błąd logowania:', error);
        throw error;
      }
      
      console.log('✅ Logowanie udane!');
      console.log('👤 Użytkownik:', data.user);
      console.log('🔑 Sesja:', data.session);
      
      navigate('/collections');
    } catch (err: any) {
      console.error('💥 Błąd podczas logowania:', err);
      console.error('📝 Szczegóły błędu:', {
        message: err.message,
        status: err.status,
        name: err.name,
        stack: err.stack
      });
      
      if (err.message === 'Invalid login credentials') {
        setError('Nieprawidłowy email lub hasło. Sprawdź poprawność danych i spróbuj ponownie.');
      } else {
        setError(`Wystąpił błąd podczas logowania: ${err.message}`);
      }
    } finally {
      console.log('🏁 Kończę proces logowania');
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Zaloguj się</h2>
      
      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="adres@email.com"
          required
          fullWidth
        />
        
        <Input
          label="Hasło"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          fullWidth
        />
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          icon={<LogIn size={16} />}
        >
          Zaloguj się
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Nie masz jeszcze konta?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;