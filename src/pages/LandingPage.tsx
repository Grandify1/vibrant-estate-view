
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Eye, 
  Share2, 
  Building2, 
  Users, 
  Zap, 
  Check, 
  Star,
  ArrowRight,
  Flag,
  Smartphone,
  Mail
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const content = {
    de: {
      hero: {
        title: "Immobilien präsentieren war noch nie so einfach!",
        subtitle: "Immoupload.com – das einfachste CMS für Immobilienmakler. Professionelle, moderne Immobilien-Websites, ohne technisches Know-how.",
        cta: "Jetzt kostenlos testen!",
        demo: "Demo ansehen"
      },
      features: {
        title: "Warum Immoupload.com?",
        subtitle: "Alles was Sie als Immobilienmakler brauchen",
        items: [
          {
            icon: Upload,
            title: "Einfache Integration",
            description: "In wenigen Minuten online: Generiere deinen individuellen Code-Snippet und integriere Immoupload.com mühelos auf deiner bestehenden Website."
          },
          {
            icon: Eye,
            title: "Modernes, übersichtliches Design",
            description: "Präsentiere deine Immobilien professionell und modern. Überzeuge Interessenten mit ansprechenden Exposés, Bildergalerien und Kontaktformularen."
          },
          {
            icon: Share2,
            title: "Faire Preise, maximale Leistung",
            description: "Ab 19 € im Monat – bezahlbar für jeden Makler. Keine versteckten Kosten, keine hohen Einmalzahlungen wie bei anderen Lösungen."
          }
        ]
      },
      functions: {
        title: "Alle Funktionen für Ihren Erfolg",
        items: [
          {
            icon: Building2,
            title: "Schnelle Immobiliendaten-Pflege",
            description: "Einfach neue Immobilien hinzufügen, bearbeiten und veröffentlichen."
          },
          {
            icon: Users,
            title: "Dynamische Immobilienexposés",
            description: "Automatische Erstellung attraktiver Exposés inklusive Kontaktformular."
          },
          {
            icon: Smartphone,
            title: "Mobile optimiert",
            description: "Perfekte Darstellung auf Smartphone, Tablet und Desktop."
          },
          {
            icon: Mail,
            title: "Direkter Kundenkontakt",
            description: "Interessenten können direkt über das integrierte Kontaktformular anfragen."
          }
        ]
      },
      pricing: {
        title: "Transparente Preise",
        subtitle: "Wählen Sie das Paket, das zu Ihnen passt",
        monthly: "Monatlich",
        yearly: "Jährlich",
        yearlyDiscount: "2 Monate gratis",
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
            cta: "Jetzt kostenlos testen",
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
        ]
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
      cta: {
        title: "Überzeugt?",
        subtitle: "Starte jetzt mit Immoupload.com und hebe dich von der Konkurrenz ab. Einfacher. Moderner. Besser.",
        button: "Jetzt kostenlos testen und überzeugen lassen!"
      },
      footer: {
        copyright: "Alle Rechte vorbehalten.",
        links: {
          legal: "Impressum",
          privacy: "Datenschutz"
        }
      }
    },
    en: {
      hero: {
        title: "Real estate presentation has never been easier!",
        subtitle: "Immoupload.com – the simplest CMS for real estate agents. Professional, modern real estate websites, without technical know-how.",
        cta: "Start free trial!",
        demo: "View demo"
      },
      features: {
        title: "Why Immoupload.com?",
        subtitle: "Everything you need as a real estate agent",
        items: [
          {
            icon: Upload,
            title: "Easy Integration",
            description: "Online in minutes: Generate your individual code snippet and integrate Immoupload.com effortlessly on your existing website."
          },
          {
            icon: Eye,
            title: "Modern, Clear Design",
            description: "Present your properties professionally and modernly. Convince prospects with appealing exposés, image galleries and contact forms."
          },
          {
            icon: Share2,
            title: "Fair Prices, Maximum Performance",
            description: "From €19 per month – affordable for every agent. No hidden costs, no high one-time payments like other solutions."
          }
        ]
      },
      functions: {
        title: "All functions for your success",
        items: [
          {
            icon: Building2,
            title: "Fast Property Data Management",
            description: "Simply add, edit and publish new properties."
          },
          {
            icon: Users,
            title: "Dynamic Property Exposés",
            description: "Automatic creation of attractive exposés including contact form."
          },
          {
            icon: Smartphone,
            title: "Mobile Optimized",
            description: "Perfect display on smartphone, tablet and desktop."
          },
          {
            icon: Mail,
            title: "Direct Customer Contact",
            description: "Prospects can inquire directly via the integrated contact form."
          }
        ]
      },
      pricing: {
        title: "Transparent pricing",
        subtitle: "Choose the package that fits you",
        monthly: "Monthly",
        yearly: "Yearly",
        yearlyDiscount: "2 months free",
        plans: [
          {
            name: "Starter",
            price: "19",
            period: "€/month",
            description: "Ideal for small real estate offices",
            features: [
              "Up to 9 properties",
              "Modern exposés",
              "Mobile optimized",
              "Contact forms",
              "Email support"
            ],
            cta: "Start free trial",
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
        ]
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
      cta: {
        title: "Convinced?",
        subtitle: "Start now with Immoupload.com and stand out from the competition. Easier. More modern. Better.",
        button: "Start free trial and get convinced!"
      },
      footer: {
        copyright: "All rights reserved.",
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

  const languageFlag = language === 'de' ? '🇩🇪' : '🇺🇸';
  const switchToFlag = language === 'de' ? '🇺🇸' : '🇩🇪';

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-estate-dark">
            <span className="bg-estate text-white py-1 px-2 rounded mr-1">Immo</span>
            Upload
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={switchLanguage}
              title={language === 'de' ? 'Switch to English' : 'Zu Deutsch wechseln'}
            >
              <span className="text-lg">{switchToFlag}</span>
            </Button>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                {language === 'de' ? 'Anmelden' : 'Login'}
              </Button>
            </Link>
            <Link to="/payment">
              <Button size="sm">
                {currentContent.hero.cta}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-estate-dark leading-tight">
            {currentContent.hero.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {currentContent.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/payment">
              <Button size="lg" className="text-lg px-8 py-3">
                {currentContent.hero.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              {currentContent.hero.demo}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-estate-dark">
              {currentContent.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {currentContent.features.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {currentContent.features.items.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-estate text-white rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Functions Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-estate-dark">
              {currentContent.functions.title}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.functions.items.map((func, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-20 h-20 bg-estate/10 rounded-full flex items-center justify-center mb-6">
                  <func.icon className="h-10 w-10 text-estate" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{func.title}</h3>
                <p className="text-gray-600">{func.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-estate-dark">
              {currentContent.pricing.title}
            </h2>
            <p className="text-xl text-gray-600">
              {currentContent.pricing.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {currentContent.pricing.plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-estate shadow-xl scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-estate">
                    Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-500">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/payment">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-estate hover:bg-estate/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-estate-dark">
              {currentContent.testimonials.title}
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl italic mb-6">
                  "{currentContent.testimonials.items[currentTestimonial].content}"
                </blockquote>
                <div>
                  <div className="font-semibold">
                    {currentContent.testimonials.items[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600">
                    {currentContent.testimonials.items[currentTestimonial].role}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-6 space-x-2">
              {currentContent.testimonials.items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentTestimonial ? 'bg-estate' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-estate text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {currentContent.cta.title}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {currentContent.cta.subtitle}
          </p>
          <Link to="/payment">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              {currentContent.cta.button}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-estate-text py-8">
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-700 pt-8 flex justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} immoupload.com. {currentContent.footer.copyright}</p>
            <div className="flex gap-4">
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
