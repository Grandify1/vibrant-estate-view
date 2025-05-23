
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface DatenschutzProps {
  language: 'de' | 'en';
}

const Datenschutz: React.FC<DatenschutzProps> = ({ language }) => {
  const [privacyContent, setPrivacyContent] = useState<string>("");
  
  useEffect(() => {
    // In a real application, you would fetch the privacy policy content from your backend
    // For now, we're just showing a placeholder message
    setPrivacyContent(
      language === 'de' 
        ? "Der vollständige Datenschutztext wird hier angezeigt. In einer echten Anwendung würde dieser Text von einem CMS oder einer API geladen werden."
        : "The complete privacy policy text would be displayed here. In a real application, this text would be loaded from a CMS or API."
    );
  }, [language]);

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
            {language === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-500 italic mb-8">
              {language === 'de' 
                ? "Der vollständige Datenschutztext sollte hier eingefügt werden. Für eine vollständige Version besuchen Sie bitte die Originalseite." 
                : "The complete privacy policy text should be inserted here. For a complete version, please visit the original page."}
              <br />
              <a 
                href="https://www.wachstumsformel.de/datenschutz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-estate hover:underline"
              >
                {language === 'de' ? 'Originale Datenschutzerklärung anzeigen' : 'View original privacy policy'}
              </a>
            </p>
            
            {language === 'de' ? (
              <div>
                <h2>Einleitung zur Datenschutzerklärung</h2>
                <p>
                  Wir freuen uns über Ihren Besuch auf unserer Webseite. Der Schutz Ihrer personenbezogenen Daten 
                  ist uns ein wichtiges Anliegen. In dieser Datenschutzerklärung informieren wir Sie darüber, wie 
                  wir mit Ihren Daten umgehen und welche Rechte Sie haben.
                </p>
                
                <h2>Verantwortliche Stelle</h2>
                <p>
                  Verantwortlich für die Datenverarbeitung auf dieser Website ist:
                </p>
                <p>
                  Grandify LLC<br />
                  1209 MOUNTAIN ROAD PL NE STE R<br />
                  ALBUQUERQUE, NM 87110
                </p>
                <p>Vertreten durch: Dustin Althaus</p>
                <p>E-Mail: office@grandify.me</p>
                
                <h2>Erhebung und Verarbeitung personenbezogener Daten</h2>
                <p>
                  Personenbezogene Daten sind Informationen, mit deren Hilfe eine Person bestimmbar ist, 
                  also Angaben, die zurück zu einer Person verfolgt werden können. Dazu gehören der Name, 
                  die E-Mail-Adresse oder die Telefonnummer.
                </p>
                <p>
                  Personenbezogene Daten werden von uns nur dann erhoben, genutzt und weitergegeben, wenn 
                  dies gesetzlich erlaubt ist oder die Nutzer in die Datenerhebung einwilligen.
                </p>
                
                <h2>Ihre Rechte</h2>
                <p>
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck 
                  Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die 
                  Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur 
                  Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit widerrufen. Außerdem 
                  haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer 
                  personenbezogenen Daten zu verlangen.
                </p>
                
                <p>
                  Für eine vollständige Datenschutzerklärung besuchen Sie bitte die 
                  <a 
                    href="https://www.wachstumsformel.de/datenschutz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-estate hover:underline ml-1"
                  >
                    originale Datenschutzerklärung
                  </a>.
                </p>
              </div>
            ) : (
              <div>
                <h2>Introduction to Privacy Policy</h2>
                <p>
                  We appreciate your visit to our website. The protection of your personal data is important 
                  to us. In this privacy policy, we inform you about how we handle your data and what rights 
                  you have.
                </p>
                
                <h2>Responsible Entity</h2>
                <p>
                  Responsible for data processing on this website is:
                </p>
                <p>
                  Grandify LLC<br />
                  1209 MOUNTAIN ROAD PL NE STE R<br />
                  ALBUQUERQUE, NM 87110
                </p>
                <p>Represented by: Dustin Althaus</p>
                <p>Email: office@grandify.me</p>
                
                <h2>Collection and Processing of Personal Data</h2>
                <p>
                  Personal data is information that can be used to identify a person, i.e., details that can 
                  be traced back to a specific individual. This includes name, email address, or phone number.
                </p>
                <p>
                  We only collect, use, and share personal data when legally permitted or when users consent 
                  to data collection.
                </p>
                
                <h2>Your Rights</h2>
                <p>
                  You have the right to receive information about the origin, recipient, and purpose of your 
                  stored personal data free of charge at any time. You also have the right to request the 
                  correction or deletion of this data. If you have given consent for data processing, you can 
                  revoke this consent at any time. You also have the right to request the restriction of the 
                  processing of your personal data under certain circumstances.
                </p>
                
                <p>
                  For a complete privacy policy, please visit the
                  <a 
                    href="https://www.wachstumsformel.de/datenschutz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-estate hover:underline ml-1"
                  >
                    original privacy policy
                  </a>.
                </p>
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
              <Link to="/impressum" className="text-gray-400 hover:text-white transition-colors">
                {language === 'de' ? 'Impressum' : 'Legal Notice'}
              </Link>
              <Link to="/datenschutz" className="text-gray-400 hover:text-white transition-colors">
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
