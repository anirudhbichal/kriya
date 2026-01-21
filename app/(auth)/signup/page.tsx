'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Store, Loader2, Eye, EyeOff, Check } from 'lucide-react';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
    storeSlug: '',
  });

  const handleStoreNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      storeName: name,
      storeSlug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);
    
    // Simulate signup
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: Implement actual signup with Supabase
    console.log('Signup:', formData);
    
    setIsLoading(false);
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  const passwordStrength = () => {
    const { password } = formData;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {step === 1 ? 'Create your account' : 'Set up your store'}
        </h1>
        <p className="text-zinc-400">
          {step === 1 
            ? 'Start selling online in minutes' 
            : 'Choose a name for your store'}
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-violet-500' : 'bg-zinc-800'}`} />
        <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-violet-500' : 'bg-zinc-800'}`} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-12 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full ${
                          i < passwordStrength() ? strengthColors[passwordStrength() - 1] : 'bg-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {strengthLabels[passwordStrength() - 1] || 'Too weak'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Store Name
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => handleStoreNameChange(e.target.value)}
                  placeholder="My Awesome Store"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            {/* Store URL */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Store URL
              </label>
              <div className="flex items-center">
                <span className="px-4 py-3 bg-zinc-800 border border-r-0 border-zinc-700 rounded-l-lg text-zinc-500 text-sm">
                  https://
                </span>
                <input
                  type="text"
                  value={formData.storeSlug}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    storeSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') 
                  }))}
                  placeholder="my-store"
                  required
                  pattern="^[a-z0-9][a-z0-9-]*[a-z0-9]$"
                  minLength={3}
                  className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
                <span className="px-4 py-3 bg-zinc-800 border border-l-0 border-zinc-700 rounded-r-lg text-zinc-500 text-sm">
                  .kriya.store
                </span>
              </div>
              {formData.storeSlug && formData.storeSlug.length >= 3 && (
                <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
                  <Check size={14} />
                  This URL is available!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Creating your store...
            </>
          ) : step === 1 ? (
            'Continue'
          ) : (
            'Create Store'
          )}
        </button>

        {/* Back Button (Step 2) */}
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full py-3 text-zinc-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
        )}

        {/* Divider (Step 1 only) */}
        {step === 1 && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-950 text-zinc-500">or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </>
        )}
      </form>

      {/* Terms */}
      <p className="mt-6 text-center text-xs text-zinc-500">
        By signing up, you agree to our{' '}
        <Link href="/terms" className="text-zinc-400 hover:text-white">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-zinc-400 hover:text-white">
          Privacy Policy
        </Link>
      </p>

      {/* Login Link */}
      <p className="mt-4 text-center text-zinc-400">
        Already have an account?{' '}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
