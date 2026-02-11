'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
    addMonths,
    eachDayOfInterval,
    endOfDay,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    isWithinInterval,
    parseISO,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Filter,
    Grid,
    List,
    MoreVertical,
    Plus,
    X,
} from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    type?: 'holiday' | 'exam' | 'deadline' | 'event' | 'term' | 'meeting';
}

interface EnhancedCalendarProps {
    selected?: Date;
    onSelect?: (date: Date) => void;
    disabled?: boolean;
    fromDate?: Date;
    toDate?: Date;
    disabledDates?: Date[];
    disabledDays?: number[];
    defaultMonth?: Date;
    defaultYear?: Date;
    events?: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
    onEventEdit?: (event: CalendarEvent) => void;
    onEventDelete?: (eventId: string) => void;
    onDateClick?: (date: Date, events: CalendarEvent[]) => void;
    onAddEvent?: (date: Date) => void;
    viewMode?: 'month' | 'agenda';
    compact?: boolean;
    maxHeight?: string;
    className?: string;
}

const EVENT_COLORS = {
    holiday: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    exam: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    deadline: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        dot: 'bg-purple-500',
    },
    event: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    term: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    meeting: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        dot: 'bg-indigo-500',
    },
    default: { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' },
};

export function EnhancedCalendar({
    selected,
    onSelect,
    disabled,
    fromDate,
    toDate,
    disabledDates = [],
    disabledDays = [],
    defaultMonth = new Date(),
    defaultYear = new Date(),
    events = [],
    onEventClick,
    onEventEdit,
    onEventDelete,
    onDateClick,
    onAddEvent,
    viewMode: initialViewMode = 'month',
    compact = true,
    maxHeight = '400px',
    className = '',
}: EnhancedCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState<Date>(defaultMonth);
    const [currentYear, setCurrentYear] = useState<Date>()
    const [viewMode, setViewMode] = useState<'month' | 'agenda'>(
        initialViewMode,
    );
    const [eventTypeFilters, setEventTypeFilters] = useState<
        Record<string, boolean>
    >({});

    // Initialize filters
    React.useEffect(() => {
        const types = Array.from(
            new Set(events.map((e) => e.type || 'default')),
        );
        const initialFilters: Record<string, boolean> = {};
        types.forEach((type) => {
            initialFilters[type] = true;
        });
        setEventTypeFilters(initialFilters);
    }, []);
    // event can be added to dependancy

    // Get filtered events
    const getFilteredEvents = React.useCallback(() => {
        return events.filter(
            (event) => eventTypeFilters[event.type || 'default'],
        );
    }, [events, eventTypeFilters]);

    // Get events for a specific date
    const getEventsForDate = (date: Date): CalendarEvent[] => {
        return getFilteredEvents().filter((event) => {
            const eventStart =
                typeof event.startDate === 'string'
                    ? parseISO(event.startDate)
                    : event.startDate;
            const eventEnd = event.endDate
                ? typeof event.endDate === 'string'
                    ? parseISO(event.endDate)
                    : event.endDate
                : eventStart;

            const dateStart = startOfDay(date);
            const dateEnd = endOfDay(date);

            return (
                isWithinInterval(dateStart, {
                    start: eventStart,
                    end: eventEnd,
                }) ||
                isWithinInterval(dateEnd, {
                    start: eventStart,
                    end: eventEnd,
                }) ||
                (date >= eventStart && date <= eventEnd)
            );
        });
    };

    // Get month view days
    const getMonthDays = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    };

    // Navigation
    const navigate = (direction: 'prev' | 'next') => {
        setCurrentMonth(
            direction === 'prev'
                ? subMonths(currentMonth, 1)
                : addMonths(currentMonth, 1),
        );
    };

    // Go to today
    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today);
        if (onSelect) onSelect(today);
    };

    // go to year
    const goToYear = (year: string) => {

       const month =  new Date(Number(year), 0, 1)
        setCurrentMonth(month)
    };

    // Check if date is disabled
    const isDateDisabled = (date: Date): boolean => {
        if (disabled) return true;
        if (fromDate && date < fromDate) return true;
        if (toDate && date > toDate) return true;
        if (disabledDates.some((d) => isSameDay(d, date))) return true;
        if (disabledDays.includes(date.getDay())) return true;
        return false;
    };

    // Handle date click
    const handleDateClick = (date: Date) => {
        if (isDateDisabled(date)) return;

        const dateEvents = getEventsForDate(date);

        if (onDateClick) {
            onDateClick(date, dateEvents);
        } else if (onSelect) {
            onSelect(date);
        }
    };

    // Compact Month View - Optimized for small screens
    const renderCompactMonthView = () => {
        const days = getMonthDays();
        const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        return (
            <div className="space-y-2">
                {/* Compact calendar grid */}
                <div className="grid grid-cols-7 gap-0.5">
                    {weekDays.map((day, i) => (
                        <div
                            key={`${day} - ${i}`}
                            className="py-1 text-center text-xs font-medium text-gray-500"
                        >
                            {day}
                        </div>
                    ))}

                    {days.map((day) => {
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = selected && isSameDay(day, selected);
                        const isDisabled = isDateDisabled(day);
                        const dayEvents = getEventsForDate(day);
                        const hasEvents = dayEvents.length > 0;

                        return (
                            <div
                                key={day.toString()}
                                className={cn(
                                    'relative aspect-square rounded-md transition-colors',
                                    isCurrentMonth
                                        ? 'bg-white'
                                        : 'bg-gray-50/50',
                                    isSelected && 'ring-1 ring-primary',
                                    isDisabled &&
                                        'cursor-not-allowed opacity-40',
                                    !isDisabled &&
                                        'cursor-pointer hover:bg-gray-50',
                                    compact ? 'p-0.5' : 'p-1',
                                )}
                                onClick={() => handleDateClick(day)}
                            >
                                {/* Date number */}
                                <div
                                    className={cn(
                                        'flex h-full w-full items-center justify-center rounded text-sm',
                                        isToday(day) && 'bg-primary text-white',
                                        isSelected &&
                                            !isToday(day) &&
                                            'bg-primary/10 text-primary',
                                        !isCurrentMonth && 'text-gray-400',
                                        hasEvents && 'font-semibold',
                                    )}
                                >
                                    {format(day, 'd')}
                                </div>

                                {/* Event dots */}
                                {hasEvents && (
                                    <div className="absolute right-0 bottom-0 left-0 flex justify-center gap-0.5 pb-0.5">
                                        {dayEvents.slice(0, 3).map((event) => (
                                            <div
                                                key={event.id}
                                                className={cn(
                                                    'h-1 w-1 cursor-pointer rounded-full',
                                                    EVENT_COLORS[
                                                        event.type || 'default'
                                                    ].dot,
                                                )}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventClick?.(event);
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Event legend */}
                {events.length > 0 && (
                    <div className="border-t pt-2">
                        <div className="grid grid-cols-2 gap-1 text-xs">
                            {getFilteredEvents()
                                .slice(0, 4)
                                .map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex cursor-pointer items-center gap-1.5 truncate rounded p-1.5 hover:bg-gray-50"
                                        onClick={() => onEventClick?.(event)}
                                    >
                                        <div
                                            className={cn(
                                                'h-2 w-2 rounded-full',
                                                EVENT_COLORS[
                                                    event.type || 'default'
                                                ].dot,
                                            )}
                                        />
                                        <span className="truncate">
                                            {event.title}
                                        </span>
                                    </div>
                                ))}
                            {getFilteredEvents().length > 4 && (
                                <div className="p-1.5 text-xs text-gray-500">
                                    +{getFilteredEvents().length - 4} more
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Standard Month View
    const renderMonthView = () => {
        const days = getMonthDays();
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div className="space-y-2">
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="py-1 text-center text-xs font-medium text-gray-500"
                        >
                            {day}
                        </div>
                    ))}

                    {days.map((day) => {
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = selected && isSameDay(day, selected);
                        const isDisabled = isDateDisabled(day);
                        const dayEvents = getEventsForDate(day);

                        return (
                            <div
                                key={day.toString()}
                                className={cn(
                                    'min-h-[3rem] rounded border transition-colors',
                                    isCurrentMonth
                                        ? 'bg-white'
                                        : 'bg-gray-50/50',
                                    isSelected &&
                                        'border-primary ring-1 ring-primary',
                                    isDisabled &&
                                        'cursor-not-allowed opacity-50',
                                    !isDisabled &&
                                        'cursor-pointer hover:bg-gray-50',
                                )}
                                onClick={() => handleDateClick(day)}
                            >
                                <div className="p-1.5">
                                    <div
                                        className={cn(
                                            'mb-1 flex h-6 w-6 items-center justify-center rounded text-sm',
                                            isToday(day) &&
                                                'bg-primary text-white',
                                            isSelected &&
                                                !isToday(day) &&
                                                'bg-primary/10 text-primary',
                                            !isCurrentMonth && 'text-gray-400',
                                        )}
                                    >
                                        {format(day, 'd')}
                                    </div>

                                    {/* Events */}
                                    <div className="space-y-0.5">
                                        {dayEvents.slice(0, 2).map((event) => (
                                            <div
                                                key={event.id}
                                                className={cn(
                                                    'cursor-pointer truncate rounded p-1 text-xs',
                                                    EVENT_COLORS[
                                                        event.type || 'default'
                                                    ].bg,
                                                    EVENT_COLORS[
                                                        event.type || 'default'
                                                    ].text,
                                                )}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventClick?.(event);
                                                }}
                                            >
                                                <div className="flex items-center gap-1">
                                                    <div
                                                        className={cn(
                                                            'h-1.5 w-1.5 rounded-full',
                                                            EVENT_COLORS[
                                                                event.type ||
                                                                    'default'
                                                            ].dot,
                                                        )}
                                                    />
                                                    <span className="truncate">
                                                        {event.title}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <div className="text-center text-xs text-gray-500">
                                                +{dayEvents.length - 2}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Compact Agenda View
    const renderAgendaView = () => {
        const filteredEvents = getFilteredEvents();
        const sortedEvents = [...filteredEvents].sort(
            (a, b) => a.startDate.getTime() - b.startDate.getTime(),
        );

        // Group events by date
        const eventsByDate: Record<string, CalendarEvent[]> = {};
        sortedEvents.forEach((event) => {
            const dateKey = format(event.startDate, 'yyyy-MM-dd');
            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            eventsByDate[dateKey].push(event);
        });

        return (
            <div className="space-y-3" style={{ maxHeight, overflowY: 'auto' }}>
                {Object.entries(eventsByDate)
                    .slice(0, 5)
                    .map(([dateKey, dateEvents]) => {
                        const date = new Date(dateKey);

                        return (
                            <div key={dateKey} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            'flex h-10 w-10 items-center justify-center rounded',
                                            isToday(date)
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100',
                                        )}
                                    >
                                        <div className="text-center">
                                            <div className="text-sm font-bold">
                                                {format(date, 'd')}
                                            </div>
                                            <div className="text-xs">
                                                {format(date, 'EEE')}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold">
                                            {format(date, 'MMM d, yyyy')}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {dateEvents.length} event
                                            {dateEvents.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="ml-12 space-y-1">
                                    {dateEvents.slice(0, 3).map((event) => (
                                        <div
                                            key={event.id}
                                            className={cn(
                                                'cursor-pointer rounded border p-2 hover:bg-gray-50',
                                                EVENT_COLORS[
                                                    event.type || 'default'
                                                ].bg,
                                            )}
                                            onClick={() =>
                                                onEventClick?.(event)
                                            }
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <div
                                                            className={cn(
                                                                'h-2 w-2 rounded-full',
                                                                EVENT_COLORS[
                                                                    event.type ||
                                                                        'default'
                                                                ].dot,
                                                            )}
                                                        />
                                                        <span className="text-sm font-medium">
                                                            {event.title}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {format(
                                                            event.startDate,
                                                            'h:mm a',
                                                        )}
                                                        {event.endDate &&
                                                            ` - ${format(event.endDate, 'h:mm a')}`}
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                        >
                                                            <MoreVertical className="h-3 w-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="text-xs"
                                                    >
                                                        {onEventEdit && (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    onEventEdit(
                                                                        event,
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onEventClick?.(
                                                                    event,
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() =>
                                                                onEventDelete?.(
                                                                    event.id,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                    {dateEvents.length > 3 && (
                                        <div className="text-xs text-gray-500">
                                            +{dateEvents.length - 3} more events
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                {sortedEvents.length === 0 && (
                    <div className="py-6 text-center">
                        <CalendarIcon className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                        <p className="text-sm text-gray-500">
                            No events scheduled
                        </p>
                        {onAddEvent && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                onClick={() => onAddEvent(new Date())}
                            >
                                <Plus className="mr-1 h-3 w-3" />
                                Add Event
                            </Button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Render filters
    const renderFilters = () => {
        const eventTypes = Array.from(
            new Set(events.map((e) => e.type || 'default')),
        );

        return (
            <div className="flex items-center gap-1.5 pb-2">
                <Filter className="h-3 w-3 text-gray-500" />
                <div className="flex flex-wrap gap-1">
                    {eventTypes.map((type) => (
                        <Badge
                            key={type}
                            variant={
                                eventTypeFilters[type] ? 'default' : 'outline'
                            }
                            className="cursor-pointer px-1.5 py-0 text-xs capitalize"
                            onClick={() =>
                                setEventTypeFilters((prev) => ({
                                    ...prev,
                                    [type]: !prev[type],
                                }))
                            }
                        >
                            {type}
                            {eventTypeFilters[type] && (
                                <X className="ml-0.5 h-2.5 w-2.5" />
                            )}
                        </Badge>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div
            className={cn('rounded-lg bg-white', className)}
            style={{ width: compact ? '280px' : '320px' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-2">
                <div className="gap flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => navigate('prev')}
                    >
                        <ChevronLeft className="h-3 w-3" />
                    </Button>

                    {/* <span className="min-w-[100px] bg-red-500 text-center text-sm font-medium"></span> */}
                    <Select onValueChange={(year) => goToYear(year)} >
                        <SelectTrigger className="h-8 w-full border px-2 text-xs active:bg-secondary">
                            {format(currentMonth, 'MMM, yyyy')}
                        </SelectTrigger>
                        <SelectContent className="max-w-5">
                            {Array.from({ length: 200 }, (_, i) => {
                                const year = new Date().getFullYear() - 100 + i;
                                const isCurrent =
                                    year === new Date().getFullYear();
                                return (
                                    <SelectItem
                                        key={year}
                                        value={year.toString()}
                                        className={`text-xs ${isCurrent ? 'bg-secondary font-semibold' : ''}`}
                                    >
                                        {year} {isCurrent && '★'}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => navigate('next')}
                    >
                        <ChevronRight className="h-3 w-3" />
                    </Button>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs"
                        onClick={goToToday}
                    >
                        Today
                    </Button>

                    <div className="flex rounded border">
                        {(['month', 'agenda'] as const).map((mode) => (
                            <Button
                                key={mode}
                                variant={
                                    viewMode === mode ? 'default' : 'ghost'
                                }
                                size="sm"
                                className="h-6 rounded-none px-2 text-xs first:rounded-l last:rounded-r"
                                onClick={() => setViewMode(mode)}
                            >
                                {mode === 'month' && (
                                    <Grid className="h-3 w-3" />
                                )}
                                {mode === 'agenda' && (
                                    <List className="h-3 w-3" />
                                )}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters */}
            {events.length > 0 && renderFilters()}

            {/* Calendar Content */}
            <div className="p-2">
                {viewMode === 'month' &&
                    (compact ? renderCompactMonthView() : renderMonthView())}
                {viewMode === 'agenda' && renderAgendaView()}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t p-2">
                <div className="text-xs text-gray-500">
                    {getFilteredEvents().length} events
                </div>

                {onAddEvent && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs"
                        onClick={() => onAddEvent(new Date())}
                    >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Event
                    </Button>
                )}
            </div>
        </div>
    );
}
