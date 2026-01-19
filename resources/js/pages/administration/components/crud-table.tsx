'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    BookOpen,
    CheckCircle,
    Edit,
    Eye,
    MoreVertical,
    Trash2,
    XCircle,
} from 'lucide-react';
import EmptyState from './empty-states';

interface Column {
    key: string;
    header: string;
    render?: (value: any, row: any) => React.ReactNode;
    className?: string;
}

interface CrudTableProps {
    data: any[];
    columns: Column[];
    onEdit?: (item: any) => void;
    onDelete?: (id: string) => void;
    onView?: (item: any) => void;
    onStatusChange?: (item: any, newStatus: boolean) => void; // Changed to boolean
    emptyTitle?: string;
    emptyDescription?: string;
    loading?: boolean;
}

export default function CrudTable({
    data,
    columns,
    onEdit,
    onDelete,
    onView,
    onStatusChange,
    emptyTitle = 'No data found',
    emptyDescription = 'Get started by creating a new item',
    loading = false,
}: CrudTableProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <EmptyState
                icon={BookOpen}
                title={emptyTitle}
                description={emptyDescription}
                actionLabel="Create New"
                onAction={() => onEdit?.({})}
            />
        );
    }

    const renderCell = (row: any, column: Column) => {
        const value = row[column.key];

        if (column.render) {
            return column.render(value, row);
        }

        // Default renderers
        if (column.key === 'active') {
            // Handle boolean active field
            const isActive = value === true || value === 'true' || value === 1;
            return (
                <Badge
                    variant={isActive ? 'default' : 'secondary'}
                    className="gap-1"
                >
                    {isActive ? (
                        <CheckCircle className="h-3 w-3" />
                    ) : (
                        <XCircle className="h-3 w-3" />
                    )}
                    {isActive ? 'Active' : 'Inactive'}
                </Badge>
            );
        }

        if (column.key === 'actions') {
            return (
                <div className="flex justify-end gap-2">
                    {onView && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(row)}
                            title="View details"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    )}
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(row)}
                            title="Edit"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {onStatusChange && (
                                <DropdownMenuItem
                                    onClick={() => {
                                        const currentActive =
                                            row.active === true ||
                                            row.active === 'true' ||
                                            row.active === 1;
                                        onStatusChange(row, !currentActive);
                                    }}
                                >
                                    {row.active === true ||
                                    row.active === 'true' ||
                                    row.active === 1
                                        ? 'Deactivate'
                                        : 'Activate'}
                                </DropdownMenuItem>
                            )}
                            {onDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete(row.id)}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        }

        return <span className="truncate">{value}</span>;
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                key={column.key}
                                className={column.className}
                            >
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow
                            key={row.id || index}
                            className="hover:bg-gray-50"
                        >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.key}
                                    className={column.className}
                                >
                                    {renderCell(row, column)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
