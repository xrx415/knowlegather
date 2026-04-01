import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import AiChat from '../components/ai/AiChat';
import { useState, useEffect } from 'react';
import { Home, FolderOpen, User, MessageSquare, Menu, Bot, Settings } from 'lucide-react';
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
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarSlot, setSidebarSlot] = useState<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth < MD_BREAKPOINT) {
      setSidebarOpen(false);
      setChatOpen(false);
    }
  }, [location.pathname]);

  return (
    <SidebarPortalProvider value={sidebarSlot}>
      <div className="flex flex-col min-h-screen">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleChat={() => setChatOpen(!chatOpen)}
        />

        <div className="flex flex-1 overflow-hidden pb-14 md:pb-0">
          {/* Mobile backdrop — left sidebar */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 top-16 bg-black/40 z-20 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Mobile backdrop — chat panel */}
          {chatOpen && (
            <div
              className="fixed inset-0 top-16 bg-black/40 z-20 md:hidden"
              onClick={() => setChatOpen(false)}
            />
          )}

          {/* Left sidebar — nav + portal slot */}
          <aside
            className={`
              bg-white border-r border-gray-200 overflow-hidden
              fixed top-16 bottom-14 left-0 z-30 w-64
              transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              md:bottom-0 md:static md:z-0 md:translate-x-0
              md:transition-[width] md:duration-300 md:shrink-0
              ${sidebarOpen ? 'md:w-64' : 'md:w-0'}
            `}
          >
            <div className="w-64 flex flex-col h-full">
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

              <div ref={setSidebarSlot} className="flex-1 flex flex-col overflow-hidden" />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto p-4">
              <Outlet />
            </div>
          </main>

          {/* Right sidebar — AI Chat */}
          <aside
            className={`
              bg-white border-l border-gray-200 overflow-hidden
              fixed top-16 bottom-14 right-0 z-30 w-80
              transition-transform duration-300 ease-in-out
              ${chatOpen ? 'translate-x-0' : 'translate-x-full'}
              md:bottom-0 md:static md:z-0 md:translate-x-0
              md:transition-[width] md:duration-300 md:shrink-0
              ${chatOpen ? 'md:w-80' : 'md:w-0'}
            `}
          >
            <div className="w-80 h-full">
              <AiChat />
            </div>
          </aside>
        </div>

        {/* Mobile bottom navigation — icons only */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
          <div className="flex items-center justify-around h-14">
            <button
              onClick={() => {
                setChatOpen(false);
                setSidebarOpen(!sidebarOpen);
              }}
              className={`flex items-center justify-center w-full h-full transition-colors ${
                sidebarOpen ? 'text-primary-600' : 'text-gray-500'
              }`}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
            <button
              onClick={() => {
                setSidebarOpen(false);
                setChatOpen(!chatOpen);
              }}
              className={`flex items-center justify-center w-full h-full transition-colors ${
                chatOpen ? 'text-primary-600' : 'text-gray-500'
              }`}
              aria-label="Chat"
            >
              <Bot size={22} />
            </button>
            <button
              onClick={() => {
                setSidebarOpen(false);
                setChatOpen(false);
                navigate('/profile');
              }}
              className={`flex items-center justify-center w-full h-full transition-colors ${
                location.pathname === '/profile' ? 'text-primary-600' : 'text-gray-500'
              }`}
              aria-label="Settings"
            >
              <Settings size={22} />
            </button>
          </div>
        </nav>
      </div>
    </SidebarPortalProvider>
  );
};

export default MainLayout;
