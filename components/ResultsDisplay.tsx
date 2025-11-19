
import React from 'react';
import { AnalysisResult } from '../types';
import { CheckCircleIcon, ArrowRightIcon } from './icons';
import { t } from '../i18n';
import { Testimonials } from './Testimonials';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
  isPremium: boolean;
  onUnlock: () => void;
  onRegenerate: (index: number) => void;
  regenCounts: number[];
  isRegenerating: number | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
    result, onReset, isPremium, onUnlock, onRegenerate, regenCounts, isRegenerating 
}) => {
  
  const getTitleForIndex = (index: number) => {
    if (index === 0) return t('results.optionFrontMain');
    if (index === 1) return t('results.optionFrontBold');
    if (index === 2) return t('results.optionProfileRight');
    return t('results.optionProfileLeft');
  };

  const getSubtitleForIndex = (index: number) => {
    if (index === 0) return t('results.descFrontMain');
    if (index === 1) return t('results.descFrontBold');
    if (index === 2) return t('results.descProfileRight');
    return t('results.descProfileLeft');
  };

  return (
    <div className="animate-fade-in relative space-y-16">
      
      {/* Summary Section - Stone Card */}
      <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-stone-200/40 border border-white ring-1 ring-stone-100">
        <div className="text-center mb-8">
             <h3 className="text-xs font-bold text-gold-600 uppercase tracking-[0.2em] mb-2">{t('results.summaryTitle')}</h3>
             <h2 className="text-3xl font-serif text-stone-800">Morphological Analysis</h2>
        </div>
        <div className="max-w-3xl mx-auto">
            <p className="text-lg text-stone-600 leading-loose text-center font-light font-serif italic">"{result.summary}"</p>
        </div>
      </div>

      {/* Diagnostic/Blueprint Section - Dark Contrast */}
      <div className="bg-stone-900 text-white rounded-[2rem] overflow-hidden shadow-2xl border-4 border-stone-800 relative">
         <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
         <div className="p-8 md:p-10 border-b border-stone-800 bg-stone-800/50 flex justify-between items-center">
             <div>
                <h3 className="text-2xl font-serif font-medium text-white flex items-center">
                    {t('results.diagnosticTitle')}
                </h3>
                <p className="text-stone-400 text-sm mt-2 font-light tracking-wide">{t('results.diagnosticDescription')}</p>
             </div>
             <div className="hidden md:block px-4 py-2 bg-gold text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">Clinical View</div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2">
             <div className="p-10 flex items-center justify-center bg-black/40 relative">
                 <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                 <img src={result.diagnosticImage} alt="Visagism Diagnostic" className="relative w-full rounded-lg shadow-2xl border border-white/10 z-10" />
             </div>
             <div className="p-10 bg-stone-900/95 backdrop-blur">
                 <h4 className="text-gold-500 font-bold mb-8 text-xs uppercase tracking-[0.2em]">{t('results.recommendationsTitle')}</h4>
                 <ul className="space-y-6">
                    {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start group">
                            <span className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center mr-5 flex-shrink-0 border border-stone-700 group-hover:border-gold-500 transition-colors">
                                <CheckCircleIcon className="w-3 h-3 text-gold-500" />
                            </span>
                            <span className="text-stone-300 text-sm leading-relaxed font-light tracking-wide">{rec}</span>
                        </li>
                    ))}
                </ul>
             </div>
         </div>
      </div>

      {/* Final Results Section (LOCKED/BLURRED) */}
      <div className="relative pt-12">
        <div className="text-center mb-16">
            <span className="text-gold-600 text-xs font-bold uppercase tracking-[0.2em] block mb-3">{t('results.enhancedFaceSubtitle')}</span>
            <h3 className="text-4xl md:text-5xl font-serif font-medium text-stone-800">
                {t('results.enhancedFaceTitle')}
            </h3>
        </div>
        
        <div className={`grid grid-cols-1 gap-24 transition-all duration-1000 ${!isPremium ? 'filter blur-xl opacity-40 select-none pointer-events-none' : ''}`}>
          {result.enhancedImages.map((image, index) => (
            <div key={index} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-100 shadow-2xl shadow-stone-200/50 relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-marble opacity-50 rounded-bl-[100%] -z-0 pointer-events-none"></div>

                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-8 h-px bg-gold-500"></span>
                            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Option 0{index + 1}</span>
                        </div>
                        <h4 className="text-3xl font-serif text-stone-800">{getTitleForIndex(index)}</h4>
                        <p className="text-stone-400 text-sm mt-2 font-light">{getSubtitleForIndex(index)}</p>
                    </div>
                    
                    {isPremium && (
                        <div className="flex items-center mt-6 md:mt-0 bg-stone-50 rounded-full px-6 py-3 border border-stone-100 shadow-sm">
                            <span className="text-[10px] text-stone-400 mr-4 uppercase tracking-wider font-bold">{t('results.regenerationsLeft')}: <span className="text-stone-900">{regenCounts[index]}</span></span>
                            <button 
                                onClick={() => onRegenerate(index)}
                                disabled={regenCounts[index] <= 0 || isRegenerating === index}
                                className="text-stone-800 hover:text-gold-600 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-30 flex items-center"
                            >
                                {isRegenerating === index ? (
                                    <span className="animate-spin h-3 w-3 border-2 border-stone-800 border-t-transparent rounded-full mr-2"></span>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                )}
                                {t('results.regenerateButton')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative z-10">
                    {/* Original */}
                    <div className="space-y-5">
                        <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] text-center">{t('results.before')}</span>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 shadow-inner border border-stone-100">
                            <img src={image.original} alt="Original" className="w-full h-full object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-700" />
                        </div>
                    </div>

                    {/* Enhanced */}
                    <div className="space-y-5">
                         <span className="block text-[10px] font-bold text-gold-600 uppercase tracking-[0.2em] text-center">{t('results.after')}</span>
                         <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-8 ring-white">
                            <img src={image.generated} alt="Enhanced" className="w-full h-full object-cover" />
                            {/* Gold shine effect on corner */}
                            <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/30 blur-xl rotate-45"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 bg-stone-50/50 p-8 rounded-2xl border border-stone-100 relative z-10">
                    <h5 className="text-xs font-bold text-stone-800 mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="w-2 h-2 bg-gold rounded-full"></span>
                        {t('results.appliedChanges')}
                    </h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        {image.changes.map((change, cIndex) => (
                        <li key={cIndex} className="flex items-start text-stone-600 text-sm font-light tracking-wide">
                            <ArrowRightIcon className="w-3 h-3 text-gold-400 mr-3 flex-shrink-0 mt-1" />
                            <span>{change}</span>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
          ))}
        </div>

        {/* Payment Wall Overlay */}
        {!isPremium && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-40">
                <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl border border-white/50 text-center max-w-xl mx-4 ring-1 ring-stone-200/50">
                    <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl text-gold-400 border-4 border-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-4xl font-serif text-stone-900 mb-4">{t('results.lockedTitle')}</h3>
                    <p className="text-stone-500 mb-10 text-lg leading-relaxed font-light">{t('results.lockedSubtitle')}</p>
                    <button 
                        onClick={onUnlock}
                        className="w-full md:w-auto bg-gold text-white font-bold uppercase tracking-[0.2em] py-5 px-12 rounded-full shadow-xl shadow-gold-500/20 transform hover:-translate-y-1 transition-all duration-300"
                    >
                        {t('results.unlockButton')}
                    </button>
                    <p className="mt-8 text-[10px] text-stone-400 uppercase tracking-widest flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {t('payment.secure')}
                    </p>
                </div>
            </div>
        )}
      </div>
      
      {isPremium && (
          <>
            <div className="mt-24 border-t border-stone-200 pt-16">
                <Testimonials />
            </div>
            <div className="mt-16 text-center">
                <button
                onClick={onReset}
                className="bg-white text-stone-500 font-bold uppercase tracking-widest py-4 px-10 rounded-full hover:bg-stone-50 hover:text-gold-600 transition-all duration-300 border border-stone-200 shadow-sm text-xs"
                >
                {t('results.newAnalysisButton')}
                </button>
            </div>
        </>
      )}
    </div>
  );
};
