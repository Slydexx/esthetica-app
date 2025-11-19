
import React, { useState, useEffect } from 'react';
import { UserData, Gender } from '../types';
import { t, getLanguage } from '../i18n';
import { PlayIcon } from './icons';

interface UserInfoFormProps {
  onSubmit: (data: UserData) => void;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [makeupPreference, setMakeupPreference] = useState<boolean | null>(null);
  
  const lang = getLanguage();
  const genderOptions: Gender[] = lang === 'it' 
    ? ['Uomo', 'Donna', 'Non specificato']
    : ['Man', 'Woman', 'Unspecified'];

  const isFormValid = name.trim() && age && Number(age) > 0 && gender && (gender !== 'Non specificato' && gender !== 'Unspecified' || makeupPreference !== null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit({
        name: name.trim(),
        age: Number(age),
        gender: gender as Gender,
        makeupPreference: (gender === 'Non specificato' || gender === 'Unspecified') ? makeupPreference! : undefined,
      });
    }
  };

  useEffect(() => {
    if (gender !== 'Non specificato' && gender !== 'Unspecified') {
        setMakeupPreference(null);
    }
  }, [gender]);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pt-10">
        
        {/* Form Section - Stone Slab Look */}
        <div className="bg-white p-8 md:p-16 rounded-[2rem] shadow-2xl shadow-stone-200/50 border border-stone-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gold"></div>
            
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">{t('userInfo.title')}</h2>
                <p className="text-stone-500 font-light">{t('userInfo.subtitle')}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Field - Full Width */}
                <div className="group">
                    <label htmlFor="name" className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 group-focus-within:text-gold-600 transition-colors">{t('userInfo.nameLabel')}</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-100 outline-none text-stone-800 transition-all shadow-inner" placeholder="Marco" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                        <label htmlFor="age" className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 group-focus-within:text-gold-600 transition-colors">{t('userInfo.ageLabel')}</label>
                        <input type="number" id="age" value={age} onChange={e => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))} required min="16" className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-100 outline-none text-stone-800 transition-all shadow-inner" placeholder="25" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">{t('userInfo.genderLabel')}</label>
                        <div className="flex flex-wrap gap-3">
                            {genderOptions.map(g => (
                                <button type="button" key={g} onClick={() => setGender(g)} className={`px-6 py-4 rounded-xl font-medium text-sm transition-all duration-300 flex-1 border shadow-sm ${gender === g ? 'bg-stone-800 text-white border-stone-800 shadow-lg transform -translate-y-1' : 'bg-white text-stone-500 border-stone-200 hover:border-gold-300 hover:text-gold-600'}`}>
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {(gender === 'Non specificato' || gender === 'Unspecified') && (
                    <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 animate-fade-in">
                        <label className="block text-sm font-serif text-stone-800 mb-6 text-center">{t('userInfo.makeupQuestion')}</label>
                        <div className="flex justify-center gap-6">
                            <button type="button" onClick={() => setMakeupPreference(true)} className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 border ${makeupPreference === true ? 'bg-gold text-white border-transparent shadow-lg' : 'bg-white text-stone-400 border-stone-200'}`}>
                                {t('userInfo.yes')}
                            </button>
                            <button type="button" onClick={() => setMakeupPreference(false)} className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 border ${makeupPreference === false ? 'bg-stone-800 text-white border-stone-800 shadow-lg' : 'bg-white text-stone-400 border-stone-200'}`}>
                                {t('userInfo.no')}
                            </button>
                        </div>
                    </div>
                )}

                <div className="text-center pt-8">
                    <button type="submit" disabled={!isFormValid} className="w-full md:w-auto bg-gold text-white font-bold uppercase tracking-[0.2em] py-5 px-16 rounded-full hover:shadow-2xl hover:shadow-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 transform hover:-translate-y-1">
                        {t('userInfo.continueButton')}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};
