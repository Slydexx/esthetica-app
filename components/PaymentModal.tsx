
import React, { useState } from 'react';
import { t } from '../i18n';
import { CheckCircleIcon, XIcon, SparklesIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  // Configurazione Link Stripe
  const STRIPE_LINK = "https://buy.stripe.com/fZucN5dTNfVWakh6QscAo04";

  const handlePay = () => {
    setIsProcessing(true);
    
    // Aggiungi email utente per pre-compilare il checkout (Migliora conversione)
    const finalLink = user?.email
        ? `${STRIPE_LINK}?prefilled_email=${encodeURIComponent(user.email)}`
        : STRIPE_LINK;
        
    // Redirect a Stripe
    window.location.href = finalLink;
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col md:flex-row ring-1 ring-white/50">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition-colors z-20 bg-white rounded-full p-2 shadow-sm"
        >
          <XIcon className="w-5 h-5" />
        </button>
        
        {/* Branding Side */}
        <div className="hidden md:flex md:w-5/12 bg-stone-900 p-12 flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-marble opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/0 via-stone-900/50 to-stone-900/90"></div>
            
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold-300 text-[10px] font-bold uppercase tracking-widest mb-6">
                    <SparklesIcon className="w-3 h-3" />
                    {t('payment.launchPromo')}
                </div>
                <h2 className="text-4xl font-serif italic mb-6 text-gold-200 leading-tight">{t('payment.title')}</h2>
                <p className="text-stone-300 text-sm leading-relaxed font-light border-l-2 border-gold pl-4">
                    "Invest in your image. The AI analysis provides the blueprint for your best self."
                </p>
            </div>
            <div className="relative z-10 text-[10px] text-stone-500 uppercase tracking-widest space-y-2">
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> SSL Encrypted</p>
                <p>Stripe Secure Checkout</p>
            </div>
        </div>

        {/* Content Side */}
        <div className="p-8 md:p-12 md:w-7/12 bg-stone-50 flex flex-col justify-center">
          <div className="md:hidden mb-8 text-center">
            <h2 className="text-3xl font-serif text-stone-900">{t('payment.title')}</h2>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gold relative overflow-hidden">
            {/* Promo Badge */}
            <div className="absolute top-0 right-0 bg-gold text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-sm">
               -50% {t('payment.promoTag')}
            </div>

            <div className="flex justify-between items-end mb-8 border-b border-stone-100 pb-6">
                <div>
                    <h3 className="text-lg font-bold text-stone-800 uppercase tracking-wide mb-1">{t('payment.fullPackage')}</h3>
                    <p className="text-xs text-stone-400 line-through">€18.99</p>
                </div>
                <div className="text-4xl font-serif text-gold-600 font-medium">€9.99</div>
            </div>
            
            <ul className="space-y-4 mb-10">
              {[
                  t('payment.feature1'),
                  t('payment.feature2'),
                  t('payment.feature3'),
                  t('payment.feature4'),
                  t('payment.featurePro')
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start text-stone-600 text-sm font-light">
                  <CheckCircleIcon className="w-5 h-5 mr-3 flex-shrink-0 text-gold-500" />
                  <span className="mt-0.5">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 rounded-full font-bold transition-all duration-300 text-xs uppercase tracking-[0.2em] bg-stone-900 hover:bg-gold text-white shadow-xl hover:shadow-gold-500/20 transform hover:-translate-y-1"
            >
              {isProcessing ? 'Redirecting...' : t('payment.payButton')}
            </button>
            
            <p className="text-center mt-4 text-[10px] text-stone-400">
                {t('payment.oneTimePayment')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
