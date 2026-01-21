
// Base interface for paginated response
export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

// Pagination link interface
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
    page?: number; 
}

// For use with Laravel's simplePaginate
export interface SimplePaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
}

export interface CursorPaginatedResponse<T> {
    data: T[];
    path: string;
    per_page: number;
    next_cursor: string | null;
    prev_cursor: string | null;
    next_page_url: string | null;
    prev_page_url: string | null;
}

// Generic wrapper for API responses
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: 'success' | 'error';
    pagination?:
        | PaginatedResponse<T>
        | SimplePaginatedResponse<T>
        | CursorPaginatedResponse<T>;
}

// Props for components that accept paginated data
export interface WithPaginationProps<T> {
    pagination: PaginatedResponse<T>;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    isLoading?: boolean;
}

// Props specifically for DataTable with pagination
export interface DataTablePaginationProps<T> {
    data: T[];
    pagination: PaginatedResponse<T>;
    onPageChange: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
}

// Helper types
export type PaginationMeta = Omit<PaginatedResponse<any>, 'data'>;

// Extract just the pagination metadata from response
export function extractPaginationMeta<T>(
    response: PaginatedResponse<T>,
): PaginationMeta {
    const { data, ...meta } = response;
    return meta;
}
