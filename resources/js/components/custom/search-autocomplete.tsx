// components/ui/search-autocomplete.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
    Book,
    Briefcase,
    Check,
    Delete,
    GraduationCap,
    Loader2,
    Search,
    Users,
    X,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface SearchResult {
    id: string | number;
    label: string;
    [key: string]: any; // Dynamic fields
}

export interface SearchFieldConfig {
    key: string; // Field key in the result object
    label: string; // Display label
    displayInResult?: boolean; // Show in search results
    displayInSelected?: boolean; // Show in selected item
    badgeStyle?: boolean; // Display as badge
    icon?: React.ReactNode; // Icon for the field
    priority?: number; // Display priority (lower = higher priority)
    format?: (value: any) => string; // Format function
    hidden?: boolean; // Hide from display
}

export interface SearchAutocompleteProps {
    // Required props
    name: string;
    url: string;
    value: string | number | null;
    onChange: (
        name: string,
        value: string | number | null,
        item?: SearchResult,
    ) => void;

    // Search configuration
    searchKey?: string;
    searchFields?: string[]; // Fields to search in (e.g., ['name', 'email', 'adm_no'])
    resultFields?: SearchFieldConfig[]; // Fields to display in results
    selectedFields?: SearchFieldConfig[]; // Fields to display in selected item
    labelField?: string; // Primary label field (default: 'name' or first field)
    identifierField?: string; // Identifier field like 'adm_no', 'id', etc.

    // Display props
    label?: string;
    placeholder?: string;
    emptyMessage?: string;
    noResultsMessage?: string;
    loadingMessage?: string;
    type?: 'student' | 'teacher' | 'class' | 'subject' | 'generic'; // Predefined types

    // Behavior props
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    error?: string;
    success?: string;
    hint?: string;
    minChars?: number;
    debounceTime?: number;
    showClearButton?: boolean;
    showSelectedInDropdown?: boolean;
    autoSelectSingleResult?: boolean;

    // Customization
    icon?: React.ReactNode;
    resultTemplate?: (item: SearchResult) => React.ReactNode;
    selectedTemplate?: (item: SearchResult) => React.ReactNode;

    // Styling
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    dropdownClassName?: string;
    selectedClassName?: string;
}

// Predefined field configurations for common types
const predefinedConfigs: Record<
    string,
    { icon: React.ReactNode; fields: SearchFieldConfig[] }
> = {
    student: {
        icon: <GraduationCap className="h-4 w-4" />,
        fields: [
            { key: 'name', label: 'Name', badgeStyle: true, priority: 2 },
            { key: 'adm_no', label: 'ADM No', badgeStyle: true, priority: 1 },
            { key: 'grade', label: 'Grade', badgeStyle: true, priority: 3 },
        ],
    },
    teacher: {
        icon: <Briefcase className="h-4 w-4" />,
        fields: [
            { key: 'name', label: 'Name', priority: 1 },
            {
                key: 'employee_id',
                label: 'Emp ID',
                badgeStyle: true,
                priority: 2,
            },
            { key: 'subject', label: 'Subject', priority: 3 },
            { key: 'department', label: 'Dept', priority: 4 },
        ],
    },
    class: {
        icon: <Users className="h-4 w-4" />,
        fields: [
            { key: 'name', label: 'Class', priority: 1 },
            { key: 'code', label: 'Code', badgeStyle: true, priority: 2 },
            { key: 'teacher', label: 'Teacher', priority: 3 },
            {
                key: 'students_count',
                label: 'Students',
                priority: 4,
                format: (val) => `${val} students`,
            },
        ],
    },
    subject: {
        icon: <Book className="h-4 w-4" />,
        fields: [
            { key: 'name', label: 'Subject', priority: 1 },
            { key: 'code', label: 'Code', badgeStyle: true, priority: 2 },
            { key: 'teacher', label: 'Teacher', priority: 3 },
            { key: 'credits', label: 'Credits', priority: 4 },
        ],
    },
    generic: {
        icon: <Search className="h-4 w-4" />,
        fields: [
            { key: 'id', label: 'ID', priority: 1, badgeStyle: true },
            { key: 'label', label: 'Label', priority: 2 },
        ],
    },
};

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
    // Required props
    name,
    url,
    value,
    onChange,

    // Search configuration
    searchKey = 'search',
    searchFields,
    resultFields,
    selectedFields,
    labelField = 'name',
    identifierField = 'id',

    // Display props
    label,
    placeholder = 'Search...',
    emptyMessage = 'Type to search',
    noResultsMessage = 'No results found',
    loadingMessage = 'Searching...',
    type = 'generic',

    // Behavior props
    required = false,
    disabled = false,
    readOnly = false,
    error,
    success,
    hint,
    minChars = 2,
    debounceTime = 300,
    showClearButton = true,
    showSelectedInDropdown = false,
    autoSelectSingleResult = false,

    // Customization
    icon,
    resultTemplate,
    selectedTemplate,

    // Styling
    className,
    containerClassName,
    labelClassName,
    inputClassName,
    dropdownClassName,
    selectedClassName,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout>();

    // Get field configurations based on type or custom props
    const getFieldConfigs = (
        fields?: SearchFieldConfig[],
        defaultType: string = type,
    ): SearchFieldConfig[] => {
        if (fields) return fields;

        const predefined =
            predefinedConfigs[defaultType] || predefinedConfigs.generic;
        return predefined.fields;
    };

    const resultFieldConfigs = getFieldConfigs(resultFields);
    const selectedFieldConfigs = getFieldConfigs(selectedFields);

    // Get icon based on type
    const getTypeIcon = () => {
        if (icon) return icon;
        const predefined = predefinedConfigs[type] || predefinedConfigs.generic;
        return predefined.icon;
    };

    // Format field value
    const formatFieldValue = (field: SearchFieldConfig, value: any): string => {
        if (field.format) return field.format(value);
        if (value === null || value === undefined) return '';
        return String(value);
    };

    // Build search query with multiple fields
    const buildSearchQuery = (query: string): string => {
        if (!searchFields || searchFields.length === 0) {
            return query;
        }

        const searchParams = new URLSearchParams();
        searchParams.append(searchKey, query);

        // Add search fields if provided
        searchFields.forEach((field) => {
            searchParams.append('fields[]', field);
        });

        return searchParams.toString();
    };

    // Fetch search results
    const fetchResults = useCallback(
        async (query: string) => {
            if (!query.trim() || query.length < minChars) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const queryString = buildSearchQuery(query);
                const searchUrl = url.includes('?')
                    ? `${url}&${queryString}`
                    : `${url}?${queryString}`;
console.log(searchUrl)
                const response = await fetch(searchUrl, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Handle different response formats
                let items: SearchResult[] = [];
                if (Array.isArray(data)) {
                    items = data;
                } else if (data.data && Array.isArray(data.data)) {
                    items = data.data;
                } else if (data.items && Array.isArray(data.items)) {
                    items = data.items;
                } else if (data.results && Array.isArray(data.results)) {
                    items = data.results;
                }

                setResults(items);

                // Auto-select if only one result
                if (autoSelectSingleResult && items.length === 1) {
                    handleSelect(items[0]);
                }
            } catch (err) {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        },
        [url, searchKey, searchFields, minChars, autoSelectSingleResult],
    );

    // Debounced search
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            fetchResults(searchTerm);
        }, debounceTime);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [searchTerm, fetchResults, debounceTime]);

    // Load selected item data when value changes
    useEffect(() => {
        const loadSelectedItem = async () => {
            if (!value) {
                setSelectedItem(null);
                return;
            }

            try {
                const response = await fetch(`${url}/${value}`);
                if (response.ok) {
                    const data = await response.json();
                    // setSelectedItem(data.data);

                    // Set search term to label field or name
                    const labelValue =
                        data[labelField] || data.name || data.label || '';
                    setSearchTerm(labelValue);
                }
            } catch (err) {
                console.error('Error loading selected item:', err);
            }
        };

        loadSelectedItem();
    }, [value, url, labelField]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    setHighlightedIndex((prev) =>
                        prev < results.length - 1 ? prev + 1 : prev,
                    );
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (highlightedIndex >= 0 && results[highlightedIndex]) {
                        handleSelect(results[highlightedIndex]);
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    setIsOpen(false);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, highlightedIndex]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length >= minChars) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }

        // Clear selection if user starts typing
        if (
            selectedItem &&
            value !==
                (selectedItem[labelField] ||
                    selectedItem.name ||
                    selectedItem.label)
        ) {
            handleClear();
        }
    };


    const handleSelect = (item: SearchResult) => {

        setSelectedItem(item);
        const labelValue = item[labelField] || item.name || item.label || '';
        setSearchTerm(labelValue);
        onChange(name, item[identifierField] || item.id, item);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    const handleClear = () => {
        setSelectedItem(null);
        setSearchTerm('');
        onChange(name, null);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleInputFocus = () => {
        if (searchTerm.length >= minChars && results.length > 0) {
            setIsOpen(true);
        }
    };

    const handleMouseEnterResult = (index: number) => {
        setHighlightedIndex(index);
    };

    // Default result template
    const defaultResultTemplate = (item: SearchResult) => {
        // Sort fields by priority
        const sortedFields = [...resultFieldConfigs]
            .filter((field) => field.displayInResult !== false && !field.hidden)
            .sort((a, b) => (a.priority || 99) - (b.priority || 99));

        return (
            <div className="flex items-center justify-between">
                <div className="flex min-w-0 flex-1 items-center space-x-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                        {getTypeIcon()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                            {sortedFields.map((field, idx) => {
                                const value = item[field.key];
                                if (!value && value !== 0) return null;

                                const formattedValue = formatFieldValue(
                                    field,
                                    value,
                                );

                                if (field.badgeStyle) {
                                    return (
                                        <span
                                            key={field.key}
                                            className={cn(
                                                'shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                                                idx === 0
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-600',
                                            )}
                                        >
                                            {formattedValue}
                                        </span>
                                    );
                                }

                                return (
                                    <span
                                        key={field.key}
                                        className={cn(
                                            'text-xs',
                                            idx === 0
                                                ? 'font-medium text-gray-900'
                                                : 'text-gray-600',
                                        )}
                                    >
                                        {idx > 0 && (
                                            <span className="mx-0.5">•</span>
                                        )}
                                        {formattedValue}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {value === (item[identifierField] || item.id) && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                )}
            </div>
        );
    };

    const defaultSelectedTemplate = (item: SearchResult) => {
        // Sort fields by priority
        const sortedFields = [...selectedFieldConfigs]
            .filter(
                (field) => field.displayInSelected !== false && !field.hidden,
            )
            .sort((a, b) => (a.priority || 99) - (b.priority || 99));

        return (
            <div className="flex items-center justify-between">
                <div className="flex min-w-0 flex-1 items-center space-x-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200 text-blue-600">
                        {getTypeIcon()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                            {sortedFields.map((field, idx) => {
                                const value = item[field.key];
                                if (!value && value !== 0) return null;

                                const formattedValue = formatFieldValue(
                                    field,
                                    value,
                                );

                                if (field.badgeStyle) {
                                    return (
                                        <span
                                            key={field.key}
                                            className={cn(
                                                'shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                                                idx === 0
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-blue-50 text-blue-600',
                                            )}
                                        >
                                            {formattedValue}
                                        </span>
                                    );
                                }

                                return (
                                    <span
                                        key={field.key}
                                        className={cn(
                                            'text-xs',
                                            idx === 0
                                                ? 'font-medium text-blue-900'
                                                : 'text-blue-700/80',
                                        )}
                                    >
                                        {idx > 0 && (
                                            <span className="mx-0.5">•</span>
                                        )}
                                        {formattedValue}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const fieldId = `${name}-search-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div ref={containerRef} className={cn('relative', containerClassName)}>
            {label && (
                <div className="mb-1.5 flex items-center justify-between">
                    <Label
                        htmlFor={fieldId}
                        className={cn(
                            'text-xs font-medium',
                            disabled && 'text-gray-400',
                            error && 'text-red-700',
                            success && 'text-green-700',
                            labelClassName,
                        )}
                    >
                        {label}
                        {required && (
                            <span className="ml-0.5 text-red-500">*</span>
                        )}
                    </Label>
                    {hint && (
                        <span className="text-xs text-gray-500">{hint}</span>
                    )}
                </div>
            )}

            <div className="relative">
                <div className="relative">
                    <Input
                        ref={inputRef}
                        id={fieldId}
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={handleInputFocus}
                        placeholder={placeholder}
                        disabled={disabled || readOnly}
                        readOnly={readOnly}
                        autoComplete="on"
                        aria-autocomplete="list"
                        aria-expanded={isOpen}
                        aria-controls={`${fieldId}-results`}
                        aria-describedby={
                            error
                                ? `${fieldId}-error`
                                : success
                                  ? `${fieldId}-success`
                                  : undefined
                        }
                        aria-invalid={!!error}
                        className={cn(
                            'h-9 rounded-full border-gray-300 pr-10 text-sm focus:border-blue-500 focus:ring-0',
                            'transition-all duration-150',
                            error && 'border-red-500 focus:border-red-500',
                            success &&
                                'border-green-500 focus:border-green-500',
                            inputClassName,
                        )}
                    />

                    <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center space-x-1.5">
                        {isLoading && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-500" />
                        )}
                        {!isLoading &&
                            searchTerm &&
                            showClearButton &&
                            !disabled &&
                            !readOnly && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="rounded-full p-0.5 transition-colors hover:bg-gray-100"
                                    aria-label="Clear search"
                                >
                                    <X className="h-3.5 w-3.5 text-gray-500 hover:text-gray-700" />
                                </button>
                            )}
                        {!isLoading && !searchTerm && (
                            <Search className="h-3.5 w-3.5 text-gray-500" />
                        )}
                    </div>
                </div>

                {/* Dropdown */}
                {isOpen && !disabled && !readOnly && (
                    <div
                        id={`${fieldId}-results`}
                        className={cn(
                            'absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1.5 text-sm shadow-lg',
                            dropdownClassName,
                        )}
                        role="listbox"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center py-2">
                                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-gray-500" />
                                <span className="text-xs text-gray-600">
                                    {loadingMessage}
                                </span>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="py-2 text-center">
                                <p className="text-xs text-gray-600">
                                    {searchTerm.length >= minChars
                                        ? noResultsMessage
                                        : emptyMessage}
                                </p>
                            </div>
                        ) : (
                            results.map((item, index) => (
                                <div
                                    key={item[identifierField] || item.id}
                                    className={cn(
                                        'mx-1.5 cursor-pointer rounded-md px-3 py-1.5 transition-colors duration-100',
                                        'hover:bg-blue-50/80',
                                        highlightedIndex === index &&
                                            'bg-blue-50',
                                        value ===
                                            (item[identifierField] ||
                                                item.id) &&
                                            !showSelectedInDropdown &&
                                            'hidden',
                                    )}
                                    onClick={() => handleSelect(item)}
                                    onMouseEnter={() =>
                                        handleMouseEnterResult(index)
                                    }
                                    role="option"
                                    aria-selected={
                                        value ===
                                        (item[identifierField] || item.id)
                                    }
                                >
                                    {resultTemplate
                                        ? resultTemplate(item)
                                        : defaultResultTemplate(item)}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Selected item display */}
            {selectedItem && !isOpen && showSelectedInDropdown && (
                <div
                    className={cn(
                        'mt-1.5 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/30 px-3 py-1.5',
                        selectedClassName,
                    )}
                >
                    <div className="min-w-0 flex-1">
                        {selectedTemplate
                            ? selectedTemplate(selectedItem)
                            : defaultSelectedTemplate(selectedItem)}
                    </div>
                    {!disabled && !readOnly && showClearButton && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="ml-2 shrink-0 rounded  bg-white px-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                        >
                            <Delete className='h-5'/>
                        </button>
                    )}
                </div>
            )}

            {error && (
                <p
                    id={`${fieldId}-error`}
                    className="mt-1 text-xs text-red-500"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {success && (
                <p
                    id={`${fieldId}-success`}
                    className="mt-1 text-xs text-green-500"
                >
                    {success}
                </p>
            )}
        </div>
    );
};

export default SearchAutocomplete;
