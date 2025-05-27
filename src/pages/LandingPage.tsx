import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Upload, 
  Eye, 
  Share2, 
  Building2, 
  Users, 
  Zap, 
  Check,
  X,
  Star,
  ArrowRight,
  Flag,
  Smartphone,
  Mail,
  CheckCircle,
  Globe,
  Shield,
  Palette,
  BarChart3,
  FileText,
  Monitor,
  Tablet,
  Code,
  Heart,
  Wrench,
  Clock,
  Euro,
  MessageSquare,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const content = {
    de: {
      navigation: {
        login: "Login",
        functions: "Funktionen",
        pricing: "Preise",
        faq: "FAQ",
        demo: "Kostenlos testen"
      },
      hero: {
        title: "Immobilien verwalten & präsentieren –",
        subtitle: "einfach, modern, smart.",
        description: "Immoupload ist dein Immobilien-CMS mit integriertem Frontend. Verwalte deine Objekte mühelos und präsentiere sie professionell auf deiner Webseite.",
        cta: "Jetzt kostenlos testen",
        demo: "Live-Demo ansehen"
      },
      howItWorks: {
        title: "So einfach funktioniert's",
        subtitle: "In drei simplen Schritten zu professionellen Immobilien-Listings auf Ihrer Webseite.",
        steps: [
          {
            number: "1",
            title: "Immobilie hinzufügen",
            description: "Erfassen Sie alle Objektdaten schnell und intuitiv in Ihrem Dashboard.",
            icon: Building2
          },
          {
            number: "2", 
            title: "Auf Webseite einbetten",
            description: "Integrieren Sie Ihre Immobilienliste mit einem Code-Snippet auf Ihrer Seite.",
            icon: Code
          },
          {
            number: "3",
            title: "Leads generieren",
            description: "Erhalten Sie Anfragen direkt über das integrierte Kontaktformular im Exposé.",
            icon: Users
          }
        ]
      },
      problems: {
        title: "Schluss mit Kompromissen",
        subtitle: "Verabschieden Sie sich von alten Problemen und begrüßen Sie die Zukunft der Immobilienpräsentation.",
        items: [
          {
            problem: "Veraltete Plugins & Systeme",
            problemDesc: "Komplizierte Wartung, Sicherheitslücken und mangelnde Flexibilität.",
            solution: "Moderne Cloud-Lösung",
            solutionDesc: "Immer aktuell, sicher und flexibel – ohne Wartungsaufwand."
          },
          {
            problem: "Unübersichtliche Arbeitsabläufe", 
            problemDesc: "Zeitraubende manuelle Eingaben und uneinheitliche Darstellung.",
            solution: "Streamlined Workflow",
            solutionDesc: "Einfache Eingabe, automatische Exposé-Erstellung und einheitliches Design."
          },
          {
            problem: "Fehlende mobile Optimierung",
            problemDesc: "Schlechte Darstellung auf Smartphones und Tablets schadet Ihrem Image.",
            solution: "Mobile-First Design", 
            solutionDesc: "Perfekte Darstellung auf allen Geräten – Desktop, Tablet und Smartphone."
          },
          {
            problem: "Hoher Aufwand für Exposé-Erstellung",
            problemDesc: "Manuelles Erstellen von ansprechenden Exposés ist zeitaufwändig.",
            solution: "Automatische Exposé-Generierung",
            solutionDesc: "Professionelle Exposés werden automatisch erstellt – mit Bildergalerie und Kontaktformular."
          }
        ]
      },
      features: {
        title: "Alle Funktionen für Ihren Erfolg",
        items: [
          {
            icon: Monitor,
            title: "Property Management Dashboard",
            description: "Verwalten Sie alle Immobilien zentral in einem übersichtlichen Dashboard."
          },
          {
            icon: FileText,
            title: "Auto-generierte Exposés",
            description: "Professionelle Exposés mit Bildergalerie und Kontaktformular – vollautomatisch."
          },
          {
            icon: Code,
            title: "Embeddable Frontend",
            description: "Einfache Integration auf Ihrer Webseite mit einem Code-Snippet."
          },
          {
            icon: Smartphone,
            title: "Mobile Optimierung",
            description: "Perfekte Darstellung auf Desktop, Tablet und Smartphone."
          },
          {
            icon: Shield,
            title: "DSGVO-konform",
            description: "Vollständige Compliance mit deutschen Datenschutzbestimmungen."
          },
          {
            icon: BarChart3,
            title: "Analytics & Insights",
            description: "Verfolgen Sie Performance Ihrer Immobilien-Listings."
          }
        ]
      },
      showcase: {
        title: "So sieht es auf Ihrer Webseite aus",
        subtitle: "Professionelle Darstellung auf Desktop und Mobile"
      },
      pricing: {
        title: "Transparente Preise",
        subtitle: "Wählen Sie das Paket, das zu Ihnen passt",
        plans: [
          {
            name: "Starter",
            price: "19",
            period: "€/Monat",
            description: "Ideal für kleine Maklerbüros",
            features: [
              "Bis zu 9 Immobilien",
              "Moderne Exposés",
              "Mobile optimiert", 
              "Kontaktformulare",
              "E-Mail Support"
            ],
            cta: "Jetzt starten",
            popular: false
          },
          {
            name: "Pro",
            price: "39,99",
            period: "€/Monat", 
            description: "Für größere Büros und Agenturen",
            features: [
              "Unbegrenzte Immobilien",
              "Premium Design",
              "Custom Branding",
              "Erweiterte Analytics",
              "Priorität Support",
              "API Zugang"
            ],
            cta: "Pro starten",
            popular: true
          }
        ],
        notes: [
          "Keine Einrichtungsgebühren",
          "Jederzeit kündbar",
          "30 Tage Geld-zurück-Garantie"
        ]
      },
      integrations: {
        title: "Integrations & Kompatibilität",
        subtitle: "Funktioniert mit allen gängigen Website-Baukästen",
        platforms: [
          { name: "WordPress", icon: Globe },
          { name: "Webflow", icon: Globe },
          { name: "Jimdo", icon: Globe },
          { name: "Wix", icon: Globe },
          { name: "HTML/CSS", icon: Code },
          { name: "React", icon: Code }
        ]
      },
      faq: {
        title: "Häufig gestellte Fragen",
        items: [
          {
            question: "Wo werden meine Daten gehostet?",
            answer: "Alle Daten werden in Deutschland auf DSGVO-konformen Servern gehostet."
          },
          {
            question: "Wie funktioniert der Support?",
            answer: "Wir bieten E-Mail-Support für Starter-Kunden und Prioritäts-Support für Pro-Kunden."
          },
          {
            question: "Ist meine Webseite sicher?",
            answer: "Ja, alle Datenübertragungen sind verschlüsselt und wir folgen höchsten Sicherheitsstandards."
          },
          {
            question: "Kann ich jederzeit kündigen?",
            answer: "Ja, Sie können Ihr Abonnement jederzeit ohne Kündigungsfrist beenden."
          },
          {
            question: "Gibt es eine Geld-zurück-Garantie?",
            answer: "Ja, wir bieten eine 30-tägige Geld-zurück-Garantie ohne Angabe von Gründen."
          }
        ]
      },
      finalCta: {
        title: "Bereit, deine Immobilien zu präsentieren?",
        subtitle: "Starte jetzt mit Immoupload und hebe dich von der Konkurrenz ab.",
        cta: "Jetzt starten – keine Kreditkarte nötig"
      },
      testimonials: {
        title: "Was unsere Kunden sagen",
        items: [
          {
            name: "Thomas Müller",
            role: "Immobilienmakler, München", 
            content: "Immoupload hat meine Arbeitsweise revolutioniert. Endlich kann ich mich aufs Verkaufen konzentrieren, statt auf Technik!",
            rating: 5
          },
          {
            name: "Sandra Weber",
            role: "Geschäftsführerin, Berlin Real Estate",
            content: "Die Integration war so einfach! In 10 Minuten war alles online und unsere Kunden sind begeistert vom modernen Design.",
            rating: 5
          },
          {
            name: "Michael Schmidt", 
            role: "Freier Makler, Hamburg",
            content: "Endlich eine bezahlbare Lösung! Für 19€ bekomme ich mehr als bei anderen Anbietern für das 10-fache.",
            rating: 5
          }
        ]
      },
      footer: {
        copyright: "Alle Rechte vorbehalten.",
        contact: {
          title: "Kontakt",
          email: "info@immoupload.com",
          phone: "+49 123 456789"
        },
        links: {
          legal: "Impressum", 
          privacy: "Datenschutz"
        }
      }
    },
    en: {
      navigation: {
        login: "Login",
        functions: "Features", 
        pricing: "Pricing",
        faq: "FAQ",
        demo: "Free Trial"
      },
      hero: {
        title: "Manage & present real estate –",
        subtitle: "simple, modern, smart.",
        description: "Immoupload is your real estate CMS with integrated frontend. Manage your properties effortlessly and present them professionally on your website.",
        cta: "Start free trial",
        demo: "View live demo"
      },
      howItWorks: {
        title: "So einfach funktioniert's",
        subtitle: "In three simple steps to professional real estate listings on your website.",
        steps: [
          {
            number: "1",
            title: "Add property",
            description: "Quickly and intuitively enter all property data in your dashboard.",
            icon: Building2
          },
          {
            number: "2", 
            title: "Embed on website",
            description: "Integrate your property list with a code snippet on your site.",
            icon: Code
          },
          {
            number: "3",
            title: "Generate leads",
            description: "Receive inquiries directly via the integrated contact form in the listing.",
            icon: Users
          }
        ]
      },
      problems: {
        title: "End with compromises",
        subtitle: "Say goodbye to old problems and welcome the future of real estate presentation.",
        items: [
          {
            problem: "Outdated plugins & systems",
            problemDesc: "Complicated maintenance, security gaps, and limited flexibility.",
            solution: "Modern cloud solution",
            solutionDesc: "Always up-to-date, secure, and flexible – without maintenance effort."
          },
          {
            problem: "Overwhelming manual workflows", 
            problemDesc: "Time-consuming manual entries and inconsistent presentation.",
            solution: "Streamlined workflow",
            solutionDesc: "Simple input, automatic listing creation, and consistent design."
          },
          {
            problem: "Lack of mobile optimization",
            problemDesc: "Poor display on smartphones and tablets harms your image.",
            solution: "Mobile-first design", 
            solutionDesc: "Perfect display on all devices – desktop, tablet, and smartphone."
          },
          {
            problem: "High effort for listing creation",
            problemDesc: "Manual creation of appealing listings is time-consuming.",
            solution: "Automatic listing generation",
            solutionDesc: "Professional listings are automatically created – with image gallery and contact form."
          }
        ]
      },
      features: {
        title: "All functions for your success",
        items: [
          {
            icon: Monitor,
            title: "Property Management Dashboard",
            description: "Manage all properties centrally in an overview dashboard."
          },
          {
            icon: FileText,
            title: "Auto-generated Exposés",
            description: "Professional listings with image gallery and contact form – fully automated."
          },
          {
            icon: Code,
            title: "Embeddable Frontend",
            description: "Simple integration on your website with a code snippet."
          },
          {
            icon: Smartphone,
            title: "Mobile Optimization",
            description: "Perfect display on desktop, tablet, and smartphone."
          },
          {
            icon: Shield,
            title: "DSGVO-compliant",
            description: "Full compliance with German data protection regulations."
          },
          {
            icon: BarChart3,
            title: "Analytics & Insights",
            description: "Track performance of your real estate listings."
          }
        ]
      },
      showcase: {
        title: "How it looks on your website",
        subtitle: "Professional presentation on desktop and mobile"
      },
      pricing: {
        title: "Transparent pricing",
        subtitle: "Choose the package that fits you",
        plans: [
          {
            name: "Starter",
            price: "19",
            period: "€/month",
            description: "Ideal for small real estate offices",
            features: [
              "Up to 9 properties",
              "Modern listings",
              "Mobile optimized",
              "Contact forms",
              "Email support"
            ],
            cta: "Start now",
            popular: false
          },
          {
            name: "Pro",
            price: "39.99",
            period: "€/month",
            description: "For larger offices and agencies",
            features: [
              "Unlimited properties",
              "Premium design",
              "Custom branding",
              "Advanced analytics",
              "Priority support",
              "API access"
            ],
            cta: "Start Pro",
            popular: true
          }
        ],
        notes: [
          "No setup fees",
          "Can be cancelled at any time",
          "30-day money-back guarantee"
        ]
      },
      integrations: {
        title: "Integrations & Compatibility",
        subtitle: "Works with all common website builders",
        platforms: [
          { name: "WordPress", icon: Globe },
          { name: "Webflow", icon: Globe },
          { name: "Jimdo", icon: Globe },
          { name: "Wix", icon: Globe },
          { name: "HTML/CSS", icon: Code },
          { name: "React", icon: Code }
        ]
      },
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            question: "Where are my data hosted?",
            answer: "All data is hosted on DSGVO-compliant servers in Germany."
          },
          {
            question: "How does support work?",
            answer: "We offer email support for Starter customers and priority support for Pro customers."
          },
          {
            question: "Is my website secure?",
            answer: "Yes, all data transfers are encrypted and we follow highest security standards."
          },
          {
            question: "Can I cancel at any time?",
            answer: "Yes, you can cancel your subscription at any time without a cancellation fee."
          },
          {
            question: "Is there a money-back guarantee?",
            answer: "Yes, we offer a 30-day money-back guarantee without specifying reasons."
          }
        ]
      },
      finalCta: {
        title: "Ready to present your real estate?",
        subtitle: "Start now with Immoupload and stand out from the competition.",
        cta: "Start now – no credit card required"
      },
      testimonials: {
        title: "What our customers say",
        items: [
          {
            name: "Thomas Müller",
            role: "Real Estate Agent, Munich",
            content: "Immoupload has revolutionized my way of working. Finally I can focus on selling instead of technology!",
            rating: 5
          },
          {
            name: "Sandra Weber",
            role: "CEO, Berlin Real Estate",
            content: "The integration was so easy! Everything was online in 10 minutes and our customers love the modern design.",
            rating: 5
          },
          {
            name: "Michael Schmidt",
            role: "Freelance Agent, Hamburg",
            content: "Finally an affordable solution! For €19 I get more than from other providers for 10 times the price.",
            rating: 5
          }
        ]
      },
      footer: {
        copyright: "All rights reserved.",
        contact: {
          title: "Contact",
          email: "info@immoupload.com",
          phone: "+49 123 456789"
        },
        links: {
          legal: "Legal Notice",
          privacy: "Privacy Policy"
        }
      }
    }
  };

  const currentContent = content[language];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => 
        (prev + 1) % currentContent.testimonials.items.length
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [currentContent.testimonials.items.length]);

  const switchLanguage = () => {
    const newLanguage = language === 'de' ? 'en' : 'de';
    setLanguage(newLanguage);
  };

  const handleLegalNavigation = (type: 'legal' | 'privacy') => {
    if (language === 'de') {
      navigate(type === 'legal' ? '/impressum' : '/datenschutz');
    } else {
      navigate(type === 'legal' ? '/legal-notice' : '/privacy-policy');
    }
  };

  const currentFlag = language === 'de' ? '🇩🇪' : '🇺🇸';

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <span className="text-blue-600">Immoupload.com</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#funktionen" className="text-gray-600 hover:text-gray-900 font-medium">{currentContent.navigation.functions}</a>
            <a href="#preise" className="text-gray-600 hover:text-gray-900 font-medium">{currentContent.navigation.pricing}</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 font-medium">{currentContent.navigation.faq}</a>
            <Link to="/admin" className="text-gray-600 hover:text-gray-900 font-medium">{currentContent.navigation.login}</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={switchLanguage}
              title={language === 'de' ? 'Switch to English' : 'Zu Deutsch wechseln'}
            >
              <span className="text-lg">{currentFlag}</span>
            </Button>
            <Link to="/payment">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                {currentContent.navigation.demo}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            {currentContent.hero.title}
            <br />
            <span className="text-blue-600">{currentContent.hero.subtitle}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {currentContent.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/payment">
              <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 h-14">
                {currentContent.hero.cta}
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-14 border-gray-300">
              {currentContent.hero.demo}
            </Button>
          </div>
          
          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="relative w-full max-w-5xl mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Immoupload Dashboard Preview" 
                className="w-full h-auto rounded-xl shadow-2xl border border-gray-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white" id="funktionen">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {currentContent.howItWorks.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {currentContent.howItWorks.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {currentContent.howItWorks.steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {currentContent.problems.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {currentContent.problems.subtitle}
            </p>
          </div>
          
          <div className="space-y-8">
            {currentContent.problems.items.map((item, index) => (
              <div key={index} className="grid lg:grid-cols-2 gap-8">
                {/* Problem */}
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <X className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-red-900 mb-2">{item.problem}</CardTitle>
                        <p className="text-red-700">{item.problemDesc}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Solution */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-green-900 mb-2">{item.solution}</CardTitle>
                        <p className="text-green-700">{item.solutionDesc}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {currentContent.features.title}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.features.items.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                  <p className="text-gray-600">{feature.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Frontend Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {currentContent.showcase.title}
            </h2>
            <p className="text-xl text-gray-600">
              {currentContent.showcase.subtitle}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Desktop Ansicht</h3>
              <div className="bg-white rounded-lg shadow-xl p-4">
                <img 
                  src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Desktop Preview" 
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6">Mobile Ansicht</h3>
              <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Mobile Preview" 
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white" id="preise">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {currentContent.pricing.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {currentContent.pricing.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {currentContent.pricing.plans.map((plan, index) => (
              <Card key={index} className={`relative overflow-hidden ${plan.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-blue-600 text-white text-sm font-bold px-4 py-1">
                      Beliebt
                    </div>
                  </div>
                )}
                <CardHeader className={`${plan.popular ? 'bg-blue-50' : ''} pb-8`}>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-lg font-normal text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/payment" className="block">
                    <Button 
                      className={`w-full py-3 text-base ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              {currentContent.pricing.notes.map((note, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  {note}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {currentContent.integrations.title}
            </h2>
            <p className="text-xl text-gray-600">
              {currentContent.integrations.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {currentContent.integrations.platforms.map((platform, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-3">
                  <platform.icon className="h-8 w-8 text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">{platform.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white" id="faq">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {currentContent.faq.title}
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {currentContent.faq.items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-base leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {currentContent.testimonials.title}
            </h2>
          </div>
          
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-2xl italic mb-8 text-gray-700 leading-relaxed">
                "{currentContent.testimonials.items[currentTestimonial].content}"
              </blockquote>
              <div className="text-lg">
                <div className="font-semibold text-gray-900">
                  {currentContent.testimonials.items[currentTestimonial].name}
                </div>
                <div className="text-gray-600">
                  {currentContent.testimonials.items[currentTestimonial].role}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-8 space-x-3">
            {currentContent.testimonials.items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            {currentContent.finalCta.title}
          </h2>
          <p className="text-xl mb-8 text-gray-600 leading-relaxed">
            {currentContent.finalCta.subtitle}
          </p>
          <Link to="/payment">
            <Button size="lg" className="text-lg px-12 py-4 bg-blue-600 hover:bg-blue-700 h-14">
              {currentContent.finalCta.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 font-bold text-xl text-white mb-6">
                <span className="text-blue-400">Immoupload.com</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Die einfachste Lösung für Immobilienmakler, um Ihre Immobilien online zu präsentieren.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <ExternalLink className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Navigation</h3>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#funktionen" className="hover:text-white transition-colors">Funktionen</a></li>
                <li><a href="#preise" className="hover:text-white transition-colors">Preise</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">{currentContent.footer.contact.title}</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {currentContent.footer.contact.email}
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {currentContent.footer.contact.phone}
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} immoupload.com. {currentContent.footer.copyright}</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <button 
                onClick={() => handleLegalNavigation('legal')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {currentContent.footer.links.legal}
              </button>
              <button 
                onClick={() => handleLegalNavigation('privacy')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {currentContent.footer.links.privacy}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
