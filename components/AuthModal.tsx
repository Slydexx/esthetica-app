
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { t } from '../i18n';
import { XIcon } from './icons';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type Mode = 'login' | 'register' | 'forgot-password';

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register, resetPassword } = useAuth();

  const getTitle = () => {
      if (mode === 'login') return t('auth.loginTitle');
      if (mode === 'register') return t('auth.registerTitle');
      return t('auth.forgotPasswordTitle');
  };

  const getDescription = () => {
      if (mode === 'login') return t('auth.loginDesc');
      if (mode === 'register') return t('auth.registerDesc');
      return t('auth.forgotPasswordDesc');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onSuccess();
        onClose();
      } else if (mode === 'register') {
        if (!name) throw new Error(t('auth.errorNameRequired'));
        await register(email, password, name);
        onSuccess();
        onClose();
      } else if (mode === 'forgot-password') {
        await resetPassword(email);
        setSuccessMessage(t('auth.resetSuccess'));
      }
    } catch (err) {
      if (err instanceof Error) {
          setError(err.message);
      } else {
          setError(t('app.errorUnknown'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors z-10"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="p-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                    {getTitle()}
                </h2>
                <p className="text-stone-500 text-sm">
                    {getDescription()}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">{t('auth.nameLabel')}</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:border-amber-500 outline-none transition-colors"
                            placeholder="Es. Mario"
                            required
                        />
                    </div>
                )}
                
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">{t('auth.emailLabel')}</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:border-amber-500 outline-none transition-colors"
                        placeholder="hello@example.com"
                        required
                    />
                </div>

                {mode !== 'forgot-password' && (
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">{t('auth.passwordLabel')}</label>
                            {mode === 'login' && (
                                <button 
                                    type="button" 
                                    onClick={() => { setMode('forgot-password'); setError(null); setSuccessMessage(null); }}
                                    className="text-[10px] text-stone-400 hover:text-amber-600 font-bold uppercase tracking-wider"
                                >
                                    {t('auth.forgotPasswordLink')}
                                </button>
                            )}
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:border-amber-500 outline-none transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                )}

                {error && <div className="text-red-500 text-xs text-center">{error}</div>}
                {successMessage && <div className="text-green-600 text-xs text-center font-bold">{successMessage}</div>}

                <button 
                    type="submit" 
                    disabled={isLoading || (mode === 'forgot-password' && !!successMessage)}
                    className="w-full bg-stone-900 text-white font-bold py-4 rounded-lg hover:bg-amber-600 transition-colors shadow-lg shadow-stone-900/10 disabled:opacity-50"
                >
                    {isLoading 
                        ? '...' 
                        : (mode === 'login' ? t('auth.loginButton') : mode === 'register' ? t('auth.registerButton') : t('auth.resetButton'))
                    }
                </button>
            </form>

            <div className="mt-6 text-center pt-6 border-t border-stone-100">
                <button 
                    onClick={() => {
                        if (mode === 'forgot-password') {
                            setMode('login');
                        } else {
                            setMode(mode === 'login' ? 'register' : 'login');
                        }
                        setError(null);
                        setSuccessMessage(null);
                    }}
                    className="text-sm text-stone-500 hover:text-stone-900 underline"
                >
                    {mode === 'login' 
                        ? t('auth.switchToRegister') 
                        : mode === 'register' 
                            ? t('auth.switchToLogin')
                            : t('auth.backToLogin')
                    }
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
