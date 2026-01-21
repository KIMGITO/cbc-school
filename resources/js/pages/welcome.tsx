import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface SchoolStat {
  id: number;
  label: string;
  value: string;
  prefix?: string;
  suffix: string;
  color: 'primary' | 'secondary' | 'accent' | 'success';
  icon: string;
}

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default function CBCHome({ canRegister = true }: { canRegister?: boolean }) {
  const { auth } = usePage<SharedData>().props;
  const [counters, setCounters] = useState({
    students: 0,
    teachers: 0,
    passingRate: 0,
    years: 0
  });

  // School information
  const schoolInfo = {
    name: "CBC School",
    motto: "Excellence in Education Since 1995",
    address: "123 Education Street, City, State 12345",
    phone: "(123) 456-7890",
    email: "info@cbcschool.edu"
  };

  // School statistics with counters
  const schoolStats: SchoolStat[] = [
    {
      id: 1,
      label: "Students Enrolled",
      value: "1500",
      suffix: "+",
      color: "primary",
      icon: "👨‍🎓"
    },
    {
      id: 2,
      label: "Qualified Teachers",
      value: "80",
      suffix: "+",
      color: "secondary",
      icon: "👩‍🏫"
    },
    {
      id: 3,
      label: "Passing Rate",
      value: "95",
      suffix: "%",
      color: "success",
      icon: "📈"
    },
    {
      id: 4,
      label: "Years of Excellence",
      value: "25",
      suffix: "+",
      color: "accent",
      icon: "⭐"
    }
  ];

  // Features
  const features: Feature[] = [
    {
      id: 1,
      title: "School Portal Access",
      description: "Login to access personalized dashboards for admin, teachers, and parents",
      icon: "🚪"
    },
    {
      id: 2,
      title: "Real-time Updates",
      description: "Get instant notifications about grades, attendance, and school events",
      icon: "⚡"
    },
    {
      id: 3,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security",
      icon: "🔒"
    }
  ];

  // Animate counters
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => ({
        students: prev.students < 1500 ? prev.students + 25 : 1500,
        teachers: prev.teachers < 80 ? prev.teachers + 2 : 80,
        passingRate: prev.passingRate < 95 ? prev.passingRate + 2 : 95,
        years: prev.years < 25 ? prev.years + 1 : 25
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const getColorClasses = (color: SchoolStat['color']) => {
    switch(color) {
      case 'primary': return 'bg-primary text-white';
      case 'secondary': return 'bg-secondary text-white';
      case 'accent': return 'bg-accent text-white';
      case 'success': return 'bg-success text-white';
      default: return 'bg-primary text-white';
    }
  };

  return (
    <>
      <Head title={`${schoolInfo.name} - Entry Portal`}>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-['Instrument_Sans',sans-serif]">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-secondary">
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 h-32 w-32 rounded-full bg-white/20"></div>
            <div className="absolute top-1/4 right-0 h-48 w-48 rounded-full bg-white/20"></div>
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-white/20"></div>
          </div>

          <div className="relative container mx-auto px-4 py-12 md:py-24">
            {/* Header */}
            <header className="mb-12">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center space-x-4 mb-6 md:mb-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <span className="text-3xl font-bold text-white">CBC</span>
                  </div>
                  <div>
                    <h1 className="font-['Poppins',sans-serif] text-3xl md:text-4xl font-bold text-white">
                      {schoolInfo.name}
                    </h1>
                    <p className="text-white/80">{schoolInfo.motto}</p>
                  </div>
                </div>

                {/* Auth buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {auth.user ? (
                    <Link
                      href={dashboard()}
                      className="px-6 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                    >
                      Enter Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href={login()}
                        className="px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-all duration-300 border border-white/30"
                      >
                        Log In
                      </Link>
                      {canRegister && (
                        <Link
                          href={register()}
                          className="px-6 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Register
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </header>

            {/* Hero Content */}
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-['Poppins',sans-serif] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Welcome to Our Learning Community
              </h2>
              <p className="text-xl text-white/90 mb-8">
                A unified platform for administrators, teachers, parents, and students. 
                Access everything you need in one place.
              </p>
              
              {/* Quick Access Button */}
              {!auth.user && (
                <div className="inline-flex flex-col sm:flex-row gap-4">
                  <Link
                    href={login()}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">🎯</span>
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              Our Community in Numbers
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {schoolStats.map((stat) => (
                <div
                  key={stat.id}
                  className={`rounded-2xl p-8 transition-all duration-500 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl ${getColorClasses(stat.color)}`}
                >
                  <div className="text-5xl mb-4">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.prefix}
                    {(() => {
                      switch(stat.id) {
                        case 1: return counters.students;
                        case 2: return counters.teachers;
                        case 3: return counters.passingRate;
                        case 4: return counters.years;
                        default: return stat.value;
                      }
                    })()}
                    {stat.suffix}
                  </div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              Platform Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Ready to Access Your Account?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {auth.user ? (
                  <Link
                    href={dashboard()}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg hover:shadow-2xl transition-all duration-300"
                  >
                    Continue to Dashboard
                    <span className="ml-2">→</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href={login()}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-all duration-300"
                    >
                      Login to Continue
                    </Link>
                    <Link
                      href={register()}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary font-semibold text-lg border-2 border-primary hover:bg-primary/10 transition-all duration-300"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Info Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-secondary/10 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                School Information & Rules
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* School Rules */}
                <div>
                  <h4 className="text-xl font-bold text-primary mb-4">Access Rules</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                      <span>Use authorized credentials for login</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                      <span>Maintain confidentiality of information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                      <span>Report technical issues immediately</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                      <span>Respect privacy of all users</span>
                    </li>
                  </ul>
                </div>

                {/* Quick Contact */}
                <div>
                  <h4 className="text-xl font-bold text-secondary mb-4">Quick Contact</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <span className="text-primary">📍</span>
                      </div>
                      <span>{schoolInfo.address}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mr-4">
                        <span className="text-secondary">📞</span>
                      </div>
                      <span>{schoolInfo.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-4">
                        <span className="text-accent">✉️</span>
                      </div>
                      <span>{schoolInfo.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Maintained from original */}
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center space-x-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <span className="text-xl font-bold">CBC</span>
                  </div>
                  <h3 className="text-xl font-bold">{schoolInfo.name}</h3>
                </div>
                <p className="text-gray-400">
                  Providing quality education since 1995. Nurturing minds, building character.
                </p>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-bold">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Academics
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Admissions
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Facilities
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-bold">Resources</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Parent Portal
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Student Portal
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      School Calendar
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Downloads
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-bold">Contact Us</h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center">
                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {schoolInfo.address}
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {schoolInfo.phone}
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {schoolInfo.email}
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} {schoolInfo.name}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}