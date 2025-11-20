
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { PaymentModal } from './components/PaymentModal';
import { Testimonials } from './components/Testimonials';
import { AuthModal } from './components/AuthModal';
import { analyzeAndEnhanceFaces, regenerateSingleImage } from './services/geminiService';
import { AnalysisResult, UserData } from './types';
import { UserInfoForm } from './components/UserInfoForm';
import { t, getLanguage } from './i18n';
import { useAuth } from './contexts/AuthContext';
import { authService } from './services/authService';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { ContactUs } from './components/ContactUs';
import { Dashboard } from './components/Dashboard';
import { CameraIcon, ScanFaceIcon, MagicWandIcon, PlayIcon } from './components/icons';

type AppStep = 'landing' | 'imageUpload' | 'userInfo' | 'loading' | 'results';
type PageView = 'home' | 'dashboard' | 'privacy' | 'terms' | 'contact';

const App: React.FC = () => {
  const [view, setView] = useState<PageView>('home');
  const [step, setStep] = useState<AppStep>('imageUpload'); // Start at image upload via landing
  const [userData, setUserData] = useState<UserData | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Monetization & Features State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const { user, upgradeUser, updateCredits } = useAuth();
  const lang = useMemo(() => getLanguage(), []);

  // --- PERSISTENCE & PAYMENT SUCCESS HANDLER ---
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const paymentSuccess = query.get('payment_success');
    const plan = query.get('plan');

    // 1. If returning from Stripe successfully
    if (paymentSuccess === 'true' && plan) {
        // Restore analysis from local storage so the user sees their result immediately
        const savedResult = localStorage.getItem('esthetica_last_analysis');
        if (savedResult) {
            try {
                const parsed = JSON.parse(savedResult);
                setAnalysisResult(parsed);
                setStep('results'); // Force view to results
                // Also restore images for context if needed, though result has them
                if (parsed.enhancedImages && parsed.enhancedImages.length > 0) {
                    setUploadedImages([parsed.enhancedImages[0].original]); 
                }
            } catch (e) {
                console.error("Failed to restore analysis", e);
            }
        }

        // Upgrade user logic
        if (user) {
            const planType = plan === 'pro' ? 'pro' : 'single';
            upgradeUser(planType).then(() => {
                // Remove query params to clean URL
                window.history.replaceState({}, '', window.location.pathname);
                alert(t('payment.successAlert') || "Pagamento confermato! Analisi sbloccata.");
            });
        }
    }
  }, [user, upgradeUser]);


  const regenCounts = user?.regenCredits || [2, 2, 2, 2];
  const isPremium = !!user?.isPremium;

  const handleImagesUpload = (images: string[]) => {
    setUploadedImages(images);
    if (images.length === 3) {
      setError(null);
    }
  };
  
  const goToUserInfo = () => {
      if (uploadedImages.length !== 3) {
          setError(t('imageUploader.errorThreeImages'));
          return;
      }
      setError(null);
      setStep('userInfo');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserInfoSubmit = async (data: UserData) => {
    setUserData(data);
    setStep('loading');
    setError(null);
    setAnalysisResult(null);

    try {
      setLoadingMessage(t('loader.analyzingFeatures'));
      const result = await analyzeAndEnhanceFaces(
        uploadedImages,
        data,
        (progressMessage) => {
          setLoadingMessage(progressMessage);
        },
        lang
      );
      
      // SAVE RESULT TO LOCAL STORAGE
      // This ensures data isn't lost when redirecting to/from Stripe
      localStorage.setItem('esthetica_last_analysis', JSON.stringify(result));

      setAnalysisResult(result);
      setStep('results');
    } catch (err) {
      console.error(err);
      let errorMessage = t('app.errorUnknown');
      if (err instanceof Error && /500|Rpc failed/.test(err.message)) {
          errorMessage = t('app.error500');
      } else if (err instanceof Error && (err.message.includes('403') || err.message.includes('PERMISSION_DENIED'))) {
          errorMessage = t('app.error403');
      } else if (err instanceof Error) {
          errorMessage = err.message;
      }
      setError(errorMessage);
      setStep('imageUpload'); // Go back to start
    } finally {
      setLoadingMessage('');
    }
  };

  const handleRegenerate = async (index: number) => {
      if (!analysisResult || !analysisResult.enhancedImages[index]) return;
      if (regenCounts[index] <= 0) return;
      if (!user) return;
      
      const targetItem = analysisResult.enhancedImages[index];
      
      setIsRegenerating(index);
      try {
          const newCredits = await authService.consumeCredit(user.id, index);
          updateCredits(newCredits);

          const newImageBase64 = await regenerateSingleImage(
              targetItem.original,
              targetItem.prompt,
              index
          );
          
          const newEnhancedImages = [...analysisResult.enhancedImages];
          newEnhancedImages[index] = {
              ...targetItem,
              generated: newImageBase64
          };
          
          const newResult = {
              ...analysisResult,
              enhancedImages: newEnhancedImages
          };

          setAnalysisResult(newResult);
          // Update local storage with new regeneration
          localStorage.setItem('esthetica_last_analysis', JSON.stringify(newResult));
          
      } catch (e) {
          console.error("Regeneration failed", e);
          alert(t('app.errorUnknown'));
      } finally {
          setIsRegenerating(null);
      }
  };
  
  const handleReset = () => {
    setUploadedImages([]);
    setAnalysisResult(null);
    setError(null);
    setUserData(null);
    setStep('imageUpload');
    localStorage.removeItem('esthetica_last_analysis'); // Clear saved data
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlockClick = () => {
    if (!user) {
        setShowAuthModal(true);
    } else {
        setShowPaymentModal(true);
    }
  };

  const handleAuthSuccess = () => {
      // Logic: If user just registered/logged in via the Unlock button, immediately show payment modal
      if (step === 'results' && !isPremium) {
          setShowPaymentModal(true);
      }
  };

  const handlePaymentSuccess = async () => {
    // This is for the mock modal fallback, Stripe redirect is handled in useEffect
    setShowPaymentModal(false);
    await upgradeUser('pro');
  };

  const navigateTo = (page: PageView) => {
    setView(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const scrollToUpload = () => {
      document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  const renderLandingContent = () => {
      return (
          <>
             {/* Hero Section */}
            <div className="text-center py-10 md:py-20 relative">
                <div className="inline-block px-4 py-1.5 bg-white/50 backdrop-blur border border-stone-200 rounded-full mb-8 shadow-sm">
                    <span className="text-gold-600 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Professional Aesthetic Analysis</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif font-medium text-stone-800 leading-tight mb-6 tracking-tight">
                    {t('landing.heroTitle')}
                </h1>
                <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed font-light font-sans">
                    {t('landing.heroSubtitle')}
                </p>
                <button onClick={scrollToUpload} className="mt-10 bg-gold text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:shadow-xl hover:shadow-gold-500/20 transition-all transform hover:-translate-y-1">
                    {t('landing.ctaTitle')}
                </button>
            </div>

            {/* Video Section */}
            <div className="max-w-5xl mx-auto mb-20">
                <div 
                    className={`relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl shadow-stone-400/20 border-4 border-white ring-1 ring-stone-200 group bg-stone-900 ${isVideoPlaying ? '' : 'hover:scale-[1.01] transition-transform duration-500 cursor-pointer'}`}
                    onClick={() => !isVideoPlaying && setIsVideoPlaying(true)}
                >
                    {!isVideoPlaying ? (
                        <>
                            <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
                                 <div className="absolute inset-0 opacity-40 bg-marble"></div>
                                 <div className="relative z-10 text-center">
                                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mx-auto mb-6 border border-stone-100">
                                        <span className="font-serif font-bold text-4xl text-gold">E</span>
                                     </div>
                                     <p className="text-stone-800 font-bold uppercase tracking-[0.3em] text-sm">Esthetica AI</p>
                                 </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/10 group-hover:bg-white/20 transition-colors">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-2xl border border-white/50 pl-2">
                                    <PlayIcon className="w-10 h-10 md:w-12 md:h-12 text-gold-600" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                             {/* LOCAL VIDEO PLAYER - Looks for /promo.mp4 in public folder */}
                             <video 
                                className="w-full h-full object-cover"
                                src="/promo.mp4" 
                                title="Esthetica AI Promo" 
                                controls
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Steps */}
            <div className="mb-24">
                <h2 className="text-3xl font-serif text-center text-stone-800 mb-16">{t('landing.howItWorksTitle')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-gold-200 to-transparent -z-10"></div>
                    {[
                        { icon: CameraIcon, title: t('landing.step1Title'), desc: t('landing.step1Desc') },
                        { icon: ScanFaceIcon, title: t('landing.step2Title'), desc: t('landing.step2Desc') },
                        { icon: MagicWandIcon, title: t('landing.step3Title'), desc: t('landing.step3Desc') }
                    ].map((step, i) => (
                        <div key={i} className="text-center group">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 border border-stone-100 shadow-xl group-hover:scale-110 transition-transform duration-500 relative">
                                <step.icon className="w-10 h-10 text-stone-600" />
                                <div className="absolute -top-1 -right-1 bg-gold text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md">{i + 1}</div>
                            </div>
                            <h3 className="text-xl font-serif text-stone-800 mb-3">{step.title}</h3>
                            <p className="text-stone-500 text-sm px-4 font-light leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div className="mb-20">
                <Testimonials />
            </div>

            {/* Image Upload Section */}
            <div id="upload-section" className="animate-fade-in max-w-4xl mx-auto mb-20">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
                        {t('landing.uploadSectionTitle')}
                    </h2>
                    <div className="h-1 w-20 bg-gold-500 mx-auto mb-6"></div>
                    <p className="text-stone-500 text-lg font-light max-w-xl mx-auto">
                        {t('landing.uploadSectionSubtitle')}
                    </p>
                </div>
                
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/40 border border-stone-100">
                    <ImageUploader onImagesUpload={handleImagesUpload} />

                    {error && <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-center text-sm">{error}</div>}

                    <div className="mt-12 text-center">
                    <button
                        onClick={goToUserInfo}
                        disabled={uploadedImages.length !== 3}
                        className="w-full md:w-auto bg-gold text-white font-bold tracking-widest uppercase py-4 px-16 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 transform hover:-translate-y-1"
                    >
                        {t('imageUploader.analyzeButton')}
                    </button>
                    <p className="text-stone-400 mt-6 text-[10px] uppercase tracking-widest">{t('imageUploader.disclaimer')}</p>
                    </div>
                </div>
            </div>
          </>
      )
  }

  const renderMainContent = () => {
    switch(step) {
      case 'imageUpload':
        return renderLandingContent();
      case 'userInfo':
        return <UserInfoForm onSubmit={handleUserInfoSubmit} />;
      case 'loading':
        return <Loader message={loadingMessage} />;
      case 'results':
        return (
          <ResultsDisplay 
            result={analysisResult!} 
            onReset={handleReset} 
            isPremium={isPremium}
            onUnlock={handleUnlockClick}
            onRegenerate={handleRegenerate}
            regenCounts={regenCounts}
            isRegenerating={isRegenerating}
          />
        );
      default:
        return renderLandingContent();
    }
  }

  const renderView = () => {
      switch(view) {
          case 'dashboard': return <Dashboard onBack={() => navigateTo('home')} />;
          case 'privacy': return <PrivacyPolicy onBack={() => navigateTo('home')} />;
          case 'terms': return <TermsOfService onBack={() => navigateTo('home')} />;
          case 'contact': return <ContactUs onBack={() => navigateTo('home')} />;
          default: return renderMainContent();
      }
  }

  return (
    <div className="min-h-screen bg-marble font-sans text-stone-800 antialiased flex flex-col">
      <Header onNavigate={navigateTo} />
      <main className="flex-grow px-4 py-8 md:py-12">
        <div className="container mx-auto max-w-6xl">
           {renderView()}
        </div>
      </main>
      <footer className="border-t border-stone-200 mt-auto py-12 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
              <div className="mb-8 flex justify-center gap-8 text-xs font-bold tracking-widest uppercase text-stone-400 flex-wrap">
                  <button onClick={() => navigateTo('privacy')} className="hover:text-gold-600 transition-colors">{t('footer.privacy')}</button>
                  <button onClick={() => navigateTo('terms')} className="hover:text-gold-600 transition-colors">{t('footer.terms')}</button>
                  <button onClick={() => navigateTo('contact')} className="hover:text-gold-600 transition-colors">{t('footer.contact')}</button>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                   <span className="font-serif font-bold text-stone-800">Esthetica AI</span>
              </div>
              <p className="text-stone-400 text-xs">&copy; {new Date().getFullYear()} Esthetica AI. {t('footer.allRightsReserved')}</p>
          </div>
      </footer>
      {showPaymentModal && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)} 
          onSuccess={handlePaymentSuccess} 
        />
      )}
      {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
      )}
    </div>
  );
};

export default App;
