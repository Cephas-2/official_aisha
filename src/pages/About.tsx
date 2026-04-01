import { useEffect } from 'react';
import { Award, GraduationCap, Users, Building2, Mic, Landmark } from 'lucide-react';

export default function About() {
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

  const milestones = [
    {
      year: '1997-2007',
      title: 'Councillor, Takaungu Ward',
      description: 'Started her political journey as a grassroots leader, serving her community for a decade.',
      icon: Users,
    },
    {
      year: '2013-2017',
      title: 'Woman Representative, Kilifi County',
      description: 'Made history as the first Woman Representative for Kilifi County.',
      icon: Award,
    },
    {
      year: '2017-2022',
      title: 'MP, Malindi Constituency',
      description: 'Elected as Member of Parliament for Malindi Constituency and served as Commissioner of the PSC.',
      icon: Mic,
    },
    {
      year: '2022-2024',
      title: 'Cabinet Secretary for Gender',
      description: 'Appointed as Cabinet Secretary for Gender, serving until July 2024.',
      icon: Landmark,
    },
    {
      year: '2027',
      title: 'Governor Aspirant, Kilifi County',
      description: 'Declared intention to vie for the governorship of Kilifi County under UDA.',
      icon: Building2,
    },
  ];

  const education = [
    {
      year: '2011',
      achievement: 'Kenya Certificate of Secondary Education',
      description: 'Pursued education later in life with perseverance and self-belief.',
    },
    {
      year: '2020',
      achievement: "Bachelor's Degree in Leadership and Management",
      description: 'International Leadership University (ILU)',
    },
    {
      year: '2020',
      achievement: 'Executive Diploma in Governance',
      description: 'Jomo Kenyatta University of Agriculture and Technology',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#f9d100] font-semibold text-sm uppercase tracking-wider">About The Leader</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6">
              AISHA JUMWA KARISA KATANA
            </h1>
            <p className="text-xl text-[#008000] font-medium mb-8">
              A Bold and Resilient Leader for Kilifi County
            </p>
          </div>
        </div>
      </section>

      {/* Main Biography */}
      <section className="py-16 lg:py-24">
        <div className="section-padding">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Sidebar Image */}
            <div className="lg:col-span-1 animate-on-scroll opacity-0 -translate-x-12 transition-all duration-700">
              <div className="sticky top-24">
                <div className="relative rounded-2xl overflow-hidden shadow-xl mb-6">
                  <img 
                    src="/images/Aisha-Jumwa.jpg" 
                    alt="Hon. Aisha Jumwa"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="bg-[#f9d100]/10 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Quick Facts</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Born:</span>
                      <span className="font-medium">March 28, 1975</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Birthplace:</span>
                      <span className="font-medium">Takaungu, Kilifi</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Party:</span>
                      <span className="font-medium text-[#008000]">UDA</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-medium">Governor Aspirant</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Biography Content */}
            <div className="lg:col-span-2 animate-on-scroll opacity-0 translate-x-12 transition-all duration-700">
              {/* Quote */}
              <div className="bg-gradient-to-r from-[#f9d100]/10 to-[#008000]/10 rounded-xl p-8 mb-10">
                <span className="text-4xl text-[#f9d100] font-serif">"</span>
                <blockquote className="text-xl font-medium text-gray-800 -mt-2 mb-4">
                  Leadership is not about titles, it's about making a difference for every citizen of Kilifi County.
                </blockquote>
                <cite className="text-[#008000] font-medium not-italic">— Hon Aisha Jumwa</cite>
              </div>

              {/* Biography Text */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Aisha Jumwa Karisa Katana, born on 28 March 1975 in the historic village of Takaungu, 
                  Kilifi County, is a bold and resilient leader whose political journey reflects determination, 
                  courage, and unwavering commitment to public service. Rising from humble beginnings, she has 
                  carved out a remarkable path in Kenya's political landscape, becoming one of the most influential 
                  voices from the Coast region.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  She most recently served as the Cabinet Secretary for Gender, a role she held until 11 July 2024, 
                  when she was relieved off her duties as a cabinet secretary in a strategic preparation to another 
                  major appointment in government. Prior to this, Aisha Jumwa represented Malindi Constituency as a 
                  Member of Parliament from 2017 to 2022 and served concurrently as a Commissioner of the Parliamentary 
                  Service Commission (PSC).
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Her leadership journey began much earlier, first as the Woman Representative for Kilifi County from 
                  2013 to 2017, and even before that as a Councillor for Takaungu Ward between 1997 and 2007 — a 
                  testament to her deep-rooted connection with grassroots leadership.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Her early life was marked by significant challenges, but these only strengthened her resolve. With 
                  perseverance and self-belief, she pursued education later in life, completing her Kenya Certificate 
                  of Secondary Education in 2011. She went on to earn a Bachelor's Degree in Leadership and Management 
                  from the International Leadership University (ILU) in 2020, alongside an Executive Diploma in Governance 
                  from Jomo Kenyatta University of Agriculture and Technology — academic milestones that mirror her 
                  lifelong commitment to growth and service.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Politically, Aisha Jumwa has been a trailblazer. She made history as the first Woman Representative 
                  for Kilifi County in 2013 and later secured victory as the Member of Parliament for Malindi Constituency 
                  in 2017. Throughout her career, she has been a fierce advocate for the marginalized, championing the 
                  rights and empowerment of women, youth, and persons with disabilities, while remaining a formidable 
                  force in coastal politics.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Following her entry into the United Democratic Alliance (UDA), Jumwa boldly declared her intention 
                  to vie for the governorship of Kilifi County. Her vision is anchored in inclusive development, 
                  accountability, and transformative leadership. Even beyond elected office, she continues to serve 
                  her community with passion, standing as a symbol of resilience, ambition, and unwavering dedication 
                  to the people she represents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Political Journey Timeline */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="section-padding">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#f9d100] font-semibold text-sm uppercase tracking-wider">Timeline</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">
              Political Journey
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className="relative flex gap-8 mb-12 last:mb-0 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Timeline Line */}
                {index !== milestones.length - 1 && (
                  <div className="absolute left-7 top-14 w-0.5 h-full bg-[#f9d100]/30" />
                )}
                
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#f9d100] flex items-center justify-center z-10">
                  <milestone.icon className="w-6 h-6 text-black" />
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-4">
                  <span className="text-[#008000] font-bold text-sm">{milestone.year}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-16 lg:py-24">
        <div className="section-padding">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#f9d100] font-semibold text-sm uppercase tracking-wider">Academic</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">
              Education & Qualifications
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {education.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 card-hover animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-lg bg-[#f9d100]/20 flex items-center justify-center mb-6">
                  <GraduationCap className="w-7 h-7 text-[#f9d100]" />
                </div>
                <span className="text-[#008000] font-bold text-sm">{item.year}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-3">{item.achievement}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 lg:py-24 bg-black text-white">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll opacity-0 scale-95 transition-all duration-700">
            <span className="text-[#f9d100] font-semibold text-sm uppercase tracking-wider">Vision 2027</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-4 mb-8">
              A Vision for Transformative Leadership
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Following her entry into the United Democratic Alliance (UDA), Jumwa boldly declared her 
              intention to vie for the governorship of Kilifi County. Her vision is anchored in inclusive 
              development, accountability, and transformative leadership.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {['Inclusive Development', 'Accountability', 'Transformative Leadership', 'Economic Empowerment'].map((item, index) => (
                <span 
                  key={index}
                  className="px-6 py-3 bg-white/10 rounded-full text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
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
