import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Heart, 
  Mail, 
  CheckCircle, 
  ArrowRight,
  UserPlus,
  HandHeart,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function GetInvolved() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ward: '',
    interest: 'delegate',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Check if email already exists in Supabase Auth
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUsers) {
        toast.error('This email is already registered. Please login instead.');
        setIsSubmitting(false);
        return;
      }

      // 2. Create user in Supabase Auth
      const role = formData.interest === 'delegate' ? 'delegate' : 'subscriber';
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            ward: formData.ward,
            role: role,
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        toast.error(authError.message || 'Failed to create account');
        setIsSubmitting(false);
        return;
      }

      if (!authData.user) {
        toast.error('Failed to create user');
        setIsSubmitting(false);
        return;
      }

      // 3. Profile will be auto-created by database trigger
      // But we can also manually create/update it if needed
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          ward: formData.ward,
          role: role,
          status: role === 'delegate' ? 'pending' : 'approved',
          created_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile error:', profileError);
        // Don't fail here - trigger might have created it
      }

      // 4. Handle based on interest type
      if (formData.interest === 'delegate') {
        toast.success('Your delegate application has been submitted! Please wait for admin approval.');
      } else if (formData.interest === 'updates') {
        // Also add to subscriptions table
        await supabase.from('subscriptions').insert({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          subscribed_at: new Date().toISOString(),
        });
        toast.success('You have successfully subscribed to campaign updates!');
      } else {
        toast.success('Thank you for your interest in volunteering! We will contact you soon.');
      }

      // 5. Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        ward: '',
        interest: 'delegate',
        password: '',
      });

    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const involvementOptions = [
    {
      icon: UserPlus,
      title: 'Join as Delegate',
      description: 'Represent your community and help mobilize support at the grassroots level.',
      color: 'bg-[#f9d100]',
    },
    {
      icon: HandHeart,
      title: 'Volunteer',
      description: 'Contribute your skills and time to support campaign activities.',
      color: 'bg-[#008000]',
    },
    {
      icon: Bell,
      title: 'Subscribe',
      description: 'Get regular updates on campaign progress, events, and news.',
      color: 'bg-black',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#f9d100]/10 via-white to-[#008000]/10">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#f9d100] font-semibold text-sm uppercase tracking-wider">Join Us</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6">
              GET INVOLVED
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Be part of the change you want to see in Kilifi County. Join thousands of 
              supporters working towards a brighter future.
            </p>
          </div>
        </div>
      </section>

      {/* Involvement Options */}
      <section className="py-16 lg:py-24">
        <div className="section-padding">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {involvementOptions.map((option, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center card-hover animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <option.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{option.title}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </div>
            ))}
          </div>

          {/* Signup Form */}
          <div className="max-w-2xl mx-auto animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-black text-white p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Join the Movement</h2>
                <p className="text-gray-400 text-sm">Fill in your details to get started</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f9d100] focus:ring-2 focus:ring-[#f9d100]/20 outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f9d100] focus:ring-2 focus:ring-[#f9d100]/20 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f9d100] focus:ring-2 focus:ring-[#f9d100]/20 outline-none transition-all"
                    placeholder="+254 700 000 000"
                  />
                </div>

                {/* Ward */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ward/Location
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f9d100] focus:ring-2 focus:ring-[#f9d100]/20 outline-none transition-all"
                    placeholder="Enter your ward or location"
                  />
                </div>

                {/* Interest */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I want to:
                  </label>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f9d100] focus:ring-2 focus:ring-[#f9d100]/20 outline-none transition-all"
                  >
                    <option value="delegate">Join as Delegate</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="updates">Receive Updates</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Create Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f9d100] focus:ring-2 focus:ring-[#f9d100]/20 outline-none transition-all"
                    placeholder="Create a secure password (min 6 characters)"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
                      Processing...
                    </>
                  ) : (
                    <>
                      JOIN THE MOVEMENT
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#f9d100] font-medium hover:underline">
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="section-padding">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#f9d100] font-semibold text-sm uppercase tracking-wider">Why Join</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">
              Benefits of Joining
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'Community', desc: 'Connect with like-minded individuals' },
              { icon: CheckCircle, title: 'Impact', desc: 'Make a real difference in your community' },
              { icon: Heart, title: 'Support', desc: 'Access to campaign resources and training' },
              { icon: Mail, title: 'Updates', desc: 'Exclusive news and event invitations' },
            ].map((benefit, index) => (
              <div 
                key={index}
                className="text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-[#f9d100]/20 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-[#f9d100]" />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
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