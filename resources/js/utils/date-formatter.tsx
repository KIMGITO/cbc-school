// utils/date-formatter.ts

// Types
export type DateInput = string | number | Date;
export type DateFormat =
    | 'short' // 1/2/2000
    | 'medium' // 1st Jan, 2012
    | 'long' // January 2, 2000
    | 'full' // Monday, January 2, 2000
    | 'iso' // 2000-01-02
    | 'time' // 2:30 PM
    | 'datetime' // 1/2/2000 2:30 PM
    | 'relative' // 2 days ago
    | 'year' // 2000
    | 'month-year' // Jan 2000
    | 'time-24h' // 14:30
    | 'custom';

// Main date formatter function
export function formatDate(
    dateInput: DateInput,
    format: DateFormat = 'medium',
    locale: string = 'en-US',
    customFormat?: string,
): string {
    const date = normalizeDate(dateInput);
    if (!date || !isValidDate(date)) {
        return 'Invalid Date';
    }

    switch (format) {
        case 'short':
            return formatShortDate(date, locale);
        case 'medium':
            return formatMediumDate(date, locale);
        case 'long':
            return formatLongDate(date, locale);
        case 'full':
            return formatFullDate(date, locale);
        case 'iso':
            return formatISODate(date);
        case 'time':
            return formatTime(date, locale);
        case 'datetime':
            return `${formatShortDate(date, locale)} ${formatTime(date, locale)}`;
        case 'relative':
            return formatRelativeDate(date);
        case 'year':
            return date.getFullYear().toString();
        case 'month-year':
            return formatMonthYear(date, locale);
        case 'time-24h':
            return formatTime24h(date);
        case 'custom':
            return customFormat
                ? formatCustom(date, customFormat, locale)
                : formatMediumDate(date, locale);
        default:
            return formatMediumDate(date, locale);
    }
}

// Individual format functions
export function formatShortDate(date: Date, locale: string = 'en-US'): string {
    return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });
}

export function formatMediumDate(date: Date, locale: string = 'en-US'): string {
    const day = date.getDate();
    const daySuffix = getDaySuffix(day);
    const month = date.toLocaleDateString(locale, { month: 'short' });
    const year = date.getFullYear();

    return `${day}${daySuffix} ${month}, ${year}`;
}

export function formatLongDate(date: Date, locale: string = 'en-US'): string {
    return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function formatFullDate(date: Date, locale: string = 'en-US'): string {
    return date.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function formatISODate(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function formatTime(date: Date, locale: string = 'en-US'): string {
    return date.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

export function formatTime24h(date: Date): string {
    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

export function formatMonthYear(date: Date, locale: string = 'en-US'): string {
    return date.toLocaleDateString(locale, {
        month: 'short',
        year: 'numeric',
    });
}

export function formatRelativeDate(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays === 0) {
        if (diffInHours === 0) {
            if (diffInMinutes === 0) {
                return 'just now';
            }
            return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
        }
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    if (diffInDays === 1) {
        return 'yesterday';
    }

    if (diffInDays < 7) {
        return `${diffInDays} days ago`;
    }

    if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }

    return formatMediumDate(date);
}

// Helper functions
export function normalizeDate(input: DateInput): Date | null {
    if (!input) return null;

    if (input instanceof Date) {
        return input;
    }

    if (typeof input === 'number') {
        return new Date(input);
    }

    if (typeof input === 'string') {
        // Try parsing various formats
        const parsed = new Date(input);
        return isValidDate(parsed) ? parsed : null;
    }

    return null;
}

export function isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
}

export function getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) {
        return 'th';
    }

    switch (day % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

// Custom format with tokens
export function formatCustom(
    date: Date,
    format: string,
    locale: string = 'en-US',
): string {
    const tokens: Record<string, string> = {
        // Day
        d: date.getDate().toString(),
        dd: date.getDate().toString().padStart(2, '0'),
        ddd: date.toLocaleDateString(locale, { weekday: 'short' }),
        dddd: date.toLocaleDateString(locale, { weekday: 'long' }),

        // Month
        M: (date.getMonth() + 1).toString(),
        MM: (date.getMonth() + 1).toString().padStart(2, '0'),
        MMM: date.toLocaleDateString(locale, { month: 'short' }),
        MMMM: date.toLocaleDateString(locale, { month: 'long' }),

        // Year
        yy: date.getFullYear().toString().slice(-2),
        yyyy: date.getFullYear().toString(),

        // Time
        h: (date.getHours() % 12 || 12).toString(),
        hh: (date.getHours() % 12 || 12).toString().padStart(2, '0'),
        H: date.getHours().toString(),
        HH: date.getHours().toString().padStart(2, '0'),
        m: date.getMinutes().toString(),
        mm: date.getMinutes().toString().padStart(2, '0'),
        s: date.getSeconds().toString(),
        ss: date.getSeconds().toString().padStart(2, '0'),
        tt: date.getHours() >= 12 ? 'PM' : 'AM',
        TT: date.getHours() >= 12 ? 'PM' : 'AM',
    };

    return format.replace(
        /d{1,4}|M{1,4}|y{2,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|t{1,2}|T{1,2}/g,
        (match) => tokens[match] || match,
    );
}

// Convenience functions
export const formatDateShort = (date: DateInput) => formatDate(date, 'short');
export const formatDateMedium = (date: DateInput) => formatDate(date, 'medium');
export const formatDateLong = (date: DateInput) => formatDate(date, 'long');
export const formatDateFull = (date: DateInput) => formatDate(date, 'full');
export const formatDateTime = (date: DateInput) => formatDate(date, 'datetime');
export const formatTimeOnly = (date: DateInput) => formatDate(date, 'time');
export const formatRelative = (date: DateInput) => formatDate(date, 'relative');

// Date manipulation functions
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

export function addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
}

export function startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}

export function endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
}

export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

export function getAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

// React component for date display

interface DateDisplayProps {
    date: DateInput;
    format?: DateFormat;
    locale?: string;
    className?: string;
    fallback?: string;
    titleFormat?: DateFormat; // For tooltip
}

export function DateDisplay({
    date,
    format = 'medium',
    locale = 'en-US',
    className = '',
    fallback = 'N/A',
    titleFormat = 'full',
}: DateDisplayProps) {
    const formattedDate = formatDate(date, format, locale);
    const titleDate = formatDate(date, titleFormat, locale);

    if (formattedDate === 'Invalid Date') {
        return <span className={className}>{fallback}</span>;
    }

    return (
        <time
            dateTime={formatDate(date, 'iso')}
            title={titleDate}
            className={className}
        >
            {formattedDate}
        </time>
    );
}
