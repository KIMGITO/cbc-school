'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ConfigurationCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description: string;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export default function ConfigurationCard({
    title,
    value,
    icon: Icon,
    description,
    color = 'primary',
    trend,
}: ConfigurationCardProps) {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        indigo: 'bg-indigo-500',
        pink: 'bg-pink-500',
        emerald: 'bg-emerald-500',
        primary: 'bg-primary',
    };

    return (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">
                            {title}
                        </p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {value}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            {description}
                        </p>
                    </div>
                    <div
                        className={`rounded-lg p-3 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary}`}
                    >
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>
                {trend && (
                    <div className="mt-4 flex items-center">
                        <span
                            className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {trend === 'up' ? '↑' : '↓'} 12%
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                            from last month
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
