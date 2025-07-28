import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import { useState } from 'react';
import { BookOpen, Home, FolderOpen, User, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const navigationItems = [
    {
      name: 'Strona główna',
      icon: Home,
      href: '/',
    },
    {
      name: 'Kolekcje',
      icon: FolderOpen,
      href: '/collections',
    },
    {
      name: 'Profil',
      icon: User,
      href: '/profile',
    },
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          <div className="p-4">
            <div className="flex items-center mb-6">
              <BookOpen className="h-6 w-6 text-primary-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">
                Knowlegathor
              </span>
            </div>
            
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href || 
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-2 ${
                      isActive ? 'text-primary-500' : 'text-gray-400'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;