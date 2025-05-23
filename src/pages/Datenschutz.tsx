
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
            {language === 'de' ? (
              <div>
                <p><strong>Präambel</strong></p>
                <p>Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als "Daten" bezeichnet) wir zu welchen Zwecken und in welchem Umfang verarbeiten. Die Datenschutzerklärung gilt für alle von uns durchgeführten Verarbeitungen personenbezogener Daten, sowohl im Rahmen der Erbringung unserer Leistungen als auch insbesondere auf unseren Webseiten, in mobilen Applikationen sowie innerhalb externer Onlinepräsenzen, wie z. B. unserer Social-Media-Profile (nachfolgend zusammenfassend bezeichnet als "Onlineangebot").</p>
                <p>Die verwendeten Begriffe sind nicht geschlechtsspezifisch.</p>
                <p>Stand: 4. Oktober 2023</p>
                
                <h2>Inhaltsübersicht</h2>
                <ul>
                  <li>Präambel</li>
                  <li>Verantwortlicher</li>
                  <li>Übersicht der Verarbeitungen</li>
                  <li>Maßgebliche Rechtsgrundlagen</li>
                  <li>Sicherheitsmaßnahmen</li>
                  <li>Übermittlung von personenbezogenen Daten</li>
                  <li>Internationale Datentransfers</li>
                  <li>Löschung von Daten</li>
                  <li>Rechte der betroffenen Personen</li>
                  <li>Einsatz von Cookies</li>
                  {/* Additional list items for German version */}
                </ul>
                
                <h2>Verantwortlicher</h2>
                <p>Dustin Althaus</p>
                <p>E-Mail-Adresse: office@wachstumsformel.de</p>
                <p>Impressum: www.wachstumsformel.de/impressum</p>
                
                {/* Continue with the rest of the German privacy policy */}
                <h2>Übersicht der Verarbeitungen</h2>
                <p>Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen.</p>
                
                <h3>Arten der verarbeiteten Daten</h3>
                <ul>
                  <li>Bestandsdaten.</li>
                  <li>Zahlungsdaten.</li>
                  <li>Kontaktdaten.</li>
                  <li>Inhaltsdaten.</li>
                  <li>Vertragsdaten.</li>
                  <li>Nutzungsdaten.</li>
                  <li>Meta-, Kommunikations- und Verfahrensdaten.</li>
                </ul>
                
                {/* Additional German content would continue here */}
                {/* For brevity, not all content is included */}
              </div>
            ) : (
              <div>
                <p><strong>Preamble</strong></p>
                <p>With the following privacy policy, we would like to inform you about what types of your personal data (hereinafter also referred to as "data") we process for what purposes and to what extent. The privacy policy applies to all processing of personal data carried out by us, both as part of the provision of our services and in particular on our websites, in mobile applications, and within external online presences, such as our social media profiles (hereinafter collectively referred to as "online offer").</p>
                <p>The terms used are not gender-specific.</p>
                <p>Last updated: October 4, 2023</p>
                
                <h2>Table of Contents</h2>
                <ul>
                  <li>Preamble</li>
                  <li>Controller</li>
                  <li>Overview of Processing Operations</li>
                  <li>Relevant Legal Bases</li>
                  <li>Security Measures</li>
                  <li>Transfer of Personal Data</li>
                  <li>International Data Transfers</li>
                  <li>Deletion of Data</li>
                  <li>Rights of Data Subjects</li>
                  <li>Use of Cookies</li>
                  {/* Additional list items for English version */}
                </ul>
                
                <h2>Controller</h2>
                <p>Dustin Althaus</p>
                <p>Email address: office@wachstumsformel.de</p>
                <p>Legal Notice: www.wachstumsformel.de/legal-notice</p>
                
                {/* Continue with the rest of the English privacy policy */}
                <h2>Overview of Processing Operations</h2>
                <p>The following overview summarizes the types of data processed and the purposes of their processing and refers to the data subjects.</p>
                
                <h3>Types of Data Processed</h3>
                <ul>
                  <li>Inventory data.</li>
                  <li>Payment data.</li>
                  <li>Contact data.</li>
                  <li>Content data.</li>
                  <li>Contract data.</li>
                  <li>Usage data.</li>
                  <li>Meta, communication and procedural data.</li>
                </ul>
                
                {/* Additional English content would continue here */}
                {/* For brevity, not all content is included */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between border-t border-gray-200 pt-8">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ImmoUpload. {language === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              {language === 'de' ? (
                <>
                  <Link to="/impressum" className="text-gray-500 text-sm hover:text-gray-700">Impressum</Link>
                  <Link to="/datenschutz" className="text-gray-500 text-sm hover:text-gray-700">Datenschutz</Link>
                </>
              ) : (
                <>
                  <Link to="/legal-notice" className="text-gray-500 text-sm hover:text-gray-700">Legal Notice</Link>
                  <Link to="/privacy-policy" className="text-gray-500 text-sm hover:text-gray-700">Privacy Policy</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Datenschutz;
