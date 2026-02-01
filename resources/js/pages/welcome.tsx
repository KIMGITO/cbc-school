import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { FiBook, FiUsers, FiAward, FiGlobe, FiMusic,  FiCamera,FiStar,FiDroplet, FiHeart, FiActivity, FiCode, } from 'react-icons/fi';
import { MdSchool, MdScience, MdComputer, MdSportsHandball, MdNature } from 'react-icons/md';
// import {User} from 'lucide-ui';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    text: string;
    image: string;
    childGrade: string;
}

interface Program {
    id: number;
    title: string;
    description: string;
    icon: JSX.Element;
    ageGroup: string;
    color: string;
    link: string;
}

interface SchoolLevel {
    id: number;
    name: string;
    grades: string;
    description: string;
    icon: JSX.Element;
    color: string;
    image: string;
}

export default function ModernSchoolHome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeLevel, setActiveLevel] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const heroRef = useRef<HTMLDivElement>(null);
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 200 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
};
    useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 640 && isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, [isMobileMenuOpen]);

useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
            setIsMobileMenuOpen(false);
        }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
}, [isMobileMenuOpen]);

    // School information with Kenyan context
    const schoolInfo = {
        name: 'CBE-School Mgt. System',
        shortName: 'CBE-SMS',
        motto: 'Innovative Transformation for our schools',
        tagline: 'Holistic Approach to school management',
        address: 'Nairobi, Kenya',
        phone: '+254 743 952 173',
        email: 'kimanthidennis02@gmail.com',
        established: '2022',
        levels: ['PP1-PP2', 'Grade 1-3', 'Grade 4-6', 'Grade 7-9', 'Grade 10-12']
    };

    const carouselItems = [
        {
            id: 1,
            title: 'Early Years Foundation',
            description: 'Play-based learning for PP1-PP2 with safe, nurturing environments',
            image: 'https://images.unsplash.com/photo-1601339434203-130259102db6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJpbWFyeSUyMHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D',
            ageGroup: '2-5 Years',
            icon: '',
            color: 'from-pink-400 to-purple-400'
        },
        {
            id: 2,
            title: 'Primary Excellence',
            description: 'Building strong foundations in literacy, numeracy, and character',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            ageGroup: '6-12 Years',
            icon: '📚',
            color: 'from-blue-400 to-cyan-400'
        },
        {
            id: 3,
            title: 'Junior Secondary',
            description: 'Exploratory learning with specialization in sciences and arts',
            image: 'https://images.unsplash.com/photo-1573894999291-f440466112cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTh8fGNsYXNzcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
            ageGroup: '13-15 Years',
            icon: '🔬',
            color: 'from-green-500 to-emerald-400'
        },
        {
            id: 4,
            title: 'Senior School',
            description: 'University preparation with career guidance and leadership',
            image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            ageGroup: '16-18 Years',
            icon: '🎓',
            color: 'from-orange-400 to-red-400'
        }
    ];

    // School Levels with age-appropriate descriptions
    const schoolLevels: SchoolLevel[] = [
        {
            id: 1,
            name: 'Early Years',
            grades: 'PP1 - PP2',
            description: 'Play-based learning focusing on social, emotional, and cognitive development',
            icon: <FiHeart className="text-4xl" />,
            color: 'bg-gradient-to-br from-pink-400 to-purple-500',
            image: 'https://plus.unsplash.com/premium_vector-1758685412226-9c3a2076e593?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGVhcmx5JTIwbGVhcm5pbmd8ZW58MHx8MHx8fDA%3D'
        },
        {
            id: 2,
            name: 'Lower Primary',
            grades: 'Grade 1 - 3',
            description: 'Building literacy, numeracy, and foundational skills in all subjects',
            icon: <MdSchool className="text-4xl" />,
            color: 'bg-gradient-to-br from-blue-400 to-cyan-500',
            image: 'https://images.unsplash.com/photo-1559838831-d8fbd8af6469?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJpbWFyeSUyMHNjaG9vbCUyMGJsYWNrfGVufDB8fDB8fHww '
        },
        {
            id: 3,
            name: 'Upper Primary',
            grades: 'Grade 4 - 6',
            description: 'Developing critical thinking and problem-solving skills across subjects',
            icon: <FiBook className="text-4xl" />,
            color: 'bg-gradient-to-br from-green-400 to-emerald-500',
            image: 'https://media.istockphoto.com/id/1056616900/photo/female-defending-basketball-from-opponent.webp?a=1&b=1&s=612x612&w=0&k=20&c=UtrtDAbV6IpmM-9Ed3_ieeOAZ3N81YgUo-DqnEUHde4='
        },
        {
            id: 4,
            name: 'Junior Secondary',
            grades: 'Grade 7 - 9',
            description: 'Exploratory learning with introduction to sciences, arts, and technology',
            icon: <FiBook className="text-4xl" />,
            color: 'bg-gradient-to-br from-orange-400 to-yellow-500',
            image: 'https://media.istockphoto.com/id/2231160548/photo/young-african-american-child-boy-studying-at-home-kid-sits-at-desk-attends-school-class.webp?a=1&b=1&s=612x612&w=0&k=20&c=r1P4k1LjoiQbcJbK4VlJ9YMuWXGbiQkOdRZDa68X8Vc='
        },
        {
            id: 5,
            name: 'Senior School',
            grades: 'Grade 10 - 12',
            description: 'Specialization tracks preparing for university and career pathways',
            icon: <FiAward className="text-4xl" />,
            color: 'bg-gradient-to-br from-red-400 to-pink-500',
            image: 'https://media.istockphoto.com/id/1047528802/photo/portrait-of-smiling-male-high-school-student-outside-college-building-with-other-teenage.webp?a=1&b=1&s=612x612&w=0&k=20&c=OuWFQOh6AfxogqN1GkOPRe7Rt4DraXnvhc0eVjpYuUQ='
        }
    ];

    // Age-appropriate programs
    const programs: Program[] = [
        {
            id: 1,
            title: 'Play & Learn',
            description: 'Montessori-inspired activities for early childhood development',
            icon: <FiStar />,
            ageGroup: 'PP1-PP2',
            color: 'bg-gradient-to-br from-pink-100 to-purple-100',
            link: '#play-learn'
        },
        {
            id: 2,
            title: 'Reading Buddies',
            description: 'Literacy program pairing older students with younger readers',
            icon: <FiDroplet />,
            ageGroup: 'Grade 1-3',
            color: 'bg-gradient-to-br from-blue-100 to-cyan-100',
            link: '#reading'
        },
        {
            id: 3,
            title: 'Young Scientists',
            description: 'Hands-on science experiments and discovery',
            icon: <FiBook />,
            ageGroup: 'Grade 4-6',
            color: 'bg-gradient-to-br from-green-100 to-emerald-100',
            link: '#science'
        },
        {
            id: 4,
            title: 'Digital Creators',
            description: 'Coding, robotics, and digital literacy for all ages',
            icon: <FiCode />,
            ageGroup: 'Grade 7-9',
            color: 'bg-gradient-to-br from-purple-100 to-pink-100',
            link: '#digital'
        },
        {
            id: 5,
            title: 'Art Expression',
            description: 'Visual arts, music, dance, and drama programs',
            icon: <FiCamera />,
            ageGroup: 'All Levels',
            color: 'bg-gradient-to-br from-yellow-100 to-orange-100',
            link: '#arts'
        },
        {
            id: 6,
            title: 'Sports Academy',
            description: 'Football, basketball, swimming, and athletics training',
            icon: <FiActivity />,
            ageGroup: 'All Levels',
            color: 'bg-gradient-to-br from-red-100 to-pink-100',
            link: '#sports'
        }
    ];

    // Kenyan parent testimonials with child grades
    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: 'Grace Wambui',
            role: 'Parent',
            childGrade: 'PP2 & Grade 4',
            text: 'Both my children have flourished here. The teachers truly understand each child\'s needs.',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 2,
            name: 'James Omondi',
            role: 'Parent',
            childGrade: 'Grade 7',
            text: 'The STEM program has ignited my son\'s passion for technology. He\'s already building apps!',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 3,
            name: 'Aisha Mohamed',
            role: 'Parent',
            childGrade: 'Grade 11',
            text: 'Excellent university preparation and career guidance. My daughter feels ready for her future.',
            image: 'https://images.unsplash.com/photo-1494790108755-2616c113a1c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        }
    ];

    // Statistics with age-group breakdown
    const stats = [
        { label: 'Total Students', value: '1,850+', detail: 'PP1 to Grade 12' },
        { label: 'Qualified Teachers', value: '145', detail: 'Specialized by grade level' },
        { label: 'Student:Teacher Ratio', value: '12:1', detail: 'Personalized attention' },
        { label: 'University Placement', value: '98%', detail: 'Class of 2023' },
        { label: 'Extracurricular Clubs', value: '25+', detail: 'Sports, Arts, STEM' },
        { label: 'Years Excellence', value: '18+', detail: 'Since 2005' },
    ];

    // Custom cursor effect
    // useEffect(() => {
    //     const moveCursor = (e: MouseEvent) => {
    //         cursorX.set(e.clientX - 16);
    //         cursorY.set(e.clientY - 16);
    //         setMousePosition({
    //             x: (e.clientX / window.innerWidth) * 2 - 1,
    //             y: (e.clientY / window.innerHeight) * 2 - 1
    //         });
    //     };

    //     window.addEventListener('mousemove', moveCursor);
    //     return () => window.removeEventListener('mousemove', moveCursor);
    // }, []);

    // Parallax effect for hero images
    useEffect(() => {
        const handleParallax = () => {
            if (!heroRef.current) return;
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroRef.current.style.transform = `translate3d(0, ${rate}px, 0)`;
        };

        window.addEventListener('scroll', handleParallax);
        return () => window.removeEventListener('scroll', handleParallax);
    }, []);

    // Carousel auto-slide
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
        }, 6000);
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

    // Update time
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head title={`${schoolInfo.name} - Holistic Education PP1 to Grade 12`}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white font-sans overflow-x-hidden">
                {/* Custom Cursor */}
                <motion.div
                    className="fixed top-0 left-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 pointer-events-none z-50 mix-blend-difference hidden lg:block"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                    }}
                />

                {/* Glass Morphism Navigation */}
                <motion.nav
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg'
            : 'bg-white/90 backdrop-blur-lg'
    }`}
>
    <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
            >
                <div className="relative h-10 w-10 sm:h-12 sm:w-12">
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg" />
                    <div className="absolute inset-1 sm:inset-2 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-base sm:text-lg font-bold text-white">BFA</span>
                    </div>
                </div>
                <div className="hidden xl:block">
                    <h1 className="text-base sm:text-lg font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {schoolInfo.name}
                    </h1>
                    <p className="text-xs text-gray-600">
                        {schoolInfo.motto}
                    </p>
                </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
                {['Home', 'Levels', 'Programs', 'Admissions', 'School Life', 'Contact'].map((item, index) => (
                    <motion.a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative font-medium text-gray-700 hover:text-blue-600 px-3 py-2 text-sm lg:text-base transition-colors"
                    >
                        {item}
                        <motion.span 
                            className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                            initial={{ width: 0, x: '-50%' }}
                            whileHover={{ width: '80%' }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.a>
                ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                {auth.user ? (
                    <Link
                        href={dashboard()}
                        className="rounded-lg md:rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 lg:px-6 py-2 text-sm lg:text-base font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href={login()}
                            className="rounded-lg md:rounded-xl border border-blue-500 bg-white/80 backdrop-blur-sm px-4 lg:px-6 py-2 text-sm lg:text-base font-medium text-blue-600 transition-all duration-300 hover:bg-blue-50"
                        >
                            Sign In
                        </Link>
                        {canRegister && (
                            <Link
                                href={register()}
                                className="rounded-lg md:rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 lg:px-6 py-2 text-sm lg:text-base font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                            >
                                Apply Now
                            </Link>
                        )}
                    </>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden menu-button p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
            >
                {isMobileMenuOpen ? (
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mobile-menu md:hidden overflow-hidden"
                >
                    <div className="pt-4 pb-6 border-t border-gray-100 mt-3">
                        {/* Mobile Navigation Links */}
                        <div className="flex flex-col space-y-3 mb-6">
                            {['Home', 'Levels', 'Programs', 'Admissions', 'School Life', 'Contact'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-base"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        {/* Mobile Auth Buttons */}
                        <div className="space-y-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg text-center shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="block w-full py-3 border-2 border-blue-500 text-blue-600 font-medium rounded-lg text-center hover:bg-blue-50 transition-colors duration-300"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="block w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg text-center shadow-lg hover:shadow-xl transition-all duration-300"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Apply Now
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Mobile Contact Info */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <div className="text-blue-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-600">{schoolInfo.phone}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="text-blue-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-600">{schoolInfo.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
</motion.nav>

                {/* Hero Section with Stable Background */}
<section className="relative min-h-screen pt-16 sm:pt-20 md:pt-24 overflow-hidden">
    {/* Stable Background Container */}
    <div className="absolute inset-0 z-0">
        {carouselItems.map((item, index) => (
            <motion.div
                key={item.id}
                className={`absolute inset-0 ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                initial={false}
                animate={{
                    scale: index === currentSlide ? 1 : 0.95,
                }}
                transition={{ 
                    duration: 1.5,
                    ease: "easeInOut"
                }}
                style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed', // Parallax effect without mouse movement
                }}
            >
                {/* Color Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-40 transition-opacity duration-1000`} />
                
                {/* Subtle Grain Texture */}
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />
            </motion.div>
        ))}
        
        {/* Enhanced Floating Educational Icons */}
        <div className="absolute inset-0 overflow-hidden">
            {['📚', '🔬', '🎨', '⚽', '🎵', '💻', '🧮', '🌱', '👨‍🏫', '🏫', '🎓', '📝'].map((icon, i) => (
                <motion.div
                    key={i}
                    className="absolute text-4xl sm:text-5xl lg:text-6xl opacity-20"
                    animate={{
                        y: [0, -40, 0],
                        x: [0, Math.sin(i * 0.5) * 15, 0],
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 8 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2
                    }}
                    style={{
                        left: `${(i * 12) % 100}%`,
                        top: `${(i * 8) % 100}%`,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                >
                    {icon}
                </motion.div>
            ))}
        </div>
        
        {/* Gradient Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />
    </div>

    {/* Hero Content */}
    <div className="relative z-20 container mx-auto px-4 sm:px-6 h-full flex items-center">
        <AnimatePresence mode="wait">
            <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ 
                    duration: 0.8,
                    ease: "easeOut"
                }}
                className="max-w-3xl text-white"
            >
                {/* Age Group Badge */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                        delay: 0.2,
                        type: "spring",
                        stiffness: 100
                    }}
                    className="inline-block rounded-full border border-white/30 bg-white/10 px-4 sm:px-6 py-2 backdrop-blur-sm mb-6 sm:mb-8"
                >
                    <span className="text-sm sm:text-base font-medium text-blue-200 flex items-center gap-2">
                        <span className="text-lg">{carouselItems[currentSlide].icon}</span>
                        {carouselItems[currentSlide].ageGroup}
                    </span>
                </motion.div>
                
                {/* Main Title */}
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                >
                    {carouselItems[currentSlide].title}
                    <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="block h-1 sm:h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 mt-4 rounded-full"
                    />
                </motion.h1>
                
                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed"
                >
                    {carouselItems[currentSlide].description}
                </motion.p>
                
                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                >
                    <motion.a
                        whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        href="#tour"
                        className="group relative rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            🏫 Schedule Visit
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.a>
                    
                    <motion.a
                        whileHover={{ 
                            scale: 1.05,
                            backgroundColor: "rgba(255, 255, 255, 0.15)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        href="#virtual-tour"
                        className="group relative rounded-xl border-2 border-white/30 bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            🎥 Virtual Tour
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.6 }}
                        />
                    </motion.a>
                </motion.div>
                
                {/* Quick Stats */}
                {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 sm:mt-12 grid grid-cols-3 gap-4 max-w-md"
                >
                    {[
                        { icon: '👨‍🎓', value: '98%', label: 'Success Rate' },
                        { icon: '🏆', value: '18+', label: 'Years Experience' },
                        { icon: '⭐', value: '4.9', label: 'Parent Rating' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + (index * 0.1) }}
                            className="text-center"
                        >
                            <div className="text-2xl mb-1">{stat.icon}</div>
                            <div className="text-xl font-bold">{stat.value}</div>
                            <div className="text-xs text-blue-200">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div> */}
            </motion.div>
        </AnimatePresence>
    </div>

    {/* Carousel Indicators with Improved Animation */}
    <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-30">
        {carouselItems.map((_, index) => (
            <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentSlide(index)}
                className="relative group"
                aria-label={`Go to slide ${index + 1}`}
            >
                <motion.div
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                            ? 'bg-white' 
                            : 'bg-white/40 hover:bg-white/60'
                    }`}
                    animate={{
                        scale: index === currentSlide ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                        duration: 2,
                        repeat: index === currentSlide ? Infinity : 0,
                        repeatType: "reverse"
                    }}
                />
                
                {/* Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {carouselItems[index].title}
                </div>
            </motion.button>
        ))}
    </div>
    
    {/* Scroll Indicator */}
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30"
    >
        <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/70"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        </motion.div>
    </motion.div>
</section>

               {/* School Levels Section */}
<section className="py-12 sm:py-20 bg-gradient-to-b from-white to-blue-50/30">
    <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12 sm:mb-16"
        >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Holistic Education
                </span> for Every Stage
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                From early childhood to university preparation, we nurture each student's unique potential
            </p>
        </motion.div>

        {/* Mobile Scroll Container */}
        <div className="lg:hidden">
            <div className="flex overflow-x-auto pb-6 gap-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
                style={{ scrollBehavior: 'smooth' }}
            >
                {schoolLevels.map((level, index) => (
                    <motion.div
                        key={level.id}
                        className="flex-shrink-0 w-[280px] snap-center relative group"
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Card Container */}
                        <div className="relative rounded-xl overflow-hidden shadow-lg h-[320px]">
                            
                            {/* BACKGROUND IMAGE - Always present */}
                            <img
                                src={level.image}
                                alt={level.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            
                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 ${level.color} opacity-70`} />
                            
                            {/* DEFAULT STATE CONTENT - Shows by default */}
                            <motion.div
                                className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6"
                                initial={false}
                                animate={{ opacity: 1 }}
                                whileHover={{ opacity: 0 }}
                                whileTap={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Icon */}
                                <div className="mb-4 text-4xl text-white">
                                    {level.icon}
                                </div>
                                
                                {/* Title */}
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {level.name}
                                    </h3>
                                    <p className="text-white/80 text-sm">
                                        {level.grades}
                                    </p>
                                </div>
                            </motion.div>

                            {/* HOVER/TAP STATE CONTENT - Shows on hover/tap */}
                            <motion.div
                                className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6"
                                initial={false}
                                animate={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                whileTap={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Dark Overlay for Text Readability */}
                                <div className="absolute inset-0 bg-black/50" />
                                
                                {/* Content Over Image */}
                                <div className="relative z-10 text-center">
                                    <div className="mb-4 text-4xl text-white">
                                        {level.icon}
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {level.name}
                                    </h3>
                                    <p className="text-white/80 text-sm mb-4">
                                        {level.grades}
                                    </p>
                                    <p className="text-white/90 text-sm px-4">
                                        {level.description}
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Mobile Tap Indicator */}
                        <div className="absolute bottom-2 right-2 z-30">
                            <div className="bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {/* Mobile Scroll Hint */}
            <div className="text-center mt-4">
                <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                    <span className="animate-pulse">←</span>
                    Tap cards to view details
                    <span className="animate-pulse">→</span>
                </p>
            </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-5 gap-6">
            {schoolLevels.map((level, index) => (
                <motion.div
                    key={level.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group"
                >
                    {/* Card Container */}
                    <div className="relative rounded-2xl overflow-hidden shadow-xl h-[320px]">
                        
                        {/* BACKGROUND IMAGE - Always present */}
                        <motion.img
                            src={level.image}
                            alt={level.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            initial={false}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.7 }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 ${level.color} opacity-70 group-hover:opacity-30 transition-opacity duration-500`} />
                        
                        {/* Subtle Texture */}
                        <div className="absolute inset-0 opacity-5"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                        />
                        
                        {/* DEFAULT STATE CONTENT */}
                        <motion.div
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8"
                            initial={false}
                            whileHover={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Icon */}
                            <motion.div
                                initial={false}
                                whileHover={{ scale: 0, rotate: 180 }}
                                transition={{ duration: 0.4 }}
                                className="mb-6 text-5xl text-white"
                            >
                                {level.icon}
                            </motion.div>
                            
                            {/* Title */}
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {level.name}
                                </h3>
                                <p className="text-white/80 text-lg">
                                    {level.grades}
                                </p>
                            </div>
                        </motion.div>

                        {/* HOVER STATE CONTENT */}
                        <motion.div
                            className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8"
                            initial={false}
                            animate={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            style={{
                                transformStyle: "preserve-3d",
                                perspective: "1000px"
                            }}
                        >
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/50" />
                            
                            {/* 3D Transform Container */}
                            <motion.div
                                initial={false}
                                animate={{ rotateY: 0, scale: 1 }}
                                whileHover={{ rotateY: 8, scale: 1.02 }}
                                transition={{ duration: 0.5 }}
                                className="relative z-10 text-center"
                            >
                                {/* Animated Icon */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    whileHover={{ scale: 1, rotate: 0,opacity: 0 }}
                                    transition={{ delay: 0.1, type: "spring" }}
                                    className="mb-6 text-5xl text-blue-500  "
                                >
                                    {level.icon}
                                </motion.div>
                                
                                {/* Title with Background */}
                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    whileHover={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-block bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl"
                                >
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {level.name}
                                    </h3>
                                    <p className="text-white/80 text-lg mb-4">
                                        {level.grades}
                                    </p>
                                    <p className="text-white/90 text-base max-w-xs">
                                        {level.description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Glowing Border */}
                        <motion.div
                            className="absolute inset-0 border-2 border-transparent rounded-2xl z-30"
                            initial={false}
                            whileHover={{ 
                                borderColor: "rgba(255, 255, 255, 0.6)",
                                boxShadow: "0 0 40px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)"
                            }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>

                    {/* Hover Indicator */}
                    <motion.div
                        className="absolute -top-3 -right-3 z-30"
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            👆 Hover to view
                        </div>
                    </motion.div>

                   
                </motion.div>
            ))}
        </div>
    </div>
</section>

                {/* Interactive Programs Grid */}
<section className="py-12 sm:py-20 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
    <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
        >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Enrichment Programs
                </span> for All Ages
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                Beyond the classroom: Discover passions and develop talents
            </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {programs.map((program, index) => {
                // Unique background images for each program type
                const programImages = [
                    'https://images.unsplash.com/photo-1564429238817-393bd4286b2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGxheSUyMGdyb3VwfGVufDB8fDB8fHww', // Play & Learn
                    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Reading
                    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Science
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Digital
                    'https://images.unsplash.com/photo-1558655146-d09347e92766?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGVzaWdufGVufDB8fDB8fHww', // Art
                    'https://images.unsplash.com/photo-1570498839593-e565b39455fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D', // Sports
                ];

                const programImage = programImages[index] || programImages[0];

                return (
                    <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="group relative"
                    >
                        {/* Card Container */}
                        <div className={`relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg h-full min-h-[220px] sm:min-h-[240px]`}>
                            
                            {/* Main Background Image */}
                            <motion.div
                                className="absolute inset-0"
                                animate={{
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <img
                                    src={programImage}
                                    alt={program.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Color Overlay */}
                                <div className={`absolute inset-0 ${program.color.replace('bg-gradient-to-br', 'bg-gradient-to-t').replace('-100', '-900')} opacity-70`} />
                            </motion.div>

                            {/* Blurred Accent Image - Bottom Right */}
                            <motion.div
                                className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 opacity-30 group-hover:opacity-50 transition-all duration-500"
                                animate={{
                                    x: [0, -8, 0],
                                    y: [0, 8, 0],
                                    rotate: [0, 5, -5, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 12,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <div 
                                    className="w-full h-full rounded-full blur-xl"
                                    style={{
                                        backgroundImage: `url(${programImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        mixBlendMode: 'overlay',
                                        filter: 'blur(20px) brightness(1.2)'
                                    }}
                                />
                                {/* Inner Glow */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent" />
                            </motion.div>

                            {/* Floating Icon Background */}
                            <motion.div
                                className="absolute -top-8 -right-8 text-6xl sm:text-7xl opacity-20 text-white"
                                animate={{
                                    rotate: [0, 20, -20, 0],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                {program.icon}
                            </motion.div>

                            {/* Content Overlay */}
                            <div className="relative z-10 p-5 sm:p-6 h-full flex flex-col bg-gradient-to-t from-black/40 via-blue-500/20 to-transparent">
                                
                                {/* Icon and Title Row */}
                                <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                                    <motion.div
                                        className="text-2xl sm:text-3xl text-white"
                                        whileHover={{ 
                                            scale: 1.3,
                                            rotate: [0, 15, -15, 0]
                                        }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {program.icon}
                                    </motion.div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                                {program.title}
                                            </h3>
                                            <motion.span
                                                whileHover={{ scale: 1.1 }}
                                                className="inline-flex items-center px-2 py-1 rounded-full bg-white/90 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur-sm"
                                            >
                                                {program.ageGroup}
                                            </motion.span>
                                        </div>
                                        
                                        {/* Animated Underline */}
                                        <motion.div
                                            className="h-0.5 bg-gradient-to-r from-emerald-300 to-green-300 mt-2"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "10%" }}
                                            whileTap={{width: "100%"}}
                                            transition={{ delay: 0.3, duration: 0.8 }}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-white/90 mb-4 text-sm sm:text-base leading-relaxed flex-1"
                                >
                                    {program.description}
                                </motion.p>

                                {/* Learn More Link */}
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="inline-flex items-center group self-start"
                                >
                                    <a
                                        href={program.link}
                                        className="inline-flex items-center text-emerald-300 font-semibold text-sm sm:text-base group-hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-black/50"
                                    >
                                        Discover Program
                                        <motion.svg
                                            className="w-4 h-4 ml-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </motion.svg>
                                    </a>
                                </motion.div>
                            </div>

                            {/* Floating Particles */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-300/50"
                                        animate={{
                                            y: [0, -30, 0],
                                            x: [0, Math.sin(i) * 15, 0],
                                            opacity: [0.2, 0.8, 0.2],
                                            scale: [1, 1.5, 1]
                                        }}
                                        transition={{
                                            duration: 4 + i,
                                            repeat: Infinity,
                                            delay: i * 0.3
                                        }}
                                        style={{
                                            left: `${10 + (i * 25)}%`,
                                            top: `${20 + (i * 15)}%`
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Hover Glow Effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-transparent to-emerald-400/0 rounded-xl sm:rounded-2xl"
                                initial={false}
                                whileHover={{
                                    background: [
                                        'radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.3) 0%, transparent 60%)',
                                        'radial-gradient(circle at 80% 20%, rgba(52, 211, 153, 0.3) 0%, transparent 60%)',
                                        'radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.3) 0%, transparent 60%)'
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />

                            {/* Edge Glow */}
                            <motion.div
                                className="absolute inset-0 border-2 border-transparent rounded-xl sm:rounded-2xl"
                                initial={false}
                                whileHover={{ 
                                    borderColor: "rgba(52, 211, 153, 0.4)",
                                    boxShadow: "0 0 40px rgba(52, 211, 153, 0.3), inset 0 0 40px rgba(52, 211, 153, 0.1)"
                                }}
                                transition={{ duration: 0.4 }}
                            />
                        </div>

                        {/* Hover Floating Effect */}
                        <motion.div
                            className="absolute -inset-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-400/30 to-blue-400/30 blur-xl opacity-0 group-hover:opacity-70 -z-10"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0, 0.7, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: index * 0.2
                            }}
                        />
                    </motion.div>
                );
            })}
        </div>

        {/* View All Button */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 sm:mt-12"
        >
            <motion.a
                href="#all-programs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
            >
                {/* Button Background Animation */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600"
                    animate={{
                        background: [
                            'linear-gradient(to right, #10b981, #059669)',
                            'linear-gradient(to right, #34d399, #10b981)',
                            'linear-gradient(to right, #10b981, #059669)'
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Button Content */}
                <span className="relative z-10 flex items-center">
                    Explore All Programs
                    <motion.svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ 
                            rotate: [0, 360],
                            x: [0, 5, 0]
                        }}
                        transition={{ 
                            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                            x: { duration: 1.5, repeat: Infinity }
                        }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                </span>
                
                {/* Button Glow Effect */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0"
                    animate={{
                        x: ["-100%", "200%"]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 0.5
                    }}
                />
            </motion.a>
        </motion.div>
    </div>
</section>

                {/* Testimonials Section */}
                <section className="py-12 sm:py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5" />
                    <div className="container mx-auto px-4 sm:px-6 relative z-10">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-12 sm:mb-20"
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                                What <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Parents Say
                                </span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                                Join hundreds of satisfied families in our learning community
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    whileHover={{ y: -10 }}
                                    className="group"
                                >
                                    <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 h-full">
                                        <div className="flex items-start mb-6">
                                            <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                                            </div>
                                            <div className="ml-4 sm:ml-6">
                                                <h4 className="font-bold text-gray-900 text-lg sm:text-xl">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                    {testimonial.role}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                    Child in {testimonial.childGrade}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 italic text-base sm:text-lg mb-6">
                                            "{testimonial.text}"
                                        </p>
                                        <div className="flex text-yellow-400 text-xl sm:text-2xl">
                                            {'★★★★★'.split('').map((star, i) => (
                                                <motion.span 
                                                    key={i}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="transform transition-transform duration-300 group-hover:scale-110"
                                                >
                                                    {star}
                                                </motion.span>
                                            ))}
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="py-12 sm:py-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/30" />
                    <div className="container mx-auto px-4 sm:px-6 relative z-10">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="group text-center"
                                >
                                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300">
                                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                            {stat.value}
                                        </div>
                                        <div className="font-semibold text-gray-800 text-sm sm:text-base">
                                            {stat.label}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                            {stat.detail}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 sm:py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center transform scale-110" />
                    </div>
                    
                    <div className="container mx-auto px-4 sm:px-6 relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                                Ready for the <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                    Journey
                                </span>?
                            </h2>
                            <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
                                Join Bright Future Academy today and give your child the advantage of quality education from PP1 through Grade 12
                            </p>
                            
                            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-xl sm:rounded-2xl bg-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold text-blue-700 shadow-2xl hover:shadow-3xl transition-all duration-300"
                                    >
                                        🚀 Start Application
                                    </Link>
                                </motion.div>
                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href="#virtual-tour"
                                    className="inline-block rounded-xl sm:rounded-2xl border-2 border-white/50 bg-white/10 backdrop-blur-sm px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold text-white hover:bg-white/20 transition-all duration-300"
                                >
                                    🎮 Interactive Demo
                                </motion.a>
                            </div>
                            
                            <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
                                {[
                                    { icon: '📅', title: '2024 Intake', subtitle: 'Open Now' },
                                    { icon: '💰', title: 'Scholarships', subtitle: 'Available' },
                                    { icon: '📱', title: 'Parent App', subtitle: 'Live Updates' },
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="text-3xl sm:text-4xl mb-2">{item.icon}</div>
                                        <div className="text-white font-bold text-sm sm:text-base">{item.title}</div>
                                        <div className="text-blue-200 text-xs sm:text-sm">{item.subtitle}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Responsive Footer */}
                <footer className="bg-gray-900 pt-12 sm:pt-20 pb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    
                    <div className="container mx-auto px-4 sm:px-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
                            {/* School Info */}
                            <div>
                                <div className="flex items-center space-x-3 sm:space-x-4 mb-6">
                                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg sm:text-xl font-bold text-white">BFA</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-white">
                                            {schoolInfo.name}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-400">{schoolInfo.motto}</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-6 text-sm sm:text-base">
                                    Holistic Education for PP1 to Grade 12
                                </p>
                                <div className="flex space-x-3 sm:space-x-4">
                                    {['F', 'T', 'I', 'Y'].map((social, index) => (
                                        <motion.a
                                            key={social}
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            href="#"
                                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all duration-300 text-sm sm:text-base"
                                        >
                                            {social}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Quick Links</h4>
                                <ul className="space-y-2 sm:space-y-3">
                                    {['Admissions', 'School Fees', 'Calendar', 'Careers'].map((link) => (
                                        <li key={link}>
                                            <a
                                                href={`#${link.toLowerCase()}`}
                                                className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group text-sm sm:text-base"
                                            >
                                                <span className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-3 sm:group-hover:w-4 mr-2 transition-all duration-300" />
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Resources */}
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Resources</h4>
                                <ul className="space-y-2 sm:space-y-3">
                                    {['Parent Portal', 'Student Login', 'Digital Library', 'Mobile App'].map((resource) => (
                                        <li key={resource}>
                                            <a
                                                href={`#${resource.toLowerCase().replace(' ', '-')}`}
                                                className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group text-sm sm:text-base"
                                            >
                                                <span className="w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-3 sm:group-hover:w-4 mr-2 transition-all duration-300" />
                                                {resource}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Contact Us</h4>
                                <div className="space-y-3 sm:space-y-4">
                                    {[
                                        { icon: '📍', text: schoolInfo.address },
                                        { icon: '📞', text: schoolInfo.phone },
                                        { icon: '✉️', text: schoolInfo.email },
                                    ].map((contact, index) => (
                                        <div key={index} className="flex items-start space-x-2 sm:space-x-3 group">
                                            <div className="text-blue-400 transform group-hover:scale-110 transition-transform duration-300 text-sm sm:text-base">
                                                {contact.icon}
                                            </div>
                                            <p className="text-gray-400 group-hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                                                {contact.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 sm:pt-8 border-t border-gray-800 text-center">
                            <p className="text-gray-400 text-sm sm:text-base">
                                © {new Date().getFullYear()} {schoolInfo.name}. All rights reserved.
                            </p>
                            <p className="mt-2 text-xs sm:text-sm text-gray-500">
                                Proudly Kenyan 🇰🇪 • Transforming Education Since 2005
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            <style jsx global>{`
                @media (max-width: 640px) {
                    .text-7xl { font-size: 3rem; }
                    .text-6xl { font-size: 2.5rem; }
                    .text-5xl { font-size: 2rem; }
                }
                
                /* Smooth scrolling */
                html {
                    scroll-behavior: smooth;
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 10px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
                    border-radius: 5px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #2563eb, #7c3aed);
                }
            `}</style>
        </>
    );
}