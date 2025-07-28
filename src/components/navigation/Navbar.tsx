import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown,
  Terminal
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import LogViewer from '../ui/LogViewer';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLogViewerOpen, setIsLogViewerOpen] = useState(false);
  const { user, clearUser } = useAuthStore();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearUser();
    navigate('/login');
  };
  
  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={onToggleSidebar}
              className="mr-2 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            
            <Link to="/" className="flex items-center">
              <BookOpen className="h-6 w-6 text-primary-600 mr-2" />
              <span className="text-xl font-semibold text-gray-900">Knowlegathor</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Log Viewer Button */}
            <button
              onClick={() => setIsLogViewerOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              title="Pokaż logi aplikacji"
            >
              <Terminal size={20} className="text-gray-600" />
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center text-sm px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                    <User size={18} className="text-primary-600" />
                  </div>
                  <span className="mr-1 hidden sm:inline-block">
                    {user.email?.split('@')[0]}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50 animate-slide-down">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        Wyloguj
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="btn btn-outline text-sm"
                >
                  Zaloguj
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary text-sm"
                >
                  Zarejestruj
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <LogViewer 
        isOpen={isLogViewerOpen} 
        onClose={() => setIsLogViewerOpen(false)} 
      />
    </>
  );
};

export default Navbar;