'use client';

import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FormFieldConfig {
    name: string;
    label: string;
    type?: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox';
    required?: boolean;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    cols?: number;
}

interface CrudFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    fields: FormFieldConfig[][];
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    loading?: boolean;
    submitLabel?: string;
}

export default function CrudFormModal({
    isOpen,
    onClose,
    title,
    description,
    fields,
    initialData = {},
    onSubmit,
    loading = false,
    submitLabel = 'Save',
}: CrudFormModalProps) {
    const [formData, setFormData] = useState<any>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData);
            setErrors({});
        }
    }, [isOpen, initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        const newErrors: Record<string, string> = {};
        fields.flat().forEach((field) => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        await onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>{title}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-6 w-6"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {fields.map((fieldGroup, groupIndex) => (
                        <FormSection
                            key={groupIndex}
                            title={groupIndex === 0 ? '' : undefined}
                            border={false}
                            spacing="md"
                        >
                            <FormGrid cols={fieldGroup[0]?.cols || 2} gap="md">
                                {fieldGroup.map((field) => (
                                    <FormField
                                        key={field.name}
                                        name={field.name}
                                        label={field.label}
                                        type={field.type || 'text'}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        required={field.required}
                                        placeholder={field.placeholder}
                                        options={field.options}
                                        error={errors[field.name]}
                                    />
                                ))}
                            </FormGrid>
                        </FormSection>
                    ))}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="min-w-[100px]"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Saving...
                                </div>
                            ) : (
                                submitLabel
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
