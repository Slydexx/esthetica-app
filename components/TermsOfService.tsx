
import React from 'react';
import { t } from '../i18n';
import { XIcon } from './icons';

interface TermsProps {
    onBack: () => void;
}

export const TermsOfService: React.FC<TermsProps> = ({ onBack }) => {
    return (
        <div className="bg-white p-8 md:p-16 rounded-[2rem] shadow-xl border border-stone-100 animate-fade-in relative">
            <button 
                onClick={onBack} 
                className="absolute top-8 right-8 p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500"
            >
                <XIcon className="w-6 h-6" />
            </button>

            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-8">{t('legal.termsTitle')}</h1>
                
                <div className="prose prose-stone text-stone-600 leading-relaxed space-y-6">
                    <p className="font-light text-lg">
                        {t('legal.termsIntro')}
                    </p>

                    <h3 className="text-xl font-bold text-stone-800 mt-8">{t('legal.termsSec1Title')}</h3>
                    <p>
                        {t('legal.termsSec1Text')}
                    </p>

                    <h3 className="text-xl font-bold text-stone-800 mt-8">{t('legal.termsSec2Title')}</h3>
                    <p>
                        {t('legal.termsSec2Text')}
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>Upload only photos of yourself or individuals for whom you have legal authorization.</li>
                            <li>Not use the service for any illegal or unauthorized purpose.</li>
                            <li>Not attempt to reverse engineer the AI algorithms.</li>
                        </ul>
                    </p>

                    <h3 className="text-xl font-bold text-stone-800 mt-8">{t('legal.termsSec3Title')}</h3>
                    <p>
                        {t('legal.termsSec3Text')}
                    </p>

                    <h3 className="text-xl font-bold text-stone-800 mt-8">4. Limitation of Liability</h3>
                    <p>
                        Esthetica AI shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service.
                    </p>
                </div>

                <div className="mt-12 pt-8 border-t border-stone-200 text-center">
                    <button 
                        onClick={onBack}
                        className="text-xs font-bold text-stone-400 uppercase tracking-widest hover:text-gold-600 transition-colors"
                    >
                        {t('legal.backHome')}
                    </button>
                </div>
            </div>
        </div>
    );
};
