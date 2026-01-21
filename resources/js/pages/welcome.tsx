import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    text: string;
    image: string;
}

interface Event {
    id: number;
    title: string;
    date: string;
    description: string;
    image: string;
}

interface CarouselItem {
    id: number;
    title: string;
    description: string;
    image: string;
    ctaText?: string;
    ctaLink?: string;
}

export default function ProfessionalSchoolHome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeFeature, setActiveFeature] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    // Carousel auto-slide
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Handle scroll for navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // School information
    const schoolInfo = {
        name: 'Competency Based School',
        shortName: 'CBS',
        motto: 'Transforming our schools to Digital Era',
        tagline: "Your trusted digital patner",
        address: 'All over place',
        phone: '(254) 758127017',
        email: 'condensons@gmail.com',
        established: '2022',
    };

    // Carousel items
    const carouselItems: CarouselItem[] = [
        {
            id: 1,
            title: 'State-of-the-Art Facilities',
            description:
                'Modern classrooms, science labs, and sports complex providing the perfect learning environment',
            image: 'https://plus.unsplash.com/premium_photo-1724026586579-5c413598de2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGFmcmljYW4lMjBzY2hvb2x8ZW58MHx8MHx8fDA%3D',
            ctaText: 'Tour Our Campus',
            ctaLink: '#campus-tour',
        },
        {
            id: 2,
            title: 'IB World School',
            description:
                'Accredited International Baccalaureate program offering globally recognized education',
            image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
            ctaText: 'Learn About Our Programs',
            ctaLink: '#programs',
        },
        {
            id: 3,
            title: 'University Placement Success',
            description:
                '100% university acceptance rate with students admitted to top institutions worldwide',
            image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            ctaText: 'View College Acceptances',
            ctaLink: '#success-stories',
        },
        {
            id: 4,
            title: 'Join Our Community',
            description:
                'Become part of a diverse, inclusive learning environment that celebrates achievement',
                image:'https://plus.unsplash.com/premium_photo-1707155465598-72c956ca9bae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YWZyaWNhbiUyMHRlYWNoZXJzJTIwbWVldGluZ3xlbnwwfHwwfHx8MA%3D%3D',
            ctaText: 'Apply Now',
            ctaLink: '#admissions',
        },
    ];

    // Featured programs
    const featuredPrograms = [
        {
            id: 1,
            title: 'STEAM Education',
            description:
                'Integrated Science, Technology, Engineering, Arts, and Mathematics program',
            icon: '🔬',
            stats: '15 Advanced Labs',
        },
        {
            id: 2,
            title: 'Language Immersion',
            description:
                'Multilingual education with French, Spanish, and Mandarin options',
            icon: '🌍',
            stats: '5+ Languages',
        },
        {
            id: 3,
            title: 'Arts & Creativity',
            description:
                'Comprehensive arts program including theater, music, and visual arts',
            icon: '🎭',
            stats: '20+ Ensembles',
        },
        {
            id: 4,
            title: 'Athletics Excellence',
            description:
                'Competitive sports program with state championship teams',
            icon: '⚽',
            stats: '25 Sports Teams',
        },
    ];

    // Testimonials
    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            role: 'Parent & University Professor',
            text: 'The individualized attention and academic rigor at Prestige Academy prepared my daughter exceptionally well for university life.',
            image: 'https://images.unsplash.com/photo-1521511189395-b82252213754?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFmcmljYW4lMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D',
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Alumni, Class of 2020',
            text: 'The mentorship and opportunities I received here opened doors to my dream university and career path.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        },
        {
            id: 3,
            name: 'Fatima',
            role: 'Current Student',
            text: 'The diverse community and challenging curriculum push me to be my best every single day.',
            image: 'https://images.unsplash.com/photo-1613005341945-35e159e522f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFmcmljYW4lMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D',
        },
    ];

    // Upcoming events
    const events: Event[] = [
        {
            id: 1,
            title: 'Open House 2024',
            date: 'January 25, 2024',
            description: 'Tour our campus and meet our faculty',
            image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 2,
            title: 'Science Fair',
            date: 'February 15, 2024',
            description: 'Student innovation showcase',
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 3,
            title: 'International Day',
            date: 'March 10, 2024',
            description: 'Celebrating cultural diversity',
            image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
    ];

    // Statistics
    const stats = [
        { label: 'Student Enrollment', value: '1,850+' },
        { label: 'Faculty Members', value: '145' },
        { label: 'Student:Teacher Ratio', value: '12:1' },
        { label: 'Transition rate', value: '100%' },
        { label: 'Courses Offered', value: '28' },
        { label: 'Years of Excellence', value: '38+' },
    ];

    return (
        <>
            <Head title={`${schoolInfo.name} - Welcome`}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-white font-sans">
                {/* Sticky Navigation */}
                <nav
                    className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-lg backdrop-blur-md' : 'bg-transparent'}`}
                >
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center space-x-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-800">
                                    <span className="text-xl font-bold text-white">
                                        {schoolInfo.shortName}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        {schoolInfo.name}
                                    </h1>
                                    <p className="hidden text-xs text-gray-600 md:block">
                                        {schoolInfo.motto}
                                    </p>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden items-center space-x-8 md:flex">
                                <a
                                    href="#home"
                                    className="font-medium text-gray-700 transition-colors hover:text-blue-600"
                                >
                                    Home
                                </a>
                                <a
                                    href="#about"
                                    className="font-medium text-gray-700 transition-colors hover:text-blue-600"
                                >
                                    About
                                </a>
                                <a
                                    href="#academics"
                                    className="font-medium text-gray-700 transition-colors hover:text-blue-600"
                                >
                                    Academics
                                </a>
                                <a
                                    href="#admissions"
                                    className="font-medium text-gray-700 transition-colors hover:text-blue-600"
                                >
                                    Admissions
                                </a>
                                <a
                                    href="#campus"
                                    className="font-medium text-gray-700 transition-colors hover:text-blue-600"
                                >
School life                                </a>
                                <a
                                    href="#contact"
                                    className="font-medium text-gray-700 transition-colors hover:text-blue-600"
                                >
                                    Contact
                                </a>
                            </div>

                            {/* Auth Buttons */}
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-800 hover:shadow-xl"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-full border-2 border-blue-600 px-6 py-2 font-medium text-blue-600 transition-all duration-300 hover:bg-blue-50"
                                        >
                                            Sign In
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
                                            >
                                                Apply Now
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Carousel */}
                <section id="home" className="relative h-screen">
                    {/* Carousel */}
                    <div className="relative h-full overflow-hidden">
                        {carouselItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${item.image})`,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent"></div>
                                </div>

                                <div className="relative container mx-auto flex h-full items-center px-6">
                                    <div className="max-w-2xl text-white">
                                        <div className="mb-4">
                                            <span className="inline-block rounded-full border border-blue-500/30 bg-blue-600/20 px-4 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm">
                                                EXCELLENCE IN EDUCATION
                                            </span>
                                        </div>
                                        <h1 className="mb-6 text-5xl leading-tight font-bold md:text-6xl">
                                            {item.title}
                                        </h1>
                                        <p className="mb-8 text-xl text-gray-200">
                                            {item.description}
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            <a
                                                href={item.ctaLink}
                                                className="transform rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:from-blue-700 hover:to-indigo-800 hover:shadow-2xl"
                                            >
                                                {item.ctaText}
                                            </a>
                                            <Link
                                                href={register()}
                                                className="rounded-full border border-white/30 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                                            >
                                                Schedule a Visit
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Carousel Indicators */}
                    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform space-x-3">
                        {carouselItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-10 bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform animate-bounce">
                        <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
                    <div className="container mx-auto px-6">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-4xl font-bold text-gray-900">
                                By The Numbers
                            </h2>
                            <p className="mx-auto max-w-3xl text-lg text-gray-600">
                                Excellence measured through achievement,
                                community, and innovation
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="group text-center"
                                    onMouseEnter={() => setActiveFeature(index)}
                                >
                                    <div className="mb-2 text-4xl font-bold text-blue-700 transition-transform duration-300 group-hover:scale-110">
                                        {stat.value}
                                    </div>
                                    <div className="font-medium text-gray-600">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Programs */}
                <section id="academics" className="bg-white py-20">
                    <div className="container mx-auto px-6">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-4xl font-bold text-gray-900">
                                Featured Programs
                            </h2>
                            <p className="mx-auto max-w-3xl text-lg text-gray-600">
                                Discover our comprehensive curriculum designed
                                to prepare students for success in an
                                ever-changing world
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {featuredPrograms.map((program) => (
                                <div
                                    key={program.id}
                                    className="group transform rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                                >
                                    <div className="mb-6 transform text-4xl transition-transform duration-300 group-hover:scale-110">
                                        {program.icon}
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-gray-900">
                                        {program.title}
                                    </h3>
                                    <p className="mb-4 text-gray-600">
                                        {program.description}
                                    </p>
                                    <div className="font-semibold text-blue-600">
                                        {program.stats}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
                    <div className="container mx-auto px-6">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-4xl font-bold text-gray-900">
                                What Our Community Says
                            </h2>
                            <p className="text-lg text-gray-600">
                                Hear from students, parents, and alumni about
                                their experiences
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="rounded-2xl bg-white p-8 shadow-xl transition-all duration-500 hover:shadow-2xl"
                                >
                                    <div className="mb-6 flex items-center">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="mr-4 h-14 w-14 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-900">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-sm text-blue-600">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="mt-6 text-yellow-400">
                                        {'★★★★★'.split('').map((star, i) => (
                                            <span key={i} className="text-xl">
                                                {star}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Upcoming Events */}
                <section id="campus" className="bg-white py-20">
                    <div className="container mx-auto px-6">
                        <div className="mb-12 flex items-end justify-between">
                            <div>
                                <h2 className="mb-4 text-4xl font-bold text-gray-900">
                                    Upcoming Events
                                </h2>
                                <p className="text-gray-600">
                                    Join us for these exciting upcoming events
                                </p>
                            </div>
                            <a
                                href="#calendar"
                                className="font-semibold text-blue-600 transition-colors hover:text-blue-800"
                            >
                                View Full Calendar →
                            </a>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="group overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-700">
                                            {event.date}
                                        </div>
                                    </div>
                                    <div className="bg-white p-6">
                                        <h3 className="mb-2 text-xl font-bold text-gray-900">
                                            {event.title}
                                        </h3>
                                        <p className="mb-4 text-gray-600">
                                            {event.description}
                                        </p>
                                        <button className="font-semibold text-blue-600 transition-colors hover:text-blue-800">
                                            Learn More →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-blue-600 to-indigo-800 py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="mb-6 text-4xl font-bold text-white">
                            Ready to Join Our Community?
                        </h2>
                        <p className="mx-auto mb-10 max-w-2xl text-xl text-blue-100">
                            Take the first step toward an exceptional
                            educational journey. Applications for 2025/26
                            academic year are  open.
                        </p>
                        <div className="flex flex-col justify-center gap-6 sm:flex-row">
                            <Link
                                href={register()}
                                className="hover:shadow-3xl transform rounded-full bg-white px-10 py-4 text-lg font-bold text-blue-700 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100"
                            >
                                Apply for Admission
                            </Link>
                            <a
                                href="#virtual-tour"
                                className="rounded-full border-2 border-white/50 bg-transparent px-10 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-white/10"
                            >
                                Take Virtual Tour
                            </a>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 pt-16 pb-8 text-white">
                    <div className="container mx-auto px-6">
                        <div className="grid gap-12 md:grid-cols-4">
                            {/* School Info */}
                            <div>
                                <div className="mb-6 flex items-center space-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                                        <span className="text-xl font-bold">
                                            {schoolInfo.shortName}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold">
                                        {schoolInfo.name}
                                    </h3>
                                </div>
                                <p className="mb-6 text-gray-400">
                                    {schoolInfo.motto}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {schoolInfo.tagline}
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="mb-6 text-lg font-bold">
                                    Quick Links
                                </h4>
                                <ul className="space-y-3">
                                    <li>
                                        <a
                                            href="#admissions"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Admissions Process
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#tuition"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Tuition & Financial Aid
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#calendar"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Academic Calendar
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#employment"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Employment Opportunities
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Resources */}
                            <div>
                                <h4 className="mb-6 text-lg font-bold">
                                    Resources
                                </h4>
                                <ul className="space-y-3">
                                    <li>
                                        <a
                                            href="#portal"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Parent Portal
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#portal"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Student Portal
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#library"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Digital Library
                                        </a>
                                    </li>
                                    <li>
                                        <Link
                                            href={login()}
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Staff Login
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h4 className="mb-6 text-lg font-bold">
                                    Contact Us
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="mt-1 text-blue-400">
                                            📍
                                        </div>
                                        <p className="text-gray-400">
                                            {schoolInfo.address}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-blue-400">📞</div>
                                        <p className="text-gray-400">
                                            {schoolInfo.phone}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-blue-400">✉️</div>
                                        <p className="text-gray-400">
                                            {schoolInfo.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 flex space-x-4">
                                    <a
                                        href="#"
                                        className="text-gray-400 transition-colors hover:text-white"
                                    >
                                        Facebook
                                    </a>
                                    <a
                                        href="#"
                                        className="text-gray-400 transition-colors hover:text-white"
                                    >
                                        X
                                    </a>
                                    <a
                                        href="#"
                                        className="text-gray-400 transition-colors hover:text-white"
                                    >
                                        Instagram
                                    </a>
                                    <a
                                        href="#"
                                        className="text-gray-400 transition-colors hover:text-white"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-gray-800 pt-8 text-center text-gray-400">
                            <p>
                                © {new Date().getFullYear()} {schoolInfo.name}.
                                All rights reserved.
                            </p>
                            <p className="mt-2 text-sm">
                                Established {schoolInfo.established} •
                                Accredited by International Schools Association
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
