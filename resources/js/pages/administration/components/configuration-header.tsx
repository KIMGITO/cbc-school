'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw, Settings } from 'lucide-react';

interface ConfigurationHeaderProps {
    title: string;
    description: string;
    loading: boolean;
    onRefresh: () => void;
    children?: React.ReactNode;
}

export default function ConfigurationHeader({
    title,
    description,
    loading,
    onRefresh,
    children,
}: ConfigurationHeaderProps) {
    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                    <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {title}
                    </h1>
                    <p className="text-gray-600">{description}</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    onClick={onRefresh}
                    disabled={loading}
                    className="gap-2"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                    />
                    Refresh
                </Button>
                {children}
            </div>
        </div>
    );
}
