import React, { useState } from 'react';
import { Shield, Flame, History, Bot, Lock, Globe, Menu, X, Sparkles, CheckCircle2, User as UserIcon, LogOut } from 'lucide-react';
import { LanguageCode } from '../types';
import { User } from 'firebase/auth';

interface NavbarProps {
  activeTab: 'detector' | 'trending' | 'history' | 'assistant' | 'admin';
  setActiveTab: (tab: 'detector' | 'trending' | 'history' | 'assistant' | 'admin') => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  savedCount: number;
  currentUser: User | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  savedCount,
  currentUser,
  onOpenAuth,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const langNames: Record<LanguageCode, string> = {
    en: 'English (US)',
    es: 'Español',
    hi: 'हिन्दी',
    fr: 'Français',
    de: 'Deutsch',
    ar: 'العربية'
  };

  interface NavItem {
    id: 'detector' | 'trending' | 'history' | 'assistant' | 'admin';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'detector', label: 'Detector Engine', icon: Shield },
    { id: 'trending', label: 'Trending Debunks', icon: Flame },
    { id: 'history', label: 'Saved Reports', icon: History, badge: savedCount },
    { id: 'assistant', label: 'Lens AI', icon: Bot },
    { id: 'admin', label: 'Admin Portal', icon: Lock }
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => { setActiveTab('detector'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                TruthLens
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                AI 3.6
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Silicon Valley Misinformation Intelligence
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-blue-600/90 shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-blue-700' : 'bg-slate-800 text-blue-400 border border-blue-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Language, Live AI Status, Auth Profile */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-all">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{langNames[language].split(' ')[0]}</span>
            </button>
            <div className="absolute right-0 mt-2 w-40 py-1 bg-slate-900 border border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {(Object.keys(langNames) as LanguageCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between ${
                    language === code ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{langNames[code]}</span>
                  {language === code && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Engine Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-[11px] font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Forensic Engine Active</span>
          </div>

          {/* Firebase Auth User Status */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs text-white transition-all shadow-md"
              >
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="User" 
                    className="w-6 h-6 rounded-lg object-cover border border-blue-400"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold text-xs">
                    {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-bold max-w-[100px] truncate">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 py-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 text-xs space-y-1">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="font-bold text-white truncate">{currentUser.displayName || 'TruthLens Member'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onSignOut();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In / Sign Up</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'text-white bg-blue-600'
                    : 'text-slate-300 bg-slate-900/60 border border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-400 text-slate-950 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Mobile Auth Button */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            {currentUser ? (
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-xs border border-blue-500/40">
                    {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[150px]">
                      {currentUser.displayName || 'TruthLens Member'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-rose-500/10 text-rose-400 rounded-lg text-xs font-bold border border-rose-500/30 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In / Sign Up</span>
              </button>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Language:</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-2 py-1"
              >
                {(Object.keys(langNames) as LanguageCode[]).map((code) => (
                  <option key={code} value={code}>
                    {langNames[code]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
