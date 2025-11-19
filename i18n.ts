
const translations: any = {
  it: {
    header: {
      title: "Visagismo AI Advisor",
      dashboard: "La mia Dashboard"
    },
    footer: {
        allRightsReserved: "Tutti i diritti riservati.",
        privacy: "Privacy Policy",
        terms: "Termini di Servizio",
        contact: "Contattaci"
    },
    auth: {
        loginTitle: "Bentornato",
        loginDesc: "Accedi per recuperare i tuoi report.",
        registerTitle: "Salva la tua Analisi",
        registerDesc: "Registrati per sbloccare i risultati e non perdere i tuoi dati.",
        forgotPasswordTitle: "Recupera Password",
        forgotPasswordDesc: "Inserisci la tua email per ricevere le istruzioni di reset.",
        nameLabel: "Nome",
        emailLabel: "Email",
        passwordLabel: "Password",
        loginButton: "Accedi",
        registerButton: "Crea Account e Continua",
        resetButton: "Invia Link di Reset",
        switchToRegister: "Non hai un account? Registrati",
        switchToLogin: "Hai già un account? Accedi",
        forgotPasswordLink: "Password dimenticata?",
        backToLogin: "Torna al Login",
        resetSuccess: "Controlla la tua email per le istruzioni.",
        logout: "ESCI",
        errorNameRequired: "Nome richiesto"
    },
    app: {
        errorUserData: "Dati utente mancanti.",
        errorUnknown: "Errore sconosciuto.",
        error500: "Servizio momentaneamente non disponibile. Riprova tra poco.",
        error403: "Traffico intenso o permessi insufficienti. Assicurati che la tua chiave API sia valida e abbia accesso al modello."
    },
    dashboard: {
        title: "La tua Dashboard",
        welcome: "Ciao, {name}",
        planStatus: "Stato Abbonamento",
        planFree: "Utente Guest (Gratuito)",
        planPro: "Membro Premium",
        nextBilling: "Prossimo rinnovo",
        cancelSub: "Cancella Abbonamento",
        active: "Attivo",
        inactive: "Non attivo",
        yourReports: "I tuoi Report",
        noReports: "Nessuna analisi salvata recente.",
        unlockMore: "Sblocca altre funzionalità",
        credits: "Crediti Rigenerazione"
    },
    landing: {
        heroTitle: "La Tua Bellezza, Rivelata dalla Scienza.",
        heroSubtitle: "Non è magia, è geometria. Scopri l'architettura del tuo volto e il look perfetto per te con l'analisi visagista AI.",
        watchVideo: "Guarda come Funziona",
        videoTitle: "Dall'Analisi al Risultato in 3 Minuti",
        ctaTitle: "Inizia la Consulenza",
        howItWorksTitle: "Il Metodo Scientifico",
        step1Title: "1. Scansione",
        step1Desc: "Carica 3 foto. L'algoritmo mappa 80 punti nodali del tuo viso.",
        step2Title: "2. Calibrazione",
        step2Desc: "Inserisci i tuoi dati biometrici per affinare l'algoritmo.",
        step3Title: "3. Risultato",
        step3Desc: "Sblocca il progetto del tuo look ideale e visualizzalo su te stesso.",
        demoTitle: "Tecnologia Clinica",
        demoDesc: "Il nostro algoritmo simula l'occhio di un team di visagisti esperti, elaborando variabili estetiche complesse in pochi secondi per trovare l'armonia perfetta.",
        generateTeaser: "Genera Teaser AI con Veo",
        clickToPlay: "Clicca per avviare",
        uploadSectionTitle: "Carica le tue Foto",
        uploadSectionSubtitle: "Per un'analisi precisa, abbiamo bisogno di vedere il tuo viso da tre angolazioni. I tuoi dati sono processati in modo sicuro."
    },
    imageUploader: {
        errorThreeImages: "Per favore carica tutte e 3 le immagini richieste.",
        analyzeButton: "Analizza il mio Viso",
        disclaimer: "Caricando le foto accetti i Termini di Servizio e la Privacy Policy.",
        frontView: "Fronte",
        rightProfile: "Profilo DX",
        leftProfile: "Profilo SX",
        removeImageAria: "Rimuovi immagine {index}",
        uploadAria: "Carica foto {label}"
    },
    userInfo: {
        title: "Calibrazione Biometrica",
        subtitle: "Aiutaci a personalizzare l'algoritmo sui tuoi tratti unici.",
        nameLabel: "NOME",
        ageLabel: "ETÀ",
        genderLabel: "IDENTITÀ DI GENERE",
        makeupQuestion: "Preferisci suggerimenti che includano makeup?",
        yes: "Sì",
        no: "No",
        continueButton: "Genera Analisi Visagista"
    },
    results: {
        summaryTitle: "SINTESI DIAGNOSTICA",
        diagnosticTitle: "Mappatura Facciale",
        diagnosticDescription: "Analisi strutturale delle proporzioni e delle asimmetrie.",
        recommendationsTitle: "INTERVENTI SUGGERITI",
        enhancedFaceTitle: "La Tua Versione Migliore",
        enhancedFaceSubtitle: "PROIEZIONE RISULTATI",
        optionFrontMain: "Armonia Naturale",
        descFrontMain: "Equilibrio perfetto per tutti i giorni.",
        optionFrontBold: "Stile Audace",
        descFrontBold: "Per chi vuole lasciare il segno.",
        optionProfileRight: "Profilo Destro",
        descProfileRight: "Definizione della mascella e volumi.",
        optionProfileLeft: "Profilo Sinistro",
        descProfileLeft: "Simmetria e texture.",
        before: "ORIGINAL",
        after: "MIGLIORATO",
        appliedChanges: "Interventi Applicati",
        lockedTitle: "Sblocca il Tuo Potenziale",
        lockedSubtitle: "La tua analisi completa è pronta. Sblocca i risultati visivi e i consigli dettagliati per iniziare la tua trasformazione.",
        unlockButton: "Sblocca Risultati Completi",
        newAnalysisButton: "Nuova Analisi",
        regenerateButton: "Rigenera",
        regenerationsLeft: "Rigenerazioni"
    },
    loader: {
        analyzingFeatures: "Analisi biometrica in corso...",
        step1: "Scansione morfologica...",
        stepDiagnostic: "Generazione mappa diagnostica...",
        step2: "Rendering immagine {current} di {total}...",
        step3: "Finalizzazione report...",
        patience: "L'ELABORAZIONE POTREBBE RICHIEDERE FINO A 60 SECONDI"
    },
    tips: [
        "La simmetria perfetta non esiste, l'armonia sì.",
        "Il taglio giusto può cambiare la percezione della forma del viso.",
        "I colori caldi ammorbidiscono i tratti spigolosi.",
        "La luce è il miglior trucco naturale.",
        "L'asimmetria è ciò che rende un volto interessante."
    ],
    payment: {
        title: "Offerta Lancio",
        launchPromo: "Launch Promo",
        promoTag: "Offerta Limitata",
        fullPackage: "Pacchetto Completo",
        feature1: "Analisi Visagista Completa",
        feature2: "4 Render Fotorealistici Prima/Dopo",
        feature3: "Mappa Diagnostica Tecnica",
        feature4: "Consigli su Taglio e Stile",
        featureBonus: "Accesso Immediato",
        featurePro: "Rigenerazioni AI Incluse (10 crediti)",
        payButton: "Sblocca Tutto a €9.99",
        oneTimePayment: "Pagamento unico. Accesso a vita al report.",
        secure: "Pagamento Sicuro SSL"
    },
    testimonials: {
        title: "Storie di Trasformazione",
        t1: "Non pensavo che un taglio di capelli potesse cambiare così tanto il mio viso. Incredibile.",
        t1_author: "GIULIA R.",
        t2: "L'analisi ha individuato esattamente ciò che non mi piaceva e come sistemarlo.",
        t2_author: "MARCO B.",
        t3: "Vale ogni centesimo. Ho portato la foto al mio barbiere e ha capito subito.",
        t3_author: "ENRICO S.",
        t4: "Finalmente mi vedo bene nelle foto. Grazie!",
        t4_author: "LAURA M.",
        t5: "Tecnologia impressionante, risultati molto naturali.",
        t5_author: "STEFANO V.",
        t6: "Mi ha dato la sicurezza per osare un look più corto.",
        t6_author: "ANNA L.",
        t7: "Consigliato a tutti i miei amici.",
        t7_author: "FEDERICO P.",
        t8: "Un'esperienza che ti cambia la prospettiva.",
        t8_author: "GIORGIA C."
    },
    legal: {
        privacyTitle: "Privacy Policy",
        lastUpdated: "Ultimo aggiornamento: Marzo 2025",
        section1Title: "1. Dati Raccolti",
        section1Text: "Raccogliamo solo i dati necessari per fornire il servizio:",
        section1List1: "Usate temporaneamente per l'analisi e poi eliminate (salvo salvataggio utente).",
        section1List2: "Nome, età e email per la gestione account.",
        section1List3: "Cookie tecnici per il funzionamento del sito.",
        section2Title: "2. Uso dell'AI",
        section2Text: "Le immagini sono processate da algoritmi di Intelligenza Artificiale sicuri. Non usiamo le tue foto per addestrare modelli pubblici.",
        section3Title: "3. Sicurezza",
        section3Text: "Utilizziamo crittografia SSL e provider di pagamento certificati (Stripe).",
        section4Title: "4. I Tuoi Diritti",
        section4Text: "Puoi richiedere la cancellazione dei tuoi dati in qualsiasi momento contattando il supporto.",
        termsTitle: "Termini di Servizio",
        termsIntro: "Utilizzando Esthetica AI, accetti i seguenti termini.",
        termsSec1Title: "1. Il Servizio",
        termsSec1Text: "Forniamo consigli estetici basati su AI. I risultati sono simulazioni e possono variare.",
        termsSec2Title: "2. Uso Consentito",
        termsSec2Text: "Accetti di:",
        termsSec3Title: "3. Proprietà Intellettuale",
        termsSec3Text: "Il software e l'algoritmo sono proprietà esclusiva di Esthetica AI.",
        backHome: "TORNA ALLA HOME"
    },
    contact: {
        title: "Contattaci",
        subtitle: "Siamo qui per aiutarti.",
        sentTitle: "Messaggio Inviato",
        sentDesc: "Ti risponderemo il prima possibile.",
        returnHome: "Torna alla Home",
        emailLabel: "LA TUA EMAIL",
        subjectLabel: "OGGETTO",
        subjects: {
            general: "Informazioni Generali",
            tech: "Supporto Tecnico",
            billing: "Pagamenti e Fatturazione",
            partner: "Partnership"
        },
        messageLabel: "MESSAGGIO",
        sendButton: "INVIA MESSAGGIO",
        orEmail: "Oppure scrivici a"
    },
    service: {
        errorInvalidBase64: "Formato immagine non valido.",
        errorParsingResponse: "Errore nell'elaborazione della risposta AI.",
        errorSafetyBlock: "L'immagine non può essere generata a causa dei filtri di sicurezza.",
        errorGeneratingImage: "Errore durante la generazione dell'immagine."
    }
  },
  en: {
    header: {
      title: "Visagism AI Advisor",
      dashboard: "My Dashboard"
    },
    footer: {
        allRightsReserved: "All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        contact: "Contact Us"
    },
    auth: {
        loginTitle: "Welcome Back",
        loginDesc: "Login to retrieve your reports.",
        registerTitle: "Save your Analysis",
        registerDesc: "Register to unlock results and save your data.",
        forgotPasswordTitle: "Recover Password",
        forgotPasswordDesc: "Enter your email to receive reset instructions.",
        nameLabel: "Name",
        emailLabel: "Email",
        passwordLabel: "Password",
        loginButton: "Login",
        registerButton: "Create Account & Continue",
        resetButton: "Send Reset Link",
        switchToRegister: "No account? Register",
        switchToLogin: "Have an account? Login",
        forgotPasswordLink: "Forgot password?",
        backToLogin: "Back to Login",
        resetSuccess: "Check your email for instructions.",
        logout: "LOGOUT",
        errorNameRequired: "Name is required"
    },
    app: {
        errorUserData: "Missing user data.",
        errorUnknown: "Unknown error.",
        error500: "Service temporarily unavailable. Please try again shortly.",
        error403: "High traffic or insufficient permissions. Ensure your API Key is valid and has access to the model."
    },
    dashboard: {
        title: "Your Dashboard",
        welcome: "Hello, {name}",
        planStatus: "Subscription Status",
        planFree: "Guest User (Free)",
        planPro: "Premium Member",
        nextBilling: "Next billing",
        cancelSub: "Cancel Subscription",
        active: "Active",
        inactive: "Inactive",
        yourReports: "Your Reports",
        noReports: "No recent saved analyses.",
        unlockMore: "Unlock more features",
        credits: "Regeneration Credits"
    },
    landing: {
        heroTitle: "Your Beauty, Revealed by Science.",
        heroSubtitle: "It's not magic, it's geometry. Discover your face architecture and the perfect look for you with AI visagism analysis.",
        watchVideo: "How it Works",
        videoTitle: "From Analysis to Result in 3 Minutes",
        ctaTitle: "Start Consultation",
        howItWorksTitle: "The Scientific Method",
        step1Title: "1. Scan",
        step1Desc: "Upload 3 photos. The algorithm maps 80 nodal points of your face.",
        step2Title: "2. Calibration",
        step2Desc: "Enter your biometric data to refine the algorithm.",
        step3Title: "3. Result",
        step3Desc: "Unlock your ideal look blueprint and visualize it on yourself.",
        demoTitle: "Clinical Technology",
        demoDesc: "Our algorithm simulates the eye of an expert visagist team, processing complex aesthetic variables in seconds to find perfect harmony.",
        generateTeaser: "Generate AI Teaser with Veo",
        clickToPlay: "Click to play",
        uploadSectionTitle: "Upload Your Photos",
        uploadSectionSubtitle: "For a precise analysis, we need to see your face from three angles. Your data is processed securely."
    },
    imageUploader: {
        errorThreeImages: "Please upload all 3 required images.",
        analyzeButton: "Analyze My Face",
        disclaimer: "By uploading photos you accept the Terms of Service and Privacy Policy.",
        frontView: "Front",
        rightProfile: "Right Profile",
        leftProfile: "Left Profile",
        removeImageAria: "Remove image {index}",
        uploadAria: "Upload photo {label}"
    },
    userInfo: {
        title: "Biometric Calibration",
        subtitle: "Help us personalize the algorithm to your unique features.",
        nameLabel: "NAME",
        ageLabel: "AGE",
        genderLabel: "GENDER IDENTITY",
        makeupQuestion: "Do you prefer suggestions that include makeup?",
        yes: "Yes",
        no: "No",
        continueButton: "Generate Visagism Analysis"
    },
    results: {
        summaryTitle: "DIAGNOSTIC SUMMARY",
        diagnosticTitle: "Facial Mapping",
        diagnosticDescription: "Structural analysis of proportions and asymmetries.",
        recommendationsTitle: "SUGGESTED INTERVENTIONS",
        enhancedFaceTitle: "Your Best Version",
        enhancedFaceSubtitle: "RESULT PROJECTION",
        optionFrontMain: "Natural Harmony",
        descFrontMain: "Perfect balance for every day.",
        optionFrontBold: "Bold Style",
        descFrontBold: "For those who want to make a mark.",
        optionProfileRight: "Right Profile",
        descProfileRight: "Jawline definition and volumes.",
        optionProfileLeft: "Left Profile",
        descProfileLeft: "Symmetry and texture.",
        before: "ORIGINAL",
        after: "ENHANCED",
        appliedChanges: "Applied Interventions",
        lockedTitle: "Unlock Your Potential",
        lockedSubtitle: "Your full analysis is ready. Unlock visual results and detailed recommendations to start your transformation.",
        unlockButton: "Unlock Full Results",
        newAnalysisButton: "New Analysis",
        regenerateButton: "Regenerate",
        regenerationsLeft: "Regenerations"
    },
    loader: {
        analyzingFeatures: "Biometric analysis in progress...",
        step1: "Morphological scanning...",
        stepDiagnostic: "Generating diagnostic map...",
        step2: "Rendering image {current} of {total}...",
        step3: "Finalizing report...",
        patience: "PROCESSING MAY TAKE UP TO 60 SECONDS"
    },
    tips: [
        "Perfect symmetry doesn't exist, harmony does.",
        "The right cut can change the perception of face shape.",
        "Warm colors soften angular features.",
        "Light is the best natural makeup.",
        "Asymmetry is what makes a face interesting."
    ],
    payment: {
        title: "Launch Offer",
        launchPromo: "Launch Promo",
        promoTag: "Limited Time",
        fullPackage: "Full Package",
        feature1: "Full Visagism Analysis",
        feature2: "4 Photorealistic Before/After Renders",
        feature3: "Technical Diagnostic Map",
        feature4: "Cut and Style Recommendations",
        featureBonus: "Immediate Access",
        featurePro: "Unlimited AI Regenerations (10 credits)",
        payButton: "Unlock All for €9.99",
        oneTimePayment: "One-time payment. Lifetime access to report.",
        secure: "Secure SSL Payment"
    },
    testimonials: {
        title: "Transformation Stories",
        t1: "I didn't think a haircut could change my face so much. Incredible.",
        t1_author: "JULIA R.",
        t2: "The analysis pinpointed exactly what I didn't like and how to fix it.",
        t2_author: "MARK B.",
        t3: "Worth every penny. I took the photo to my barber and he understood immediately.",
        t3_author: "HENRY S.",
        t4: "I finally look good in photos. Thanks!",
        t4_author: "LAURA M.",
        t5: "Impressive technology, very natural results.",
        t5_author: "STEPHEN V.",
        t6: "It gave me the confidence to try a shorter look.",
        t6_author: "ANNA L.",
        t7: "Recommended to all my friends.",
        t7_author: "FREDERICK P.",
        t8: "An experience that changes your perspective.",
        t8_author: "GEORGIA C."
    },
    legal: {
        privacyTitle: "Privacy Policy",
        lastUpdated: "Last updated: March 2025",
        section1Title: "1. Collected Data",
        section1Text: "We only collect data necessary to provide the service:",
        section1List1: "Used temporarily for analysis and then deleted (unless user saves).",
        section1List2: "Name, age, and email for account management.",
        section1List3: "Technical cookies for site operation.",
        section2Title: "2. Use of AI",
        section2Text: "Images are processed by secure Artificial Intelligence algorithms. We do not use your photos to train public models.",
        section3Title: "3. Security",
        section3Text: "We use SSL encryption and certified payment providers (Stripe).",
        section4Title: "4. Your Rights",
        section4Text: "You can request the deletion of your data at any time by contacting support.",
        termsTitle: "Terms of Service",
        termsIntro: "By using Esthetica AI, you accept the following terms.",
        termsSec1Title: "1. The Service",
        termsSec1Text: "We provide aesthetic advice based on AI. Results are simulations and may vary.",
        termsSec2Title: "2. Allowed Use",
        termsSec2Text: "You agree to:",
        termsSec3Title: "3. Intellectual Property",
        termsSec3Text: "The software and algorithm are exclusive property of Esthetica AI.",
        backHome: "BACK TO HOME"
    },
    contact: {
        title: "Contact Us",
        subtitle: "We are here to help.",
        sentTitle: "Message Sent",
        sentDesc: "We will reply as soon as possible.",
        returnHome: "Return to Home",
        emailLabel: "YOUR EMAIL",
        subjectLabel: "SUBJECT",
        subjects: {
            general: "General Information",
            tech: "Technical Support",
            billing: "Payments and Billing",
            partner: "Partnership"
        },
        messageLabel: "MESSAGE",
        sendButton: "SEND MESSAGE",
        orEmail: "Or write to us at"
    },
    service: {
        errorInvalidBase64: "Invalid image format.",
        errorParsingResponse: "Error parsing AI response.",
        errorSafetyBlock: "Image cannot be generated due to safety filters.",
        errorGeneratingImage: "Error generating image."
    }
  }
};

export const getLanguage = (): 'it' | 'en' => {
    if (typeof navigator !== 'undefined') {
        return navigator.language.startsWith('it') ? 'it' : 'en';
    }
    return 'en';
};

export const t = (key: string, params?: any) => {
    const lang = getLanguage();
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            return key;
        }
    }
    if (typeof value === 'string' && params) {
        Object.keys(params).forEach(k => {
            value = value.replace(`{${k}}`, params[k]);
        });
    }
    return value;
};
