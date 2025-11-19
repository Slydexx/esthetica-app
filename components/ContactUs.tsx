
import React, { useState } from 'react';
import { t } from '../i18n';
import { XIcon } from './icons';

interface ContactProps {
    onBack: () => void;
}

export const ContactUs: React.FC<ContactProps> = ({ onBack }) => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submission
        setSubmitted(true);
    };

    return (
        <div className="bg-white p-8 md:p-16 rounded-[2rem] shadow-xl border border-stone-100 animate-fade-in relative min-h-[600px] flex flex-col justify-center">
            <button 
                onClick={onBack} 
                className="absolute top-8 right-8 p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500"
            >
                <XIcon className="w-6 h-6" />
            </button>

            <div className="max-w-xl mx-auto w-full">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">{t('contact.title')}</h1>
                    <p className="text-stone-500 font-light">
                        {t('contact.subtitle')}
                    </p>
                </div>

                {submitted ? (
                    <div className="bg-stone-50 p-10 rounded-2xl text-center border border-stone-200">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                        <h3 className="text-xl font-serif text-stone-800 mb-2">{t('contact.sentTitle')}</h3>
                        <p className="text-stone-500 mb-6">{t('contact.sentDesc')}</p>
                        <button 
                            onClick={onBack}
                            className="bg-stone-900 text-white px-8 py-3 rounded-full uppercase text-xs font-bold tracking-widest hover:bg-gold-600 transition-colors"
                        >
                            {t('contact.returnHome')}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{t('contact.emailLabel')}</label>
                            <input type="email" required className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-400 outline-none transition-colors" placeholder="you@example.com" />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{t('contact.subjectLabel')}</label>
                            <select className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-400 outline-none transition-colors text-stone-600">
                                <option>{t('contact.subjects.general')}</option>
                                <option>{t('contact.subjects.tech')}</option>
                                <option>{t('contact.subjects.billing')}</option>
                                <option>{t('contact.subjects.partner')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{t('contact.messageLabel')}</label>
                            <textarea required rows={5} className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-400 outline-none transition-colors resize-none" placeholder="How can we help?"></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-gold text-white font-bold uppercase tracking-[0.2em] py-4 rounded-full shadow-lg hover:bg-gold-600 transition-colors transform hover:-translate-y-1"
                        >
                            {t('contact.sendButton')}
                        </button>
                    </form>
                )}

                <div className="mt-12 text-center">
                    <p className="text-xs text-stone-400">{t('contact.orEmail')} <a href="mailto:support@esthetica.ai" className="text-gold-600 hover:underline">support@esthetica.ai</a></p>
                </div>
            </div>
        </div>
    );
};
