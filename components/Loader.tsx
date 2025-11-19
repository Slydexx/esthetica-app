import React, { useState, useEffect, useRef } from 'react';
import { t } from '../i18n';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  const [currentTip, setCurrentTip] = useState('');
  const [opacity, setOpacity] = useState(1);
  const tipsQueueRef = useRef<string[]>([]);

  useEffect(() => {
    const allTips = t('tips') as string[];
    if (Array.isArray(allTips) && allTips.length > 0) {
      const shuffled = [...allTips];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      tipsQueueRef.current = shuffled;
      setCurrentTip(tipsQueueRef.current.pop() || allTips[0]);

      const interval = setInterval(() => {
        setOpacity(0);
        setTimeout(() => {
          if (tipsQueueRef.current.length === 0) {
             const reShuffle = [...allTips];
             for (let i = reShuffle.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [reShuffle[i], reShuffle[j]] = [reShuffle[j], reShuffle[i]];
             }
             tipsQueueRef.current = reShuffle;
          }
          const nextTip = tipsQueueRef.current.pop();
          if (nextTip) setCurrentTip(nextTip);
          setOpacity(1);
        }, 500);
      }, 6000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-20 text-center min-h-[500px] animate-fade-in bg-white rounded-[3rem] shadow-xl border border-stone-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-marble opacity-20"></div>
      
      <div className="relative w-24 h-24 z-10">
        <div className="absolute inset-0 border-4 border-stone-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-gold border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
      
      <h3 className="mt-10 text-2xl font-serif font-medium text-stone-800 tracking-wide relative z-10">{message}</h3>
      
      <div className="mt-10 max-w-lg mx-auto min-h-[100px] flex items-center justify-center relative z-10">
        <p 
          className="text-stone-500 italic text-lg font-light font-serif transition-opacity duration-500"
          style={{ opacity: opacity }}
        >
          "{currentTip}"
        </p>
      </div>
      
      <p className="mt-8 text-[10px] text-stone-400 uppercase tracking-[0.2em] relative z-10">{t('loader.patience')}</p>
    </div>
  );
};