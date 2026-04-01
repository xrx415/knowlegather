import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import { useState, useEffect } from 'react';
import { Home, FolderOpen, User, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarPortalProvider } from '../contexts/SidebarPortalContext';

const MD_BREAKPOINT = 768;

const navigationItems = [
  { name: 'Strona główna', icon: Home, href: '/?stay=true' },
  { name: 'Kolekcje', icon: FolderOpen, href: '/collections' },
  { name: 'Profil', icon: User, href: '/profile' },
  { name: 'Domini Chat', icon: MessageSquare, href: '/chat' },
];

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarSlot, setSidebarSlot] = useState<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < MD_BREAKPOINT) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <SidebarPortalProvider value={sidebarSlot}>
      <div className="flex flex-col min-h-screen">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex flex-1 overflow-hidden">
          {/* Mobile backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 top-16 bg-black/40 z-20 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Unified sidebar — top: main nav, bottom: contextual portal slot */}
          <aside
            className={`
              bg-white border-r border-gray-200 overflow-hidden
              fixed top-16 bottom-0 left-0 z-30 w-64
              transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              md:static md:z-0 md:translate-x-0
              md:transition-[width] md:duration-300 md:shrink-0
              ${sidebarOpen ? 'md:w-64' : 'md:w-0'}
            `}
          >
            <div className="w-64 flex flex-col h-full">
              {/* Top: main navigation (always the same) */}
              <div className="p-4 shrink-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isHomepage = item.href.startsWith('/');
                    const isActive = isHomepage
                      ? location.pathname === '/'
                      : location.pathname === item.href || location.pathname.startsWith(item.href);

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
                        <Icon className={`h-5 w-5 mr-2 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom: contextual panel — pages inject content here via portal */}
              <div ref={setSidebarSlot} className="flex-1 flex flex-col overflow-hidden" />
            </div>
          </aside>

          {/* Main content area */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto p-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarPortalProvider>
  );
};

export default MainLayout;
