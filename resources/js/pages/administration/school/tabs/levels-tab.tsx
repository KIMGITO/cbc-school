'use client';

import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import { CheckCircle, Edit, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface LevelsTabProps {
    data: any[];
    onDataUpdate: (type: 'levels', data: any[]) => void;
    onRefresh: () => void;
}

interface FormErrors {
    name?: string;
    code?: string;
    description?: string;
    order?: string;
    [key: string]: string | undefined;
}

export default function LevelsTab({
    data,
    onDataUpdate,
    onRefresh,
}: LevelsTabProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLevel, setEditingLevel] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        order: 0,
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const handleInputChange = (field: string, value: any) => {
        // Clear error for this field when user starts typing
        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: undefined }));
        }

        if (editingLevel) {
            setEditingLevel((prev) => ({ ...prev, [field]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleEdit = (level: any) => {
        setEditingLevel(level);
        setFormErrors({});
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingLevel(null);
        setFormErrors({});
        setFormData({
            name: '',
            code: '',
            description: '',
            order: data.length + 1,
        });
        setIsDialogOpen(true);
    };

    const validateForm = () => {
        const errors: FormErrors = {};
        const currentData = editingLevel || formData;

        if (!currentData.name?.trim()) {
            errors.name = 'Level name is required';
        }

        if (!currentData.code?.trim()) {
            errors.code = 'Level code is required';
        } else if (currentData.code.length > 10) {
            errors.code = 'Code must be less than 10 characters';
        }

        if (currentData.order <= 0) {
            errors.order = 'Order must be greater than 0';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            if (editingLevel) {
                // Update existing level
                const response = await axios.put(
                    `/api/admin/configuration/levels/${editingLevel.id}`,
                    editingLevel,
                );
                onDataUpdate(
                    'levels',
                    data.map((l) =>
                        l.id === editingLevel.id ? response.data.data : l,
                    ),
                );
            } else {
                // Create new level
                const response = await axios.post(
                    route('system.config.level.store'),
                    formData,
                ).catch((errors) => {
                    console.log('errors')
                });
                onDataUpdate('levels', [...data, response.data.data]);
            }
            setIsDialogOpen(false);
            setFormErrors({});
            onRefresh();
        } catch (error: any) {
            if (error.response?.data?.errors) {
                // Handle server-side validation errors
                setFormErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                // Handle general error message
                setFormErrors({ _general: error.response.data.message });
            } else {
                console.error('Error saving level:', error);
                setFormErrors({
                    _general:
                        'An error occurred while saving. Please try again.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this level?')) return;

        setLoading(true);
        try {
            await axios.delete(`/api/admin/configuration/levels/${id}`);
            onDataUpdate(
                'levels',
                data.filter((l) => l.id !== id),
            );
        } catch (error: any) {
            console.error('Error deleting level:', error);
            alert(error.response?.data?.message || 'Failed to delete level');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (level: any) => {
        setLoading(true);
        try {
            const newStatus = level.status === 'active' ? 'inactive' : 'active';
            const response = await axios.patch(
                `/api/admin/configuration/levels/${level.id}/status`,
                {
                    status: newStatus,
                },
            );
            onDataUpdate(
                'levels',
                data.map((l) => (l.id === level.id ? response.data.data : l)),
            );
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setLoading(false);
        }
    };

    const moveLevelOrder = async (level: any, direction: 'up' | 'down') => {
        setLoading(true);
        try {
            const response = await axios.patch(
                `/api/admin/configuration/levels/${level.id}/order`,
                {
                    direction,
                },
            );
            onDataUpdate('levels', response.data.data);
        } catch (error) {
            console.error('Error moving level:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Level Management</h2>
                    <p className="text-gray-600">
                        Manage educational levels/forms in the system
                    </p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    Add New Level
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Level Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data &&
                            data.map((level, index) => (
                                <TableRow key={level.id}>
                                    <TableCell className="font-medium">
                                        {level.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {level.code}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                        {level.description}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                level.status === 'active'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className="cursor-pointer"
                                            onClick={() => toggleStatus(level)}
                                        >
                                            {level.status === 'active' ? (
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                            ) : (
                                                <XCircle className="mr-1 h-3 w-3" />
                                            )}
                                            {level.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleEdit(level)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(level.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingLevel ? 'Edit Level' : 'Create New Level'}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Display general errors */}
                    {formErrors._general && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <InputError message={formErrors._general} />
                        </div>
                    )}

                    <div className="grid gap-4 py-4">
                        <FormSection
                            title="Level Information"
                            description="Enter the basic details for the level"
                            border={false}
                            spacing="md"
                        >
                            <FormGrid cols={2} gap="md">
                                <FormField
                                    error={formErrors.name}
                                    name="name"
                                    label="Level Name"
                                    value={editingLevel?.name || formData.name}
                                    onChange={handleInputChange}
                                    required={true}
                                    placeholder="e.g., Form 1"
                                    containerClassName="space-y-2"
                                />

                                <FormField
                                    error={formErrors.code}
                                    name="code"
                                    label="Level Code"
                                    value={editingLevel?.code || formData.code}
                                    onChange={handleInputChange}
                                    required={true}
                                    placeholder="e.g., F1"
                                    containerClassName="space-y-2"
                                />
                            </FormGrid>

                            <FormField
                                error={formErrors.order}
                                name="order"
                                label="Display Order"
                                type="number"
                                value={editingLevel?.order || formData.order}
                                onChange={handleInputChange}
                                required={true}
                                placeholder="Enter order number"
                                containerClassName="space-y-2"
                                inputClassName="w-full"
                            />

                            <FormField
                                error={formErrors.description}
                                name="description"
                                label="Description"
                                type="textarea"
                                value={
                                    editingLevel?.description ||
                                    formData.description
                                }
                                onChange={handleInputChange}
                                placeholder="Optional description for this level"
                                rows={3}
                                containerClassName="space-y-2"
                            />
                        </FormSection>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setFormErrors({});
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading
                                ? 'Saving...'
                                : editingLevel
                                  ? 'Update'
                                  : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
