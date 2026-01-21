import Link from 'next/link';
import { Store } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Store size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">Kriya</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Kriya. All rights reserved.
      </footer>
    </div>
  );
}
