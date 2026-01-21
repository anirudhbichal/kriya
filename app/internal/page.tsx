import Link from 'next/link';
import { Database, FileCode, GitBranch, Layers } from 'lucide-react';

export default function InternalPage() {
  const cards = [
    {
      href: '/internal/schema',
      icon: Database,
      title: 'Database Schema',
      description: 'View the complete database schema with tables, relationships, and indexes.',
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
    },
    {
      href: '/internal/api-docs',
      icon: FileCode,
      title: 'API Documentation',
      description: 'Explore all API endpoints with request/response examples.',
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
    },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Kriya Internal Documentation
        </h1>
        <p className="text-zinc-400">
          Technical documentation for developers. View database schema, API endpoints, and architecture details.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Tables', value: '5', icon: Database },
          { label: 'API Routes', value: '12', icon: FileCode },
          { label: 'Themes', value: '3', icon: Layers },
          { label: 'Version', value: '0.1.0', icon: GitBranch },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-zinc-400 mb-1">
              <stat.icon size={14} />
              <span className="text-xs uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`group relative overflow-hidden rounded-xl border ${card.borderColor} bg-gradient-to-br ${card.color} p-6 transition-all hover:scale-[1.02] hover:shadow-xl`}
          >
            <card.icon className="w-10 h-10 text-white mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {card.title}
            </h2>
            <p className="text-zinc-300 text-sm">
              {card.description}
            </p>
            <div className="absolute bottom-4 right-4 text-zinc-400 group-hover:text-white transition-colors">
              →
            </div>
          </Link>
        ))}
      </div>

      {/* Architecture Overview */}
      <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Architecture Overview</h2>
        <pre className="text-sm text-zinc-400 font-mono overflow-x-auto">
{`┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Merchant     │────▶│    Next.js      │────▶│    Supabase     │
│    Dashboard    │     │    App          │     │    PostgreSQL   │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
        store1.kriya       store2.kriya      custom-domain
        (Subdomain)        (Subdomain)       (Custom Domain)`}
        </pre>
      </div>
    </div>
  );
}
