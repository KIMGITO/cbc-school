import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Notice {
    id: number;
    title: string;
    content: string;
    date: string;
    category: 'general' | 'academic' | 'event' | 'emergency';
}

interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
}

interface News {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    image: string;
}

export default function CBCHome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    // Sample data - in real app, this would come from props or API
    const [notices, setNotices] = useState<Notice[]>([
        {
            id: 1,
            title: 'Annual Sports Day 2024',
            content: 'The Annual Sports Day will be held on March 15th, 2024.',
            date: '2024-02-28',
            category: 'event',
        },
        {
            id: 2,
            title: 'Mid-Term Examination Schedule',
            content:
                'Mid-term exams for all classes will begin from March 20th.',
            date: '2024-02-25',
            category: 'academic',
        },
        {
            id: 3,
            title: 'Parent-Teacher Meeting',
            content: 'PTM for Grades 6-10 will be held on March 5th.',
            date: '2024-02-20',
            category: 'general',
        },
        {
            id: 4,
            title: 'School Closure - Public Holiday',
            content:
                "School will remain closed on March 8th for International Women's Day.",
            date: '2024-02-18',
            category: 'general',
        },
    ]);

    const [events, setEvents] = useState<Event[]>([
        {
            id: 1,
            title: 'Science Fair',
            date: '2024-03-10',
            time: '10:00 AM',
            location: 'School Auditorium',
        },
        {
            id: 2,
            title: 'Cultural Fest',
            date: '2024-03-22',
            time: '9:00 AM',
            location: 'Main Ground',
        },
        {
            id: 3,
            title: 'Career Counseling Session',
            date: '2024-03-05',
            time: '2:00 PM',
            location: 'Library Hall',
        },
    ]);

    const [news, setNews] = useState<News[]>([
        {
            id: 1,
            title: 'CBC School Wins Regional Debate Championship',
            excerpt:
                'Our debate team secured first position in the regional level championship.',
            date: '2024-02-15',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        },
        {
            id: 2,
            title: 'New Computer Lab Inaugurated',
            excerpt:
                'State-of-the-art computer lab with 50 systems opened for students.',
            date: '2024-02-10',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        },
    ]);

    const [activeNotice, setActiveNotice] = useState<Notice>(notices[0]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Set initial active notice
    useEffect(() => {
        if (notices.length > 0) {
            setActiveNotice(notices[0]);
        }
    }, [notices]);

    const getCategoryColor = (category: Notice['category']) => {
        switch (category) {
            case 'emergency':
                return 'bg-red-100 text-red-800';
            case 'academic':
                return 'bg-blue-100 text-blue-800';
            case 'event':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Head title="CBC School - Excellence in Education">
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

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-['Instrument_Sans',sans-serif] text-gray-800">
                {/* Header/Navigation */}
                <header className="sticky top-0 z-50 bg-white shadow-md">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                    <span className="text-xl font-bold text-white">
                                        CBC
                                    </span>
                                </div>
                                <div>
                                    <h1 className="font-['Poppins',sans-serif] text-2xl font-bold text-blue-800">
                                        CBC School
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        Excellence in Education Since 1995
                                    </p>
                                </div>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden items-center space-x-6 md:flex">
                                <Link
                                    href="#"
                                    className="font-medium text-blue-700 hover:text-blue-900"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="#"
                                    className="font-medium text-gray-600 hover:text-blue-700"
                                >
                                    About
                                </Link>
                                <Link
                                    href="#"
                                    className="font-medium text-gray-600 hover:text-blue-700"
                                >
                                    Academics
                                </Link>
                                <Link
                                    href="#"
                                    className="font-medium text-gray-600 hover:text-blue-700"
                                >
                                    Admissions
                                </Link>
                                <Link
                                    href="#"
                                    className="font-medium text-gray-600 hover:text-blue-700"
                                >
                                    Contact
                                </Link>

                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={login()}
                                            className="inline-block rounded-lg border border-blue-600 px-6 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                                        >
                                            Log in
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                            >
                                                Register
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </nav>

                            {/* Mobile menu button */}
                            <button
                                className="text-gray-600 md:hidden"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {mobileMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>

                        {/* Mobile Navigation */}
                        {mobileMenuOpen && (
                            <div className="mt-4 border-t pt-4 pb-4 md:hidden">
                                <div className="flex flex-col space-y-3">
                                    <Link
                                        href="#"
                                        className="py-2 font-medium text-blue-700"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="#"
                                        className="py-2 text-gray-600 hover:text-blue-700"
                                    >
                                        About
                                    </Link>
                                    <Link
                                        href="#"
                                        className="py-2 text-gray-600 hover:text-blue-700"
                                    >
                                        Academics
                                    </Link>
                                    <Link
                                        href="#"
                                        className="py-2 text-gray-600 hover:text-blue-700"
                                    >
                                        Admissions
                                    </Link>
                                    <Link
                                        href="#"
                                        className="py-2 text-gray-600 hover:text-blue-700"
                                    >
                                        Contact
                                    </Link>

                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-700"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <div className="flex flex-col space-y-3">
                                            <Link
                                                href={login()}
                                                className="inline-block rounded-lg border border-blue-600 px-6 py-2 text-center text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                                            >
                                                Log in
                                            </Link>
                                            {canRegister && (
                                                <Link
                                                    href={register()}
                                                    className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-700"
                                                >
                                                    Register
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-blue-700 to-blue-900 py-16 text-white md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl">
                            <h1 className="mb-4 font-['Poppins',sans-serif] text-4xl font-bold md:text-5xl">
                                Shaping Future Leaders Through Quality Education
                            </h1>
                            <p className="mb-8 text-xl text-blue-100">
                                At CBC School, we provide a nurturing
                                environment that fosters academic excellence,
                                character development, and holistic growth.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="#"
                                    className="inline-block rounded-lg bg-white px-8 py-3 font-medium text-blue-700 shadow-lg transition hover:bg-blue-50"
                                >
                                    Explore Academics
                                </Link>
                                <Link
                                    href="#"
                                    className="inline-block rounded-lg border-2 border-white px-8 py-3 font-medium text-white transition hover:bg-white/10"
                                >
                                    Virtual Tour
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 md:opacity-20">
                        <svg
                            className="h-64 w-64 md:h-96 md:w-96"
                            viewBox="0 0 200 200"
                            fill="currentColor"
                        >
                            <path d="M100,50 Q150,50 150,100 Q150,150 100,150 Q50,150 50,100 Q50,50 100,50 Z M80,80 L120,80 L120,120 L80,120 Z" />
                        </svg>
                    </div>
                </section>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8 md:py-12">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3"> 
                        {/* Left Column - Notices & Quick Links */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Important Notices Section */}
                            <section className="overflow-hidden rounded-xl bg-white shadow-lg">
                                <div className="school-gradient-notice bg-blue-700 px-6 py-4 text-white">
                                    <h2 className="flex items-center text-xl font-bold">
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Important Notices
                                    </h2>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Notice List */}
                                        <div className="space-y-4">
                                            {notices.map((notice) => (
                                                <div
                                                    key={notice.id}
                                                    className={`border-l-4 ${notice.category === 'emergency' ? 'border-red-500' : 'border-blue-500'} cursor-pointer py-3 pl-4 transition hover:bg-gray-50 ${activeNotice.id === notice.id ? 'bg-blue-50' : ''}`}
                                                    onClick={() =>
                                                        setActiveNotice(notice)
                                                    }
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <h3 className="font-medium text-gray-800">
                                                            {notice.title}
                                                        </h3>
                                                        <span
                                                            className={`rounded-full px-2 py-1 text-xs ${getCategoryColor(notice.category)}`}
                                                        >
                                                            {notice.category}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        {notice.date}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Active Notice Details */}
                                        <div className="rounded-lg bg-gray-50 p-6">
                                            <div className="mb-4 flex items-start justify-between">
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {activeNotice.title}
                                                </h3>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs ${getCategoryColor(activeNotice.category)}`}
                                                >
                                                    {activeNotice.category}
                                                </span>
                                            </div>
                                            <p className="mb-4 text-gray-700">
                                                {activeNotice.content}
                                            </p>
                                            <div className="text-sm text-gray-500">
                                                Posted on: {activeNotice.date}
                                            </div>
                                            <div className="mt-6 border-t pt-4">
                                                <Link
                                                    href="#"
                                                    className="flex items-center font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    View all notices
                                                    <svg
                                                        className="ml-1 h-4 w-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                        />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* News & Updates */}
                            <section className="overflow-hidden rounded-xl bg-white shadow-lg">
                                <div className="bg-green-700 px-6 py-4 text-white">
                                    <h2 className="flex items-center text-xl font-bold">
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Latest News & Updates
                                    </h2>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {news.map((item) => (
                                            <div
                                                key={item.id}
                                                className="overflow-hidden rounded-lg border transition hover:shadow-md"
                                            >
                                                <div className="relative h-48 bg-gray-200">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute top-0 left-0 bg-blue-600 px-3 py-1 text-sm text-white">
                                                        {item.date}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="mb-2 text-lg font-bold">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mb-4 text-gray-600">
                                                        {item.excerpt}
                                                    </p>
                                                    <Link
                                                        href="#"
                                                        className="font-medium text-blue-600 hover:text-blue-800"
                                                    >
                                                        Read more →
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Upcoming Events & Quick Info */}
                        <div className="space-y-8">
                            {/* Upcoming Events */}
                            <section className="overflow-hidden rounded-xl bg-white shadow-lg">
                                <div className="bg-purple-700 px-6 py-4 text-white">
                                    <h2 className="flex items-center text-xl font-bold">
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Upcoming Events
                                    </h2>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {events.map((event) => (
                                            <div
                                                key={event.id}
                                                className="border-l-4 border-purple-500 py-3 pl-4"
                                            >
                                                <h3 className="font-bold text-gray-800">
                                                    {event.title}
                                                </h3>
                                                <div className="mt-1 flex items-center text-sm text-gray-600">
                                                    <svg
                                                        className="mr-1 h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {event.date} • {event.time}
                                                </div>
                                                <div className="mt-1 flex items-center text-sm text-gray-600">
                                                    <svg
                                                        className="mr-1 h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {event.location}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6">
                                        <Link
                                            href="#"
                                            className="flex items-center font-medium text-purple-600 hover:text-purple-800"
                                        >
                                            View calendar
                                            <svg
                                                className="ml-1 h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </section>

                            {/* Quick Info Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
                                    <div className="mb-2 text-3xl font-bold text-blue-700">
                                        1,500+
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Students Enrolled
                                    </div>
                                </div>
                                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                                    <div className="mb-2 text-3xl font-bold text-green-700">
                                        95%
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Pass Rate 2023
                                    </div>
                                </div>
                                <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-center">
                                    <div className="mb-2 text-3xl font-bold text-purple-700">
                                        80+
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Qualified Staff
                                    </div>
                                </div>
                                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-center">
                                    <div className="mb-2 text-3xl font-bold text-orange-700">
                                        25+
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Years Experience
                                    </div>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <section className="rounded-xl bg-white p-6 shadow-lg">
                                <h3 className="mb-4 text-lg font-bold text-gray-800">
                                    Quick Links
                                </h3>
                                <div className="space-y-3">
                                    <Link
                                        href="#"
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Academic Calendar
                                    </Link>
                                    <Link
                                        href="#"
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Staff Directory
                                    </Link>
                                    <Link
                                        href="#"
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Download Forms
                                    </Link>
                                    <Link
                                        href="#"
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        Contact Us
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* School Features Section */}
                    <section className="mt-12 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
                        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">
                            Why Choose CBC School?
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="rounded-xl bg-white p-6 text-center shadow-md">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                    <svg
                                        className="h-8 w-8 text-blue-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-bold">
                                    Quality Education
                                </h3>
                                <p className="text-gray-600">
                                    CBSE curriculum with modern teaching
                                    methodologies and digital classrooms.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-6 text-center shadow-md">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <svg
                                        className="h-8 w-8 text-green-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-bold">
                                    Holistic Development
                                </h3>
                                <p className="text-gray-600">
                                    Sports, arts, and extracurricular activities
                                    for all-round personality development.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-6 text-center shadow-md">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                    <svg
                                        className="h-8 w-8 text-purple-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-bold">
                                    Modern Facilities
                                </h3>
                                <p className="text-gray-600">
                                    State-of-the-art labs, library, sports
                                    complex, and transportation facilities.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="mt-12 bg-gray-900 text-white">
                    <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div>
                                <div className="mb-4 flex items-center space-x-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                                        <span className="text-xl font-bold">
                                            CBC
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold">
                                        CBC School
                                    </h3>
                                </div>
                                <p className="text-gray-400">
                                    Providing quality education since 1995.
                                    Nurturing minds, building character.
                                </p>
                            </div>

                            <div>
                                <h4 className="mb-4 text-lg font-bold">
                                    Quick Links
                                </h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-white"
                                        >
                                            About Us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-white"
                                        >
                                            Academics
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-white"
                                        >
                                            Admissions
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-white"
                                        >
                                            Facilities
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-4 text-lg font-bold">
                                    Resources
                                </h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-white"
                                        >
                                            Parent Portal
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-white"
                                        >
                                            Student Portal
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-white"
                                        >
                                            School Calendar
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-white"
                                        >
                                            Downloads
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-4 text-lg font-bold">
                                    Contact Us
                                </h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li className="flex items-center">
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        123 Education Street, City, State 12345
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                        (123) 456-7890
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        info@cbcschool.edu
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
                            <p>
                                © {new Date().getFullYear()} CBC School. All
                                rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
