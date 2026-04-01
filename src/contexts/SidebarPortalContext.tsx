import { createContext, useContext } from 'react';

const SidebarPortalContext = createContext<HTMLDivElement | null>(null);

export const SidebarPortalProvider = SidebarPortalContext.Provider;
export const useSidebarPortal = () => useContext(SidebarPortalContext);
