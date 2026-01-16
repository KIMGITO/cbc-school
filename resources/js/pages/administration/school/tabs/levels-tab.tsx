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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { ArrowUpDown, CheckCircle, Edit, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface LevelsTabProps {
    data: any[];
    onDataUpdate: (type: 'levels', data: any[]) => void;
    onRefresh: () => void;
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

    const handleInputChange = (field: string, value: any) => {
        if (editingLevel) {
            setEditingLevel((prev) => ({ ...prev, [field]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleEdit = (level: any) => {
        setEditingLevel(level);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingLevel(null);
        setFormData({
            name: '',
            code: '',
            description: '',
            order: data.length + 1,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
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
                    '/api/admin/configuration/levels',
                    formData,
                );
                onDataUpdate('levels', [...data, response.data.data]);
            }
            setIsDialogOpen(false);
            onRefresh();
        } catch (error) {
            console.error('Error saving level:', error);
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
        } catch (error) {
            console.error('Error deleting level:', error);
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
                            <TableHead className="w-16">Order</TableHead>
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
                        {data
                            .sort((a, b) => a.order - b.order)
                            .map((level, index) => (
                                <TableRow key={level.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono">
                                                {level.order}
                                            </span>
                                            <div className="flex flex-col">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-4 w-4"
                                                    onClick={() =>
                                                        moveLevelOrder(
                                                            level,
                                                            'up',
                                                        )
                                                    }
                                                    disabled={index === 0}
                                                >
                                                    <ArrowUpDown className="h-3 w-3 rotate-90" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-4 w-4"
                                                    onClick={() =>
                                                        moveLevelOrder(
                                                            level,
                                                            'down',
                                                        )
                                                    }
                                                    disabled={
                                                        index ===
                                                        data.length - 1
                                                    }
                                                >
                                                    <ArrowUpDown className="h-3 w-3 -rotate-90" />
                                                </Button>
                                            </div>
                                        </div>
                                    </TableCell>
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
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Level Name</Label>
                            <Input
                                id="name"
                                value={editingLevel?.name || formData.name}
                                onChange={(e) =>
                                    handleInputChange('name', e.target.value)
                                }
                                placeholder="e.g., Form 1"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="code">Level Code</Label>
                                <Input
                                    id="code"
                                    value={editingLevel?.code || formData.code}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'code',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g., F1"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="order">Display Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={
                                        editingLevel?.order || formData.order
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
                                            'order',
                                            parseInt(e.target.value),
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={
                                    editingLevel?.description ||
                                    formData.description
                                }
                                onChange={(e) =>
                                    handleInputChange(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                placeholder="Optional description for this level"
                                rows={3}
                            />
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
