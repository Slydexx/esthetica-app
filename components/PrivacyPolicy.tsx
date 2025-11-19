
import React from 'react';
import { t } from '../i18n';
import { XIcon } from './icons';

interface PrivacyPolicyProps {
    onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    return (
        <div className="bg-white p-8 md:p-16 rounded-[2rem] shadow-xl border border-stone-100 animate-fade-in relative">
            <button 
                onClick={onBack} 
                className="absolute top-8 right-8 p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500"
            >
                <XIcon className="w-6 h-6" />
            </button>

            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-8">{t('legal.privacyTitle')}</h1>
                
                <div className="prose prose-stone text-stone-600 leading-relaxed space-y-6">
                    <p className="font-light text-lg border-l-4 border-gold pl-4 italic">
                        {t('legal.lastUpdated')}
                    </p>

                    <h3 className="text-xl font-bold text-stone-800 mt-8">{t('legal.section1Title')}</h3>
                    <p>
                        {t('legal.section1Text')}
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li><strong>Facial Images:</strong> {t('legal.section1List1')}</li>
                            <li><strong>User Data:</strong> {t('legal.section1List2')}</li>
                            <li><strong>Technical Data:</strong> {t('legal.section1List3')}</li>
                        </ul>
                    </p>

                    <h3 className="text-xl font-bold text-stone-800 mt-8">{t('legal.section2Title')}</h3>
                    <p>
                        {t('legal.section2Text')}
                    </p>

                    <h3 className="text-xl font-bold text-stone-800 mt-8">{t('legal.section3Title')}</h3>
                    <p>
                        {t('legal.section3Text')}
                    </p>

                    <h3 className="text-xl font-bold text-stone-800 mt-8">{t('legal.section4Title')}</h3>
                    <p>
                        {t('legal.section4Text')}
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
