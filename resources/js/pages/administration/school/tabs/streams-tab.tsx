'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

interface StreamsTabProps {
    data: any[];
    onDataUpdate: (type: 'streams', data: any[]) => void;
    onRefresh: () => void;
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
        capacity: 50,
    });
    const [loading, setLoading] = useState(false);

    // Mock levels data - in reality, this would come from your API
    const levels = [
        { id: '1', name: 'Form 1' },
        { id: '2', name: 'Form 2' },
        { id: '3', name: 'Form 3' },
        { id: '4', name: 'Form 4' },
    ];

    const handleInputChange = (field: string, value: any) => {
        if (editingStream) {
            setEditingStream((prev) => ({ ...prev, [field]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleEdit = (stream: any) => {
        setEditingStream(stream);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingStream(null);
        setFormData({
            name: '',
            code: '',
            level_id: '',
            capacity: 50,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (editingStream) {
                // Update existing stream
                const response = await axios.put(
                    `/api/admin/configuration/streams/${editingStream.id}`,
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
                    '/api/admin/configuration/streams',
                    formData,
                );
                onDataUpdate('streams', [...data, response.data.data]);
            }
            setIsDialogOpen(false);
            onRefresh();
        } catch (error) {
            console.error('Error saving stream:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this stream?')) return;

        setLoading(true);
        try {
            await axios.delete(`/api/admin/configuration/streams/${id}`);
            onDataUpdate(
                'streams',
                data.filter((s) => s.id !== id),
            );
        } catch (error) {
            console.error('Error deleting stream:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (stream: any) => {
        setLoading(true);
        try {
            const newStatus =
                stream.status === 'active' ? 'inactive' : 'active';
            const response = await axios.patch(
                `/api/admin/configuration/streams/${stream.id}/status`,
                {
                    status: newStatus,
                },
            );
            onDataUpdate(
                'streams',
                data.map((s) => (s.id === stream.id ? response.data.data : s)),
            );
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Stream Management</h2>
                    <p className="text-gray-600">
                        Manage all streams in the system
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
                        {data.map((stream) => (
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
                                    {levels.find(
                                        (l) => l.id === stream.level_id,
                                    )?.name || stream.level_id}
                                </TableCell>
                                <TableCell>{stream.capacity}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            stream.status === 'active'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        className="cursor-pointer"
                                        onClick={() => toggleStatus(stream)}
                                    >
                                        {stream.status === 'active' ? (
                                            <CheckCircle className="mr-1 h-3 w-3" />
                                        ) : (
                                            <XCircle className="mr-1 h-3 w-3" />
                                        )}
                                        {stream.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(stream)}
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
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingStream
                                ? 'Edit Stream'
                                : 'Create New Stream'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Stream Name</Label>
                            <Input
                                id="name"
                                value={editingStream?.name || formData.name}
                                onChange={(e) =>
                                    handleInputChange('name', e.target.value)
                                }
                                placeholder="e.g., North Stream"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="code">Stream Code</Label>
                                <Input
                                    id="code"
                                    value={editingStream?.code || formData.code}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'code',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g., NTH"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    value={
                                        editingStream?.capacity ||
                                        formData.capacity
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
                                            'capacity',
                                            parseInt(e.target.value),
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="level">Level</Label>
                            <Select
                                value={
                                    editingStream?.level_id || formData.level_id
                                }
                                onValueChange={(value) =>
                                    handleInputChange('level_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {levels.map((level) => (
                                        <SelectItem
                                            key={level.id}
                                            value={level.id}
                                        >
                                            {level.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading
                                ? 'Saving...'
                                : editingStream
                                  ? 'Update'
                                  : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
