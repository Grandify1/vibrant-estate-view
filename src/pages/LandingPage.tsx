import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  Code, 
  FileText, 
  Users, 
  Star, 
  CircleCheck,
  ArrowRight,
  Award,
  ShieldCheck,
  Rocket,
  Flag
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const LandingPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const switchLanguage = (lang: 'de' | 'en') => {
    setLanguage(lang);
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
              {t('nav.application')}
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-sm text-gray-700 hover:text-estate transition-colors"
            >
              {t('nav.features')}
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-sm text-gray-700 hover:text-estate transition-colors"
            >
              {t('nav.pricing')}
            </button>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <button 
                className="flex items-center gap-1 text-sm text-gray-700 hover:text-estate transition-colors"
                onClick={() => switchLanguage(language === 'de' ? 'en' : 'de')}
              >
                <Flag className="h-4 w-4" />
                <span>{language === 'de' ? 'DE' : 'EN'}</span>
              </button>
            </div>
            <Link to="/auth" className="text-sm font-medium text-gray-700 hover:text-estate transition-colors">
              {t('nav.login')}
            </Link>
            <Button asChild>
              <Link to="/auth">{t('nav.start')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1773&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-estate-dark/90 to-estate/70"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="text-white max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('hero.title')} <span className="text-estate-accent">professionell</span>
              </h1>
              <p className="text-xl mb-8 text-white/90">
                {t('hero.subtitle')}
              </p>
              
              <div className="mb-10">
                <Button asChild size="sm" className="bg-white hover:bg-white/90 text-estate-dark">
                  <Link to="/auth">{t('hero.cta')}</Link>
                </Button>
              </div>
              
              {/* Key benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                <div className="flex items-start">
                  <div className="mr-3 p-2 rounded-full bg-estate-accent/20">
                    <Rocket className="h-5 w-5 text-estate-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t('features.integration')}</h3>
                    <p className="text-sm text-white/80">{t('features.integration.desc')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 p-2 rounded-full bg-estate-accent/20">
                    <ShieldCheck className="h-5 w-5 text-estate-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t('features.notech')}</h3>
                    <p className="text-sm text-white/80">{t('features.notech.desc')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 p-2 rounded-full bg-estate-accent/20">
                    <Award className="h-5 w-5 text-estate-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t('features.professional')}</h3>
                    <p className="text-sm text-white/80">{t('features.professional.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust element */}
          <div className="mt-8 md:mt-16 p-4 bg-white/10 backdrop-blur-sm rounded-xl max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-white font-medium mb-3 md:mb-0">{t('trust.rating')}</p>
              <div className="flex items-center">
                <span className="text-xl font-bold mr-2 text-white">{t('trust.excellent')}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-6 w-6 fill-estate-accent text-estate-accent" />
                  ))}
                </div>
                <span className="ml-3 text-white font-medium">5.0 aus 5</span>
              </div>
              <p className="text-white/80 text-sm ml-2 hidden md:block">{t('trust.based')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Applications Section with Images - BUTTONS REMOVED */}
      <section id="applications" className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-estate-dark">
            {t('applications.title').split(' ')[0]} <span className="text-estate">{t('applications.title').split(' ').slice(1).join(' ')}</span>
          </h2>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="h-56 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
              <div className="p-8">
                <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mb-4">
                  <Code className="text-estate" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-estate-dark">{t('applications.card1.title')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('applications.card1.desc')}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{t('applications.card1.point1')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('applications.card1.point2')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('applications.card1.point3')}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="h-56 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
              <div className="p-8">
                <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mb-4">
                  <FileText className="text-estate" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-estate-dark">{t('applications.card2.title')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('applications.card2.desc')}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{t('applications.card2.point1')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('applications.card2.point2')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('applications.card2.point3')}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="h-56 bg-[url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
              <div className="p-8">
                <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-estate" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-estate-dark">{t('applications.card3.title')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('applications.card3.desc')}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('applications.card3.point1')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('applications.card3.point2')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('applications.card3.point3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-estate-gray">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-estate-dark">
            {t('featuressection.title').split('–')[0]} <span className="text-estate">{t('featuressection.title').split('–')[1]}</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <CircleCheck className="text-estate h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-estate-dark">{t('applications.card1.title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>{t('applications.card1.point1')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>{t('applications.card1.point2')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>{t('applications.card1.point3')}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <CircleCheck className="text-estate h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-estate-dark">{t('applications.card2.title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>{t('applications.card2.point1')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>{t('applications.card2.point2')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>{t('applications.card2.point3')}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-12 h-12 bg-estate-light/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <CircleCheck className="text-estate h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-estate-dark">{t('applications.card3.title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>{t('applications.card3.point1')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>{t('applications.card3.point2')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                  <span>{t('applications.card3.point3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-estate text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t('cta.subtitle')}
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white text-estate hover:bg-estate hover:text-white border-white"
            asChild
          >
            <Link to="/auth">{t('cta.button')}</Link>
          </Button>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-estate-dark">
            {t('how.title').split(' ')[0]} <span className="text-estate">{t('how.title').split(' ').slice(1).join(' ')}</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-12 h-12 bg-estate rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div className="bg-white rounded-lg p-8 pl-10 shadow-md ml-6">
                <h3 className="text-xl font-bold mb-4 text-estate-dark">{t('how.step1.title')}</h3>
                <p className="text-gray-600">
                  {t('how.step1.desc')}
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
                <h3 className="text-xl font-bold mb-4 text-estate-dark">{t('how.step2.title')}</h3>
                <p className="text-gray-600">
                  {t('how.step2.desc')}
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
                <h3 className="text-xl font-bold mb-4 text-estate-dark">{t('how.step3.title')}</h3>
                <p className="text-gray-600">
                  {t('how.step3.desc')}
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
            {t('faq.title').split(' ')[0]} <span className="text-estate">{t('faq.title').split(' ').slice(1).join(' ')}</span>
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-estate-dark">{t('faq.q1')}</h3>
              <p className="text-gray-600">
                {t('faq.a1')}
              </p>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-estate-dark">{t('faq.q2')}</h3>
              <p className="text-gray-600">
                {t('faq.a2')}
              </p>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-estate-dark">{t('faq.q3')}</h3>
              <p className="text-gray-600">
                {t('faq.a3')}
              </p>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-estate-dark">{t('faq.q4')}</h3>
              <p className="text-gray-600">
                {t('faq.a4')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Updated Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-estate-dark">
            {t('pricing.title').split(' ')[0]} <span className="text-estate">{t('pricing.title').split(' ').slice(1).join(' ')}</span>
          </h2>
          
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Starter Plan - Updated price and features */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-estate-dark">{t('pricing.starter')}</h3>
                  <span className="bg-estate-light/20 text-estate px-3 py-1 rounded-full text-sm font-medium">{t('pricing.recommended')}</span>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">€19</span>
                  <span className="text-gray-500">{t('pricing.month')}</span>
                </div>
                <p className="text-gray-600 mb-6">{t('pricing.starter.desc')}</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('pricing.starter.feature1')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('pricing.starter.feature2')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('pricing.starter.feature3')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('pricing.starter.feature4')}</span>
                  </li>
                </ul>
              </div>
              <div className="px-8 pb-8">
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/payment?plan=starter">{t('cta.button')}</Link>
                </Button>
              </div>
            </div>
            
            {/* Professional Plan - Updated price and features */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-estate">
              <div className="bg-estate text-white p-3 text-center font-medium">
                {t('pricing.pro.reco')}
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-estate-dark">{t('pricing.pro')}</h3>
                  <span className="bg-estate text-white px-3 py-1 rounded-full text-sm font-medium">{t('pricing.pro.popular')}</span>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">€39</span>
                  <span className="text-gray-500">{t('pricing.month')}</span>
                </div>
                <p className="text-gray-600 mb-6">{t('pricing.pro.desc')}</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('pricing.pro.feature1')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('pricing.pro.feature2')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('pricing.pro.feature3')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('pricing.pro.feature4')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-estate mr-2 mt-1 flex-shrink-0" />
                    <span>{t('pricing.pro.feature5')}</span>
                  </li>
                </ul>
              </div>
              <div className="px-8 pb-8">
                <Button className="w-full" asChild>
                  <Link to="/payment?plan=professional">{t('cta.button')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-estate to-estate-dark text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('finalcta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t('finalcta.subtitle')}
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white text-estate hover:bg-estate-light hover:text-white border-white"
            asChild
          >
            <Link to="/auth">{t('cta.button')}</Link>
          </Button>
        </div>
      </section>

      {/* Footer - Removed Ressourcen section */}
      <footer className="bg-estate-text py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
                <span className="bg-white text-estate py-1 px-2 rounded mr-1">Immo</span>
                <span>Upload</span>
              </div>
              <p className="text-gray-300">
                {t('footer.desc')}
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer.product')}</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#applications" className="hover:text-white transition-colors">{t('footer.applications')}</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">{t('footer.features')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t('footer.pricing')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer.contact')}</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="mailto:info@immoupload.com" className="hover:text-white transition-colors">info@immoupload.com</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.support')}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} immoupload.com. {t('footer.rights')}</p>
            <div className="flex gap-4">
              <Link to="/impressum" className="text-gray-400 hover:text-white transition-colors">{t('footer.imprint')}</Link>
              <Link to="/datenschutz" className="text-gray-400 hover:text-white transition-colors">{t('footer.privacy')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
