'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
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
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useId, useState } from 'react';
import { EnhancedCalendar } from './enhanced-calender';
import { Dialog, DialogContent } from '../ui/dialog';

export type FieldType =
    | 'input'
    | 'textarea'
    | 'select'
    | 'date'
    | 'calendar'
    | 'calendar-enhanced'
    | 'email'
    | 'password'
    | 'number'
    | 'checkbox'
    | 'checkbox-group';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface CheckboxOption {
    id: string;
    label: string;
    value: string;
    checked?: boolean;
    disabled?: boolean;
}

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

interface SelectSpecificProps {
    options?: SelectOption[];
    emptyOption?: string;
}

interface TextareaSpecificProps {
    rows?: number;
    cols?: number;
}

interface CalendarSpecificProps {
    fromDate?: Date;
    toDate?: Date;
    disabledDates?: Date[];
    disabledDays?: number[];
    defaultMonth?: Date;
}

interface CheckboxSpecificProps {
    checkboxLabel?: string;
    checked?: boolean;
    indeterminate?: boolean;
    checkboxOptions?: CheckboxOption[];
}

export type FormFieldProps = BaseFieldProps &
    InputSpecificProps &
    SelectSpecificProps &
    TextareaSpecificProps &
    CalendarSpecificProps &
    CheckboxSpecificProps;

interface EnhancedCalendarProps {
    selected?: Date;
    onSelect?: (date?: Date) => void;
    disabled?: boolean;
    fromDate?: Date;
    toDate?: Date;
    disabledDates?: Date[];
    disabledDays?: number[];
    defaultMonth?: Date;
}

// const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({
//     selected,
//     onSelect,
//     disabled,
//     fromDate,
//     toDate,
//     disabledDates,
//     disabledDays,
//     defaultMonth,
// }) => {
//     const [currentMonth, setCurrentMonth] = React.useState<Date>(
//         defaultMonth || selected || new Date(),
//     );
//     const [showYearPicker, setShowYearPicker] = React.useState(false);

//     const startYear = fromDate?.getFullYear() || 1900;
//     const endYear = toDate?.getFullYear() || 2100;
//     const years = Array.from(
//         { length: endYear - startYear + 1 },
//         (_, i) => startYear + i,
//     );

//     const handleYearSelect = (year: number) => {
//         const newDate = new Date(currentMonth);
//         newDate.setFullYear(year);
//         setCurrentMonth(newDate);
//         setShowYearPicker(false);
//     };

//     const handleMonthNavigation = (direction: 'prev' | 'next') => {
//         const newDate = new Date(currentMonth);
//         newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
//         setCurrentMonth(newDate);
//     };

//     const currentYear = currentMonth.getFullYear();

//     return (
//         <div className="space-y-3">
//             <div className="flex items-center justify-between px-3">
//                 <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => handleMonthNavigation('prev')}
//                     disabled={disabled}
//                     className="h-7 w-7"
//                 >
//                     <ChevronLeft className="h-4 w-4" />
//                 </Button>

//                 <div className="flex items-center gap-2">
//                     {showYearPicker ? (
//                         <Select
//                             value={currentYear.toString()}
//                             onValueChange={(value) =>
//                                 handleYearSelect(parseInt(value))
//                             }
//                         >
//                             <SelectTrigger className="h-7 w-24 text-sm">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="max-h-60">
//                                 {years.map((year) => (
//                                     <SelectItem
//                                         key={year}
//                                         value={year.toString()}
//                                     >
//                                         {year}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     ) : (
//                         <div className="flex items-center gap-1">
//                             <span className="text-sm font-medium">
//                                 {currentMonth.toLocaleDateString('en-US', {
//                                     month: 'long',
//                                 })}
//                             </span>
//                             <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="sm"
//                                 className="h-7 px-2 text-sm font-medium"
//                                 onClick={() => setShowYearPicker(true)}
//                             >
//                                 {currentYear}
//                             </Button>
//                         </div>
//                     )}
//                 </div>

//                 <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => handleMonthNavigation('next')}
//                     disabled={disabled}
//                     className="h-7 w-7"
//                 >
//                     <ChevronRight className="h-4 w-4" />
//                 </Button>
//             </div>

//             <Calendar
//                 mode="single"
//                 selected={selected}
//                 onSelect={onSelect}
//                 disabled={disabled}
//                 fromDate={fromDate}
//                 toDate={toDate}
//                 disabledDates={disabledDates}
//                 disabledDays={disabledDays}
//                 month={currentMonth}
//                 onMonthChange={setCurrentMonth}
//                 className="p-0"
//                 classNames={{
//                     months: 'space-y-0',
//                     month: 'space-y-3',
//                     caption: 'hidden',
//                     caption_label: 'hidden',
//                     nav: 'hidden',
//                     table: 'w-full border-collapse space-y-1',
//                     head_row: 'flex justify-between',
//                     head_cell:
//                         'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
//                     row: 'flex w-full justify-between mt-1',
//                     cell: cn(
//                         'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
//                         'h-8 w-8 rounded-md [&:has([aria-selected])]:bg-accent',
//                     ),
//                     day: cn(
//                         'h-8 w-8 rounded-md p-0 font-normal aria-selected:opacity-100',
//                         'hover:bg-accent hover:text-accent-foreground',
//                         'focus:bg-accent focus:text-accent-foreground',
//                         'aria-selected:bg-primary aria-selected:text-primary-foreground',
//                     ),
//                     day_selected:
//                         'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
//                     day_today: 'bg-accent text-accent-foreground',
//                     day_outside: 'text-muted-foreground opacity-50',
//                     day_disabled: 'text-muted-foreground opacity-50',
//                     day_range_middle:
//                         'aria-selected:bg-accent aria-selected:text-accent-foreground',
//                     day_hidden: 'invisible',
//                 }}
//             />
//         </div>
//     );
// };

const FormField: React.FC<FormFieldProps> = ({
    name,
    label,
    type = 'input',
    value,
    onChange,
    showLabel = true,
    required = false,
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

    inputType = 'text',
    min,
    max,
    step,
    pattern,
    autoComplete,

    options = [],
    emptyOption,

    rows = 3,
    cols,

    fromDate,
    toDate,
    disabledDates,
    disabledDays,
    defaultMonth,

    checkboxLabel,
    checked = false,
    indeterminate = false,
    checkboxOptions = [],
}) => {
    const fieldId = useId();

    const [dialogOpen, setDialogOpen] = useState(false);
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

    const handleCheckboxChange = (checked: boolean) => {
        handleChange(checked);
    };

    const handleCheckboxGroupChange = (optionId: string, checked: boolean) => {
        let currentValues = value || [];

        if (Array.isArray(currentValues)) {
            if (checked) {
                currentValues = [...currentValues, optionId];
            } else {
                currentValues = currentValues.filter(
                    (id: string) => id !== optionId,
                );
            }
        } else {
            currentValues = checked ? [optionId] : [];
        }

        handleChange(currentValues);
    };

    const getInputType = () => {
        if (type === 'email') return 'email';
        if (type === 'password') return 'password';
        if (type === 'number') return 'number';
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
            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={fieldId}
                            checked={value || checked}
                            onCheckedChange={handleCheckboxChange}
                            disabled={disabled}
                            aria-invalid={!!error}
                            aria-describedby={
                                error
                                    ? `${fieldId}-error`
                                    : description
                                      ? `${fieldId}-description`
                                      : undefined
                            }
                            className={cn(
                                error && 'border-red-500',
                                success && 'border-green-500',
                            )}
                        />
                        {checkboxLabel && (
                            <Label
                                htmlFor={fieldId}
                                className={cn(
                                    'cursor-pointer text-sm font-medium',
                                    disabled &&
                                        'cursor-not-allowed text-gray-400',
                                    error && 'text-red-700',
                                    success && 'text-green-700',
                                )}
                            >
                                {checkboxLabel}
                                {required && (
                                    <span className="ml-1 text-red-500">*</span>
                                )}
                            </Label>
                        )}
                    </div>
                );

            case 'checkbox-group':
                return (
                    <div className="space-y-3">
                        {checkboxOptions.map((option) => {
                            const optionFieldId = `${fieldId}-${option.id}`;
                            const isChecked = Array.isArray(value)
                                ? value.includes(option.id)
                                : option.checked || false;

                            return (
                                <div
                                    key={option.id}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={optionFieldId}
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxGroupChange(
                                                option.id,
                                                checked as boolean,
                                            )
                                        }
                                        disabled={disabled || option.disabled}
                                        aria-invalid={!!error}
                                        className={cn(
                                            error && 'border-red-500',
                                            success && 'border-green-500',
                                        )}
                                    />
                                    <Label
                                        htmlFor={optionFieldId}
                                        className={cn(
                                            'cursor-pointer text-sm font-medium',
                                            (disabled || option.disabled) &&
                                                'cursor-not-allowed text-gray-400',
                                            error && 'text-red-700',
                                            success && 'text-green-700',
                                        )}
                                    >
                                        {option.label}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                );

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
                                <SelectItem value="" disabled>
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

            case 'calendar-enhanced':
                return (
                    <>
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full justify-start text-left font-normal',
                                !value && 'text-muted-foreground',
                                commonProps.className,
                            )}
                            onClick={() => setDialogOpen(true)}
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
                                <span>{placeholder || 'Select a date'}</span>
                            )}
                        </Button>

                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogContent className="max-w-[320px] p-0 sm:max-w-[350px]">
                                <div className="p-2">
                                    <EnhancedCalendar
                                        maxHeight="350px"
                                        selected={value}
                                        onSelect={(date) => {
                                            handleCalendarChange(date);
                                            setDialogOpen(false);
                                        }}
                                        disabled={disabled}
                                        fromDate={fromDate}
                                        toDate={toDate}
                                        disabledDates={disabledDates}
                                        disabledDays={disabledDays}
                                        defaultMonth={defaultMonth}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </>
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
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={value}
                                onSelect={handleCalendarChange}
                                initialFocus
                                disabled={disabled}
                                fromDate={fromDate}
                                toDate={toDate}
                                disabledDates={disabledDates}
                                disabledDays={disabledDays}
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

    const shouldShowLabel =
        showLabel && label && type !== 'checkbox' && type !== 'checkbox-group';

    return (
        <div className={cn('space-y-2', containerClassName)}>
            {shouldShowLabel && (
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

            {description &&
                !error &&
                !success &&
                type !== 'checkbox' &&
                type !== 'checkbox-group' && (
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
