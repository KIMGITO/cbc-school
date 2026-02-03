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
import { useEffect, useState } from 'react';

interface TermsTabProps {
    data: any[];
    onDataUpdate: (type: 'terms', data: any[]) => void;
    onRefresh: () => void;
}

interface FormErrors {
    name?: string;
    number?: string;
    start_date?: string;
    end_date?: string;
    academic_year?: string;
    description?: string;
    [key: string]: string | undefined;
}

interface AcademicYear {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

export default function TermsTab({
    data,
    onDataUpdate,
    onRefresh,
}: TermsTabProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTerm, setEditingTerm] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        start_date: '',
        end_date: '',
        description: '',
        academic_year: '',
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [loadingYears, setLoadingYears] = useState(false);

    // Fetch academic years on component mount
    useEffect(() => {
        fetchAcademicYears();
    }, []);

    const fetchAcademicYears = async () => {
        setLoadingYears(true);
        try {
            const response = await axios.get(
                '/system/config/years',
            );
            setAcademicYears(response.data.data || []);
        } catch (error) {
            console.error('Error fetching academic years:', error);
        } finally {
            setLoadingYears(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        // Clear error for this field when user starts typing
        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: undefined }));
        }

        if (editingTerm) {
            setEditingTerm((prev) => ({ ...prev, [field]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleEdit = (term: any) => {
        setEditingTerm(term);
        setFormErrors({});
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingTerm(null);
        setFormErrors({});
        setFormData({
            name: '',
            number: '',
            start_date: '',
            end_date: '',
            description: '',
            academic_year: academicYears.length > 0 ? academicYears[0].id : '',
            is_active: true,
        });
        setIsDialogOpen(true);
    };

    

    const handleSubmit = async () => {

        setLoading(true);
        try {
            const submitData = editingTerm || formData;

            const processedData = {
                ...submitData,
                number: parseInt(submitData.number),
            };

            if (editingTerm) {
                // Update existing term
                const response = await axios.put(
                    `/system/config/terms/${editingTerm.id}`,
                    processedData,
                );
                onDataUpdate(
                    'terms',
                    data.map((d) =>
                        d.id === editingTerm.id ? response.data.data : d,
                    ),
                );
            } else {
                // Create new term
                const response = await axios.post(
                    '/system/config/terms',
                    processedData,
                );

                onDataUpdate('terms', [...data, response.data.data]);
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
                console.error('Error saving term:', error);
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
        if (!confirm('Are you sure you want to delete this term?')) return;

        setLoading(true);
        try {
            await axios.delete(`/system/config/terms/${id}`);
            onDataUpdate(
                'terms',
                data.filter((d) => d.id !== id),
            );
        } catch (error: any) {
            console.error('Error deleting term:', error);
            alert(error.response?.data?.message || 'Failed to delete term');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (term: any) => {
        setLoading(true);
        try {
            const newActive = !term.is_active;
            const response = await axios.patch(
                `/system/config/terms/${term.id}/status`,
                {
                    is_active: newActive,
                },
            );

            if (response.status == 200) {
                onDataUpdate(
                    'terms',
                    data.map((d) =>
                        d.id === term.id
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

    // Get academic year name by ID
    const getAcademicYearName = (academicYearId: string) => {
        const year = academicYears.find((y) => y.id === academicYearId);
        return year ? year.name : 'N/A';
    };

    // Calculate duration in weeks
    const getDurationInWeeks = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationDays = Math.ceil(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        );
        return Math.ceil(durationDays / 7);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                        Academic Terms Management
                    </h2>
                    <p className="text-gray-600">
                        Manage academic terms/semesters
                    </p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    Add New Term
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Term Name</TableHead>
                            <TableHead>Term #</TableHead>
                            <TableHead>Academic Year</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.length > 0 ? (
                            data.map((term) => (
                                <TableRow key={term.id}>
                                    <TableCell className="font-medium">
                                        {term.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="font-mono"
                                        >
                                            Term {term.number}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getAcademicYearName(
                                            term.academic_year,
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(term.start_date)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(term.end_date)}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600">
                                            {getDurationInWeeks(
                                                term.start_date,
                                                term.end_date,
                                            )}{' '}
                                            weeks
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                term.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className="cursor-pointer"
                                            onClick={() => toggleStatus(term)}
                                        >
                                            {term.is_active ? (
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                            ) : (
                                                <XCircle className="mr-1 h-3 w-3" />
                                            )}
                                            {term.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(term)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(term.id)
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
                                    colSpan={8}
                                    className="py-8 text-center text-gray-500"
                                >
                                    No terms found. Click "Add New Term" to
                                    create one.
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
                            {editingTerm ? 'Edit Term' : 'Create New Term'}
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
                            title="Term Information"
                            description="Enter the term details"
                            border={false}
                            spacing="md"
                        >
                            <FormGrid cols={2} gap="md">
                                <FormField
                                    error={formErrors.name}
                                    name="name"
                                    label="Term Name"
                                    value={editingTerm?.name || formData.name}
                                    onChange={handleInputChange}
                                    required={true}
                                    placeholder="e.g., Term 1"
                                    containerClassName="space-y-2"
                                />

                                <FormField
                                    error={formErrors.number}
                                    name="number"
                                    label="Term Number"
                                    value={
                                        editingTerm?.number || formData.number
                                    }
                                    onChange={handleInputChange}
                                    required={true}
                                    type="number"
                                    placeholder="e.g., 1"
                                    min={1}
                                    containerClassName="space-y-2"
                                />
                            </FormGrid>

                            <FormField
                                type="select"
                                error={formErrors.academic_year}
                                name="academic_year"
                                label="Academic Year"
                                value={
                                    editingTerm?.academic_year ||
                                    formData.academic_year
                                }
                                onChange={handleInputChange}
                                required={true}
                                options={academicYears.map((year) => ({
                                    value: year.id,
                                    label: year.name,
                                }))}
                                placeholder="Select an academic year"
                                loading={loadingYears}
                                containerClassName="space-y-2"
                            />

                            <FormGrid cols={2} gap="md">
                                <FormField
                                    error={formErrors.start_date}
                                    name="start_date"
                                    label="Start Date"
                                    type="calendar-enhanced"
                                    value={
                                        editingTerm?.start_date ||
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
                                        editingTerm?.end_date ||
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
                                    editingTerm?.description ||
                                    formData.description
                                }
                                onChange={handleInputChange}
                                placeholder="Optional description for this term"
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
                                : editingTerm
                                  ? 'Update'
                                  : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
