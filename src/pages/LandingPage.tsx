
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
  Flag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const content = {
    de: {
      hero: {
        title: "Die einfachste Art, Immobilien zu präsentieren",
        subtitle: "Laden Sie Ihre Immobilienfotos hoch und erhalten Sie sofort eine professionelle, teilbare Präsentation",
        cta: "Kostenlos starten",
        demo: "Demo ansehen"
      },
      features: {
        title: "Warum ImmoUpload wählen?",
        subtitle: "Alles was Sie brauchen, um Ihre Immobilien professionell zu präsentieren",
        items: [
          {
            icon: Upload,
            title: "Einfacher Upload",
            description: "Ziehen Sie Ihre Fotos einfach per Drag & Drop in unseren Editor"
          },
          {
            icon: Eye,
            title: "Sofortige Vorschau",
            description: "Sehen Sie sofort, wie Ihre Immobilie präsentiert wird"
          },
          {
            icon: Share2,
            title: "Einfaches Teilen",
            description: "Teilen Sie Ihre Präsentation mit einem einzigen Link"
          }
        ]
      },
      benefits: {
        title: "Perfekt für Immobilienprofis",
        items: [
          {
            icon: Building2,
            title: "Für Makler",
            description: "Erstellen Sie beeindruckende Exposés in Minuten, nicht Stunden"
          },
          {
            icon: Users,
            title: "Für Vermieter",
            description: "Präsentieren Sie Ihre Immobilie professionell an potenzielle Mieter"
          },
          {
            icon: Zap,
            title: "Für Entwickler",
            description: "Showcase neue Projekte mit hochwertigen Präsentationen"
          }
        ]
      },
      pricing: {
        title: "Transparente Preise",
        subtitle: "Wählen Sie den Plan, der zu Ihnen passt",
        monthly: "Monatlich",
        yearly: "Jährlich",
        yearlyDiscount: "2 Monate gratis",
        plans: [
          {
            name: "Starter",
            price: "0",
            period: "kostenlos",
            description: "Perfekt zum Ausprobieren",
            features: [
              "Bis zu 3 Immobilien",
              "10 Fotos pro Immobilie", 
              "Basic Präsentation",
              "Community Support"
            ],
            cta: "Kostenlos starten",
            popular: false
          },
          {
            name: "Professional",
            price: "29",
            period: "/Monat",
            description: "Für professionelle Makler",
            features: [
              "Unbegrenzte Immobilien",
              "Unbegrenzte Fotos",
              "Premium Vorlagen",
              "Custom Branding",
              "Priorität Support",
              "Analytics Dashboard"
            ],
            cta: "Jetzt starten",
            popular: true
          },
          {
            name: "Enterprise",
            price: "99",
            period: "/Monat",
            description: "Für große Unternehmen",
            features: [
              "Alles aus Professional",
              "Team Management",
              "API Zugang",
              "Custom Integration",
              "Dedicated Support",
              "SLA Garantie"
            ],
            cta: "Kontakt aufnehmen",
            popular: false
          }
        ]
      },
      testimonials: {
        title: "Was unsere Kunden sagen",
        items: [
          {
            name: "Sarah Weber",
            role: "Immobilienmaklerin",
            content: "ImmoUpload hat meine Art zu arbeiten völlig verändert. Ich kann jetzt in Minuten professionelle Exposés erstellen.",
            rating: 5
          },
          {
            name: "Michael Schmidt",
            role: "Vermieter",
            content: "Die Präsentationen sehen so professionell aus. Ich bekomme viel mehr Anfragen für meine Wohnungen.",
            rating: 5
          },
          {
            name: "Lisa Mueller",
            role: "Projektentwicklerin",
            content: "Perfect für unsere neuen Projekte. Die Investoren sind begeistert von den Präsentationen.",
            rating: 5
          }
        ]
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
        title: "The easiest way to present real estate",
        subtitle: "Upload your property photos and instantly get a professional, shareable presentation",
        cta: "Start for free",
        demo: "View demo"
      },
      features: {
        title: "Why choose ImmoUpload?",
        subtitle: "Everything you need to present your properties professionally",
        items: [
          {
            icon: Upload,
            title: "Easy Upload",
            description: "Simply drag & drop your photos into our editor"
          },
          {
            icon: Eye,
            title: "Instant Preview",
            description: "See immediately how your property will be presented"
          },
          {
            icon: Share2,
            title: "Easy Sharing",
            description: "Share your presentation with a single link"
          }
        ]
      },
      benefits: {
        title: "Perfect for real estate professionals",
        items: [
          {
            icon: Building2,
            title: "For Agents",
            description: "Create stunning listings in minutes, not hours"
          },
          {
            icon: Users,
            title: "For Landlords",
            description: "Present your property professionally to potential tenants"
          },
          {
            icon: Zap,
            title: "For Developers",
            description: "Showcase new projects with high-quality presentations"
          }
        ]
      },
      pricing: {
        title: "Transparent pricing",
        subtitle: "Choose the plan that fits you",
        monthly: "Monthly",
        yearly: "Yearly",
        yearlyDiscount: "2 months free",
        plans: [
          {
            name: "Starter",
            price: "0",
            period: "free",
            description: "Perfect for trying out",
            features: [
              "Up to 3 properties",
              "10 photos per property",
              "Basic presentation",
              "Community support"
            ],
            cta: "Start for free",
            popular: false
          },
          {
            name: "Professional",
            price: "29",
            period: "/month",
            description: "For professional agents",
            features: [
              "Unlimited properties",
              "Unlimited photos",
              "Premium templates",
              "Custom branding",
              "Priority support",
              "Analytics dashboard"
            ],
            cta: "Get started",
            popular: true
          },
          {
            name: "Enterprise",
            price: "99",
            period: "/month",
            description: "For large companies",
            features: [
              "Everything in Professional",
              "Team management",
              "API access",
              "Custom integration",
              "Dedicated support",
              "SLA guarantee"
            ],
            cta: "Contact us",
            popular: false
          }
        ]
      },
      testimonials: {
        title: "What our customers say",
        items: [
          {
            name: "Sarah Weber",
            role: "Real Estate Agent",
            content: "ImmoUpload has completely changed the way I work. I can now create professional listings in minutes.",
            rating: 5
          },
          {
            name: "Michael Schmidt",
            role: "Landlord",
            content: "The presentations look so professional. I get much more inquiries for my apartments.",
            rating: 5
          },
          {
            name: "Lisa Mueller",
            role: "Project Developer",
            content: "Perfect for our new projects. Investors are thrilled with the presentations.",
            rating: 5
          }
        ]
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

  // Funktion für sprachbasierte Navigation zur richtigen Seite
  const handleLegalNavigation = (type: 'legal' | 'privacy') => {
    if (language === 'de') {
      navigate(type === 'legal' ? '/impressum' : '/datenschutz');
    } else {
      navigate(type === 'legal' ? '/legal-notice' : '/privacy-policy');
    }
  };

  // Füge Flaggen-Emoji ein
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
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
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

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-estate-dark">
              {currentContent.benefits.title}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {currentContent.benefits.items.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-20 h-20 bg-estate/10 rounded-full flex items-center justify-center mb-6">
                  <benefit.icon className="h-10 w-10 text-estate" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
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
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    €{plan.price}
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
            {language === 'de' ? 'Bereit anzufangen?' : 'Ready to get started?'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {language === 'de' 
              ? 'Erstellen Sie noch heute Ihre erste professionelle Immobilienpräsentation.'
              : 'Create your first professional real estate presentation today.'
            }
          </p>
          <Link to="/payment">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              {currentContent.hero.cta}
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
