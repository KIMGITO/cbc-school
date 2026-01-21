import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSize?: number;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
    showTotal?: boolean;
    className?: string;
}

export function DataTablePagination({
    currentPage,
    totalPages,
    onPageChange,
    onPageSizeChange,
    pageSize = 10,
    pageSizeOptions = [10, 20, 30, 50, 100],
    showPageSizeSelector = false,
    showTotal = true,
    className,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show before/after current
        const range: (number | 'ellipsis')[] = [];
        const rangeWithDots: (number | 'ellipsis')[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        let prev = 0;
        for (const page of range) {
            if (page !== prev + 1) {
                rangeWithDots.push('ellipsis');
            }
            rangeWithDots.push(page);
            prev = page;
        }

        return rangeWithDots;
    };

    return (
        <div
            className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
        >
            {showTotal && (
                <div className="flex items-center text-sm text-gray-600">
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    {showPageSizeSelector && onPageSizeChange && (
                        <>
                            <span className="mx-2">•</span>
                            <div className="flex items-center gap-2">
                                <span>Show</span>
                                <Select
                                    value={pageSize.toString()}
                                    onValueChange={(value) =>
                                        onPageSizeChange(Number(value))
                                    }
                                >
                                    <SelectTrigger className="h-8 w-20">
                                        <SelectValue placeholder={pageSize} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pageSizeOptions.map((size) => (
                                            <SelectItem
                                                key={size}
                                                value={size.toString()}
                                            >
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span>per page</span>
                            </div>
                        </>
                    )}
                </div>
            )}

            <Pagination className="w-full sm:w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(currentPage - 1)}
                            className={
                                currentPage === 1
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                            }
                        />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                            {page === 'ellipsis' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(page)}
                                    isActive={currentPage === page}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(currentPage + 1)}
                            className={
                                currentPage === totalPages
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

// Alternative: Minimal pagination with buttons only
export function CompactPagination({
    currentPage,
    totalPages,
    onPageChange,
}: Omit<PaginationProps, 'showPageSizeSelector' | 'showTotal'>) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                    {(() => {
                        const pages: number[] = [];
                        const maxVisible = 5;

                        if (totalPages <= maxVisible) {
                            for (let i = 1; i <= totalPages; i++) pages.push(i);
                        } else if (currentPage <= 3) {
                            for (let i = 1; i <= 4; i++) pages.push(i);
                            pages.push(totalPages);
                        } else if (currentPage >= totalPages - 2) {
                            pages.push(1);
                            for (let i = totalPages - 3; i <= totalPages; i++)
                                pages.push(i);
                        } else {
                            pages.push(1);
                            for (
                                let i = currentPage - 1;
                                i <= currentPage + 1;
                                i++
                            )
                                pages.push(i);
                            pages.push(totalPages);
                        }

                        return pages.map((pageNumber, index) => {
                            const showEllipsis =
                                index > 0 &&
                                pageNumber - pages[index - 1] > 1 &&
                                index < pages.length - 1;

                            return (
                                <div
                                    key={pageNumber}
                                    className="flex items-center"
                                >
                                    {showEllipsis && (
                                        <span className="mx-1 text-gray-400">
                                            ...
                                        </span>
                                    )}
                                    <Button
                                        variant={
                                            currentPage === pageNumber
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        onClick={() => onPageChange(pageNumber)}
                                        className="h-8 w-8 p-0"
                                    >
                                        {pageNumber}
                                    </Button>
                                </div>
                            );
                        });
                    })()}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

// Enhanced pagination with extra info
export function EnhancedPagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    pageSize = 10,
    onPageSizeChange,
}: PaginationProps & { totalItems: number }) {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                    Showing {startItem} to {endItem} of {totalItems} results
                </div>

                {onPageSizeChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            Rows per page:
                        </span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) =>
                                onPageSizeChange(Number(value))
                            }
                        >
                            <SelectTrigger className="h-8 w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 20, 30, 50, 100].map((size) => (
                                    <SelectItem
                                        key={size}
                                        value={size.toString()}
                                    >
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                showTotal={false}
            />
        </div>
    );
}
