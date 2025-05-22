
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  ChevronDown, 
  Code, 
  FileText, 
  Users, 
  Star, 
  CircleCheck,
  ArrowRight
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-estate-dark">
            <span className="bg-estate text-white py-1 px-2 rounded mr-1">Immo</span>
            Upload
          </div>
          
          <nav className="hidden md:flex gap-6">
            <button 
              onClick={() => scrollToSection('applications')}
              className="text-sm text-gray-700 hover:text-estate transition-colors"
            >
              Anwendung
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-sm text-gray-700 hover:text-estate transition-colors"
            >
              Funktionen
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-sm text-gray-700 hover:text-estate transition-colors"
            >
              Preise
            </button>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium text-gray-700 hover:text-estate transition-colors">
              Login
            </Link>
            <Button asChild>
              <Link to="/auth">Jetzt starten</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-estate-gray to-white overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-estate-dark mb-6">
              Präsentieren Sie Ihre Immobilien 
              <span className="text-estate"> professionell</span> auf Ihrer Website
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Mit ImmoupLoad binden Sie Ihre Immobilien mühelos in Ihre eigene Website ein – ganz ohne technisches Know-how oder teure Entwickler.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auth">Jetzt kostenlos starten</Link>
              </Button>
              <Button variant="outline" size="lg" onClick={() => scrollToSection('how-it-works')}>
                So funktioniert's <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Applications Section */}
      <section id="applications" className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-estate-dark">
            Anwendungen für <span className="text-estate">Immobilienmakler</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mb-4">
                <Code className="text-estate" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-estate-dark">Immobilien unkompliziert auf die eigene Website darstellen</h3>
              <p className="text-gray-600 mb-6">
                Viele Immobilienmakler verzichten darauf, ihre Angebote auf der eigenen Webseite zu präsentieren, weil ihnen technisches Wissen fehlt. Immoupload bietet eine simple, intuitive Lösung: Sie erhalten einen kleinen Code-Schnipsel, den Sie ganz einfach in Ihre Webseite einfügen – fertig! Alle Immobilien erscheinen sofort professionell und aktuell auf Ihrer Seite.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Kein technisches Vorwissen nötig</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Sofort einsatzbereit mit einem kurzen Code</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Professionelle Immobilienanzeigen auf der eigenen Website</span>
                </li>
              </ul>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-estate" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-estate-dark">Nie mehr teure Agenturen oder Entwickler nötig</h3>
              <p className="text-gray-600 mb-6">
                Bisher mussten Sie für die professionelle Präsentation Ihrer Immobilien auf der eigenen Website oft teure Agenturen oder Webentwickler engagieren. Mit Immoupload sparen Sie diese Kosten vollständig ein. Ein kleiner Code-Schnipsel genügt, und Ihre Immobilien sind perfekt präsentiert – ganz ohne Zusatzkosten oder technische Kopfschmerzen.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Keine externen Dienstleister oder Agenturen mehr nötig</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Spart erheblich Kosten</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Unabhängigkeit in der Immobilienvermarktung</span>
                </li>
              </ul>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mb-4">
                <Users className="text-estate" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-estate-dark">Einfache Verwaltung der Immobilien direkt aus Ihrem Dashboard</h3>
              <p className="text-gray-600 mb-6">
                Verwalten Sie Ihre Immobilienanzeigen komfortabel in Ihrem eigenen übersichtlichen Dashboard. Änderungen wie Preisupdates oder neue Fotos erscheinen automatisch auf Ihrer Webseite – ohne zusätzlichen Aufwand. So wird die Immobilienpräsentation für Sie nicht zur technischen Herausforderung, sondern zur einfachen, angenehmen Aufgabe.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Intuitive Bedienung des Dashboards</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Änderungen erscheinen sofort automatisch online</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Mehr Kontrolle, weniger Zeitaufwand</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-estate-gray">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-estate-dark">
            Immoupload – Die wichtigsten <span className="text-estate">Funktionen</span> im Überblick
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <CircleCheck className="text-estate h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-estate-dark">Kinderleichte Website-Integration</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Immobilienanzeigen mit einem kleinen Code-Schnipsel einbinden</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Kein technisches Vorwissen nötig</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Sofort einsatzbereit, unkompliziert und zuverlässig</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <CircleCheck className="text-estate h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-estate-dark">Übersichtliches Dashboard für Makler</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Einfaches Hinzufügen, Bearbeiten und Löschen von Immobilien</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Schnelle Updates und Echtzeit-Vorschau der Änderungen</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Vollständige Kontrolle über dein Portfolio – jederzeit und überall</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <CircleCheck className="text-estate h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-estate-dark">Optimierte Darstellung der Immobilienanzeigen</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Moderne, responsive Anzeigen auf allen Geräten</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Schnelle Ladezeiten und bessere Sichtbarkeit bei Google</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>Hochwertige Präsentation, die Käufer und Verkäufer überzeugt</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-estate text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bereit, Ihre Immobilien professionell zu präsentieren?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Starten Sie noch heute und verbessern Sie Ihre Online-Präsenz für Immobilien.
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white text-estate hover:bg-estate hover:text-white border-white"
            asChild
          >
            <Link to="/auth">Jetzt kostenfrei starten</Link>
          </Button>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-estate-dark">
            So einfach <span className="text-estate">starten</span> Sie
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-12 h-12 bg-estate rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div className="bg-white rounded-lg p-8 pl-10 shadow-md ml-6">
                <h3 className="text-xl font-bold mb-4 text-estate-dark">Registrieren Sie sich</h3>
                <p className="text-gray-600">
                  Erstellen Sie einfach ein kostenloses Konto, um Zugang zu allen Funktionen von Immoupload zu erhalten.
                </p>
              </div>
              <div className="hidden md:block absolute -right-5 top-1/2 transform -translate-y-1/2 z-10">
                <ArrowRight className="text-estate h-6 w-6" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-12 h-12 bg-estate rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div className="bg-white rounded-lg p-8 pl-10 shadow-md ml-6">
                <h3 className="text-xl font-bold mb-4 text-estate-dark">Erfassen Sie Ihre Immobilien</h3>
                <p className="text-gray-600">
                  Legen Sie Ihr Profil an und erfassen Sie Ihre Immobilien schnell und einfach im übersichtlichen Dashboard.
                </p>
              </div>
              <div className="hidden md:block absolute -right-5 top-1/2 transform -translate-y-1/2 z-10">
                <ArrowRight className="text-estate h-6 w-6" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-12 h-12 bg-estate rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div className="bg-white rounded-lg p-8 pl-10 shadow-md ml-6">
                <h3 className="text-xl font-bold mb-4 text-estate-dark">Fügen Sie den Code ein</h3>
                <p className="text-gray-600">
                  Kopieren Sie den Code-Schnipsel und fügen Sie ihn auf Ihrer Website ein. Wie genau das geht, erklären wir Ihnen natürlich ausführlich.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-estate-gray">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-estate-dark">
            Häufig <span className="text-estate">gestellte Fragen</span>
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-estate-dark">Benötige ich Programmierkenntnisse?</h3>
              <p className="text-gray-600">
                Nein, überhaupt nicht. Sie erhalten einen fertigen Code-Schnipsel, den Sie einfach kopieren und in Ihre Website einfügen. Wir bieten ausführliche Anleitungen für alle gängigen Website-Systeme wie WordPress, Wix, Jimdo und viele mehr.
              </p>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-estate-dark">Wie viele Immobilien kann ich verwalten?</h3>
              <p className="text-gray-600">
                Es gibt keine Begrenzung für die Anzahl der Immobilien, die Sie mit Immoupload verwalten können. Ob eine einzelne Immobilie oder ein umfangreiches Portfolio – unser System ist für jede Größe ausgelegt.
              </p>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-estate-dark">Wie schnell sind meine Änderungen sichtbar?</h3>
              <p className="text-gray-600">
                Alle Änderungen, die Sie im Dashboard vornehmen, werden sofort auf Ihrer Website sichtbar. Es gibt keine Verzögerung oder Wartezeiten – Ihre Website bleibt immer aktuell.
              </p>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-estate-dark">Wie passen sich die Anzeigen an mein Website-Design an?</h3>
              <p className="text-gray-600">
                Unsere Immobilienanzeigen sind so gestaltet, dass sie sich harmonisch in jedes Website-Design einfügen. Sie können zudem verschiedene Darstellungsoptionen wählen, um den Look an Ihren individuellen Stil anzupassen.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section (placeholder) */}
      <section id="pricing" className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-estate-dark">
            Unsere <span className="text-estate">Preise</span>
          </h2>
          
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-estate-dark">Starter</h3>
                  <span className="bg-estate-light/20 text-estate px-3 py-1 rounded-full text-sm font-medium">Kostenlos</span>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">€0</span>
                  <span className="text-gray-500">/Monat</span>
                </div>
                <p className="text-gray-600 mb-6">Perfekt für Einsteiger und kleine Portfolios.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>Bis zu 5 Immobilien</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>Grundlegende Dashboard-Funktionen</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>Standard Website-Integration</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>E-Mail Support</span>
                  </li>
                </ul>
              </div>
              <div className="px-8 pb-8">
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/auth">Kostenlos starten</Link>
                </Button>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-estate">
              <div className="bg-estate text-white p-3 text-center font-medium">
                Empfohlen für Immobilienmakler
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-estate-dark">Professional</h3>
                  <span className="bg-estate text-white px-3 py-1 rounded-full text-sm font-medium">Beliebt</span>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">€29</span>
                  <span className="text-gray-500">/Monat</span>
                </div>
                <p className="text-gray-600 mb-6">Ideal für professionelle Immobilienmakler.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>Unbegrenzte Immobilien</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>Erweiterte Dashboard-Funktionen</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>Anpassbare Website-Integration</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>Prioritäts-Support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>Keine Immoupload-Branding</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>Erweiterte Analysen</span>
                  </li>
                </ul>
              </div>
              <div className="px-8 pb-8">
                <Button className="w-full" asChild>
                  <Link to="/auth">Jetzt starten</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-estate to-estate-dark text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Präsentieren Sie Ihre Immobilien noch heute professionell</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Nutzen Sie die einfachste Lösung zur Immobilienpräsentation und heben Sie sich von Ihrer Konkurrenz ab.
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white text-estate hover:bg-estate-light hover:text-white border-white"
            asChild
          >
            <Link to="/auth">Jetzt kostenlos starten</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-estate-text py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
                <span className="bg-white text-estate py-1 px-2 rounded mr-1">Immo</span>
                <span>Upload</span>
              </div>
              <p className="text-gray-300">
                Die einfachste Lösung, um Immobilien professionell auf Ihrer eigenen Website zu präsentieren.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Produkt</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#applications" className="hover:text-white transition-colors">Anwendungen</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Funktionen</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Preise</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Ressourcen</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Dokumentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="mailto:info@immoupload.com" className="hover:text-white transition-colors">info@immoupload.com</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} immoupload.com. Alle Rechte vorbehalten.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Impressum</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Datenschutz</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">AGB</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
