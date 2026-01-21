// Theme configurations for Gen-Z aesthetics

export const themes = {
  neon: {
    name: 'Neon',
    description: 'Cyberpunk vibes with neon glows',
    colors: {
      background: '#0a0a0f',
      backgroundAlt: '#12121a',
      foreground: '#ffffff',
      foregroundMuted: '#a1a1aa',
      primary: '#00ff88',
      primaryGlow: 'rgba(0, 255, 136, 0.4)',
      secondary: '#ff00ff',
      secondaryGlow: 'rgba(255, 0, 255, 0.4)',
      accent: '#00d4ff',
      accentGlow: 'rgba(0, 212, 255, 0.4)',
      border: '#27272a',
      card: '#18181b',
      success: '#00ff88',
      error: '#ff3366',
    },
    fonts: {
      heading: "'Space Grotesk', sans-serif",
      body: "'Inter', sans-serif",
    },
    borderRadius: '0.5rem',
    effects: {
      glow: true,
      gradients: true,
    },
  },
  soft: {
    name: 'Soft',
    description: 'Minimal & airy with gentle pastels',
    colors: {
      background: '#faf9f7',
      backgroundAlt: '#f5f3f0',
      foreground: '#1a1a1a',
      foregroundMuted: '#737373',
      primary: '#e07a5f',
      primaryGlow: 'rgba(224, 122, 95, 0.2)',
      secondary: '#81b29a',
      secondaryGlow: 'rgba(129, 178, 154, 0.2)',
      accent: '#f2cc8f',
      accentGlow: 'rgba(242, 204, 143, 0.2)',
      border: '#e5e5e5',
      card: '#ffffff',
      success: '#81b29a',
      error: '#e07a5f',
    },
    fonts: {
      heading: "'Fraunces', serif",
      body: "'DM Sans', sans-serif",
    },
    borderRadius: '1rem',
    effects: {
      glow: false,
      gradients: false,
    },
  },
  brutal: {
    name: 'Brutal',
    description: 'Raw & bold with stark contrasts',
    colors: {
      background: '#fffef5',
      backgroundAlt: '#f0efe5',
      foreground: '#000000',
      foregroundMuted: '#525252',
      primary: '#ff5500',
      primaryGlow: 'rgba(255, 85, 0, 0.3)',
      secondary: '#0055ff',
      secondaryGlow: 'rgba(0, 85, 255, 0.3)',
      accent: '#ffdd00',
      accentGlow: 'rgba(255, 221, 0, 0.3)',
      border: '#000000',
      card: '#ffffff',
      success: '#00cc66',
      error: '#ff0033',
    },
    fonts: {
      heading: "'Bebas Neue', sans-serif",
      body: "'Work Sans', sans-serif",
    },
    borderRadius: '0',
    effects: {
      glow: false,
      gradients: false,
    },
  },
} as const;

export type ThemeConfig = typeof themes[keyof typeof themes];
