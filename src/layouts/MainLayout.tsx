import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import AiChat from '../components/ai/AiChat';
import { useState, useEffect } from 'react';
import { Home, FolderOpen, User, MessageSquare, Menu, Bot, Settings, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarPortalProvider } from '../contexts/SidebarPortalContext';

const MD_BREAKPOINT = 768;
const LEFT_DEFAULT = 256;
const LEFT_MIN = 200;
const LEFT_MAX = 480;
const RIGHT_DEFAULT = 384;
const RIGHT_MIN = 300;
const RIGHT_MAX = 700;

const navigationItems = [
  { name: 'Strona główna', icon: Home, href: '/?stay=true' },
  { name: 'Kolekcje', icon: FolderOpen, href: '/collections' },
  { name: 'Profil', icon: User, href: '/profile' },
  { name: 'Domini Chat', icon: MessageSquare, href: '/chat' },
];

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ─── Responsive ───
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= MD_BREAKPOINT);
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= MD_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ─── Panel state ───
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= MD_BREAKPOINT);
  const [chatOpen, setChatOpen] = useState(window.innerWidth >= MD_BREAKPOINT);
  const [sidebarSlot, setSidebarSlot] = useState<HTMLDivElement | null>(null);

  // Reset defaults when crossing breakpoint
  useEffect(() => {
    setSidebarOpen(isDesktop);
    setChatOpen(isDesktop);
  }, [isDesktop]);

  // ─── Resizable widths (desktop only) ───
  const [leftWidth, setLeftWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarLeftWidth');
    return saved ? parseInt(saved) : LEFT_DEFAULT;
  });
  const [rightWidth, setRightWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarRightWidth');
    return saved ? parseInt(saved) : RIGHT_DEFAULT;
  });
  const [resizing, setResizing] = useState<'left' | 'right' | null>(null);

  useEffect(() => { localStorage.setItem('sidebarLeftWidth', String(leftWidth)); }, [leftWidth]);
  useEffect(() => { localStorage.setItem('sidebarRightWidth', String(rightWidth)); }, [rightWidth]);

  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: MouseEvent) => {
      if (resizing === 'left') {
        setLeftWidth(Math.max(LEFT_MIN, Math.min(LEFT_MAX, e.clientX)));
      } else {
        setRightWidth(Math.max(RIGHT_MIN, Math.min(RIGHT_MAX, window.innerWidth - e.clientX)));
      }
    };
    const onUp = () => {
      setResizing(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [resizing]);

  // Auto-close drawers on mobile route change
  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
      setChatOpen(false);
    }
  }, [location.pathname]);

  // ─── Shared nav links ───
  const navLinks = navigationItems.map((item) => {
    const Icon = item.icon;
    const isActive = item.href === '/?stay=true'
      ? location.pathname === '/'
      : location.pathname === item.href || location.pathname.startsWith(item.href);

    return (
      <Link
        key={item.name}
        to={item.href}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
          isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon className={`h-5 w-5 mr-2 shrink-0 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
        {item.name}
      </Link>
    );
  });

  /* ══════════════════════════════════════════════════
     DESKTOP — 3-column static flex layout
     ══════════════════════════════════════════════════ */
  if (isDesktop) {
    return (
      <SidebarPortalProvider value={sidebarSlot}>
        <div className="flex flex-col h-screen">
          <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <div className="flex flex-1 overflow-hidden">
            {/* ── Left sidebar ── */}
            <aside
              className="bg-white border-r border-gray-200 overflow-hidden relative shrink-0"
              style={{
                width: sidebarOpen ? leftWidth : 0,
                transition: resizing ? 'none' : 'width 300ms ease-in-out',
              }}
            >
              <div style={{ width: leftWidth }} className="flex flex-col h-full">
                <div className="p-4 shrink-0">
                  <nav className="space-y-1">{navLinks}</nav>
                </div>
                <div ref={setSidebarSlot} className="flex-1 flex flex-col overflow-hidden" />
              </div>

              {/* Resize handle — right edge */}
              <div
                className="absolute top-0 bottom-0 right-0 w-1 cursor-col-resize hover:bg-primary-400 transition-colors"
                onMouseDown={(e) => { e.preventDefault(); setResizing('left'); }}
              >
                <div className="absolute inset-y-0 -left-1 -right-1" />
              </div>
            </aside>

            {/* ── Main content ── */}
            <main className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-auto p-4">
                <Outlet />
              </div>
            </main>

            {/* ── Right sidebar (chat) ── */}
            <div
              className="relative shrink-0"
              style={{
                width: chatOpen ? rightWidth : 0,
                transition: resizing ? 'none' : 'width 300ms ease-in-out',
              }}
            >
              {/* Close tab — D-shape, only when open */}
              {chatOpen && (
                <button
                  onClick={() => setChatOpen(false)}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 z-10
                             flex items-center justify-center w-8 h-14
                             bg-primary-600 text-white rounded-l-full
                             hover:bg-primary-700 transition-colors shadow-lg cursor-pointer"
                  aria-label="Close AI Chat"
                >
                  <X size={18} />
                </button>
              )}

              <aside className="bg-white border-l border-gray-200 overflow-hidden h-full relative">
                {/* Resize handle — left edge */}
                <div
                  className="absolute top-0 bottom-0 left-0 w-1 cursor-col-resize hover:bg-primary-400 transition-colors z-10"
                  onMouseDown={(e) => { e.preventDefault(); setResizing('right'); }}
                >
                  <div className="absolute inset-y-0 -left-1 -right-1" />
                </div>

                <div style={{ width: rightWidth }} className="h-full">
                  <AiChat />
                </div>
              </aside>
            </div>

            {/* Open tab — D-shape on right screen edge, only when closed */}
            {!chatOpen && (
              <button
                onClick={() => setChatOpen(true)}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-40
                           flex items-center justify-center w-8 h-14
                           bg-primary-600 text-white rounded-l-full
                           hover:bg-primary-700 hover:w-10
                           transition-all duration-300 shadow-lg cursor-pointer"
                aria-label="Open AI Chat"
              >
                <Bot size={18} />
              </button>
            )}
          </div>
        </div>
      </SidebarPortalProvider>
    );
  }

  /* ══════════════════════════════════════════════════
     MOBILE — drawers + bottom nav
     ══════════════════════════════════════════════════ */
  return (
    <SidebarPortalProvider value={sidebarSlot}>
      <div className="flex flex-col h-screen">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex flex-col flex-1 overflow-hidden pb-14">
          {/* Backdrops */}
          {sidebarOpen && (
            <div className="fixed inset-0 top-16 bg-black/40 z-20" onClick={() => setSidebarOpen(false)} />
          )}
          {chatOpen && (
            <div className="fixed inset-0 top-16 bg-black/30 z-20" onClick={() => setChatOpen(false)} />
          )}

          {/* Left drawer */}
          <aside
            className={`
              fixed top-16 bottom-14 left-0 z-30 w-64
              bg-white border-r border-gray-200
              transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="w-64 flex flex-col h-full">
              <div className="p-4 shrink-0">
                <nav className="space-y-1">{navLinks}</nav>
              </div>
              <div ref={setSidebarSlot} className="flex-1 flex flex-col overflow-hidden" />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-4">
            <Outlet />
          </main>

          {/* Right drawer (chat) */}
          <aside
            className={`
              fixed top-16 bottom-14 right-0 z-30 w-80
              bg-white border-l border-gray-200 shadow-xl
              transition-transform duration-300 ease-in-out
              ${chatOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            <div className="w-80 h-full">
              <AiChat />
            </div>
          </aside>
        </div>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex items-center justify-around h-14">
            <button
              onClick={() => { setChatOpen(false); setSidebarOpen(!sidebarOpen); }}
              className={`flex items-center justify-center w-full h-full transition-colors ${
                sidebarOpen ? 'text-primary-600' : 'text-gray-500'
              }`}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
            <button
              onClick={() => { setSidebarOpen(false); setChatOpen(!chatOpen); }}
              className={`flex items-center justify-center w-full h-full transition-colors ${
                chatOpen ? 'text-primary-600' : 'text-gray-500'
              }`}
              aria-label="Chat"
            >
              <Bot size={22} />
            </button>
            <button
              onClick={() => { setSidebarOpen(false); setChatOpen(false); navigate('/profile'); }}
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
