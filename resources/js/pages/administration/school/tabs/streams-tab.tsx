'use client';

import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CrudFormModal from '../../components/crud-form';
import CrudTable from '../../components/crud-table';

interface StreamsTabProps {
    data: any[];
    onDataUpdate: (type: string, data: any[]) => void;
    onRefresh: () => void;
}

export default function StreamsTab({
    data,
    onDataUpdate,
    onRefresh,
}: StreamsTabProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStream, setEditingStream] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const columns = [
        { key: 'name', header: 'Stream Name' },
        { key: 'code', header: 'Code' },
        {
            key: 'level_id',
            header: 'Level',
            render: (value: string) => (
                <span className="font-medium">
                    {data.find((s) => s.id === value)?.level_name || value}
                </span>
            ),
        },
        { key: 'capacity', header: 'Capacity' },
        { key: 'status', header: 'Status' },
        { key: 'actions', header: '', className: 'text-right' },
    ];

    const formFields = [
        [
            {
                name: 'name',
                label: 'Stream Name',
                type: 'text',
                required: true,
                placeholder: 'e.g., North Stream',
            },
            {
                name: 'code',
                label: 'Stream Code',
                type: 'text',
                required: true,
                placeholder: 'e.g., NTH',
            },
        ],
        [
            {
                name: 'level_id',
                label: 'Level',
                type: 'select',
                required: true,
                options: [
                    { value: '1', label: 'Form 1' },
                    { value: '2', label: 'Form 2' },
                ],
            },
            {
                name: 'capacity',
                label: 'Capacity',
                type: 'number',
                required: true,
                placeholder: 'e.g., 50',
            },
        ],
    ];

    const handleEdit = (stream: any) => {
        setEditingStream(stream);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this stream?')) return;

        setLoading(true);
        router.delete(`/admin/configuration/streams/${id}`, {
            preserveState: true,
            onSuccess: () => {
                onDataUpdate(
                    'streams',
                    data.filter((s) => s.id !== id),
                );
                onRefresh();
            },
            onError: (errors) => {
                console.error('Error deleting stream:', errors);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    const handleStatusChange = async (stream: any, newStatus: string) => {
        setLoading(true);
        router.patch(
            `/admin/configuration/streams/${stream.id}/status`,
            {
                status: newStatus,
            },
            {
                preserveState: true,
                onSuccess: () => {
                    onDataUpdate(
                        'streams',
                        data.map((s) =>
                            s.id === stream.id
                                ? { ...s, status: newStatus }
                                : s,
                        ),
                    );
                },
                onFinish: () => {
                    setLoading(false);
                },
            },
        );
    };

    const handleSubmit = async (formData: any) => {
        setLoading(true);

        const method = editingStream ? 'put' : 'post';
        const url = editingStream
            ? `/admin/configuration/streams/${editingStream.id}`
            : '/admin/configuration/streams';

        router[method](url, formData, {
            preserveState: true,
            onSuccess: (page) => {
                if (page.props.success) {
                    setIsModalOpen(false);
                    setEditingStream(null);
                    onRefresh();
                }
            },
            onError: (errors) => {
                console.error('Error saving stream:', errors);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Stream Management
                    </h2>
                    <p className="text-gray-600">
                        Create and manage class streams
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditingStream(null);
                        setIsModalOpen(true);
                    }}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add New Stream
                </Button>
            </div>

            <CrudTable
                data={data}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                loading={loading}
                emptyTitle="No streams found"
                emptyDescription="Get started by creating your first stream"
            />

            <CrudFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingStream(null);
                }}
                title={editingStream ? 'Edit Stream' : 'Create New Stream'}
                description="Streams are subdivisions within a level/class"
                fields={formFields}
                initialData={editingStream || {}}
                onSubmit={handleSubmit}
                loading={loading}
                submitLabel={editingStream ? 'Update' : 'Create'}
            />
        </div>
    );
}
