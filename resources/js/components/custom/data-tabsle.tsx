// components/data-table.tsx
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
import { cn } from '@/lib/utils';
import {  MoreHorizontal } from 'lucide-react';
import { DataTablePagination } from './custom-pagination';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    cell?: (value: any, row: T) => React.ReactNode;
    className?: string;
    headerClassName?: string;
    cellClassName?: string | ((row: T) => string);
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (row: T) => string | number;
    onRowClick?: (row: T) => void;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    actions?: {
        label: string;
        onClick: (row: T) => void;
        icon?: React.ReactNode;
        variant?: 'default' | 'destructive' | 'outline';
    }[];
    emptyMessage?: string;
    className?: string;
    rowClassName?: string | ((row: T) => string);
    isLoading?: boolean;
}

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    onRowClick,
    pagination,
    actions,
    emptyMessage = 'No data found',
    className,
    rowClassName,
    isLoading = false,
}: DataTableProps<T>) {
    const renderCell = (row: T, column: Column<T>) => {
        let value: any;

        if (typeof column.accessor === 'function') {
            value = column.accessor(row);
        } else {
            value = row[column.accessor];
        }

        if (column.cell) {
            return column.cell(value, row);
        }

        return value;
    };

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-12 animate-pulse rounded-lg bg-gray-200"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className={cn('space-y-4', className)}>
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableHead
                                    key={index}
                                    className={cn(
                                        'font-semibold text-gray-700',
                                        column.headerClassName,
                                    )}
                                >
                                    {column.header}
                                </TableHead>
                            ))}
                            {actions && actions.length > 0 && (
                                <TableHead className="w-20 text-right font-semibold text-gray-700">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="h-32 text-center text-gray-500"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => {
                                const rowKey = keyExtractor(row);
                                const rowClass =
                                    typeof rowClassName === 'function'
                                        ? rowClassName(row)
                                        : rowClassName;

                                return (
                                    <TableRow
                                        key={rowKey}
                                        className={cn(
                                            'cursor-pointer transition-colors hover:bg-gray-50',
                                            onRowClick && 'hover:bg-gray-50',
                                            rowClass,
                                        )}
                                        onClick={() => onRowClick?.(row)}
                                    >
                                        {columns.map((column, colIndex) => {
                                            const cellClass =
                                                typeof column.cellClassName ===
                                                'function'
                                                    ? column.cellClassName(row)
                                                    : column.cellClassName;

                                            return (
                                                <TableCell
                                                    key={colIndex}
                                                    className={cn(
                                                        'py-3',
                                                        column.className,
                                                        cellClass,
                                                    )}
                                                >
                                                    {renderCell(row, column)}
                                                </TableCell>
                                            );
                                        })}

                                        {actions && actions.length > 0 && (
                                            <TableCell className="py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {actions.map(
                                                            (action, index) => (
                                                                <DropdownMenuItem
                                                                    key={index}
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        action.onClick(
                                                                            row,
                                                                        );
                                                                    }}
                                                                    className={cn(
                                                                        action.variant ===
                                                                            'destructive' &&
                                                                            'text-red-600 focus:text-red-600',
                                                                    )}
                                                                >
                                                                    {action.icon && (
                                                                        <span className="mr-2">
                                                                            {
                                                                                action.icon
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    {
                                                                        action.label
                                                                    }
                                                                </DropdownMenuItem>
                                                            ),
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="mt-4 border-t pt-4">
                    <DataTablePagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.onPageChange}
                        showTotal={true}
                        className="px-4"
                    />
                </div>
            )}
        </div>
    );
}
    