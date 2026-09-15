import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Scissors, 
  Flame, 
  PlusCircle, 
  Wallet, 
  Trophy, 
  ShieldAlert, 
  UserCheck, 
  Bell, 
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  LogIn,
  UserPlus,
  FileText,
  Settings,
  LogOut,
  Building2,
  Menu,
  X
} from 'lucide-react'
import { apiService } from '../services/apiService'

export function Navbar({ activeRole, setActiveRole, walletBalance, userSession, setUserSession }) {
  const location = useLocation()
  const navigate = useNavigate()

  const isStandaloneDashboard = ['/clipper-dashboard', '/brand-dashboard', '/admin'].includes(location.pathname)
  if (isStandaloneDashboard) return null

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const isActive = (path) => location.pathname === path
  const currentUser = userSession || apiService.getCurrentUser(activeRole)

  const handleLogout = () => {
    apiService.logoutUser()
    if (setUserSession) setUserSession(null)
    setShowProfileMenu(false)
    navigate('/login')
  }

  const notifications = [
    { id: 1, title: 'Payout Received!', text: '+$2,169.00 credited to your wallet for Island Challenge clips.', time: '2h ago' },
    { id: 2, title: 'Clip Approved', text: 'Brand approved your submission for JRE #2140.', time: '5h ago' }
  ]

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <Scissors className="w-5.5 h-5.5 text-slate-950 font-extrabold stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  Clip<span className="gradient-text-emerald">Yard</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold uppercase tracking-wider">
                    MVP
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Performance Clipping</span>
              </div>
            </Link>

            {/* Main Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/') 
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  Explore Campaigns
                </span>
              </Link>

              {activeRole === 'clipper' && (
                <Link 
                  to="/clipper-dashboard" 
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive('/clipper-dashboard') 
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                    My Clips
                  </span>
                </Link>
              )}

              {activeRole === 'brand' && (
                <Link 
                  to="/brand-dashboard" 
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive('/brand-dashboard') 
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-purple-400" />
                    Brand Portal
                  </span>
                </Link>
              )}

              <Link 
                to="/brand" 
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/brand') || isActive('/brand-kit')
                    ? 'bg-slate-800 text-purple-400 border border-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  For Brands
                </span>
              </Link>

              <Link 
                to="/leaderboard" 
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/leaderboard') 
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Leaderboard
                </span>
              </Link>

              <Link 
                to="/terms" 
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/terms') 
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Terms
                </span>
              </Link>

              {activeRole === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive('/admin') 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Admin
                  </span>
                </Link>
              )}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Role Switcher */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-1 flex items-center space-x-1 text-xs">
              <span className="text-[10px] uppercase font-extrabold text-slate-400 px-1.5 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                Role:
              </span>
              <button
                onClick={() => setActiveRole('clipper')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  activeRole === 'clipper'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Clipper
              </button>
              <button
                onClick={() => setActiveRole('brand')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  activeRole === 'brand'
                    ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Brand
              </button>
              <button
                onClick={() => setActiveRole('admin')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  activeRole === 'admin'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Wallet Balance Badge */}
            <Link
              to="/wallet"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs font-bold hover:border-emerald-500 transition-colors"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-extrabold">${walletBalance.toFixed(2)}</span>
            </Link>

            {/* Login / Register CTAs */}
            <div className="flex items-center space-x-1.5">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-colors flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                <span>Log In</span>
              </Link>

              <Link
                to="/login?mode=register"
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0B0F19]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-card border border-slate-700/80 shadow-2xl p-4 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Notifications
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">2 New</span>
                  </div>
                  <div className="divide-y divide-slate-800/60 mt-2">
                    {notifications.map(n => (
                      <div key={n.id} className="py-2.5 first:pt-0 last:pb-0">
                        <p className="text-xs font-bold text-white">{n.title}</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">{n.text}</p>
                        <span className="text-[9px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-1.5 p-1 rounded-xl hover:bg-slate-900 transition-colors"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.display_name} 
                  className="w-7 h-7 rounded-full border border-emerald-500 object-cover"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card border border-slate-700 shadow-2xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <span className="font-extrabold text-white block">{currentUser.display_name}</span>
                    <span className="text-[10px] text-slate-400 block">{currentUser.email}</span>
                  </div>

                  <Link 
                    to="/brand" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Building2 className="w-4 h-4 text-purple-400" />
                    <span>Brand Overview & Kit</span>
                  </Link>

                  <Link 
                    to="/brand-settings" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Brand Settings</span>
                  </Link>

                  <Link 
                    to="/terms" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Terms & Conditions</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-left mt-1 border-t border-slate-800/80"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-2 text-sm font-semibold">
            <Link
              to="/"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Flame className="w-4 h-4 text-emerald-400" />
              <span>Explore Campaigns</span>
            </Link>

            <Link
              to="/brand"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-purple-400 bg-purple-500/10 border border-purple-500/20 font-extrabold"
            >
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>For Brands & Kit</span>
            </Link>

            {activeRole === 'clipper' && (
              <Link
                to="/clipper-dashboard"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>My Clips</span>
              </Link>
            )}

            {activeRole === 'brand' && (
              <Link
                to="/brand-dashboard"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <LayoutDashboard className="w-4 h-4 text-purple-400" />
                <span>Brand Portal</span>
              </Link>
            )}

            <Link
              to="/leaderboard"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </Link>

            <Link
              to="/terms"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Terms</span>
            </Link>
          </div>
        )}

      </div>
    </header>
  )
}
