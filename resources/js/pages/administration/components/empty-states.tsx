'use client';

import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-4">
                <Icon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {title}
            </h3>
            <p className="mt-2 max-w-sm text-gray-600">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction} className="mt-6">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
