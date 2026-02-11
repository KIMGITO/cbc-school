import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDepartmentStore } from '@/stores/department-store';
import { useTeacherAdmissionStore } from '@/stores/teacher-admission-store';
import {
    BadgeCheck,
    Briefcase,
    GraduationCap,
    Plus,
    Trash2,
} from 'lucide-react';
import { useEffect } from 'react';

export default function ProfessionalInfoTab() {
    // Get data and actions from the store
    const {
        formData,
        formDataErrors,
        selectedTeacher,
        updateFormField,
        addQualification,
        updateQualification,
        removeQualification,
        clearFormFieldError,
    } = useTeacherAdmissionStore();

    const { departments, fetchDepartments } = useDepartmentStore();

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    const handleQualificationChange = (
        index: number,
        field: string,
        value: any,
    ) => {
        // Update qualification in store
        updateQualification(index, { [field]: value });

        // Clear any existing error for this qualification field
        const errorKey = `qualifications.${index}.${field}`;
        clearFormFieldError(errorKey);
    };

    const handleFormFieldChange = (field: keyof any, value: any) => {
        updateFormField(field, value);
    };

    const handleAddNewQualification = () => {
        addQualification({
            name: '',
            institution: '',
            year_completed: '',
            tsc_registered: false,
        });
    };

    const handleRemoveQualification = (index: number) => {
        removeQualification(index);
    };

    // Helper to extract qualification error messages
    const getQualificationError = (index: number, field: string): string => {
        const errorKey = `qualifications.${index}.${field}`;
        const error = formDataErrors[errorKey];

        if (Array.isArray(error)) {
            return error[0] || '';
        }

        return error || '';
    };

    return (
        <div className="space-y-6">
            <FormSection
                title="Professional Information"
                Icon={{ icon: Briefcase, color: 'orange-500' }}
            >
                <FormSection title="Official Details" border={false}>
                    <FormGrid cols={2}>
                        <FormField
                            name="tsc_number"
                            label="TSC Number"
                            type="input"
                            value={formData.tsc_number}
                            onChange={handleFormFieldChange}
                            required
                            error={formDataErrors.tsc_number || formDataErrors.tsc_number_hash}
                            placeholder="e.g., 1234567"
                        />
                        <FormField
                            name="kra_pin"
                            label="KRA PIN"
                            type="input"
                            value={formData.kra_pin}
                            onChange={handleFormFieldChange}
                            required
                            error={formDataErrors.kra_pin || formDataErrors.kra_pin_hash}
                            placeholder="e.g., A123456789A"
                        />
                    </FormGrid>
                    <FormGrid cols={2}>
                        <FormField
                            name="department_id"
                            label="Department"
                            type="select"
                            value={formData.department_id || ''}
                            emptyOption="Select Department"
                            options={departments}
                            onChange={handleFormFieldChange}
                            error={formDataErrors.department_id as string}
                            placeholder="e.g., Mathematics Department"
                        />

                        <FormField
                            name="employment_date"
                            required
                            label="Hire Date"
                            type="calendar"
                            value={formData.employment_date || ''}
                            onChange={handleFormFieldChange}
                            error={formDataErrors.employment_date}
                        />
                    </FormGrid>
                </FormSection>

                <FormSection
                    title="Qualifications"
                    border={false}
                    action={
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddNewQualification}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Qualification
                        </Button>
                    }
                >
                    <div className="space-y-4">
                        {formData.qualifications &&
                        formData.qualifications.length > 0 ? (
                            <div className="relative">
                                {formData.qualifications.map(
                                    (qualification, index) => (
                                        <div
                                            key={index}
                                            className="mb-4 rounded-lg border bg-gray-50 p-4"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="h-5 w-5 text-gray-600" />
                                                    <h4 className="font-medium">
                                                        Qualification #
                                                        {index + 1}
                                                    </h4>
                                                    {qualification.tsc_registered && (
                                                        <BadgeCheck className="h-4 w-4 text-green-600" />
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleRemoveQualification(
                                                            index,
                                                        )
                                                    }
                                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <FormGrid cols={3}>
                                                <FormField
                                                    name={`qualifications[${index}].name`}
                                                    label="Qualification Name"
                                                    type="input"
                                                    value={qualification.name}
                                                    error={getQualificationError(
                                                        index,
                                                        'name',
                                                    )}
                                                    onChange={(field, value) =>
                                                        handleQualificationChange(
                                                            index,
                                                            'name',
                                                            value,
                                                        )
                                                    }
                                                    placeholder="e.g., Bachelor of Education"
                                                />
                                                <FormField
                                                    name={`qualifications[${index}].institution`}
                                                    label="Institution"
                                                    type="input"
                                                    value={
                                                        qualification.institution
                                                    }
                                                    onChange={(field, value) =>
                                                        handleQualificationChange(
                                                            index,
                                                            'institution',
                                                            value,
                                                        )
                                                    }
                                                    placeholder="e.g., University of Nairobi"
                                                    error={getQualificationError(
                                                        index,
                                                        'institution',
                                                    )}
                                                />
                                                <FormField
                                                    name={`qualifications[${index}].year_completed`}
                                                    label="Year Completed"
                                                    type="input"
                                                    value={
                                                        qualification.year_completed
                                                    }
                                                    onChange={(field, value) =>
                                                        handleQualificationChange(
                                                            index,
                                                            'year_completed',
                                                            value,
                                                        )
                                                    }
                                                    placeholder="e.g., 2020"
                                                    inputType="number"
                                                    error={getQualificationError(
                                                        index,
                                                        'year_completed',
                                                    )}
                                                />
                                            </FormGrid>

                                            <div className="mt-3 flex items-center justify-between">
                                                <FormField
                                                    name={`qualifications[${index}].tsc_registered`}
                                                    label="TSC Registered?"
                                                    checkboxLabel="TSC Approved?"
                                                    type="checkbox"
                                                    value={
                                                        qualification.tsc_registered
                                                    }
                                                    onChange={(field, value) =>
                                                        handleQualificationChange(
                                                            index,
                                                            'tsc_registered',
                                                            value,
                                                        )
                                                    }
                                                    labelClassName="text-blue-500"
                                                />
                                            </div>
                                        </div>
                                    ),
                                )}
                                <Button
                                    type="button"
                                    variant="solid"
                                    size="sm"
                                    onClick={handleAddNewQualification}
                                    className="fixed right-6 bottom-2 z-10 flex gap-2 bg-green-600 text-white shadow-md hover:bg-green-700 md:absolute"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                                <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                    No Qualifications Added
                                </h3>
                                <p className="mt-1 text-gray-600">
                                    Add at least one qualification to continue
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-4 gap-2"
                                    onClick={handleAddNewQualification}
                                >
                                    <Plus className="h-4 w-4" />
                                    Add First Qualification
                                </Button>
                            </div>
                        )}
                    </div>
                </FormSection>
            </FormSection>

            {selectedTeacher && (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                    <p>
                        <strong>Note:</strong> Professional details like TSC
                        number are official records. Ensure accuracy when
                        updating.
                    </p>
                </div>
            )}
        </div>
    );
}
