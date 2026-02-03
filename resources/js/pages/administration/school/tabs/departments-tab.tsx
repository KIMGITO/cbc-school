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

interface DepartmentsTabProps {
    data: any[];
    onDataUpdate: (type: 'departments', data: any[]) => void;
    onRefresh: () => void;
}

interface FormErrors {
    name?: string;
    code?: string;
    description?: string;
    [key: string]: string | undefined;
}

export default function DepartmentsTab({
    data,
    onDataUpdate,
    onRefresh,
}: DepartmentsTabProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        active: true,
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const handleInputChange = (field: string, value: any) => {
        // Clear error for this field when user starts typing
        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: undefined }));
        }

        if (editingDepartment) {
            setEditingDepartment((prev) => ({ ...prev, [field]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleEdit = (department: any) => {
        setEditingDepartment(department);
        setFormErrors({});
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingDepartment(null);
        setFormErrors({});
        setFormData({
            name: '',
            code: '',
            description: '',
            active: true,
        });
        setIsDialogOpen(true);
    };

    const validateForm = () => {
        const errors: FormErrors = {};
        const currentData = editingDepartment || formData;

        if (!currentData.name?.trim()) {
            errors.name = 'Department name is required';
        }

        if (!currentData.code?.trim()) {
            errors.code = 'Department code is required';
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
            if (editingDepartment) {
                // Update existing department
                const response = await axios.put(
                    `/system/config/departments/${editingDepartment.id}`,
                    editingDepartment,
                );
                onDataUpdate(
                    'departments',
                    data.map((d) =>
                        d.id === editingDepartment.id ? response.data.data : d,
                    ),
                );
            } else {
                // Create new department
                const response = await axios.post(
                    '/system/config/departments',
                    formData,
                );

                onDataUpdate('departments', [...data, response.data.data]);
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
                console.error('Error saving department:', error);
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
        if (!confirm('Are you sure you want to delete this department?'))
            return;

        setLoading(true);
        try {
            await axios.delete(`/system/config/departments/${id}`);
            onDataUpdate(
                'departments',
                data.filter((d) => d.id !== id),
            );
        } catch (error: any) {
            console.error('Error deleting department:', error);
            alert(
                error.response?.data?.message || 'Failed to delete department',
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (department: any) => {
        setLoading(true);
        try {
            const newActive = !department.active;
            const response = await axios.patch(
                `/system/config/departments/${department.id}/status`,
                {
                    active: newActive,
                },
            );

            if (response.status == 200) {
                onDataUpdate(
                    'departments',
                    data.map((d) =>
                        d.id === department.id
                            ? { ...d, active: response.data.data.active }
                            : d,
                    ),
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                        Department Management
                    </h2>
                    <p className="text-gray-600">Manage academic departments</p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    Add New Department
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.length > 0 ? (
                            data.map((department, index) => (
                                <TableRow key={department.id}>
                                    <TableCell className="font-medium">
                                        {department.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {department.code}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                        {department.description}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                department.active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                toggleStatus(department)
                                            }
                                        >
                                            {department.active ? (
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                            ) : (
                                                <XCircle className="mr-1 h-3 w-3" />
                                            )}
                                            {department.active
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
                                                    handleEdit(department)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(department.id)
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
                                    colSpan={5}
                                    className="py-8 text-center text-gray-500"
                                >
                                    No departments found. Click "Add New
                                    Department" to create one.
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
                            {editingDepartment
                                ? 'Edit Department'
                                : 'Create New Department'}
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
                            title="Department Information"
                            description="Enter the basic details for the department"
                            border={false}
                            spacing="md"
                        >
                            <FormGrid cols={2} gap="md">
                                <FormField
                                    error={formErrors.name}
                                    name="name"
                                    label="Department Name"
                                    value={
                                        editingDepartment?.name || formData.name
                                    }
                                    onChange={handleInputChange}
                                    required={true}
                                    placeholder="e.g., Mathematics"
                                    containerClassName="space-y-2"
                                />

                                <FormField
                                    error={formErrors.code}
                                    name="code"
                                    label="Department Code"
                                    value={
                                        editingDepartment?.code || formData.code
                                    }
                                    onChange={handleInputChange}
                                    required={true}
                                    placeholder="e.g., MATH"
                                    containerClassName="space-y-2"
                                />
                            </FormGrid>

                            <FormField
                                error={formErrors.description}
                                name="description"
                                label="Description"
                                type="textarea"
                                value={
                                    editingDepartment?.description ||
                                    formData.description
                                }
                                onChange={handleInputChange}
                                placeholder="Optional description for this department"
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
                                : editingDepartment
                                  ? 'Update'
                                  : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
