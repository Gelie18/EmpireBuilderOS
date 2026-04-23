import TopNav from '@/components/layout/TopNav';
import SideNav from '@/components/layout/SideNav';
import MobileNav from '@/components/layout/MobileNav';
import FloatingChat from '@/components/chat/FloatingChat';
import SplashScreen from '@/components/layout/SplashScreen';
import SubcoSelector from '@/components/layout/SubcoSelector';
import { SubcoProvider } from '@/contexts/SubcoContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DecisionsProvider } from '@/contexts/DecisionsContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // h-dvh = dynamic viewport height — fixes iOS Safari 100vh bug
  return (
    <ThemeProvider>
      <SubcoProvider>
      <DecisionsProvider>
      <div className="h-dvh flex flex-col overflow-x-hidden" style={{ background: 'var(--color-bg)' }}>
        <SplashScreen />
        <TopNav rightSlot={<SubcoSelector />} />

        {/* Body: sidenav + main */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* Sidebar — md+ only */}
          <SideNav />

          {/* Main scroll area */}
          <main className="flex-1 min-w-0 overflow-y-auto overscroll-contain">
            <div className="w-full px-4 pt-4 md:px-6 md:pt-5 md:pb-8 flex flex-col gap-4 md:gap-5">
              {children}
              {/* Spacer that clears the fixed mobile tab bar (56px) + safe area + generous buffer */}
              <div className="block md:hidden" style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 80px)', flexShrink: 0 }} aria-hidden="true" />
            </div>
          </main>
        </div>

        {/* Global AI Co-Pilot — floating panel, works on all pages */}
        <FloatingChat />

        {/* Mobile bottom nav — shared across all OS modules */}
        <MobileNav />
      </div>
      </DecisionsProvider>
      </SubcoProvider>
    </ThemeProvider>
  );
}
