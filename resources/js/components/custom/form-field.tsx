import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';

export type FieldType =
    | 'input'
    | 'textarea'
    | 'select'
    | 'date'
    | 'calendar'
    | 'email'
    | 'password'
    | 'number';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

// Base props that all field types share
interface BaseFieldProps {
    name: string;
    label?: string;
    type?: FieldType;
    value?: any;
    onChange?: (name: string, value: any) => void;
    showLabel?: boolean;
    required?: boolean;
    placeholder?: string;
    description?: string;
    disabled?: boolean;
    readOnly?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    error?: string;
    success?: string;
    hint?: string;
    autoFocus?: boolean;
}

// Input-specific props
interface InputSpecificProps {
    inputType?:
        | 'text'
        | 'email'
        | 'password'
        | 'number'
        | 'tel'
        | 'url'
        | 'date'
        | 'time'
        | 'datetime-local';
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
    autoComplete?: string;
}

// Select-specific props
interface SelectSpecificProps {
    options?: SelectOption[];
    emptyOption?: string;
}

// Textarea-specific props
interface TextareaSpecificProps {
    rows?: number;
    cols?: number;
}

// Calendar-specific props
interface CalendarSpecificProps {
    fromDate?: Date;
    toDate?: Date;
    disabledDates?: Date[];
    disabledDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
    defaultMonth?: Date;
}

// Combined props type
export type FormFieldProps = BaseFieldProps &
    InputSpecificProps &
    SelectSpecificProps &
    TextareaSpecificProps &
    CalendarSpecificProps & {
        // You can add custom props here if needed
    };

const FormField: React.FC<FormFieldProps> = ({
    // Base props
    name,
    label,
    type = 'input',
    value,
    onChange,
    showLabel = true,
    required = true,
    placeholder,
    description,
    disabled = false,
    readOnly = false,
    containerClassName,
    labelClassName,
    inputClassName,
    error,
    success,
    hint,
    autoFocus = false,

    // Input-specific props
    inputType = 'text',
    min,
    max,
    step,
    pattern,
    autoComplete,

    // Select-specific props
    options = [],
    emptyOption,

    // Textarea-specific props
    rows = 3,
    cols,

    // Calendar-specific props
    fromDate,
    toDate,
    disabledDates,
    disabledDays,
    defaultMonth,
}) => {
    const handleChange = (newValue: any) => {
        if (onChange && !disabled && !readOnly) {
            onChange(name, newValue);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        handleChange(e.target.value);
    };

    const handleSelectChange = (selectedValue: string) => {
        handleChange(selectedValue);
    };

    const handleCalendarChange = (date: Date | undefined) => {
        handleChange(date);
    };

    const fieldId = `${name}-field-${Math.random().toString(36).substr(2, 9)}`;

    // Determine input type based on field type
    const getInputType = () => {
        if (type === 'email') return 'email';
        if (type === 'password') return 'password';
        if (type === 'number') return 'number';
        if (type === 'date') return 'date';
        return inputType;
    };

    const renderField = () => {
        const commonProps = {
            id: fieldId,
            name,
            disabled,
            'aria-disabled': disabled,
            'aria-readonly': readOnly,
            className: cn(
                'focus:border-primary focus:ring-primary',
                disabled && 'cursor-not-allowed opacity-60',
                readOnly && 'cursor-default bg-gray-50',
                error &&
                    'border-red-500 focus:border-red-500 focus:ring-red-500',
                success &&
                    'border-green-500 focus:border-green-500 focus:ring-green-500',
                inputClassName,
            ),
        };

        switch (type) {
            case 'textarea':
                return (
                    <Textarea
                        {...commonProps}
                        value={value || ''}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        rows={rows}
                        cols={cols}
                        aria-invalid={!!error}
                        aria-describedby={
                            error
                                ? `${fieldId}-error`
                                : description
                                  ? `${fieldId}-description`
                                  : undefined
                        }
                    />
                );

            case 'select':
                return (
                    <Select
                        value={value || ''}
                        onValueChange={handleSelectChange}
                        disabled={disabled}
                    >
                        <SelectTrigger
                            {...commonProps}
                            className={cn(commonProps.className, 'w-full')}
                            aria-invalid={!!error}
                            aria-describedby={
                                error
                                    ? `${fieldId}-error`
                                    : description
                                      ? `${fieldId}-description`
                                      : undefined
                            }
                        >
                            <SelectValue
                                placeholder={placeholder || 'Select an option'}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {emptyOption && (
                                <SelectItem value="0" disabled>
                                    {emptyOption}
                                </SelectItem>
                            )}
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.disabled}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'calendar':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !value && 'text-muted-foreground',
                                    commonProps.className,
                                )}
                                disabled={disabled}
                                aria-invalid={!!error}
                                aria-describedby={
                                    error
                                        ? `${fieldId}-error`
                                        : description
                                          ? `${fieldId}-description`
                                          : undefined
                                }
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {value ? (
                                    format(value, 'PPP')
                                ) : (
                                    <span>
                                        {placeholder || 'Select a date'}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={value}
                                onSelect={handleCalendarChange}
                                initialFocus
                                disabled={disabled || disabledDates}
                                fromDate={fromDate}
                                toDate={toDate}
                                defaultMonth={defaultMonth}
                            />
                        </PopoverContent>
                    </Popover>
                );

            case 'input':
            case 'email':
            case 'password':
            case 'number':
            case 'date':
            default:
                return (
                    <Input
                        {...commonProps}
                        type={getInputType()}
                        value={value || ''}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        min={min}
                        max={max}
                        step={step}
                        pattern={pattern}
                        autoComplete={autoComplete}
                        autoFocus={autoFocus}
                        aria-invalid={!!error}
                        aria-describedby={
                            error
                                ? `${fieldId}-error`
                                : description
                                  ? `${fieldId}-description`
                                  : undefined
                        }
                    />
                );
        }
    };

    return (
        <div className={cn('space-y-2', containerClassName)}>
            {showLabel && label && (
                <div className="flex items-center justify-between">
                    <Label
                        htmlFor={fieldId}
                        className={cn(
                            'text-sm font-medium',
                            disabled && 'text-gray-400',
                            error && 'text-red-700',
                            success && 'text-green-700',
                            labelClassName,
                        )}
                    >
                        {label}
                        {required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                        {!required && (
                            <span className="ml-1 text-xs text-gray-500">
                                (Optional)
                            </span>
                        )}
                    </Label>
                    {hint && (
                        <span className="text-xs text-gray-500">{hint}</span>
                    )}
                </div>
            )}

            {renderField()}

            {description && !error && !success && (
                <p
                    id={`${fieldId}-description`}
                    className="text-xs text-gray-500"
                >
                    {description}
                </p>
            )}

            {error && (
                <p
                    id={`${fieldId}-error`}
                    className="text-xs text-red-500"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {success && (
                <p id={`${fieldId}-success`} className="text-xs text-green-500">
                    {success}
                </p>
            )}
        </div>
    );
};

export default FormField;
