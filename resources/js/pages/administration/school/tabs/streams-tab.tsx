'use client';

import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import PopoverForm from '@/components/custom/pop-over-form';
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
import { CheckCircle, Edit, School, Trash2, XCircle } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

interface StreamsTabProps {
    data: any[];
    onDataUpdate: (type: 'streams', data: any[]) => void;
    onRefresh: () => void;
}

interface FormErrors {
    name?: string;
    code?: string;
    level_id?: string;
    capacity?: string;
    [key: string]: string | undefined;
}

interface LevelOption {
    value: string;
    label: string;
}

export default function StreamsTab({
    data,
    onDataUpdate,
    onRefresh,
}: StreamsTabProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingStream, setEditingStream] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        level_id: '',
        capacity: 0,
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [levels, setLevels] = useState<LevelOption[]>([]);

    useEffect(() => {
        fetchLevels();
    }, []);

    const fetchLevels = async () => {
            const response = await axios.get('/system/config/levels');
            if (response.data.data && Array.isArray(response.data.data)) {
                setLevels(
                    response.data.data.map((level: any) => ({
                        value: level.id,
                        label: level.name,   
                    })),
                );
            }
        
    };

    const handleInputChange = (field: string, value: any) => {
        // Clear error for this field when user starts typing
        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: undefined }));
        }

        if (editingStream) {
            setEditingStream((prev: any) => ({ ...prev, [field]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleEdit = (stream: any) => {
        setEditingStream(stream);
        setFormErrors({});
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingStream(null);
        setFormErrors({});
        setFormData({
            name: '',
            code: '',
            level_id: '',
            capacity: 0,
        });
        setIsDialogOpen(true);
    };

    const validateForm = () => {
        const errors: FormErrors = {};
        const currentData = editingStream || formData;

        if (!currentData.name?.trim()) {
            errors.name = 'Stream name is required';
        }

        if (!currentData.code?.trim()) {
            errors.code = 'Stream code is required';
        }

        if (!currentData.level_id) {
            errors.level_id = 'Please select a level';
        }

        if (!currentData.capacity || currentData.capacity <= 0) {
            errors.capacity = 'Capacity must be greater than 0';
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
            if (editingStream) {
                // Update existing stream
                const response = await axios.put(
                    `/system/config/streams/${editingStream.id}`,
                    editingStream,
                );
                onDataUpdate(
                    'streams',
                    data.map((s) =>
                        s.id === editingStream.id ? response.data.data : s,
                    ),
                );
            } else {
                // Create new stream
                const response = await axios.post(
                    '/system/config/streams',
                    formData,
                );

                onDataUpdate('streams', [...data, response.data.data]);
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
                console.error('Error saving stream:', error);
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
        if (!confirm('Are you sure you want to delete this stream?')) return;

        setLoading(true);
        try {
            await axios.delete(`/system/config/streams/${id}`);
            onDataUpdate(
                'streams',
                data.filter((s) => s.id !== id),
            );
        } catch (error: any) {
            console.error('Error deleting stream:', error);
            alert(error.response?.data?.message || 'Failed to delete stream');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (stream: any) => {
        setLoading(true);
        try {
            const newActive = !stream.active;
            const response = await axios.patch(
                `/system/config/streams/${stream.id}/status`,
                {
                    active: newActive,
                },
            );

            if (response.status == 200) {
                onDataUpdate(
                    'streams',
                    data.map((s) =>
                        s.id === stream.id
                            ? { ...s, active: response.data.data.active }
                            : s,
                    ),
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const getLevelName = (levelId: string) => {
        const level = levels.find((l) => l.value === levelId);
        return level ? level.label : levelId;
    };

    
            <PopoverForm
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={editingStream ? 'Edit Stream' : 'Create New Stream'}
                icon={School}
                loading={loading}
                errors={formErrors}
                onSubmit={handleSubmit}
                onCancel={() => setFormErrors({})}
                submitLabel={editingStream ? 'Update' : 'Create'}
                size="md"
            >
                <FormSection
                    title="Stream Information"
                    description="Enter stream details"
                    border={false}
                    spacing="md"
                >
                    <FormGrid cols={2} gap="md">
                        <FormField
                            error={formErrors.name}
                            name="name"
                            label="Stream Name"
                            value={editingStream?.name || formData.name}
                            onChange={handleInputChange}
                            required={true}
                            placeholder="e.g., North Stream"
                            containerClassName="space-y-2"
                        />

                        <FormField
                            error={formErrors.code}
                            name="code"
                            label="Stream Code"
                            value={editingStream?.code || formData.code}
                            onChange={handleInputChange}
                            required={true}
                            placeholder="e.g., NTH"
                            containerClassName="space-y-2"
                        />
                    </FormGrid>

                    <FormGrid cols={2} gap="md">
                        <FormField
                            error={formErrors.level_id}
                            name="level_id"
                            label="Level"
                            type="select"
                            value={
                                editingStream?.level_id ||
                                formData.level_id
                            }
                            onChange={handleInputChange}
                            required={true}
                            options={[
                                { value: '0', label: 'Select Level' },
                                ...levels.map((level) => ({
                                    value: level.value,
                                    label: level.label,
                                })),
                            ]}
                            containerClassName="space-y-2"
                        />

                        <FormField
                            error={formErrors.capacity}
                            name="capacity"
                            label="Capacity"
                            type="number"
                            value={
                                editingStream?.capacity ||
                                formData.capacity
                            }
                            onChange={handleInputChange}
                            required={true}
                            placeholder="e.g., 50"
                            min={1}
                            containerClassName="space-y-2"
                        />
                    </FormGrid>
                </FormSection>
            </PopoverForm>
       

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Stream Management</h2>
                    <p className="text-gray-600">
                        Create and manage class streams
                    </p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    Add New Stream
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Stream Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.length > 0 ? (
                            data.map((stream) => (
                                <TableRow key={stream.id}>
                                    <TableCell className="font-medium">
                                        {stream.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {stream.code}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getLevelName(stream.level_id)}
                                    </TableCell>
                                    <TableCell>
                                        {stream.capacity || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                stream.active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className="cursor-pointer"
                                            onClick={() => toggleStatus(stream)}
                                        >
                                            {stream.active ? (
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                            ) : (
                                                <XCircle className="mr-1 h-3 w-3" />
                                            )}
                                            {stream.active
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
                                                    handleEdit(stream)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(stream.id)
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
                                    No streams found. Click "Add New Stream" to
                                    create one.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <PopoverForm
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={editingStream ? 'Edit Stream' : 'Create New Stream'}
                icon={School}
                loading={loading}
                errors={formErrors}
                onSubmit={handleSubmit}
                onCancel={() => setFormErrors({})}
                submitLabel={editingStream ? 'Update' : 'Create'}
                size="md"
            >
                <FormSection
                    title="Stream Information"
                    description="Enter stream details"
                    border={false}
                    spacing="md"
                >
                    <FormGrid cols={2} gap="md">
                        <FormField
                            error={formErrors.name}
                            name="name"
                            label="Stream Name"
                            value={editingStream?.name || formData.name}
                            onChange={handleInputChange}
                            required={true}
                            placeholder="e.g., North Stream"
                            containerClassName="space-y-2"
                        />

                        <FormField
                            error={formErrors.code}
                            name="code"
                            label="Stream Code"
                            value={editingStream?.code || formData.code}
                            onChange={handleInputChange}
                            required={true}
                            placeholder="e.g., NTH"
                            containerClassName="space-y-2"
                        />
                    </FormGrid>

                    <FormGrid cols={2} gap="md">
                        <FormField
                            error={formErrors.level_id}
                            name="level_id"
                            label="Level"
                            type="select"
                            value={editingStream?.level_id || formData.level_id}
                            onChange={handleInputChange}
                            required={true}
                            options={[
                                { value: '0', label: 'Select Level' },
                                ...levels.map((level) => ({
                                    value: level.value,
                                    label: level.label,
                                })),
                            ]}
                            containerClassName="space-y-2"
                        />

                        <FormField
                            error={formErrors.capacity}
                            name="capacity"
                            label="Capacity"
                            type="number"
                            value={editingStream?.capacity || formData.capacity}
                            onChange={handleInputChange}
                            required={true}
                            placeholder="e.g., 50"
                            min={1}
                            containerClassName="space-y-2"
                        />
                    </FormGrid>
                </FormSection>
            </PopoverForm>
        </div>
    );
}
