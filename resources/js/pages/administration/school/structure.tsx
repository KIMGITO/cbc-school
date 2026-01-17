'use client';

import LoadingSpinner from '@/components/custom/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import {
    BarChart3,
    Bell,
    BookOpen,
    Building,
    Calendar,
    CalendarDays,
    DollarSign,
    GraduationCap,
    Layers,
    Notebook,
    Settings,
    Shield,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import ConfigurationCard from '../components/configuration-card';
import ConfigurationHeader from '../components/configuration-header';
import EmptyState from '../components/empty-states';
import LevelsTab from './tabs/levels-tab';
import StreamsTab from './tabs/streams-tab';

interface ConfigurationData {
    streams: [];
    levels: [];
    terms: [];
    subjects: [];
    houses: [];
    notifications: [];
    departments: [];
    roles: [];
    fees: [];
    exams: [];
    grading: [];
    academicYears: [];
}

export default function ConfigurationAdmin({
    initialData,
}: {
    initialData?: Partial<ConfigurationData>;
    }) {
    console.log('Initial data', initialData)
    const sections = [
        {
            label: 'Academic Levels',
            value: 'levels',
            icon: Layers,
            component: LevelsTab,
            description: 'Manage Classes/Grades',
            color: 'bg-blue-500',
            count: initialData?.levels?.length || 0,
        },
        {
            label: 'Streams',
            value: 'streams',
            icon: BookOpen,
            component: StreamsTab,
            description: 'Class subdivisions',
            color: 'bg-green-500',
            count: initialData?.streams?.length || 0,
        },
        {
            label: 'Subjects',
            value: 'subjects',
            icon: GraduationCap,
            component: null,
            description: 'Curriculum subjects',
            color: 'bg-purple-500',
            count: initialData?.subjects?.length || 0,
        },
        {
            label: 'Academic Years',
            value: 'academic-years',
            icon: CalendarDays,
            component: null,
            description: 'School years',
            color: 'bg-orange-500',
            count: initialData?.academicYears?.length || 0,
        },
        {
            label: 'Terms/Semesters',
            value: 'terms',
            icon: Calendar,
            component: null,
            description: 'Term/semester management',
            color: 'bg-yellow-500',
            count: initialData?.terms?.length || 0,
        },
        {
            label: 'Departments',
            value: 'departments',
            icon: Building,
            component: null,
            description: 'School departments',
            color: 'bg-indigo-500',
            count: initialData?.departments?.length || 0,
        },
        {
            label: 'Houses',
            value: 'houses',
            icon: Users,
            component: null,
            description: 'Student house system',
            color: 'bg-pink-500',
            count: initialData?.houses?.length || 0,
        },
        {
            label: 'Fee Structure',
            value: 'fees',
            icon: DollarSign,
            component: null,
            description: 'Fee categories & amounts',
            color: 'bg-emerald-500',
            count: initialData?.fees?.length || 0,
        },
        {
            label: 'Exams & Tests',
            value: 'exams',
            icon: Notebook,
            component: null,
            description: 'Examination types',
            color: 'bg-red-500',
            count: initialData?.exams?.length || 0,
        },
        {
            label: 'Grading System',
            value: 'grading',
            icon: BarChart3,
            component: null,
            description: 'Grade scales & points',
            color: 'bg-cyan-500',
            count: initialData?.grading?.length || 0,
        },
        {
            label: 'User Roles',
            value: 'roles',
            icon: Shield,
            component: null,
            description: 'System permissions',
            color: 'bg-gray-500',
            count: initialData?.roles?.length || 0,
        },
        {
            label: 'Notifications',
            value: 'notifications',
            icon: Bell,
            component: null,
            description: 'System alerts',
            color: 'bg-amber-500',
            count: initialData?.notifications?.length || 0,
        },
    ];

    const [activeTab, setActiveTab] = useState('levels');
    const [loading, setLoading] = useState(false);
    const [loadedData, setLoadedData] = useState<ConfigurationData>({
        streams: initialData?.streams || [],
        levels: initialData?.levels || [],
        terms: [],
        subjects: [],
        houses: [],
        notifications: [],
        departments: [],
        roles: [],
        fees: [],
        exams: [],
        grading: [],
        academicYears: [],
    });

    const [tabLoaded, setTabLoaded] = useState<Record<string, boolean>>(
        sections.reduce(
            (acc, section) => ({
                ...acc,
                [section.value]:
                    !!initialData?.[section.value as keyof ConfigurationData],
            }),
            {},
        ),
    );

    // Get the active component
    const ActiveComponent = sections.find(
        (section) => section.value === activeTab,
    )?.component;

    // Load data for a specific tab using Inertia
    const loadTabData = async (tab: string) => {
        if (tabLoaded[tab]) return;

        setLoading(true);
        try {
            console.log('data to lad');
            router.get(
                route(`system.config.${tab}.index`),
                {},
                {
                    preserveState: true,
                    onSuccess: (page) => {
                        if (page.props[tab]) {
                            setLoadedData((prev) => ({
                                ...prev,
                                [tab]: page.props[tab],
                            }));
                            setTabLoaded((prev) => ({
                                ...prev,
                                [tab]: true,
                            }));
                        }
                    },
                    onError: (errors) => {
                        console.error(`Error loading ${tab}:`, errors);
                    },
                    onFinish: () => {
                        setLoading(false);
                    },
                },
            );
        } catch (error) {
            console.error(`Error loading ${tab}:`, error);
            setLoading(false);
        }
    };


    // Handle tab change
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        loadTabData(tab);
    };

    // Refresh current tab data
    const handleRefresh = () => {
        setTabLoaded((prev) => ({
            ...prev,
            [activeTab]: false,
        }));
        loadTabData(activeTab);
    };

    // Handle data updates from child components
    const handleDataUpdate = (type: string, data: any) => {
        setLoadedData((prev) => ({
            ...prev,
            [type]: data,
        }));
    };

    return (
        <AppLayout>
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <ConfigurationHeader
                    title="School Configuration"
                    description="Manage all system configurations in one place"
                    loading={loading}
                    onRefresh={handleRefresh}
                />

                {/* Horizontal Scrollable Tabs */}
                <div className="relative">
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex space-x-2 pb-4">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeTab === section.value;
                                const isLoaded = tabLoaded[section.value];
                                const count =
                                    loadedData[
                                        section.value as keyof ConfigurationData
                                    ]?.length || 0;

                                return (
                                    <button
                                        key={section.value}
                                        onClick={() =>
                                            handleTabChange(section.value)
                                        }
                                        className={`group relative flex min-w-[160px] flex-col items-center justify-center rounded-lg border p-4 transition-all duration-200 ${
                                            isActive
                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                        } focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none`}
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <div
                                                className={`rounded-lg p-2 ${section.color} ${isActive ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                                            >
                                                <Icon className="h-5 w-5 text-white" />
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}
                                            >
                                                {count}
                                            </span>
                                        </div>
                                        <div className="mt-3 w-full text-left">
                                            <h3
                                                className={`font-semibold ${isActive ? 'text-primary' : 'text-gray-900'}`}
                                            >
                                                {section.label}
                                            </h3>
                                            <p className="mt-1 truncate text-xs text-gray-500">
                                                {section.description}
                                            </p>
                                        </div>
                                        <div
                                            className={`absolute -bottom-2 h-1 w-full rounded-full transition-all duration-200 ${isActive ? 'bg-primary' : 'bg-transparent'}`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                {/* Main Content Area */}
                <div className="mt-2">
                    <Card className="w-full border shadow-lg">
                        <CardContent className="p-6">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <LoadingSpinner size="lg" />
                                    <p className="mt-4 text-gray-500">
                                        Loading{' '}
                                        {
                                            sections.find(
                                                (s) => s.value === activeTab,
                                            )?.label
                                        }
                                        ...
                                    </p>
                                </div>
                            ) : !tabLoaded[activeTab] ? (
                                <EmptyState
                                    icon={
                                        sections.find(
                                            (s) => s.value === activeTab,
                                        )?.icon || Settings
                                    }
                                    title="No Data Loaded"
                                    description={`Click the "${sections.find((s) => s.value === activeTab)?.label}" tab to load data`}
                                    actionLabel="Load Data"
                                    onAction={() => loadTabData(activeTab)}
                                />
                            ) : ActiveComponent &&
                              loadedData[
                                  activeTab as keyof ConfigurationData
                              ] ? (
                                <ActiveComponent
                                    data={
                                        loadedData[
                                            activeTab as keyof ConfigurationData
                                        ]
                                    }
                                    onDataUpdate={handleDataUpdate}
                                    onRefresh={handleRefresh}
                                />
                            ) : (
                                <div className="py-12 text-center">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {
                                            sections.find(
                                                (s) => s.value === activeTab,
                                            )?.label
                                        }
                                    </h3>
                                    <p className="mt-2 text-gray-600">
                                        This configuration section is under
                                        development.
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Total items:{' '}
                                        {loadedData[
                                            activeTab as keyof ConfigurationData
                                        ]?.length || 0}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <ConfigurationCard
                        title="Total Configurations"
                        value={sections.reduce(
                            (sum, section) =>
                                sum +
                                (loadedData[
                                    section.value as keyof ConfigurationData
                                ]?.length || 0),
                            0,
                        )}
                        icon={Settings}
                        description="Active configurations"
                        trend="up"
                    />
                    <ConfigurationCard
                        title="Active Levels"
                        value={
                            loadedData.levels?.filter(
                                (l: any) => l.status === 'active',
                            ).length || 0
                        }
                        icon={Layers}
                        description="Currently active"
                        color="blue"
                    />
                    <ConfigurationCard
                        title="Active Streams"
                        value={
                            loadedData.streams?.filter(
                                (s: any) => s.status === 'active',
                            ).length || 0
                        }
                        icon={BookOpen}
                        description="Currently active"
                        color="green"
                    />
                    <ConfigurationCard
                        title="System Ready"
                        value="100%"
                        icon={Shield}
                        description="All systems operational"
                        color="emerald"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
