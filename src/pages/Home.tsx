import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Heart, TrendingUp, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberName, setSubscriberName] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscriberEmail || !subscriberName) {
      toast.error('Please fill in all fields');
      return;
    }

    // Save subscriber
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    subscribers.push({
      id: `sub-${Date.now()}`,
      email: subscriberEmail,
      name: subscriberName,
      subscribedAt: new Date().toISOString(),
    });
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    
    toast.success('Thank you for subscribing! You will receive campaign updates.');
    setSubscriberEmail('');
    setSubscriberName('');
  };

  const stats = [
    { icon: Users, value: '50K+', label: 'Supporters' },
    { icon: Target, value: '7', label: 'Key Priorities' },
    { icon: Heart, value: '25+', label: 'Years of Service' },
    { icon: TrendingUp, value: '2027', label: 'Vision for Change' },
  ];

  const actionItems = [
    {
      title: 'Economic Empowerment',
      description: 'Creating sustainable livelihood opportunities through skills training and microfinance access.',
      icon: TrendingUp,
    },
    {
      title: 'Education Reform',
      description: 'Building modern schools and ensuring every child has access to quality education.',
      icon: Users,
    },
    {
      title: 'Healthcare Access',
      description: 'Upgrading health facilities and bringing healthcare closer to the people.',
      icon: Heart,
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-white to-gray-100"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#f9d100] blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#008000] blur-3xl" />
        </div>

        <div className="section-padding w-full py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1 z-10">
              <div className="inline-flex items-center gap-2 bg-[#f9d100]/20 px-4 py-2 rounded-full mb-6 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-[#f9d100] animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Kilifi County Governor 2027</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-slide-up">
                MEET YOUR{' '}
                <span className="text-[#f9d100]">NEXT</span>{' '}
                GOVERNOR
              </h1>
              
              <p className="text-xl text-gray-600 mb-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
                Hon. Aisha Jumwa Karisa Katana
              </p>
              <p className="text-lg text-[#008000] font-medium mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
                A Bold Leader for a Brighter Kilifi
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12 animate-slide-up" style={{ animationDelay: '400ms' }}>
                <Link to="/get-involved" className="btn-primary flex items-center gap-2">
                  JOIN THE MOVEMENT
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/about" className="btn-secondary">
                  LEARN MORE
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '500ms' }}>
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-[#f9d100] hover:text-black transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="order-1 lg:order-2 relative animate-slide-in-right">
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-4 border-[#f9d100] rounded-lg" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 border-4 border-[#008000] rounded-lg" />
                
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/images/Aisha-Jumwa.jpg" 
                    alt="Hon. Aisha Jumwa"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-[#f9d100] text-black px-6 py-4 rounded-lg shadow-lg animate-float">
                  <p className="font-bold text-lg">UDA</p>
                  <p className="text-sm">Kazi Ni Kazi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black text-white">
        <div className="section-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-[#f9d100]" />
                <p className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 lg:py-28">
        <div className="section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative animate-on-scroll opacity-0 -translate-x-12 transition-all duration-700">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="/images/hero.jpg" 
                  alt="Aisha Jumwa"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#f9d100]/10 rounded-full -z-10" />
            </div>

            {/* Content */}
            <div className="animate-on-scroll opacity-0 translate-x-12 transition-all duration-700">
              <span className="text-[#f9d100] font-semibold text-sm uppercase tracking-wider">About The Leader</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-6">
                A Legacy of Service & Dedication
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Aisha Jumwa Karisa Katana, born on 28 March 1975 in the historic village of Takaungu, 
                Kilifi County, is a bold and resilient leader whose political journey reflects determination, 
                courage, and unwavering commitment to public service.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Rising from humble beginnings, she has carved out a remarkable path in Kenya's political 
                landscape, becoming one of the most influential voices from the Coast region.
              </p>
              <Link to="/about" className="btn-primary inline-flex items-center gap-2">
                READ FULL STORY
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-gradient-to-r from-[#f9d100]/10 to-[#008000]/10">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll opacity-0 scale-95 transition-all duration-700">
            <span className="text-6xl text-[#f9d100] font-serif">"</span>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-relaxed -mt-4 mb-6">
              Leadership is not about titles, it's about making a difference 
              for every citizen of Kilifi County.
            </blockquote>
            <cite className="text-lg text-[#008000] font-medium not-italic">
              — Hon Aisha Jumwa
            </cite>
          </div>
        </div>
      </section>

      {/* Action Plan Preview */}
      <section className="py-20 lg:py-28">
        <div className="section-padding">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#f9d100] font-semibold text-sm uppercase tracking-wider">Our Vision</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4">
              ACTION PLAN
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the key priorities that will drive transformative change in Kilifi County
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {actionItems.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 card-hover animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-lg bg-[#f9d100]/20 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-[#f9d100]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <Link to="/action-plan" className="btn-secondary inline-flex items-center gap-2">
              VIEW ALL PRIORITIES
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="py-20 bg-black text-white">
        <div className="section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll opacity-0 -translate-x-12 transition-all duration-700">
              <span className="text-[#f9d100] font-semibold text-sm uppercase tracking-wider">Join Us</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">
                GET INVOLVED
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Be part of the change you want to see in Kilifi County. Join thousands of 
                supporters working towards a brighter future. Whether you want to volunteer, 
                become a delegate, or simply stay updated, there's a place for you in this movement.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/get-involved" className="btn-primary">
                  JOIN NOW
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 animate-on-scroll opacity-0 translate-x-12 transition-all duration-700">
              {[
                { title: 'Join as Delegate', desc: 'Represent your community' },
                { title: 'Volunteer', desc: 'Contribute your skills' },
                { title: 'Subscribe', desc: 'Get campaign updates' },
                { title: 'Donate', desc: 'Support the movement' },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-[#f9d100]/50 transition-colors"
                >
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-gradient-to-br from-[#f9d100]/10 to-[#008000]/10">
        <div className="section-padding">
          <div className="max-w-2xl mx-auto text-center animate-on-scroll opacity-0 scale-95 transition-all duration-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Connected
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to receive the latest campaign updates, events, and news directly to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={subscriberName}
                onChange={(e) => setSubscriberName(e.target.value)}
                className="flex-1 px-6 py-4 rounded-lg border border-gray-300 focus:border-[#f9d100] focus:ring-2 focus:ring-[#f9d100]/20 outline-none transition-all"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-lg border border-gray-300 focus:border-[#f9d100] focus:ring-2 focus:ring-[#f9d100]/20 outline-none transition-all"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CSS for scroll animations */}
      <style>{`
        .animate-visible {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) scale(1) !important;
        }
      `}</style>
    </div>
  );
}
