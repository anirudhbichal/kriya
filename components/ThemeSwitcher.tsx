'use client';

import { useStore } from '@/lib/store-context';
import { themes } from '@/lib/themes';
import { ThemeType } from '@/lib/types';
import { Palette } from 'lucide-react';
import { useState } from 'react';

export default function ThemeSwitcher() {
  const { config, setTheme } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions: { id: ThemeType; emoji: string }[] = [
    { id: 'neon', emoji: '🌙' },
    { id: 'soft', emoji: '🌸' },
    { id: 'brutal', emoji: '⚡' },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div className="relative">
        {/* Theme Options */}
        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 p-2 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] shadow-2xl animate-slide-up">
            <p className="text-xs text-[var(--foregroundMuted)] px-3 py-1 mb-2 font-medium uppercase tracking-wider">
              Switch Theme
            </p>
            {themeOptions.map(({ id, emoji }) => (
              <button
                key={id}
                onClick={() => {
                  setTheme(id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                  config.theme === id 
                    ? 'bg-[var(--primary)] text-[var(--background)]' 
                    : 'hover:bg-[var(--backgroundAlt)] text-[var(--foreground)]'
                }`}
              >
                <span className="text-lg">{emoji}</span>
                <div className="text-left">
                  <p className="font-heading font-semibold">{themes[id].name}</p>
                  <p className={`text-xs ${config.theme === id ? 'opacity-80' : 'text-[var(--foregroundMuted)]'}`}>
                    {themes[id].description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-full shadow-lg hover:border-[var(--primary)] transition-colors"
        >
          <Palette size={18} className="text-[var(--primary)]" />
          <span className="text-sm font-medium text-[var(--foreground)]">
            {themeOptions.find(t => t.id === config.theme)?.emoji} {themes[config.theme].name}
          </span>
        </button>
      </div>
    </div>
  );
}
