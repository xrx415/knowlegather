import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne.');
      return;
    }
    
    if (password.length < 8) {
      setError('Hasło musi zawierać co najmniej 8 znaków.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      navigate('/collections');
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas rejestracji.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Zarejestruj się</h2>
      
      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleRegister} className="space-y-4">
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
        
        <Input
          label="Potwierdź hasło"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          fullWidth
        />
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          icon={<UserPlus size={16} />}
        >
          Zarejestruj się
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Masz już konto?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;