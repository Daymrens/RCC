import './globals.css';
import { Toaster } from 'sonner';
import Sidebar from '@/components/layout/Sidebar';
import ThemeToggle from '@/components/layout/ThemeToggle';

export const metadata = {
  title: 'RoboDesk',
  description: 'Device Management & Control Platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-12 border-b border-border flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-text-muted">RoboDesk</span>
              </div>
              <ThemeToggle />
            </header>
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
