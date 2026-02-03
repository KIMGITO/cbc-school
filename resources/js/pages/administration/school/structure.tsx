'use client';

import LoadingSpinner from '@/components/custom/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
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
import { useEffect, useState } from 'react';
import ConfigurationCard from '../components/configuration-card';
import ConfigurationHeader from '../components/configuration-header';
import EmptyState from '../components/empty-states';
import LevelsTab from './tabs/levels-tab';
import StreamsTab from './tabs/streams-tab';
import DepartmentsTab from './tabs/departments-tab';
import CoursesTab from './tabs/subjects-tab';

// Type definitions
interface Level {
    id: string;
    name: string;
    code: string;
    description?: string;
    active: boolean;
    order?: number;
    created_at?: string;
    updated_at?: string;
}

interface Stream {
    id: string;
    name: string;
    code: string;
    level_id?: string;
    capacity?: number;
    active: boolean;
    created_at?: string;
    updated_at?: string;
}

interface Department {
    id: string;
    name: string;
    code: string;
    description?: string;
    active: boolean;
    created_at?: string;
    updated_at?: string;
}

interface ConfigurationData {
    streams: Stream[];
    levels: Level[];
    departments: Department[];
    terms: any[];
    courses: any[];
    houses: any[];
    notifications: any[];
    roles: any[];
    fees: any[];
    exams: any[];
    grading: any[];
    academicYears: any[];
}

interface ConfigurationSection {
    label: string;
    value: keyof ConfigurationData;
    icon: React.ComponentType<any>;
    component: React.ComponentType<any> | null;
    description: string;
    color: string;
}

export default function ConfigurationAdmin({
    initialData,
}: {
    initialData?: Partial<ConfigurationData>;
}) {

    // Define sections
    const sections: ConfigurationSection[] = [
        {
            label: 'Academic Levels',
            value: 'levels',
            icon: Layers,
            component: LevelsTab,
            description: 'Manage Classes/Grades',
            color: 'bg-blue-500',
        },
        {
            label: 'Streams',
            value: 'streams',
            icon: BookOpen,
            component: StreamsTab,
            description: 'Class subdivisions',
            color: 'bg-green-500',
        },
        {
            label: 'Departments',
            value: 'departments',
            icon: Building,
            component: DepartmentsTab,
            description: 'School departments',
            color: 'bg-indigo-500',
        },
        {
            label: 'Learning Areas',
            value: 'courses',
            icon: GraduationCap,
            component: CoursesTab,
            description: 'Curriculum subjects',
            color: 'bg-purple-500',
        },
        {
            label: 'Academic Years',
            value: 'academicYears',
            icon: CalendarDays,
            component: null,
            description: 'School years',
            color: 'bg-orange-500',
        },
        {
            label: 'Terms/Semesters',
            value: 'terms',
            icon: Calendar,
            component: null,
            description: 'Term/semester management',
            color: 'bg-yellow-500',
        },

        {
            label: 'Houses',
            value: 'houses',
            icon: Users,
            component: null,
            description: 'Student house system',
            color: 'bg-pink-500',
        },
        {
            label: 'Fee Structure',
            value: 'fees',
            icon: DollarSign,
            component: null,
            description: 'Fee categories & amounts',
            color: 'bg-emerald-500',
        },
        {
            label: 'Exams & Tests',
            value: 'exams',
            icon: Notebook,
            component: null,
            description: 'Examination types',
            color: 'bg-red-500',
        },
        {
            label: 'Grading System',
            value: 'grading',
            icon: BarChart3,
            component: null,
            description: 'Grade scales & points',
            color: 'bg-cyan-500',
        },
        {
            label: 'User Roles',
            value: 'roles',
            icon: Shield,
            component: null,
            description: 'System permissions',
            color: 'bg-gray-500',
        },
        {
            label: 'Notifications',
            value: 'notifications',
            icon: Bell,
            component: null,
            description: 'System alerts',
            color: 'bg-amber-500',
        },
    ];

    // State management
    const [activeTab, setActiveTab] =
        useState<keyof ConfigurationData>('levels');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Initialize data with proper empty arrays
    const [loadedData, setLoadedData] = useState<ConfigurationData>(() => {
        const defaultData: ConfigurationData = {
            streams: [],
            levels: [],
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
        };

        // Merge initial data, ensuring arrays
        if (initialData) {
            Object.keys(defaultData).forEach((key) => {
                const typedKey = key as keyof ConfigurationData;
                if (Array.isArray(initialData[typedKey])) {
                    defaultData[typedKey] = initialData[typedKey] as any;
                }
            });
        }

        return defaultData;
    });

    // Track which tabs have been loaded
    const [loadedTabs, setLoadedTabs] = useState<Set<keyof ConfigurationData>>(
        () => {
            const tabs = new Set<keyof ConfigurationData>();
            if (initialData) {
                Object.keys(initialData).forEach((key) => {
                    const typedKey = key as keyof ConfigurationData;
                    if (
                        Array.isArray(initialData[typedKey]) &&
                        initialData[typedKey]!.length > 0
                    ) {
                        tabs.add(typedKey);
                    }
                });
            }
            return tabs;
        },
    );

    // Get active component
    const ActiveComponent = sections.find(
        (section) => section.value === activeTab,
    )?.component;

    // Helper function to safely get data
    const getSafeData = <K extends keyof ConfigurationData>(
        tab: K,
    ): ConfigurationData[K] => {
        const data = loadedData[tab];
        return Array.isArray(data) ? data : [];
    };

    // Load tab data
    const loadTabData = async (tab: keyof ConfigurationData) => {
        // Skip if already loaded
        if (loadedTabs.has(tab) && getSafeData(tab).length > 0) {
            return;
        }

        setIsLoading(true);

        // collect data async on tab
        try {
            const response = await fetch(`/system/config/${tab}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to load ${tab}`);
            }

            const result = await response.json();

            // Extract data from response - handle different response formats
            let dataArray: any[] = [];

            if (Array.isArray(result)) {
                dataArray = result;
            } else if (result && typeof result === 'object') {
                if (Array.isArray(result.data)) {
                    dataArray = result.data;
                } else if (Array.isArray(result[tab])) {
                    dataArray = result[tab];
                } else if (result.success && Array.isArray(result.data)) {
                    dataArray = result.data;
                }
            }

            if (Array.isArray(dataArray)) {
                // Update data
                setLoadedData((prev) => ({
                    ...prev,
                    [tab]: dataArray,
                }));

                // Mark tab as loaded
                setLoadedTabs((prev) => new Set([...prev, tab]));
            } else {
                console.warn(
                    `No array data found for ${tab} in response:`,
                    result,
                );
            }
        } catch (error) {
            console.error(`Error loading ${tab}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle tab change
    const handleTabChange = (tab: keyof ConfigurationData) => {
        setActiveTab(tab);
        loadTabData(tab);
    };

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await loadTabData(activeTab);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Handle data updates from child components
    const handleDataUpdate = (
        type: keyof ConfigurationData,
        newData: any[],
    ) => {
        setLoadedData((prev) => ({
            ...prev,
            [type]: [...newData], // Create new array reference
        }));
    };

    // Load initial tab data on mount
    useEffect(() => {
        if (!loadedTabs.has('levels') || getSafeData('levels').length === 0) {
            loadTabData('levels');
        }
    }, []);

    
    // Helper functions for stats
    const getTotalConfigurations = (): number => {
        return sections.reduce((total, section) => {
            const data = getSafeData(section.value);
            return total + (Array.isArray(data) ? data.length : 0);
        }, 0);
    };

    const getActiveCount = <K extends keyof ConfigurationData>(
        tab: K,
    ): number => {
        const data = getSafeData(tab);
        if (!Array.isArray(data)) return 0;

        return data.filter((item) => {
            if (!item || typeof item !== 'object') return false;
            const active = item.active;
            return active === true || active === 'true' || active === 1;
        }).length;
    };

    // Render content based on current state
    const renderContent = () => {
        const currentData = getSafeData(activeTab);
        const isTabLoaded = loadedTabs.has(activeTab);
        const hasData = true;


        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-500">
                        Loading{' '}
                        {sections.find((s) => s.value === activeTab)?.label}...
                    </p>
                </div>
            );
        }

        if (!isTabLoaded || !hasData) {
            return (
                <EmptyState
                    icon={
                        sections.find((s) => s.value === activeTab)?.icon ||
                        Settings
                    }
                    title={isTabLoaded ? 'No Data Found' : 'Data Not Loaded'}
                    description={
                        isTabLoaded
                            ? `No ${sections.find((s) => s.value === activeTab)?.label?.toLowerCase()} found`
                            : `Click "Load Data" to load ${sections.find((s) => s.value === activeTab)?.label?.toLowerCase()}`
                    }
                    actionLabel={isTabLoaded ? 'Create New' : 'Load Data'}
                    onAction={() => {
                        if (isTabLoaded) {
                            // Handle create new - this would need to be implemented
                            renderContent()
                        } else {
                            loadTabData(activeTab);
                        }
                    }}
                />
            );
        }

        if (ActiveComponent) {
            return (
                <ActiveComponent
                    key={`${activeTab}-${currentData.length}-${Date.now()}`}
                    data={currentData}
                    onDataUpdate={handleDataUpdate}
                    onRefresh={handleRefresh}
                />
            );
        }

        return (
            <div className="py-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    {sections.find((s) => s.value === activeTab)?.label}
                </h3>
                <p className="mt-2 text-gray-600">
                    This configuration section is under development.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                    Total items: {currentData.length}
                </p>
            </div>
        );
    };

    return (
        <AppLayout>
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <ConfigurationHeader
                    title="School Configuration"
                    description="Manage all system configurations in one place"
                    loading={isLoading || isRefreshing}
                    onRefresh={handleRefresh}
                />

                {/* Tabs */}
                <div className="relative">
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex space-x-2 pb-4">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeTab === section.value;
                                const data = getSafeData(section.value);
                                const count = Array.isArray(data)
                                    ? data.length
                                    : 0;

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

                {/* Main Content */}
                <div className="mt-2">
                    <Card className="w-full border shadow-lg">
                        <CardContent className="p-6">
                            {renderContent()}
                        </CardContent>
                    </Card>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <ConfigurationCard
                        title="Total Configurations"
                        value={getTotalConfigurations()}
                        icon={Settings}
                        description="Active configurations"
                        trend="up"
                    />
                    <ConfigurationCard
                        title="Active Levels"
                        value={getActiveCount('levels')}
                        icon={Layers}
                        description="Currently active"
                        color="blue"
                    />
                    <ConfigurationCard
                        title="Active Streams"
                        value={getActiveCount('streams')}
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
