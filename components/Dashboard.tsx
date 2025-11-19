
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { t } from '../i18n';
import { XIcon, ChartBarIcon, ShieldCheckIcon, SparklesIcon } from './icons';

interface DashboardProps {
  onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [isCancelling, setIsCancelling] = useState(false);

  if (!user) {
      return <div className="text-center p-10">Please log in</div>;
  }

  const handleCancel = () => {
      if(confirm("Sei sicuro di voler cancellare l'abbonamento? Perderai accesso alle funzionalità Premium alla fine del periodo.")) {
          setIsCancelling(true);
          setTimeout(() => {
              alert("Abbonamento cancellato con successo. Rimarrà attivo fino a fine mese.");
              setIsCancelling(false);
          }, 1500);
      }
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl md:text-4xl font-serif text-stone-800">
                {t('dashboard.title')}
            </h1>
            <button 
                onClick={onBack} 
                className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500"
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Card */}
            <div className="md:col-span-1 bg-white p-8 rounded-3xl shadow-lg border border-stone-100">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 text-2xl font-serif font-bold mb-4 mx-auto">
                     {user.name.charAt(0)}
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-stone-800">{user.name}</h2>
                    <p className="text-stone-500 text-sm mb-6">{user.email}</p>
                    <button 
                        onClick={() => { logout(); onBack(); }}
                        className="text-xs text-red-500 font-bold uppercase tracking-widest hover:underline"
                    >
                        {t('auth.logout')}
                    </button>
                </div>
            </div>

            {/* Subscription Status */}
            <div className="md:col-span-2 bg-stone-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheckIcon className="w-32 h-32" />
                </div>
                <h3 className="text-gold-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">{t('dashboard.planStatus')}</h3>
                <div className="text-2xl md:text-3xl font-serif mb-6">
                    {user.isPremium ? t('dashboard.planPro') : t('dashboard.planFree')}
                </div>
                
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <span className="block text-[10px] text-stone-400 uppercase tracking-wider">Status</span>
                        <span className="font-bold text-green-400 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            {t('dashboard.active')}
                        </span>
                    </div>
                    {user.isPremium && (
                         <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                            <span className="block text-[10px] text-stone-400 uppercase tracking-wider">{t('dashboard.credits')}</span>
                            <span className="font-bold text-white flex items-center gap-1">
                                <SparklesIcon className="w-4 h-4 text-gold" />
                                {user.regenCredits.reduce((a, b) => a + b, 0)}
                            </span>
                        </div>
                    )}
                </div>

                {user.isPremium ? (
                    <button 
                        onClick={handleCancel}
                        disabled={isCancelling}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-full transition-colors border border-red-500/30"
                    >
                        {isCancelling ? 'Processing...' : t('dashboard.cancelSub')}
                    </button>
                ) : (
                    <button className="bg-gold text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-full shadow-lg hover:bg-white hover:text-gold transition-colors">
                        {t('payment.payButton')}
                    </button>
                )}
            </div>

            {/* Past Reports (Mock) */}
            <div className="md:col-span-3 bg-white p-8 rounded-3xl shadow-lg border border-stone-100">
                <div className="flex items-center gap-3 mb-6">
                    <ChartBarIcon className="w-5 h-5 text-gold-500" />
                    <h3 className="text-lg font-bold text-stone-800">{t('dashboard.yourReports')}</h3>
                </div>
                
                <div className="bg-stone-50 rounded-xl p-8 text-center border border-dashed border-stone-200">
                    <p className="text-stone-400 italic mb-4">{t('dashboard.noReports')}</p>
                    <button onClick={onBack} className="text-stone-800 text-xs font-bold uppercase tracking-widest hover:text-gold-600 underline">
                        {t('results.newAnalysisButton')}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
