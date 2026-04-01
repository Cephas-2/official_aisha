import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Action Plan', path: '/action-plan' },
    { name: 'Get Involved', path: '/get-involved' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Logo & About */}
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/images/logo.jpg" 
                alt="UDA Logo" 
                className="h-16 w-auto object-contain rounded"
              />
              <div>
                <span className="font-bold text-xl block">Aisha Jumwa</span>
                <span className="text-sm text-[#f9d100]">For Kilifi Governor 2027</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Leadership for the People. Join us in building a brighter future for Kilifi County 
              through inclusive development, accountability, and transformative leadership.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#f9d100] hover:text-black transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
            <h3 className="text-lg font-bold mb-6 text-[#f9d100]">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[#f9d100] transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f9d100] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-[#f9d100] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f9d100] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-lg font-bold mb-6 text-[#f9d100]">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#f9d100] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Campaign Headquarters<br />
                  Kilifi County, Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#f9d100] flex-shrink-0" />
                <a 
                  href="mailto:info@aishajumwa2027.co.ke"
                  className="text-gray-400 text-sm hover:text-[#f9d100] transition-colors"
                >
                  info@aishajumwa2027.co.ke
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#f9d100] flex-shrink-0" />
                <a 
                  href="tel:+254700000000"
                  className="text-gray-400 text-sm hover:text-[#f9d100] transition-colors"
                >
                  +254 700 000 000
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section-padding py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Aisha Jumwa Campaign. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs">
              United Democratic Alliance (UDA) - Kazi Ni Kazi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
