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

interface YearTabProps {
    data: any[];
    onDataUpdate: (type: 'years', data: any[]) => void;
    onRefresh: () => void;
}

interface FormErrors {
    name?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
    [key: string]: string | undefined;
}

export default function YearTab({
    data,
    onDataUpdate,
    onRefresh,
}: YearTabProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAcademicYear, setEditingAcademicYear] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const handleInputChange = (field: string, value: any) => {
        // Clear error for this field when user starts typing
        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: undefined }));
        }

        if (editingAcademicYear) {
            setEditingAcademicYear((prev) => ({ ...prev, [field]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleEdit = (academicYear: any) => {
        setEditingAcademicYear(academicYear);
        setFormErrors({});
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingAcademicYear(null);
        setFormErrors({});
        setFormData({
            name: '',
            start_date: '',
            end_date: '',
            description: '',
            is_active: true,
        });
        setIsDialogOpen(true);
    };

    const validateForm = () => {
        const errors: FormErrors = {};
        const currentData = editingAcademicYear || formData;

        if (!currentData.name?.trim()) {
            errors.name = 'Academic year name is required';
        }

        if (!currentData.start_date) {
            errors.start_date = 'Start date is required';
        }

        if (!currentData.end_date) {
            errors.end_date = 'End date is required';
        }

        // Validate date range
        if (currentData.start_date && currentData.end_date) {
            const start = new Date(currentData.start_date);
            const end = new Date(currentData.end_date);

            if (start >= end) {
                errors.end_date = 'End date must be after start date';
            }
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
            if (editingAcademicYear) {
                // Update existing academic year
                const response = await axios.put(
                    `/system/config/years/${editingAcademicYear.id}`,
                    editingAcademicYear,
                );
                onDataUpdate(
                    'years',
                    data.map((d) =>
                        d.id === editingAcademicYear.id
                            ? response.data.data
                            : d,
                    ),
                );
            } else {
                // Create new academic year
                const response = await axios.post(
                    '/system/config/years',
                    formData,
                );

                onDataUpdate('years', [...data, response.data.data]);
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
                console.error('Error saving academic year:', error);
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
        if (!confirm('Are you sure you want to delete this academic year?'))
            return;

        setLoading(true);
        try {
            await axios.delete(`/system/config/years/${id}`);
            onDataUpdate(
                'years',
                data.filter((d) => d.id !== id),
            );
        } catch (error: any) {
            console.error('Error deleting academic year:', error);
            alert(
                error.response?.data?.message ||
                    'Failed to delete academic year',
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (academicYear: any) => {
        setLoading(true);
        try {
            const newActive = !academicYear.is_active;
            const response = await axios.patch(
                `/system/config/years/${academicYear.id}/status`,
                {
                    is_active: newActive,
                },
            );

            if (response.status == 200) {
                onDataUpdate(
                    'years',
                    data.map((d) =>
                        d.id === academicYear.id
                            ? { ...d, is_active: response.data.data.is_active }
                            : d,
                    ),
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                        Academic Year Management
                    </h2>
                    <p className="text-gray-600">
                        Manage academic years and terms
                    </p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    Add New Academic Year
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Academic Year</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.length > 0 ? (
                            data.map((academicYear, index) => (
                                <TableRow key={academicYear.id}>
                                    <TableCell className="font-medium">
                                        {academicYear.name}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(academicYear.start_date)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(academicYear.end_date)}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                        {academicYear.description || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                academicYear.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                toggleStatus(academicYear)
                                            }
                                        >
                                            {academicYear.is_active ? (
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                            ) : (
                                                <XCircle className="mr-1 h-3 w-3" />
                                            )}
                                            {academicYear.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleEdit(academicYear)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(
                                                        academicYear.id,
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-8 text-center text-gray-500"
                                >
                                    No academic years found. Click "Add New
                                    Academic Year" to create one.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAcademicYear
                                ? 'Edit Academic Year'
                                : 'Create New Academic Year'}
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
                            title="Academic Year Information"
                            description="Enter the academic year details"
                            border={false}
                            spacing="md"
                        >
                            <FormGrid cols={1} gap="md">
                                <FormField
                                    error={formErrors.name}
                                    name="name"
                                    label="Academic Year Name"
                                    value={
                                        editingAcademicYear?.name ||
                                        formData.name
                                    }
                                    onChange={handleInputChange}
                                    required={true}
                                    placeholder="e.g., 2024-2025 Academic Year"
                                    containerClassName="space-y-2"
                                />

                                <FormGrid cols={2} gap="md">
                                    <FormField
                                        error={formErrors.start_date}
                                        name="start_date"
                                        label="Start Date"
                                        type="calendar-enhanced"
                                        value={
                                            editingAcademicYear?.start_date ||
                                            formData.start_date
                                        }
                                        onChange={handleInputChange}
                                        required={true}
                                        containerClassName="space-y-2"
                                    />

                                    <FormField
                                        error={formErrors.end_date}
                                        name="end_date"
                                        label="End Date"
                                        type="calendar-enhanced"
                                        value={
                                            editingAcademicYear?.end_date ||
                                            formData.end_date
                                        }
                                        onChange={handleInputChange}
                                        required={true}
                                        containerClassName="space-y-2"
                                    />
                                </FormGrid>

                                <FormField
                                    error={formErrors.description}
                                    name="description"
                                    label="Description"
                                    type="textarea"
                                    value={
                                        editingAcademicYear?.description ||
                                        formData.description
                                    }
                                    onChange={handleInputChange}
                                    placeholder="Optional description for this academic year"
                                    rows={3}
                                    containerClassName="space-y-2"
                                />
                            </FormGrid>
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
                                : editingAcademicYear
                                  ? 'Update'
                                  : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
