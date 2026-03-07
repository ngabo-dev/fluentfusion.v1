import { NavBar } from './NavBar';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-[#0a0a0a] content-stretch flex relative size-full min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-[240px]">
        <NavBar />
        <main className="flex-1 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
