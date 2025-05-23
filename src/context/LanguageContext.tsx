
import React, { createContext, useState, useContext } from 'react';

type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  de: {
    // Navigation
    'nav.application': 'Anwendung',
    'nav.features': 'Funktionen',
    'nav.pricing': 'Preise',
    'nav.login': 'Login',
    'nav.start': 'Jetzt starten',
    
    // Hero Section
    'hero.title': 'Ihre Immobilien professionell präsentieren',
    'hero.subtitle': 'Mit ImmoUpload binden Sie Ihre Immobilien mühelos in Ihre Website ein – ohne technisches Know-how oder teure Entwickler.',
    'hero.cta': 'Jetzt starten',
    
    // Features
    'features.integration': 'Einfache Integration',
    'features.integration.desc': 'Nur ein Code-Snippet für Ihre Website',
    'features.notech': 'Ohne Technik-Kenntnisse',
    'features.notech.desc': 'Intuitive Bedienung für jeden',
    'features.professional': 'Professionelles Ergebnis',
    'features.professional.desc': 'Hochwertige Immobiliendarstellung',
    
    // Trust
    'trust.rating': 'Unsere Kunden bewerten uns mit',
    'trust.excellent': 'Exzellent',
    'trust.based': 'basierend auf bisherigen Kundenerfahrungen',
    
    // Applications
    'applications.title': 'Anwendungen für Immobilienmakler',
    'applications.card1.title': 'Immobilien unkompliziert auf die eigene Website darstellen',
    'applications.card1.desc': 'Viele Immobilienmakler verzichten auf Immobilienanzeigen auf ihrer Website, da technisches Wissen fehlt. Mit ImmoUpload fügen Sie einfach einen Code-Schnipsel ein – fertig!',
    'applications.card1.point1': 'Kein technisches Vorwissen nötig',
    'applications.card1.point2': 'Sofort einsatzbereit mit einem kurzen Code',
    'applications.card1.point3': 'Professionelle Immobilienanzeigen',
    
    'applications.card2.title': 'Nie mehr teure Agenturen oder Entwickler nötig',
    'applications.card2.desc': 'Sparen Sie die Kosten für Agenturen und Webentwickler. Mit ImmoUpload genügt ein kleiner Code-Schnipsel für eine perfekte Präsentation Ihrer Immobilien.',
    'applications.card2.point1': 'Keine externen Dienstleister mehr nötig',
    'applications.card2.point2': 'Spart erheblich Kosten',
    'applications.card2.point3': 'Unabhängigkeit in der Immobilienvermarktung',
    
    'applications.card3.title': 'Einfache Verwaltung der Immobilien direkt aus Ihrem Dashboard',
    'applications.card3.desc': 'Verwalten Sie Ihre Immobilienanzeigen komfortabel im übersichtlichen Dashboard. Änderungen erscheinen automatisch auf Ihrer Website.',
    'applications.card3.point1': 'Intuitive Bedienung des Dashboards',
    'applications.card3.point2': 'Änderungen erscheinen sofort online',
    'applications.card3.point3': 'Mehr Kontrolle, weniger Zeitaufwand',
    
    // Features Section
    'featuressection.title': 'Immoupload – Die wichtigsten Funktionen im Überblick',
    
    // CTA
    'cta.title': 'Bereit, Ihre Immobilien professionell zu präsentieren?',
    'cta.subtitle': 'Starten Sie noch heute und verbessern Sie Ihre Online-Präsenz für Immobilien.',
    'cta.button': 'Jetzt starten',
    
    // How it works
    'how.title': 'So einfach starten Sie',
    'how.step1.title': 'Registrieren Sie sich',
    'how.step1.desc': 'Erstellen Sie einfach ein kostenloses Konto, um Zugang zu allen Funktionen von Immoupload zu erhalten.',
    'how.step2.title': 'Erfassen Sie Ihre Immobilien',
    'how.step2.desc': 'Legen Sie Ihr Profil an und erfassen Sie Ihre Immobilien schnell und einfach im übersichtlichen Dashboard.',
    'how.step3.title': 'Fügen Sie den Code ein',
    'how.step3.desc': 'Kopieren Sie den Code-Schnipsel und fügen Sie ihn auf Ihrer Website ein. Wie genau das geht, erklären wir Ihnen natürlich ausführlich.',
    
    // FAQ
    'faq.title': 'Häufig gestellte Fragen',
    'faq.q1': 'Benötige ich Programmierkenntnisse?',
    'faq.a1': 'Nein, überhaupt nicht. Sie erhalten einen fertigen Code-Schnipsel, den Sie einfach kopieren und in Ihre Website einfügen. Wir bieten ausführliche Anleitungen für alle gängigen Website-Systeme wie WordPress, Wix, Jimdo und viele mehr.',
    'faq.q2': 'Wie viele Immobilien kann ich verwalten?',
    'faq.a2': 'Es gibt keine Begrenzung für die Anzahl der Immobilien, die Sie mit Immoupload verwalten können. Ob eine einzelne Immobilie oder ein umfangreiches Portfolio – unser System ist für jede Größe ausgelegt.',
    'faq.q3': 'Wie schnell sind meine Änderungen sichtbar?',
    'faq.a3': 'Alle Änderungen, die Sie im Dashboard vornehmen, werden sofort auf Ihrer Website sichtbar. Es gibt keine Verzögerung oder Wartezeiten – Ihre Website bleibt immer aktuell.',
    'faq.q4': 'Wie passen sich die Anzeigen an mein Website-Design an?',
    'faq.a4': 'Unsere Immobilienanzeigen sind so gestaltet, dass sie sich harmonisch in jedes Website-Design einfügen. Sie können zudem verschiedene Darstellungsoptionen wählen, um den Look an Ihren individuellen Stil anzupassen.',
    
    // Pricing
    'pricing.title': 'Unsere Preise',
    'pricing.starter': 'Starter',
    'pricing.recommended': 'Empfohlen',
    'pricing.month': '/Monat',
    'pricing.starter.desc': 'Perfekt für Einsteiger und kleine Portfolios.',
    'pricing.starter.feature1': 'Bis zu 9 Immobilien',
    'pricing.starter.feature2': 'Grundlegende Dashboard-Funktionen',
    'pricing.starter.feature3': 'Standard Website-Integration',
    'pricing.starter.feature4': 'E-Mail Support',
    
    'pricing.pro': 'Professional',
    'pricing.pro.reco': 'Empfohlen für Immobilienmakler',
    'pricing.pro.popular': 'Beliebt',
    'pricing.pro.desc': 'Ideal für professionelle Immobilienmakler.',
    'pricing.pro.feature1': 'Unbegrenzte Immobilien',
    'pricing.pro.feature2': 'Erweiterte Dashboard-Funktionen',
    'pricing.pro.feature3': 'Anpassbare Website-Integration',
    'pricing.pro.feature4': 'Prioritäts-Support',
    'pricing.pro.feature5': 'Erweiterte Analysen',
    
    // Final CTA
    'finalcta.title': 'Präsentieren Sie Ihre Immobilien noch heute professionell',
    'finalcta.subtitle': 'Nutzen Sie die einfachste Lösung zur Immobilienpräsentation und heben Sie sich von Ihrer Konkurrenz ab.',
    
    // Footer
    'footer.desc': 'Die einfachste Lösung, um Immobilien professionell auf Ihrer eigenen Website zu präsentieren.',
    'footer.product': 'Produkt',
    'footer.applications': 'Anwendungen',
    'footer.features': 'Funktionen',
    'footer.pricing': 'Preise',
    'footer.contact': 'Kontakt',
    'footer.support': 'Support',
    'footer.rights': 'Alle Rechte vorbehalten.',
    'footer.imprint': 'Impressum',
    'footer.privacy': 'Datenschutz',
    
    // Language Selector
    'language.de': 'Deutsch',
    'language.en': 'Englisch'
  },
  en: {
    // Navigation
    'nav.application': 'Application',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.login': 'Login',
    'nav.start': 'Get Started',
    
    // Hero Section
    'hero.title': 'Present your properties professionally',
    'hero.subtitle': 'With ImmoUpload, you can effortlessly integrate your properties into your website – without technical know-how or expensive developers.',
    'hero.cta': 'Get Started',
    
    // Features
    'features.integration': 'Easy Integration',
    'features.integration.desc': 'Just one code snippet for your website',
    'features.notech': 'No Technical Skills',
    'features.notech.desc': 'Intuitive operation for everyone',
    'features.professional': 'Professional Result',
    'features.professional.desc': 'High-quality property presentation',
    
    // Trust
    'trust.rating': 'Our customers rate us',
    'trust.excellent': 'Excellent',
    'trust.based': 'based on customer experiences',
    
    // Applications
    'applications.title': 'Applications for Real Estate Agents',
    'applications.card1.title': 'Display properties on your website with ease',
    'applications.card1.desc': 'Many real estate agents avoid listing properties on their websites due to lack of technical knowledge. With ImmoUpload, you simply insert a code snippet – done!',
    'applications.card1.point1': 'No technical knowledge needed',
    'applications.card1.point2': 'Ready to use with a short code',
    'applications.card1.point3': 'Professional property listings',
    
    'applications.card2.title': 'No more expensive agencies or developers needed',
    'applications.card2.desc': 'Save costs on agencies and web developers. With ImmoUpload, a small code snippet is enough for a perfect presentation of your properties.',
    'applications.card2.point1': 'No external service providers needed',
    'applications.card2.point2': 'Saves significant costs',
    'applications.card2.point3': 'Independence in property marketing',
    
    'applications.card3.title': 'Easy management of properties directly from your dashboard',
    'applications.card3.desc': 'Manage your property listings comfortably in the clear dashboard. Changes appear automatically on your website.',
    'applications.card3.point1': 'Intuitive dashboard operation',
    'applications.card3.point2': 'Changes appear instantly online',
    'applications.card3.point3': 'More control, less time spent',
    
    // Features Section
    'featuressection.title': 'ImmoUpload – The Most Important Features at a Glance',
    
    // CTA
    'cta.title': 'Ready to present your properties professionally?',
    'cta.subtitle': 'Start today and improve your online presence for real estate.',
    'cta.button': 'Get Started',
    
    // How it works
    'how.title': 'How to Get Started Easily',
    'how.step1.title': 'Register',
    'how.step1.desc': 'Simply create a free account to access all the features of ImmoUpload.',
    'how.step2.title': 'Add your properties',
    'how.step2.desc': 'Set up your profile and add your properties quickly and easily in the clear dashboard.',
    'how.step3.title': 'Insert the code',
    'how.step3.desc': 'Copy the code snippet and paste it into your website. We will explain exactly how to do this in detail.',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'Do I need programming skills?',
    'faq.a1': 'No, not at all. You receive a ready-made code snippet that you simply copy and paste into your website. We provide detailed instructions for all common website systems such as WordPress, Wix, Jimdo, and many more.',
    'faq.q2': 'How many properties can I manage?',
    'faq.a2': 'There is no limit to the number of properties you can manage with ImmoUpload. Whether it\'s a single property or an extensive portfolio – our system is designed for any size.',
    'faq.q3': 'How quickly are my changes visible?',
    'faq.a3': 'All changes you make in the dashboard are immediately visible on your website. There is no delay or waiting time – your website always stays up-to-date.',
    'faq.q4': 'How do the listings adapt to my website design?',
    'faq.a4': 'Our property listings are designed to blend harmoniously into any website design. You can also choose various display options to customize the look to your individual style.',
    
    // Pricing
    'pricing.title': 'Our Pricing',
    'pricing.starter': 'Starter',
    'pricing.recommended': 'Recommended',
    'pricing.month': '/month',
    'pricing.starter.desc': 'Perfect for beginners and small portfolios.',
    'pricing.starter.feature1': 'Up to 9 properties',
    'pricing.starter.feature2': 'Basic dashboard functions',
    'pricing.starter.feature3': 'Standard website integration',
    'pricing.starter.feature4': 'Email support',
    
    'pricing.pro': 'Professional',
    'pricing.pro.reco': 'Recommended for real estate agents',
    'pricing.pro.popular': 'Popular',
    'pricing.pro.desc': 'Ideal for professional real estate agents.',
    'pricing.pro.feature1': 'Unlimited properties',
    'pricing.pro.feature2': 'Advanced dashboard functions',
    'pricing.pro.feature3': 'Customizable website integration',
    'pricing.pro.feature4': 'Priority support',
    'pricing.pro.feature5': 'Advanced analytics',
    
    // Final CTA
    'finalcta.title': 'Present your properties professionally today',
    'finalcta.subtitle': 'Use the easiest solution for property presentation and stand out from your competition.',
    
    // Footer
    'footer.desc': 'The easiest solution to present properties professionally on your own website.',
    'footer.product': 'Product',
    'footer.applications': 'Applications',
    'footer.features': 'Features',
    'footer.pricing': 'Pricing',
    'footer.contact': 'Contact',
    'footer.support': 'Support',
    'footer.rights': 'All rights reserved.',
    'footer.imprint': 'Legal Notice',
    'footer.privacy': 'Privacy Policy',
    
    // Language Selector
    'language.de': 'German',
    'language.en': 'English'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'de',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('de');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
