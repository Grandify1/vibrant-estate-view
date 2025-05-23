import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Flag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ImpressumProps {
  language: 'de' | 'en';
}

const Impressum: React.FC<ImpressumProps> = ({ language }) => {
  const { setLanguage } = useLanguage();

  const switchLanguage = () => {
    if (language === 'de') {
      setLanguage('en');
      window.location.href = '/legal-notice';
    } else {
      setLanguage('de');
      window.location.href = '/impressum';
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
            {language === 'de' ? 'Impressum' : 'Legal Notice'}
          </h1>
          
          {language === 'de' ? (
            <div className="prose max-w-none">
              <p>Verantwortlich für den Inhalt gemäß § 6 TDG/ § 6 MDStV:</p>
              
              <p>
                Grandify LLC<br />
                1209 MOUNTAIN ROAD PL NE STE R<br />
                ALBUQUERQUE, NM 87110
              </p>
              
              <p>Vertreten durch: Dustin Althaus</p>
              
              <h2>Hinweis gemäß Online-Streitbeilegungs-Verordnung</h2>
              <p>
                Nach geltendem Recht sind wir verpflichtet, Verbraucher auf die Existenz der Europäischen 
                Online-Streitbeilegungs-Plattform hinzuweisen, die für die Beilegung von Streitigkeiten 
                genutzt werden kann, ohne dass ein Gericht eingeschaltet werden muss. Für die Einrichtung 
                der Plattform ist die Europäische Kommission zuständig. Die Europäische Online-Streitbeilegungs-Plattform 
                ist hier zu finden: <a href="http://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer">http://ec.europa.eu/odr</a>. 
                Unsere E-Mail lautet: office@grandify.me
              </p>
              <p>
                Wir weisen aber darauf hin, dass wir nicht bereit sind, uns am Streitbeilegungsverfahren 
                im Rahmen der Europäischen Online-Streitbeilegungs-Plattform zu beteiligen. Nutzen Sie zur 
                Kontaktaufnahme bitte unsere obige E-Mail und Telefonnummer.
              </p>
              
              <h2>Hinweis gemäß Verbraucherstreitbeilegungsgesetz (VSBG)</h2>
              <p>
                Wir sind nicht bereit und verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
              
              <h2>Disclaimer – rechtliche Hinweise</h2>
              
              <h3>§ 1 Warnhinweis zu Inhalten</h3>
              <p>
                Die kostenlosen und frei zugänglichen Inhalte dieser Webseite wurden mit größtmöglicher 
                Sorgfalt erstellt. Der Anbieter dieser Webseite übernimmt jedoch keine Gewähr für die 
                Richtigkeit und Aktualität der bereitgestellten kostenlosen und frei zugänglichen 
                journalistischen Ratgeber und Nachrichten. Namentlich gekennzeichnete Beiträge geben 
                die Meinung des jeweiligen Autors und nicht immer die Meinung des Anbieters wieder. 
                Allein durch den Aufruf der kostenlosen und frei zugänglichen Inhalte kommt keinerlei 
                Vertragsverhältnis zwischen dem Nutzer und dem Anbieter zustande, insoweit fehlt es am 
                Rechtsbindungswillen des Anbieters.
              </p>

              <h3>§ 2 Externe Links</h3>
              <p>
                Diese Website enthält Verknüpfungen zu Websites Dritter ("externe Links"). Diese Websites 
                unterliegen der Haftung der jeweiligen Betreiber. Der Anbieter hat bei der erstmaligen 
                Verknüpfung der externen Links die fremden Inhalte daraufhin überprüft, ob etwaige 
                Rechtsverstöße bestehen. Zu dem Zeitpunkt waren keine Rechtsverstöße ersichtlich. Der 
                Anbieter hat keinerlei Einfluss auf die aktuelle und zukünftige Gestaltung und auf die 
                Inhalte der verknüpften Seiten. Das Setzen von externen Links bedeutet nicht, dass sich 
                der Anbieter die hinter dem Verweis oder Link liegenden Inhalte zu Eigen macht. Eine 
                ständige Kontrolle der externen Links ist für den Anbieter ohne konkrete Hinweise auf 
                Rechtsverstöße nicht zumutbar. Bei Kenntnis von Rechtsverstößen werden jedoch derartige 
                externe Links unverzüglich gelöscht.
              </p>

              <h3>§ 3 Urheber- und Leistungsschutzrechte</h3>
              <p>
                Die auf dieser Website veröffentlichten Inhalte unterliegen dem deutschen Urheber- und 
                Leistungsschutzrecht. Jede vom deutschen Urheber- und Leistungsschutzrecht nicht zugelassene 
                Verwertung bedarf der vorherigen schriftlichen Zustimmung des Anbieters oder jeweiligen 
                Rechteinhabers. Dies gilt insbesondere für Vervielfältigung, Bearbeitung, Übersetzung, 
                Einspeicherung, Verarbeitung bzw. Wiedergabe von Inhalten in Datenbanken oder anderen 
                elektronischen Medien und Systemen. Inhalte und Rechte Dritter sind dabei als solche 
                gekennzeichnet. Die unerlaubte Vervielfältigung oder Weitergabe einzelner Inhalte oder 
                kompletter Seiten ist nicht gestattet und strafbar. Lediglich die Herstellung von Kopien 
                und Downloads für den persönlichen, privaten und nicht kommerziellen Gebrauch ist erlaubt.
                Die Darstellung dieser Website in fremden Frames ist nur mit schriftlicher Erlaubnis zulässig.
              </p>
              
              <h3>§ 4 Besondere Nutzungsbedingungen</h3>
              <p>
                Soweit besondere Bedingungen für einzelne Nutzungen dieser Website von den vorgenannten 
                Paragraphen abweichen, wird an entsprechender Stelle ausdrücklich darauf hingewiesen. 
                In diesem Falle gelten im jeweiligen Einzelfall die besonderen Nutzungsbedingungen.
              </p>
              
              <p>Quelle: eRecht24.de</p>
            </div>
          ) : (
            <div className="prose max-w-none">
              <p>Responsible for content according to § 6 TDG/ § 6 MDStV:</p>
              
              <p>
                Grandify LLC<br />
                1209 MOUNTAIN ROAD PL NE STE R<br />
                ALBUQUERQUE, NM 87110
              </p>
              
              <p>Represented by: Dustin Althaus</p>
              
              <h2>Note According to the Online Dispute Resolution Regulation</h2>
              <p>
                According to applicable law, we are obligated to inform consumers about the existence 
                of the European Online Dispute Resolution platform, which can be used to resolve 
                disputes without involving a court. The European Commission is responsible for 
                establishing the platform. The European Online Dispute Resolution platform can be 
                found at: <a href="http://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer">http://ec.europa.eu/odr</a>. 
                Our email is: office@grandify.me
              </p>
              <p>
                However, we would like to point out that we are not willing to participate in dispute 
                resolution proceedings within the framework of the European Online Dispute Resolution 
                platform. Please use our email and phone number above to contact us.
              </p>
              
              <h2>Note According to the Consumer Dispute Resolution Act (VSBG)</h2>
              <p>
                We are not willing or obligated to participate in dispute resolution proceedings 
                before a consumer arbitration board.
              </p>
              
              <h2>Disclaimer – Legal Notices</h2>
              
              <h3>§ 1 Warning Notice Regarding Content</h3>
              <p>
                The free and publicly accessible content of this website has been created with the 
                utmost care. However, the provider of this website assumes no liability for the 
                accuracy and timeliness of the free and publicly accessible journalistic guides and 
                news provided. Contributions identified by name reflect the opinion of the respective 
                author and not always the opinion of the provider. By merely accessing the free and 
                publicly accessible content, no contractual relationship between the user and the 
                provider is established; in this respect, there is no legal intent on the part of 
                the provider.
              </p>

              <h3>§ 2 External Links</h3>
              <p>
                This website contains links to third-party websites ("external links"). These websites 
                are subject to the liability of the respective operators. When the external links were 
                first created, the provider checked the external content for possible legal violations. 
                At that time, no legal violations were apparent. The provider has no influence on the 
                current and future design and content of the linked pages. The inclusion of external 
                links does not mean that the provider adopts the content behind the reference or link 
                as its own. Continuous monitoring of external links is not reasonable for the provider 
                without concrete indications of legal violations. However, if violations become known, 
                such external links will be deleted immediately.
              </p>

              <h3>§ 3 Copyright and Performance Protection Rights</h3>
              <p>
                The content published on this website is subject to German copyright and performance 
                protection law. Any use not permitted under German copyright and performance protection 
                law requires the prior written consent of the provider or respective rights holder. This 
                applies in particular to reproduction, processing, translation, storage, processing, or 
                reproduction of content in databases or other electronic media and systems. Content and 
                rights of third parties are marked as such. The unauthorized reproduction or distribution 
                of individual content or complete pages is not permitted and is punishable by law. Only the 
                making of copies and downloads for personal, private, and non-commercial use is permitted.
                The display of this website in external frames is only permitted with written permission.
              </p>
              
              <h3>§ 4 Special Terms of Use</h3>
              <p>
                Insofar as special conditions for individual uses of this website deviate from the 
                aforementioned paragraphs, explicit reference is made at the appropriate point. In such 
                cases, the special terms of use apply in the respective individual case.
              </p>
              
              <p>Source: eRecht24.de</p>
            </div>
          )}
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

export default Impressum;
