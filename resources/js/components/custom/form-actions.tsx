// components/ui/form-actions.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    CheckCircle,
    Loader2,
    RotateCcw,
    Save,
    Send,
    Trash2,
    XCircle,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface FormActionButton {
    id: string;
    label: string;
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link';
    onClick: () => void | Promise<void>;
    icon?: React.ReactNode;
    loadingLabel?: string;
    successLabel?: string;
    showSuccessState?: boolean;
    successDuration?: number;
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export interface FormActionsProps {
    // Primary actions
    onSubmit: () => void | Promise<void>;
    onSaveDraft?: () => void | Promise<void>;
    onClearDraft?: () => void;
    onDelete?: () => void | Promise<void>;
    onCancel?: () => void;
    onReset?: () => void;

    // Custom actions
    customActions?: FormActionButton[];

    // States
    isSubmitting?: boolean;
    isSavingDraft?: boolean;
    isDeleting?: boolean;
    isResetting?: boolean;
    submitLabel?: string;
    saveDraftLabel?: string;
    clearDraftLabel?: string;
    deleteLabel?: string;
    cancelLabel?: string;
    resetLabel?: string;

    // Success states - external control
    showSubmitSuccess?: boolean;
    showSaveSuccess?: boolean;
    showDeleteSuccess?: boolean;
    successDuration?: number;

    // Visibility
    showSubmit?: boolean;
    showSaveDraft?: boolean;
    showClearDraft?: boolean;
    showDelete?: boolean;
    showCancel?: boolean;
    showReset?: boolean;

    // Disabled states
    disableSubmit?: boolean;
    disableSaveDraft?: boolean;
    disableClearDraft?: boolean;
    disableDelete?: boolean;
    disableCancel?: boolean;
    disableReset?: boolean;

    // Customization
    className?: string;
    align?: 'left' | 'center' | 'right' | 'between';
    direction?: 'row' | 'column';
    gap?: 'sm' | 'md' | 'lg';

    // Children
    children?: React.ReactNode;
}

const FormActions: React.FC<FormActionsProps> = ({
    // Primary actions
    onSubmit,
    onSaveDraft,
    onClearDraft,
    onDelete,
    onCancel,
    onReset,

    // Custom actions
    customActions = [],

    // States
    isSubmitting = false,
    isSavingDraft = false,
    isDeleting = false,
    isResetting = false,
    submitLabel = 'Submit',
    saveDraftLabel = 'Save Draft',
    clearDraftLabel = 'Clear Draft',
    deleteLabel = 'Delete',
    cancelLabel = 'Cancel',
    resetLabel = 'Reset',

    // Success states
    showSubmitSuccess = false,
    showSaveSuccess = false,
    showDeleteSuccess = false,
    successDuration = 3000,

    // Visibility
    showSubmit = true,
    showSaveDraft = true,
    showClearDraft = true,
    showDelete = false,
    showCancel = false,
    showReset = false,

    // Disabled states
    disableSubmit = false,
    disableSaveDraft = false,
    disableClearDraft = false,
    disableDelete = false,
    disableCancel = false,
    disableReset = false,

    // Customization
    className,
    align = 'left',
    direction = 'row',
    gap = 'md',

    // Children
    children,
}) => {
    // Success state management
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [shaking, setShaking] = useState(false);

    // Use refs to track timeout IDs
    const submitTimeoutRef = useRef<NodeJS.Timeout>();
    const saveTimeoutRef = useRef<NodeJS.Timeout>();
    const deleteTimeoutRef = useRef<NodeJS.Timeout>();
    const shakeTimeoutRef = useRef<NodeJS.Timeout>();

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (submitTimeoutRef.current)
                clearTimeout(submitTimeoutRef.current);
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            if (deleteTimeoutRef.current)
                clearTimeout(deleteTimeoutRef.current);
            if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
        };
    }, []);

    // Handle external success state changes - FIXED with proper dependencies
    useEffect(() => {
        if (showSubmitSuccess && !submitSuccess) {
            setSubmitSuccess(true);
            submitTimeoutRef.current = setTimeout(() => {
                setSubmitSuccess(false);
            }, successDuration);
        }

        return () => {
            if (submitTimeoutRef.current) {
                clearTimeout(submitTimeoutRef.current);
            }
        };
    }, [showSubmitSuccess, submitSuccess, successDuration]); // Added dependencies

    useEffect(() => {
        if (showSaveSuccess && !saveSuccess) {
            setSaveSuccess(true);
            saveTimeoutRef.current = setTimeout(() => {
                setSaveSuccess(false);
            }, successDuration);
        }

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [showSaveSuccess, saveSuccess, successDuration]);

    useEffect(() => {
        if (showDeleteSuccess && !deleteSuccess) {
            setDeleteSuccess(true);
            setShaking(true);

            deleteTimeoutRef.current = setTimeout(() => {
                setDeleteSuccess(false);
            }, successDuration);

            shakeTimeoutRef.current = setTimeout(() => {
                setShaking(false);
            }, 2000);
        }

        return () => {
            if (deleteTimeoutRef.current)
                clearTimeout(deleteTimeoutRef.current);
            if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
        };
    }, [showDeleteSuccess, deleteSuccess, successDuration]);

    // Enhanced handlers with success states - FIXED: Use useCallback
    const handleSubmit = useCallback(async () => {
        try {
            await onSubmit();
            setSubmitSuccess(true);
            submitTimeoutRef.current = setTimeout(() => {
                setSubmitSuccess(false);
            }, successDuration);
        } catch (error) {
            console.error('Submit error:', error);
        }
    }, [onSubmit, successDuration]);

    const handleSaveDraft = useCallback(async () => {
        if (!onSaveDraft) return;
        try {
            await onSaveDraft();
            setSaveSuccess(true);
            saveTimeoutRef.current = setTimeout(() => {
                setSaveSuccess(false);
            }, successDuration);
        } catch (error) {
            console.error('Save draft error:', error);
        }
    }, [onSaveDraft, successDuration]);

    const handleDelete = useCallback(async () => {
        if (!onDelete) return;
        try {
            await onDelete();
            setDeleteSuccess(true);
            setShaking(true);

            deleteTimeoutRef.current = setTimeout(() => {
                setDeleteSuccess(false);
            }, successDuration);

            shakeTimeoutRef.current = setTimeout(() => {
                setShaking(false);
            }, 2000);
        } catch (error) {
            console.error('Delete error:', error);
        }
    }, [onDelete, successDuration]);

    const handleClearDraft = useCallback(() => {
        if (onClearDraft) {
            onClearDraft();
        }
    }, [onClearDraft]);

    const handleCancel = useCallback(() => {
        if (onCancel) {
            onCancel();
        }
    }, [onCancel]);

    const handleReset = useCallback(() => {
        if (onReset) {
            onReset();
        }
    }, [onReset]);

    // Gap classes
    const gapClasses = {
        sm: direction === 'row' ? 'gap-2' : 'gap-1',
        md: direction === 'row' ? 'gap-3' : 'gap-2',
        lg: direction === 'row' ? 'gap-4' : 'gap-3',
    };

    // Alignment classes
    const alignClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
        between: 'justify-between',
    };

    return (
        <div
            className={cn(
                'flex',
                direction === 'row' ? 'flex-row' : 'flex-col',
                alignClasses[align],
                gapClasses[gap],
                className,
            )}
        >
            {/* Custom children content */}
            {children}

            {/* Custom Actions */}
            {customActions.map((action) => (
                <CustomActionButton
                    key={action.id}
                    action={action}
                    successDuration={successDuration}
                />
            ))}

            {/* Reset Button */}
            {showReset && onReset && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={disableReset || isResetting}
                    className="gap-2"
                >
                    {isResetting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RotateCcw className="h-4 w-4" />
                    )}
                    {isResetting ? 'Resetting...' : resetLabel}
                </Button>
            )}

            {/* Clear Draft Button */}
            {showClearDraft && onClearDraft && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearDraft}
                    disabled={disableClearDraft}
                    className="gap-2"
                >
                    <Trash2 className="h-4 w-4" />
                    {clearDraftLabel}
                </Button>
            )}

            {/* Save Draft Button with Success State */}
            {showSaveDraft && onSaveDraft && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={disableSaveDraft || isSavingDraft || saveSuccess}
                    className={cn(
                        'gap-2 transition-all duration-300',
                        saveSuccess &&
                            'border-green-200 bg-green-50 text-green-700 hover:bg-green-50',
                    )}
                >
                    {isSavingDraft ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : saveSuccess ? (
                        <CheckCircle className="h-4 w-4" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    {isSavingDraft
                        ? 'Saving...'
                        : saveSuccess
                          ? 'Saved!'
                          : saveDraftLabel}
                </Button>
            )}

            {/* Delete Button with Shaking Animation */}
            {showDelete && onDelete && (
                <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={disableDelete || isDeleting || deleteSuccess}
                    className={cn(
                        'gap-2 transition-all duration-300',
                        shaking && 'animate-shake',
                        deleteSuccess &&
                            'border-red-200 bg-red-50 text-red-700 hover:bg-red-50',
                    )}
                >
                    {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : deleteSuccess ? (
                        <XCircle className="h-4 w-4" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                    {isDeleting
                        ? 'Deleting...'
                        : deleteSuccess
                          ? 'Deleted!'
                          : deleteLabel}
                </Button>
            )}

            {/* Cancel Button */}
            {showCancel && onCancel && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={disableCancel}
                    className="gap-2"
                >
                    <XCircle className="h-4 w-4" />
                    {cancelLabel}
                </Button>
            )}

            {/* Submit Button with Success State */}
            {showSubmit && (
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={disableSubmit || isSubmitting || submitSuccess}
                    className={cn(
                        'gap-2 bg-green-600 transition-all duration-300 hover:bg-green-700',
                        submitSuccess &&
                            'border-green-200 bg-green-50 text-green-700 hover:bg-green-50',
                    )}
                >
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : submitSuccess ? (
                        <CheckCircle className="h-4 w-4" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                    {isSubmitting
                        ? 'Submitting...'
                        : submitSuccess
                          ? 'Submitted!'
                          : submitLabel}
                </Button>
            )}
        </div>
    );
};

// Individual Custom Action Button Component - FIXED
interface CustomActionButtonProps {
    action: FormActionButton;
    successDuration?: number;
}

const CustomActionButton: React.FC<CustomActionButtonProps> = ({
    action,
    successDuration = 3000,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    // Cleanup timeout
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleClick = useCallback(async () => {
        if (action.showSuccessState) {
            setIsLoading(true);
            try {
                await action.onClick();
                setShowSuccess(true);
                timeoutRef.current = setTimeout(() => {
                    setShowSuccess(false);
                }, action.successDuration || successDuration);
            } catch (error) {
                console.error('Action error:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            action.onClick();
        }
    }, [action, successDuration]);

    return (
        <Button
            type={action.type || 'button'}
            variant={action.variant || 'default'}
            onClick={handleClick}
            disabled={action.disabled || isLoading || showSuccess}
            className={cn('gap-2', action.className)}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : showSuccess ? (
                <CheckCircle className="h-4 w-4" />
            ) : (
                action.icon
            )}
            {isLoading
                ? action.loadingLabel || 'Loading...'
                : showSuccess
                  ? action.successLabel || 'Success!'
                  : action.label}
        </Button>
    );
};

// Individual button components - FIXED with proper async handling

interface SubmitButtonProps {
    onClick: () => void | Promise<void>;
    label?: string;
    isLoading?: boolean;
    showSuccess?: boolean;
    disabled?: boolean;
    className?: string;
    successDuration?: number;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    onClick,
    label = 'Submit',
    isLoading = false,
    showSuccess = false,
    disabled = false,
    className,
    successDuration = 3000,
}) => {
    const [success, setSuccess] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    // Cleanup
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Handle external success state
    useEffect(() => {
        if (showSuccess && !success) {
            setSuccess(true);
            timeoutRef.current = setTimeout(() => {
                setSuccess(false);
            }, successDuration);
        }
    }, [showSuccess, success, successDuration]);

    const handleClick = useCallback(async () => {
        if (isLoading || success) return;
        try {
            await onClick();
        } catch (error) {
            console.error('Submit error:', error);
        }
    }, [onClick, isLoading, success]);

    return (
        <Button
            type="submit"
            onClick={handleClick}
            disabled={disabled || isLoading || success}
            className={cn(
                'gap-2 bg-green-600 transition-all duration-300 hover:bg-green-700',
                success &&
                    'border-green-200 bg-green-50 text-green-700 hover:bg-green-50',
                className,
            )}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : success ? (
                <CheckCircle className="h-4 w-4" />
            ) : (
                <Send className="h-4 w-4" />
            )}
            {isLoading ? 'Submitting...' : success ? 'Submitted!' : label}
        </Button>
    );
};

interface SaveDraftButtonProps {
    onClick: () => void | Promise<void>;
    label?: string;
    isLoading?: boolean;
    showSuccess?: boolean;
    disabled?: boolean;
    className?: string;
    successDuration?: number;
}

export const SaveDraftButton: React.FC<SaveDraftButtonProps> = ({
    onClick,
    label = 'Save Draft',
    isLoading = false,
    showSuccess = false,
    disabled = false,
    className,
    successDuration = 3000,
}) => {
    const [success, setSuccess] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (showSuccess && !success) {
            setSuccess(true);
            timeoutRef.current = setTimeout(() => {
                setSuccess(false);
            }, successDuration);
        }
    }, [showSuccess, success, successDuration]);

    const handleClick = useCallback(async () => {
        if (isLoading || success) return;
        try {
            await onClick();
        } catch (error) {
            console.error('Save draft error:', error);
        }
    }, [onClick, isLoading, success]);

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={disabled || isLoading || success}
            className={cn(
                'gap-2 transition-all duration-300',
                success &&
                    'border-green-200 bg-green-50 text-green-700 hover:bg-green-50',
                className,
            )}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : success ? (
                <CheckCircle className="h-4 w-4" />
            ) : (
                <Save className="h-4 w-4" />
            )}
            {isLoading ? 'Saving...' : success ? 'Saved!' : label}
        </Button>
    );
};

interface DeleteButtonProps {
    onClick: () => void | Promise<void>;
    label?: string;
    isLoading?: boolean;
    showSuccess?: boolean;
    disabled?: boolean;
    className?: string;
    successDuration?: number;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
    onClick,
    label = 'Delete',
    isLoading = false,
    showSuccess = false,
    disabled = false,
    className,
    successDuration = 3000,
}) => {
    const [success, setSuccess] = useState(false);
    const [shaking, setShaking] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const shakeTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (showSuccess && !success) {
            setSuccess(true);
            setShaking(true);

            timeoutRef.current = setTimeout(() => {
                setSuccess(false);
            }, successDuration);

            shakeTimeoutRef.current = setTimeout(() => {
                setShaking(false);
            }, 2000);
        }
    }, [showSuccess, success, successDuration]);

    const handleClick = useCallback(async () => {
        if (isLoading || success) return;
        try {
            await onClick();
        } catch (error) {
            console.error('Delete error:', error);
        }
    }, [onClick, isLoading, success]);

    return (
        <Button
            type="button"
            variant="destructive"
            onClick={handleClick}
            disabled={disabled || isLoading || success}
            className={cn(
                'gap-2 transition-all duration-300',
                shaking && 'animate-shake',
                success &&
                    'border-red-200 bg-red-50 text-red-700 hover:bg-red-50',
                className,
            )}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : success ? (
                <XCircle className="h-4 w-4" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
            {isLoading ? 'Deleting...' : success ? 'Deleted!' : label}
        </Button>
    );
};

interface ClearDraftButtonProps {
    onClick: () => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

export const ClearDraftButton: React.FC<ClearDraftButtonProps> = ({
    onClick,
    label = 'Clear Draft',
    disabled = false,
    className,
}) => {
    const handleClick = useCallback(() => {
        if (!disabled) {
            onClick();
        }
    }, [onClick, disabled]);

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={disabled}
            className={cn('gap-2', className)}
        >
            <Trash2 className="h-4 w-4" />
            {label}
        </Button>
    );
};

interface CancelButtonProps {
    onClick: () => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

export const CancelButton: React.FC<CancelButtonProps> = ({
    onClick,
    label = 'Cancel',
    disabled = false,
    className,
}) => {
    const handleClick = useCallback(() => {
        if (!disabled) {
            onClick();
        }
    }, [onClick, disabled]);

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={disabled}
            className={cn('gap-2', className)}
        >
            <XCircle className="h-4 w-4" />
            {label}
        </Button>
    );
};

interface ResetButtonProps {
    onClick: () => void;
    label?: string;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
}

export const ResetButton: React.FC<ResetButtonProps> = ({
    onClick,
    label = 'Reset',
    isLoading = false,
    disabled = false,
    className,
}) => {
    const handleClick = useCallback(() => {
        if (!disabled && !isLoading) {
            onClick();
        }
    }, [onClick, disabled, isLoading]);

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={disabled || isLoading}
            className={cn('gap-2', className)}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <RotateCcw className="h-4 w-4" />
            )}
            {isLoading ? 'Resetting...' : label}
        </Button>
    );
};

export default FormActions;
