'use client';

import { useState } from 'react';
import { Save, Loader2, Store, Palette, Globe, Bell, CreditCard, CheckCircle } from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-store';

export default function SettingsPage() {
  const { settings, updateSettings, products, categories, isLoading } = useDashboard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    // General
    storeName: settings.name,
    tagline: settings.description,
    announcement: '🔥 FREE SHIPPING ON ORDERS OVER $50',
    
    // Theme
    theme: settings.theme,
    
    // Currency
    currency: settings.currency,
    currencySymbol: '$',
    
    // Social
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    tiktok: 'https://tiktok.com',
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'domain', label: 'Domain', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const themes: { id: 'neon' | 'soft' | 'brutal'; name: string; description: string; emoji: string }[] = [
    { id: 'neon', name: 'Neon', description: 'Cyberpunk vibes with neon glows', emoji: '🌙' },
    { id: 'soft', name: 'Soft', description: 'Minimal & airy with gentle pastels', emoji: '🌸' },
    { id: 'brutal', name: 'Brutal', description: 'Raw & bold with stark contrasts', emoji: '⚡' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateSettings({
        name: formData.storeName,
        description: formData.tagline,
        theme: formData.theme as 'neon' | 'soft' | 'brutal',
        currency: formData.currency,
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 animate-in slide-in-from-top-2">
          <CheckCircle size={18} />
          <span className="font-medium">Settings saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your store configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-56 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">General Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Announcement Banner
                  </label>
                  <input
                    type="text"
                    value={formData.announcement}
                    onChange={(e) => setFormData(prev => ({ ...prev, announcement: e.target.value }))}
                    placeholder="Leave empty to hide"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={formData.currencySymbol}
                      onChange={(e) => setFormData(prev => ({ ...prev, currencySymbol: e.target.value }))}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <h3 className="text-sm font-semibold text-white mb-4">Social Links</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={formData.instagram}
                        onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                        placeholder="https://instagram.com/yourstore"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Twitter / X
                      </label>
                      <input
                        type="url"
                        value={formData.twitter}
                        onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                        placeholder="https://twitter.com/yourstore"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        TikTok
                      </label>
                      <input
                        type="url"
                        value={formData.tiktok}
                        onChange={(e) => setFormData(prev => ({ ...prev, tiktok: e.target.value }))}
                        placeholder="https://tiktok.com/@yourstore"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Settings */}
            {activeTab === 'theme' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Theme Settings</h2>
                <p className="text-sm text-zinc-400">Choose a theme that matches your brand</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, theme: theme.id }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.theme === theme.id
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-3xl mb-2 block">{theme.emoji}</span>
                      <h3 className="font-semibold text-white">{theme.name}</h3>
                      <p className="text-sm text-zinc-400 mt-1">{theme.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Domain Settings */}
            {activeTab === 'domain' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Domain Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Your Store URL
                  </label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-zinc-800 border border-r-0 border-zinc-700 rounded-l-lg text-zinc-500">
                      https://
                    </span>
                    <input
                      type="text"
                      value="mystore"
                      disabled
                      className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-zinc-400 cursor-not-allowed"
                    />
                    <span className="px-4 py-3 bg-zinc-800 border border-l-0 border-zinc-700 rounded-r-lg text-zinc-500">
                      .kriya.store
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                  <h3 className="font-medium text-white mb-2">Custom Domain</h3>
                  <p className="text-sm text-zinc-400 mb-4">
                    Connect your own domain to your store. Available on Pro plan.
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Notification Settings</h2>
                <p className="text-sm text-zinc-400">Configure how you receive notifications</p>
                
                <div className="space-y-4">
                  {[
                    { id: 'new-order', label: 'New Order', description: 'Get notified when you receive a new order' },
                    { id: 'low-stock', label: 'Low Stock', description: 'Get notified when a product is running low' },
                    { id: 'reviews', label: 'New Reviews', description: 'Get notified when customers leave reviews' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{item.label}</p>
                        <p className="text-sm text-zinc-400">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billing */}
            {activeTab === 'billing' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Billing & Plan</h2>
                
                <div className="p-4 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-violet-400 uppercase tracking-wider font-semibold">Current Plan</span>
                      <h3 className="text-2xl font-bold text-white mt-1">Free</h3>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Upgrade
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-zinc-300">Plan Limits</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-zinc-800/50 rounded-lg">
                      <p className="text-sm text-zinc-400">Products</p>
                      <p className="text-lg font-semibold text-white">{products.length} / 100</p>
                    </div>
                    <div className="p-3 bg-zinc-800/50 rounded-lg">
                      <p className="text-sm text-zinc-400">Categories</p>
                      <p className="text-lg font-semibold text-white">{categories.length} / 10</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            {(activeTab === 'general' || activeTab === 'theme') && (
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 text-white rounded-lg font-medium transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
