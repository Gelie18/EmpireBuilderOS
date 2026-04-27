import TopNav from '@/components/layout/TopNav';
import SideNavHR from '@/components/hr/SideNavHR';
import PersonaSwitcher from '@/components/hr/PersonaSwitcher';
import SplashScreen from '@/components/layout/SplashScreen';
import MobileNav from '@/components/layout/MobileNav';
import { PersonaProvider } from '@/lib/hr/context';
import { SubcoProvider } from '@/contexts/SubcoContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SubcoProvider>
        <PersonaProvider>
          <div className="h-dvh flex flex-col overflow-x-hidden" style={{ background: 'var(--color-bg)' }}>
            <SplashScreen product="HR OS" />
            <TopNav companyName="783 Partners" product="HR OS" rightSlot={<PersonaSwitcher />} />

            <div className="flex flex-1 min-h-0 overflow-hidden">
              <SideNavHR />
              <main className="flex-1 min-w-0 overflow-y-auto overscroll-contain">
                <div className="w-full px-4 pt-4 md:px-6 md:pt-5 md:pb-8 flex flex-col gap-4 md:gap-5" style={{ maxWidth: 1280, margin: '0 auto' }}>
                  {children}
                  <div className="block md:hidden" style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 80px)', flexShrink: 0 }} aria-hidden />
                </div>
              </main>
            </div>
            <MobileNav />
          </div>
        </PersonaProvider>
      </SubcoProvider>
    </ThemeProvider>
  );
}
