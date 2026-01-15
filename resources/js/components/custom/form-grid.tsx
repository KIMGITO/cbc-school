import { cn } from '@/lib/utils';
import React from 'react';

export interface FormGridProps {
    children: React.ReactNode;
    cols?: 1 | 2 | 3 | 4 | 6;
    responsive?: boolean;
    gap?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
    align?: 'start' | 'center' | 'end' | 'stretch';
}

const FormGrid: React.FC<FormGridProps> = ({
    children,
    cols = 1,
    responsive = true,
    gap = 'lg',
    className,
    align = 'stretch',
}) => {
    const gapClasses = {
        none: 'gap-0',
        sm: 'gap-3',
        md: 'gap-4',
        lg: 'gap-6',
    };

    const colClasses = {
        1: 'grid-cols-1',
        2: responsive ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2',
        3: responsive
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-3',
        4: responsive
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-4',
        6: responsive
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
            : 'grid-cols-6',
    };

    const alignClasses = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
    };

    return (
        <div
            className={cn(
                'grid my-4',
                colClasses[cols],
                gapClasses[gap],
                alignClasses[align],
                className,
            )}
        >
            {children}
        </div>
    );
};

export default FormGrid;
