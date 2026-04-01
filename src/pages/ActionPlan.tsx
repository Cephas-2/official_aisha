import { useEffect } from 'react';
import { 
  TrendingUp, 
  GraduationCap, 
  Heart, 
  Route, 
  Users, 
  Sprout,
  Droplets,
  Lightbulb,
  Shield,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActionPlan() {
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

  const priorities = [
    {
      icon: TrendingUp,
      title: 'Economic Empowerment',
      description: 'Creating sustainable livelihood opportunities through skills training, microfinance access, and support for local enterprises.',
      initiatives: [
        'Establish youth empowerment centers in all wards',
        'Provide microfinance loans to women-led businesses',
        'Create job placement programs for graduates',
        'Support local artisans and small-scale traders',
      ],
      color: 'from-yellow-400 to-yellow-500',
    },
    {
      icon: GraduationCap,
      title: 'Education Reform',
      description: 'Building modern schools, providing bursaries, and ensuring every child has access to quality education.',
      initiatives: [
        'Construct 50 new classrooms across the county',
        'Provide bursaries for 10,000 students annually',
        'Equip schools with modern learning materials',
        'Establish vocational training centers',
      ],
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Heart,
      title: 'Healthcare Access',
      description: 'Upgrading health facilities, ensuring drug availability, and bringing healthcare closer to the people.',
      initiatives: [
        'Upgrade 15 health centers to level 4 facilities',
        'Ensure 100% drug availability in all facilities',
        'Deploy mobile clinics to remote areas',
        'Implement universal health coverage programs',
      ],
      color: 'from-red-400 to-red-500',
    },
    {
      icon: Route,
      title: 'Infrastructure Development',
      description: 'Improving roads, water supply, and electricity connectivity across all wards.',
      initiatives: [
        'Tarmac 200km of county roads',
        'Connect 50,000 households to clean water',
        'Extend electricity to all trading centers',
        'Build modern market facilities',
      ],
      color: 'from-blue-400 to-blue-500',
    },
    {
      icon: Users,
      title: 'Youth & Women Empowerment',
      description: 'Dedicated programs for youth employment and women-led business initiatives.',
      initiatives: [
        'Launch youth innovation hubs',
        'Provide startup capital for women entrepreneurs',
        'Create apprenticeship programs',
        'Establish women cooperative societies',
      ],
      color: 'from-purple-400 to-purple-500',
    },
    {
      icon: Sprout,
      title: 'Agricultural Transformation',
      description: 'Modern farming techniques, irrigation projects, and market access for farmers.',
      initiatives: [
        'Establish irrigation schemes in arid areas',
        'Provide subsidized farm inputs',
        'Create farmer cooperatives for market access',
        'Introduce climate-smart farming techniques',
      ],
      color: 'from-emerald-400 to-emerald-500',
    },
  ];

  const achievements = [
    {
      icon: Droplets,
      title: 'Water Projects',
      stat: '15+',
      description: 'Community water projects initiated',
    },
    {
      icon: Lightbulb,
      title: 'Education Support',
      stat: '5,000+',
      description: 'Students supported through bursaries',
    },
    {
      icon: Shield,
      title: 'Healthcare',
      stat: '10+',
      description: 'Health facilities upgraded',
    },
    {
      icon: Briefcase,
      title: 'Employment',
      stat: '2,000+',
      description: 'Jobs created through initiatives',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#f9d100]/10 via-white to-[#008000]/10">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#f9d100] font-semibold text-sm uppercase tracking-wider">Our Vision</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6">
              ACTION PLAN
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover the key priorities that will drive transformative change in Kilifi County. 
              Our comprehensive action plan addresses the most pressing needs of our communities.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements Stats */}
      <section className="py-16 bg-black text-white">
        <div className="section-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((item, index) => (
              <div 
                key={index}
                className="text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <item.icon className="w-8 h-8 mx-auto mb-4 text-[#f9d100]" />
                <p className="text-3xl md:text-4xl font-bold mb-2">{item.stat}</p>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Priority Areas */}
      <section className="py-16 lg:py-24">
        <div className="section-padding">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#f9d100] font-semibold text-sm uppercase tracking-wider">Key Priorities</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">
              Six Pillars of Transformation
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {priorities.map((priority, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 animate-on-scroll opacity-0 translate-y-8"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${priority.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <priority.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#f9d100] transition-colors">
                      {priority.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {priority.description}
                    </p>
                    
                    {/* Initiatives */}
                    <ul className="space-y-2">
                      {priority.initiatives.map((initiative, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f9d100] flex-shrink-0" />
                          {initiative}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="section-padding">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#f9d100] font-semibold text-sm uppercase tracking-wider">Roadmap</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">
              Implementation Timeline
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {[
              { phase: 'Phase 1: First 100 Days', focus: 'Quick wins and immediate interventions', items: ['County-wide needs assessment', 'Emergency healthcare interventions', 'Road repair program launch', 'Youth employment program initiation'] },
              { phase: 'Phase 2: Year 1', focus: 'Foundation laying and infrastructure', items: ['School construction begins', 'Water project implementation', 'Health facility upgrades', 'Agricultural input distribution'] },
              { phase: 'Phase 3: Year 2-3', focus: 'Scaling and sustainability', items: ['Complete major infrastructure projects', 'Expand economic empowerment programs', 'Establish sustainable healthcare systems', 'Achieve 80% of campaign promises'] },
            ].map((phase, index) => (
              <div 
                key={index}
                className="relative mb-12 last:mb-0 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-10 h-10 rounded-full bg-[#f9d100] flex items-center justify-center text-black font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{phase.phase}</h3>
                      <p className="text-[#008000] text-sm">{phase.focus}</p>
                    </div>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-3 ml-14">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#008000] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#f9d100] to-[#e5c000]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll opacity-0 scale-95 transition-all duration-700">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">
              Be Part of the Change
            </h2>
            <p className="text-black/80 text-lg mb-8">
              Join thousands of supporters working towards a brighter future for Kilifi County.
            </p>
            <Link 
              to="/get-involved" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              GET INVOLVED
              <ArrowRight className="w-5 h-5" />
            </Link>
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
