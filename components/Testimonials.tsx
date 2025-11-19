import React from 'react';
import { t } from '../i18n';

interface TestimonialItem {
    text: string;
    author: string;
    initial: string;
}

const TestimonialCard = ({ item }: { item: TestimonialItem }) => (
    <div className="bg-white border border-stone-100 p-8 rounded-2xl shadow-lg shadow-stone-200/20 relative mx-4 w-80 md:w-96 flex-shrink-0 hover:-translate-y-1 transition-transform duration-500">
         <div className="absolute -top-6 left-8 w-12 h-12 bg-stone-900 rounded-full text-gold border-2 border-white flex items-center justify-center font-serif font-bold shadow-md text-xl">
             {item.initial}
         </div>
         <div className="mt-4">
            <div className="flex text-gold-400 mb-4 text-[10px] tracking-widest gap-1">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="text-stone-600 text-sm italic mb-6 font-light leading-relaxed font-serif line-clamp-3">"{item.text}"</p>
            <div className="w-8 h-px bg-gold mb-3"></div>
            <p className="text-stone-900 text-xs font-bold uppercase tracking-widest">{item.author}</p>
         </div>
    </div>
);

export const Testimonials: React.FC = () => {
    const testimonials: TestimonialItem[] = [
        { text: t('testimonials.t1'), author: t('testimonials.t1_author'), initial: "G" },
        { text: t('testimonials.t2'), author: t('testimonials.t2_author'), initial: "M" },
        { text: t('testimonials.t3'), author: t('testimonials.t3_author'), initial: "E" },
        { text: t('testimonials.t4'), author: t('testimonials.t4_author'), initial: "L" },
        { text: t('testimonials.t5'), author: t('testimonials.t5_author'), initial: "S" },
        { text: t('testimonials.t6'), author: t('testimonials.t6_author'), initial: "A" },
        { text: t('testimonials.t7'), author: t('testimonials.t7_author'), initial: "F" },
        { text: t('testimonials.t8'), author: t('testimonials.t8_author'), initial: "G" }
    ];

    // Split into two rows
    const row1 = testimonials.slice(0, 4);
    const row2 = testimonials.slice(4, 8);

    return (
        <div className="overflow-hidden py-10">
            <h3 className="text-3xl font-serif text-center text-stone-800 mb-16 italic">{t('testimonials.title')}</h3>
            
            {/* Row 1 - Scroll Left */}
            <div className="relative w-full mb-10 flex">
                <div className="animate-scroll flex">
                    {[...row1, ...row1, ...row1].map((item, i) => (
                        <TestimonialCard key={`r1-${i}`} item={item} />
                    ))}
                </div>
            </div>

            {/* Row 2 - Scroll Right (Reverse) */}
            <div className="relative w-full flex">
                <div className="animate-scroll-reverse flex">
                    {[...row2, ...row2, ...row2].map((item, i) => (
                         <TestimonialCard key={`r2-${i}`} item={item} />
                    ))}
                </div>
            </div>
            
            {/* Gradients to fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-marble to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-marble to-transparent z-10 pointer-events-none"></div>
        </div>
    );
};