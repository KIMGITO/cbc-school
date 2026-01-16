'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { BookOpen, Layers, Plus, Settings } from 'lucide-react';
import { useState } from 'react';
import LevelsTab from './tabs/levels-tab';
import StreamsTab from './tabs/streams-tab';

interface ConfigurationData {
    streams: Stream[];
    levels: Level[];
}

interface Stream {
    id: string;
    name: string;
    code: string;
    level_id: string;
    capacity: number;
    status: 'active' | 'inactive';
    created_at: string;
}

interface Level {
    id: string;
    name: string;
    code: string;
    description: string;
    order: number;
    status: 'active' | 'inactive';
    created_at: string;
}

export default function ConfigurationAdmin() {
    const sections = [
        {
            label: 'Streams',
            value: 'streams',
            icon: BookOpen,
            component: StreamsTab,
        },
        {
            label: 'Levels',
            value: 'levels',
            icon: Layers,
            component: LevelsTab,
        },
    ];

    const [activeTab, setActiveTab] = useState('streams');
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    // Store loaded data separately for each tab
    const [loadedData, setLoadedData] = useState<{
        streams: Stream[] | null;
        levels: Level[] | null;
    }>({
        streams: null,
        levels: null,
    });

    const [tabLoaded, setTabLoaded] = useState({
        streams: false,
        levels: false,
    });

    // Get the active component
    const ActiveComponent = sections.find(
        (section) => section.value === activeTab,
    )?.component;

    // Load data for a specific tab
    const loadTabData = async (tab: string) => {
        if (tabLoaded[tab as keyof typeof tabLoaded]) return;

        setLoading(true);
        try {
            const response = await axios.get(`/api/admin/configuration/${tab}`);

            setLoadedData((prev) => ({
                ...prev,
                [tab]: response.data.data,
            }));

            setTabLoaded((prev) => ({
                ...prev,
                [tab]: true,
            }));
        } catch (error) {
            console.error(`Error loading ${tab}:`, error);
        } finally {
            setLoading(false);
            setInitialLoad(false);
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
    const handleDataUpdate = (type: 'streams' | 'levels', data: any[]) => {
        setLoadedData((prev) => ({
            ...prev,
            [type]: data,
        }));
    };

    return (
        <AppLayout>
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Settings className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">
                                Configuration Management
                            </h1>
                            <p className="text-gray-600">
                                Manage streams, levels, and other system
                                configurations
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add New
                        </Button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-2">
                        {sections.map((section, index) => {
                            const Icon = section.icon;
                            const isActive = activeTab === section.value;
                            const isLoaded =
                                tabLoaded[
                                    section.value as keyof typeof tabLoaded
                                ];

                            return (
                                <Card
                                    key={section.value}
                                    className={`w-full min-w-[200px] cursor-pointer transition-all duration-200 hover:shadow-md ${
                                        isActive
                                            ? 'border-primary shadow-sm'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        handleTabChange(section.value)
                                    }
                                >
                                    <CardContent className="p-4">
                                        <CardTitle className="flex items-center text-lg">
                                            <Badge
                                                className={`me-3 rounded-full shadow ${
                                                    isActive
                                                        ? 'bg-primary'
                                                        : 'bg-gray-200 text-gray-700'
                                                }`}
                                            >
                                                <Icon className="h-3 w-3" />
                                            </Badge>
                                            <div className="flex flex-col">
                                                <span
                                                    className={
                                                        isActive
                                                            ? 'text-primary'
                                                            : 'text-gray-600'
                                                    }
                                                >
                                                    {section.label}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {isLoaded
                                                        ? `${loadedData[section.value as keyof typeof loadedData]?.length || 0} items`
                                                        : 'Click to load'}
                                                </span>
                                            </div>
                                        </CardTitle>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Main Content Area */}
                <div className="mt-2">
                    <Card className="w-full border-t-4 border-t-primary shadow-lg">
                        <CardContent className="p-6">
                            {initialLoad &&
                            !tabLoaded[activeTab as keyof typeof tabLoaded] ? (
                                <div className="flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <p className="text-gray-500">
                                            Click on a tab to load data
                                        </p>
                                    </div>
                                </div>
                            ) : loading ? (
                                <div className="flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                        <p className="text-gray-500">
                                            Loading {activeTab}...
                                        </p>
                                    </div>
                                </div>
                            ) : ActiveComponent &&
                              loadedData[
                                  activeTab as keyof typeof loadedData
                              ] ? (
                                <ActiveComponent
                                    data={
                                        loadedData[
                                            activeTab as keyof typeof loadedData
                                        ]
                                    }
                                    onDataUpdate={handleDataUpdate}
                                    onRefresh={handleRefresh}
                                />
                            ) : null}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
