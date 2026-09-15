import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { 
  Scissors, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  Building,
  Video
} from 'lucide-react'
import { apiService } from '../services/apiService'
import confetti from 'canvas-confetti'

export function AuthPage({ setActiveRole, setUserSession }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login')
  const [role, setRole] = useState('clipper') // 'clipper' | 'brand'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (mode === 'register' && !acceptedTerms) {
      setError('You must accept the Terms of Service to create an account.')
      return
    }

    setIsSubmitting(true)

    try {
      const user = await apiService.authenticateUser({
        mode,
        email,
        password,
        displayName: displayName || email.split('@')[0],
        role
      })

      setActiveRole(role)
      if (setUserSession) setUserSession(user)

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      })

      setIsSubmitting(false)
      navigate(role === 'brand' ? '/brand-dashboard' : '/clipper-dashboard')
    } catch (err) {
      setError(err.message || 'Authentication failed.')
      setIsSubmitting(false)
    }
  }

  const handleOAuthLogin = async (provider) => {
    setIsSubmitting(true)
    try {
      const user = await apiService.authenticateOAuth(provider, role)
      setActiveRole(role)
      if (setUserSession) setUserSession(user)
      setIsSubmitting(false)
      navigate(role === 'brand' ? '/brand-dashboard' : '/clipper-dashboard')
    } catch (err) {
      setError(err.message || 'OAuth login failed.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#0B0F19] to-[#0B0F19]">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Scissors className="w-6 h-6 text-slate-950 font-extrabold stroke-[2.5]" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {mode === 'login' ? 'Welcome back to ClipYard' : 'Join the Performance Clipping Yard'}
          </h1>
          <p className="text-xs text-slate-400">
            {mode === 'login' 
              ? 'Enter your credentials to access your dashboard' 
              : 'Start clipping or launch campaigns with escrow protection'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Account Role Selector */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('clipper')}
                className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition-all ${
                  role === 'clipper'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Video className="w-4 h-4 shrink-0" />
                <div>
                  <span className="text-xs font-bold block leading-none">Clipper</span>
                  <span className="text-[9px] opacity-80 mt-0.5 block">Cut & get paid</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('brand')}
                className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition-all ${
                  role === 'brand'
                    ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Building className="w-4 h-4 shrink-0" />
                <div>
                  <span className="text-xs font-bold block leading-none">Brand / Owner</span>
                  <span className="text-[9px] opacity-80 mt-0.5 block">Fund campaigns</span>
                </div>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name / Handle
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Alex River"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="alex@clipyard.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms Acceptance */}
            {mode === 'register' && (
              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-300 leading-snug">
                  I agree to the <Link to="/terms" className="text-emerald-400 hover:underline font-semibold">Terms & Conditions</Link>, Escrow Policy, and Privacy Policy.
                </label>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : mode === 'login' ? 'Log In to Account' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Social Auth Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
              <span className="bg-[#151D2A] px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('Google')}
              className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center justify-center space-x-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('Discord')}
              className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center justify-center space-x-2 transition-colors"
            >
              <svg className="w-4 h-4 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Discord</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  )
}
