import { cn } from '@/lib/utils';
import { LucideIcon, ZapIcon } from 'lucide-react';
import React from 'react';

export interface FormSectionProps {
    title?: string;
    Icon?: {
        icon: LucideIcon;
        color?: string;
    };

    description?: string;
    children: React.ReactNode;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    contentClassName?: string;
    border?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const FormSection: React.FC<FormSectionProps> = ({
    title,
    Icon = {
        color: 'green-500',
    },
    description,
    children,
    className,
    titleClassName,
    descriptionClassName,
    contentClassName,
    border = true,
    padding = 'md',
    spacing = 'md',
}) => {
    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    const spacingClasses = {
        none: 'space-y-0',
        sm: 'space-y-2',
        md: 'space-y-4',
        lg: 'space-y-6',
    };

    return (
        <div
            className={cn(
                border && 'rounded-lg border border-gray-200',
                paddingClasses[padding],
                className,
            )}
        >
            <div className={cn('space-y-3', spacingClasses[spacing])}>
                {(title || description) && (
                    <div className="space-y-1">
                        {title && (
                            <h3
                                className={cn(
                                    'flex gap-2 text-lg font-semibold',
                                    
                                    titleClassName,
                                )}
                            >
                                {Icon.icon && (
                                    <Icon.icon
                                        className={`text-${Icon.color}`}
                                    />
                                )}{' '}
                                {title}
                            </h3>
                        )}
                        {description && (
                            <p
                                className={cn(
                                    'text-sm text-gray-600 dark:text-gray-400',
                                    descriptionClassName,
                                )}
                            >
                                {description}
                            </p>
                        )}
                    </div>
                )}

                <div className={cn(contentClassName)}>{children}</div>
            </div>
        </div>
    );
};

export default FormSection;
