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
import { useState, useEffect } from 'react';

interface CoursesTabProps {
    data: any[];
    onDataUpdate: (type: 'courses', data: any[]) => void;
    onRefresh: () => void;
}

interface FormErrors {
    name?: string;
    code?: string;
    description?: string;
    department_id?: string;
    [key: string]: string | undefined;
}

interface Department {
    id: string;
    name: string;
    code: string;
}

export default function CoursesTab({
    data,
    onDataUpdate,
    onRefresh,
}: CoursesTabProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        department_id: '',
        active: true,
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);

    // Fetch departments on component mount
    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setLoadingDepartments(true);
        try {
            const response = await axios.get('/system/config/departments?active=true');
            setDepartments(response.data.data || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
        } finally {
            setLoadingDepartments(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        // Clear error for this field when user starts typing
        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: undefined }));
        }

        if (editingCourse) {
            setEditingCourse((prev) => ({ ...prev, [field]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleEdit = (course: any) => {
        setEditingCourse(course);
        setFormErrors({});
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingCourse(null);
        setFormErrors({});
        setFormData({
            name: '',
            code: '',
            description: '',
            department_id: '',
            active: true,
        });
        setIsDialogOpen(true);
    };

    const validateForm = () => {
        const errors: FormErrors = {};
        const currentData = editingCourse || formData;

        if (!currentData.name?.trim()) {
            errors.name = 'Course name is required';
        }

        if (!currentData.code?.trim()) {
            errors.code = 'Course code is required';
        }

        if (!currentData.department_id) {
            errors.department_id = 'Please select a department';
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
            if (editingCourse) {
                // Update existing course
                const response = await axios.put(
                    `/system/config/courses/${editingCourse.id}`,
                    editingCourse,
                );
                onDataUpdate(
                    'courses',
                    data.map((c) =>
                        c.id === editingCourse.id ? response.data.data : c,
                    ),
                );
            } else {
                // Create new course
                const response = await axios.post(
                    '/system/config/courses',
                    formData,
                );
                onDataUpdate('courses', [...data, response.data.data]);
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
                console.error('Error saving course:', error);
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
        if (!confirm('Are you sure you want to delete this course?'))
            return;

        setLoading(true);
        try {
            await axios.delete(`/system/config/courses/${id}`);
            onDataUpdate(
                'courses',
                data.filter((c) => c.id !== id),
            );
        } catch (error: any) {
            console.error('Error deleting course:', error);
            alert(
                error.response?.data?.message || 'Failed to delete course',
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (course: any) => {
        setLoading(true);
        try {
            const newActive = !course.active;
            const response = await axios.patch(
                `/system/config/courses/${course.id}/status`,
                {
                    active: newActive,
                },
            );

            if (response.status == 200) {
                onDataUpdate(
                    'courses',
                    data.map((c) =>
                        c.id === course.id
                            ? { ...c, active: response.data.data.active }
                            : c,
                    ),
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // Get department name by ID
    const getDepartmentName = (departmentId: string) => {
        const department = departments.find(d => d.id === departmentId);
        return department ? department.name : 'N/A';
    };

    // Get department code by ID
    const getDepartmentCode = (departmentId: string) => {
        const department = departments.find(d => d.id === departmentId);
        return department ? department.code : 'N/A';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                        Course Management
                    </h2>
                    <p className="text-gray-600">Manage academic courses</p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    Add New Course
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Course Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.length > 0 ? (
                            data.map((course, index) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium">
                                        {course.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {course.code}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                        {course.description}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span>{getDepartmentName(course.department_id)}</span>
                                            <Badge variant="secondary" className="w-fit">
                                                {getDepartmentCode(course.department_id)}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                course.active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                toggleStatus(course)
                                            }
                                        >
                                            {course.active ? (
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                            ) : (
                                                <XCircle className="mr-1 h-3 w-3" />
                                            )}
                                            {course.active
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
                                                    handleEdit(course)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(course.id)
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
                                    No courses found. Click "Add New Course" to create one.
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
                            {editingCourse
                                ? 'Edit Course'
                                : 'Create New Course'}
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
                            title="Course Information"
                            description="Enter the basic details for the course"
                            border={false}
                            spacing="md"
                        >
                            <FormGrid cols={2} gap="md">
                                <FormField
                                    error={formErrors.name}
                                    name="name"
                                    label="Course Name"
                                    value={
                                        editingCourse?.name || formData.name
                                    }
                                    onChange={handleInputChange}
                                    required={true}
                                    placeholder="e.g., Introduction to Programming"
                                    containerClassName="space-y-2"
                                />

                                <FormField
                                    error={formErrors.code}
                                    name="code"
                                    label="Course Code"
                                    value={
                                        editingCourse?.code || formData.code
                                    }
                                    onChange={handleInputChange}
                                    required={true}
                                    placeholder="e.g., CS101"
                                    containerClassName="space-y-2"
                                />
                            </FormGrid>

                            <FormField
                                type="select"
                                error={formErrors.department_id}
                                name="department_id"
                                label="Department"
                                value={
                                    editingCourse?.department_id || formData.department_id
                                }
                                onChange={handleInputChange}
                                required={true}
                                options={departments.map(dept => ({
                                    value: dept.id,
                                    label: `${dept.name} (${dept.code})`
                                }))}
                                placeholder="Select a department"
                                loading={loadingDepartments}
                                containerClassName="space-y-2"
                            />

                            <FormField
                                error={formErrors.description}
                                name="description"
                                label="Description"
                                type="textarea"
                                value={
                                    editingCourse?.description ||
                                    formData.description
                                }
                                onChange={handleInputChange}
                                placeholder="Optional description for this course"
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
                                : editingCourse
                                  ? 'Update'
                                  : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}