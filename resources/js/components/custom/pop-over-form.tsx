'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface PopoverFormProps {
    // Dialog state
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;

    // Title and icon
    title: string;
    icon?: LucideIcon;

    // Form state
    loading?: boolean;
    errors?: {
        _general?: string;
        [key: string]: string | undefined;
    };

    // Actions
    onCancel?: () => void;
    onSubmit?: () => void;
    submitLabel?: string;
    cancelLabel?: string;

    // Children
    children: ReactNode;

    // Additional props
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showFooter?: boolean;
}

export default function PopoverForm({
    isOpen,
    onOpenChange,
    title,
    icon: Icon,
    loading = false,
    errors = {},
    onCancel,
    onSubmit,
    submitLabel = 'Save',
    cancelLabel = 'Cancel',
    children,
    size = 'md',
    showFooter = true,
}: PopoverFormProps) {
    // Size classes
    const sizeClasses = {
        sm: 'sm:max-w-[400px]',
        md: 'sm:max-w-[500px]',
        lg: 'sm:max-w-[600px]',
        xl: 'sm:max-w-[800px]',
    };

    // Handle cancel
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        onOpenChange(false);
    };

    // Handle submit
    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className={sizeClasses[size]}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary">
                        {Icon && <Icon className="h-5 w-5" />}
                        {title}
                    </DialogTitle>
                </DialogHeader>

                {/* Display general errors */}
                {errors._general && (
                    <div className="mb-4 rounded-md bg-red-50 p-4">
                        <InputError message={errors._general} />
                    </div>
                )}

                {/* Form content */}
                <div className="grid gap-4 py-4">{children}</div>

                {/* Footer with actions */}
                {showFooter && (
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                            type="button"
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            type="button"
                        >
                            {loading ? 'Saving...' : submitLabel}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
