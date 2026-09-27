import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  BookOpen,
  Award,
  GraduationCap,
  Briefcase,
  Bookmark,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAdmin, logout, bookmarks } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/opportunities', label: 'Opportunities', icon: Search },
    { to: '/exams', label: 'Examinations', icon: Award },
    { to: '/scholarships', label: 'Scholarships', icon: BookOpen },
    { to: '/courses', label: 'Courses', icon: GraduationCap },
    { to: '/careers', label: 'Career Paths', icon: Briefcase },
    { to: '/about', label: 'About', icon: Compass }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0b0a]/90 backdrop-blur-xl border-b border-stone-850 border-stone-800 text-stone-100 shadow-lg shadow-black/25 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center text-stone-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 group-hover:shadow-amber-500/35 transition-all duration-200">
              <Compass className="w-5.5 h-5.5 transition-transform duration-700 group-hover:rotate-45" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white transition-colors">
                Path<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Finder</span>
              </span>
              <p className="text-[10px] font-bold tracking-wider uppercase leading-none hidden sm:block text-stone-400">
                Discover • Learn • Grow
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 rounded-2xl border bg-stone-900/80 border-stone-800 backdrop-blur-md">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'text-stone-950 bg-amber-400 font-black shadow-xs'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800'
                    }`
                  }
                >
                  {Icon && <Icon className="w-3.5 h-3.5 opacity-80" />}
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Dashboard Link */}
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all border text-stone-200 hover:text-amber-400 hover:bg-stone-900 border-transparent hover:border-stone-800"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-500" />
                  Dashboard
                </Link>

                {/* Saved Items */}
                <Link
                  to="/saved"
                  className="relative p-2.5 rounded-xl transition-all border text-stone-300 hover:text-amber-400 hover:bg-stone-900 border-transparent hover:border-stone-800"
                  title="Saved Opportunities"
                  aria-label="Saved Opportunities"
                >
                  <Bookmark className="w-4.5 h-4.5" />
                  {bookmarks.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-amber-500 text-stone-950 text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                      {bookmarks.length}
                    </span>
                  )}
                </Link>

                {/* Admin Portal Button */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-950/60 text-amber-300 border border-amber-800/80 hover:bg-amber-900/60 transition-all shadow-2xs"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    Admin Suite
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl border border-stone-800 bg-stone-900/90 hover:border-amber-500/60 text-white transition-all shadow-2xs cursor-pointer active:scale-98"
                  >
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-stone-950 flex items-center justify-center text-xs font-black shadow-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-bold max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-60 bg-stone-900/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/40 border border-stone-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-stone-200"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-stone-800">
                        <p className="text-xs font-black text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-stone-400 truncate mt-0.5">{user.email}</p>
                        {user.educationLevel && (
                          <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/60">
                            {user.educationLevel}
                          </span>
                        )}
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-stone-300 hover:bg-stone-800 hover:text-amber-400 transition-colors"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        My Profile & Preferences
                      </Link>
                      <Link
                        to="/saved"
                        className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-stone-300 hover:bg-stone-800 hover:text-amber-400 transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Bookmark className="w-4 h-4 text-stone-400" />
                          Saved Opportunities
                        </span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 bg-amber-950 text-amber-300 rounded-md">
                          {bookmarks.length}
                        </span>
                      </Link>
                      <div className="border-t border-stone-800 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold rounded-xl transition-all text-stone-300 hover:text-white hover:bg-stone-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-black text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 rounded-xl shadow-md shadow-amber-500/20 transition-all hover:shadow-amber-500/35 hover:-translate-y-0.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl transition-colors cursor-pointer text-stone-300 hover:bg-stone-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl bg-[#0b0b0a]/95 border-stone-800 text-stone-200">
          {user && (
            <div className="p-3.5 rounded-2xl mb-2 border bg-stone-900 border-stone-800">
              <p className="text-sm font-black text-white">{user.name}</p>
              <p className="text-xs text-stone-400">{user.email}</p>
              {user.educationLevel && (
                <p className="text-xs text-amber-400 font-bold mt-1 inline-block px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/60">
                  {user.educationLevel}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl text-stone-300 hover:bg-stone-800 hover:text-white"
                >
                  {Icon && <Icon className="w-4 h-4 text-amber-400" />}
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t pt-3 space-y-2 border-stone-800">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-stone-300 hover:bg-stone-800 rounded-xl"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-stone-300 hover:bg-stone-800 rounded-xl"
                >
                  <span className="flex items-center gap-3">
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span>Saved Opportunities</span>
                  </span>
                  <span className="px-2 py-0.5 bg-amber-950 text-amber-300 text-xs rounded-full font-bold">
                    {bookmarks.length}
                  </span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-stone-300 hover:bg-stone-800 rounded-xl"
                >
                  <User className="w-4 h-4 text-stone-400" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-xl flex items-center gap-3 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-xs font-bold text-stone-300 bg-stone-900 rounded-xl border border-stone-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-xs font-black text-stone-950 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
