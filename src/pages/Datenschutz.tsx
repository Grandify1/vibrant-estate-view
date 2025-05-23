
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Flag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DatenschutzProps {
  language: 'de' | 'en';
}

const Datenschutz: React.FC<DatenschutzProps> = ({ language }) => {
  const { setLanguage } = useLanguage();

  const switchLanguage = () => {
    if (language === 'de') {
      setLanguage('en');
      window.location.href = '/privacy-policy';
    } else {
      setLanguage('de');
      window.location.href = '/datenschutz';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-estate-dark">
            <Link to="/">
              <span className="bg-estate text-white py-1 px-2 rounded mr-1">Immo</span>
              Upload
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={switchLanguage}
              title={language === 'de' ? 'Switch to English' : 'Zu Deutsch wechseln'}
            >
              <Flag className="h-4 w-4" />
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {language === 'de' ? 'Zurück zur Startseite' : 'Back to Homepage'}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {language === 'de' ? 'Datenschutz' : 'Privacy Policy'}
          </h1>
          
          <div className="prose max-w-none">
            {/* This will load the privacy policy content that was added via GitHub */}
            {language === 'de' && (
              <div>
                <p>Datenschutzerklärungsinhalte wurden über GitHub hinzugefügt.</p>
              </div>
            )}
            {language === 'en' && (
              <div>
                <p>Privacy policy contents have been added via GitHub.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-estate-text py-8 mt-auto">
        <div className="container">
          <div className="border-t border-gray-700 pt-8 flex justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} immoupload.com. {language === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}</p>
            <div className="flex gap-4">
              <Link to={language === 'de' ? "/impressum" : "/legal-notice"} className="text-gray-400 hover:text-white transition-colors">
                {language === 'de' ? 'Impressum' : 'Legal Notice'}
              </Link>
              <Link to={language === 'de' ? "/datenschutz" : "/privacy-policy"} className="text-gray-400 hover:text-white transition-colors">
                {language === 'de' ? 'Datenschutz' : 'Privacy Policy'}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Datenschutz;
