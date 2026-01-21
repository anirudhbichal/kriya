'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, FileCode, Home, ArrowLeft } from 'lucide-react';

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/internal', label: 'Overview', icon: Home },
    { href: '/internal/schema', label: 'Database Schema', icon: Database },
    { href: '/internal/api-docs', label: 'API Documentation', icon: FileCode },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="text-sm">Back to Store</span>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <h1 className="text-lg font-semibold text-white">
                Internal Documentation
              </h1>
            </div>
            <div className="text-xs text-zinc-500 font-mono">
              kriya v0.1.0
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-800 min-h-[calc(100vh-4rem)] bg-zinc-900/30">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
