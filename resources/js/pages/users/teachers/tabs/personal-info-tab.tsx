import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import { useTeacherAdmissionStore } from '@/stores/teacher-admission-store';
import { User } from 'lucide-react';

export default function PersonalInfoTab() {
    // Get data and actions from the store
    const {
        formData,
        formDataErrors,
        selectedTeacher,
        updateFormField,
        clearFormFieldError,
    } = useTeacherAdmissionStore();

    const handleFieldChange = (field: keyof any, value: any) => {
        updateFormField(field, value);
    };

    // Helper to get error message - handles both string and array errors
    const getErrorMessage = (field: string): string => {
        const error = formDataErrors[field];

        if (Array.isArray(error)) {
            return error[0] || '';
        }

        return error || '';
    };

    return (
        <div className="space-y-6">
            <FormSection
                title="Personal Information"
                Icon={{ icon: User, color: 'green-500' }}
            >
                <FormSection title="Identification Data" border={false}>
                    <FormGrid cols={3}>
                        <FormField
                            name="sir_name"
                            label="Surname"
                            type="input"
                            value={formData.sir_name}
                            onChange={handleFieldChange}
                            required
                            error={getErrorMessage('sir_name')}
                            disabled={!!selectedTeacher}
                            placeholder="Enter surname"
                        />
                        <FormField
                            name="first_name"
                            label="First Name"
                            type="input"
                            value={formData.first_name}
                            onChange={handleFieldChange}
                            required
                            error={getErrorMessage('first_name')}
                            disabled={!!selectedTeacher}
                            placeholder="Enter first name"
                        />
                        <FormField
                            name="other_names"
                            label="Other Names"
                            type="input"
                            value={formData.other_names}
                            onChange={handleFieldChange}
                            error={getErrorMessage('other_names')}
                            disabled={!!selectedTeacher}
                            placeholder="Enter other names"
                        />
                    </FormGrid>

                    <FormGrid cols={3}>
                        <FormField
                            name="national_id"
                            label="National ID"
                            type="input"
                            value={formData.national_id}
                            onChange={handleFieldChange}
                            required
                            error={
                                getErrorMessage('national_id') ||
                                getErrorMessage('national_id_hash')
                            }
                            disabled={!!selectedTeacher}
                            placeholder="e.g., 12345678"
                            inputType="number"
                        />
                        <FormField
                            name="gender"
                            label="Gender"
                            type="select"
                            value={formData.gender}
                            onChange={handleFieldChange}
                            required
                            placeholder="Select Gender"
                            error={getErrorMessage('gender')}
                            emptyOption="Select Gender"
                            options={[
                                { label: 'Male', value: 'male' },
                                { label: 'Female', value: 'female' },
                                { label: 'Other', value: 'other' },
                            ]}
                        />
                    </FormGrid>
                </FormSection>
            </FormSection>

            {selectedTeacher && (
                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                    <p>
                        <strong>Note:</strong> Personal information cannot be
                        changed for existing teachers. Contact the
                        administration for updates.
                    </p>
                </div>
            )}
        </div>
    );
}
