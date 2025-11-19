
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { t } from '../i18n';

interface HeaderProps {
    onNavigate?: (page: 'dashboard' | 'home') => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <header className="bg-white/80 border-b border-stone-200/50 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
              {/* Logo Symbol */}
              <div className="w-10 h-10 bg-stone-900 text-white rounded-sm flex items-center justify-center shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gold opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <span className="font-serif font-bold text-2xl text-gold-200 relative z-10">E</span>
              </div>
              {/* Text Logo with Gradient */}
              <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wide uppercase leading-none">
                    <span className="text-gold">Esthetica</span>
                  </h1>
                  <span className="text-[8px] tracking-[0.3em] uppercase text-stone-400 font-bold pl-0.5">AI Advisor</span>
              </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Desktop Tagline */}
             <div className="hidden md:flex items-center space-x-6 text-[10px] font-bold tracking-widest text-stone-400 uppercase mr-4">
                <span>Clinical Precision</span>
                <span className="text-stone-200">|</span>
                <span>Est. 2025</span>
             </div>

             {user ? (
                 <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                     <div className="text-right hidden sm:block">
                         <div className="text-xs font-bold text-stone-800">{user.name}</div>
                         <button 
                            onClick={() => onNavigate && onNavigate('dashboard')}
                            className="text-[9px] font-bold tracking-wider uppercase text-gold-600 hover:underline"
                         >
                             {t('header.dashboard')}
                         </button>
                     </div>
                     <div onClick={() => onNavigate && onNavigate('dashboard')} className="h-9 w-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 font-serif font-bold shadow-inner cursor-pointer hover:border-gold-400 transition-colors">
                         {user.name.charAt(0)}
                     </div>
                 </div>
             ) : (
                 <button 
                    onClick={() => setShowAuth(true)}
                    className="text-xs font-bold uppercase tracking-widest text-stone-800 border border-stone-300 px-5 py-2.5 rounded hover:bg-stone-50 hover:border-gold-400 transition-all"
                 >
                     {t('auth.loginButton')}
                 </button>
             )}
          </div>
        </div>
      </header>

      {showAuth && (
          <AuthModal 
            onClose={() => setShowAuth(false)} 
            onSuccess={() => {}} 
          />
      )}
    </>
  );
};
