import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import { useTeacherAdmissionStore } from '@/stores/teacher-admission-store';
import { Phone } from 'lucide-react';

export default function ContactInfoTab() {
    // Get data and actions from the store
    const {
        formData,
        formDataErrors,
        selectedTeacher,
        updateFormField,
        clearFormFieldError,
    } = useTeacherAdmissionStore();

    const handleFieldChange = (field: keyof any, value: any) => {
        // Clear error for this field if it exists
        clearFormFieldError(field);
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
                title="Contact Information"
                Icon={{ icon: Phone, color: 'blue-500' }}
            >
                <FormSection title="Contact Details" border={false}>
                    <FormGrid cols={3}>
                        <FormField
                            name="phone_number"
                            label="Primary Phone"
                            type="input"
                            value={formData.phone_number}
                            onChange={handleFieldChange}
                            required
                            error={
                                getErrorMessage('phone_number') ||
                                getErrorMessage('phone_number_hash')
                            }
                            placeholder="e.g., 0712345678"
                            inputType="tel"
                        />
                        <FormField
                            name="phone_number_2"
                            label="Alternative Phone"
                            type="input"
                            value={formData.phone_number_2}
                            onChange={handleFieldChange}
                            error={
                                getErrorMessage('phone_number_2') ||
                                getErrorMessage('phone_number_2_hash')
                            }
                            placeholder="e.g., 0723456789"
                            inputType="tel"
                        />
                        <FormField
                            name="email"
                            label="Email Address"
                            type="input"
                            value={formData.email}
                            onChange={handleFieldChange}
                            required
                            error={getErrorMessage('email')}
                            placeholder="e.g., teacher@school.edu"
                            inputType="email"
                        />
                    </FormGrid>
                </FormSection>
            </FormSection>

            {selectedTeacher && (
                <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700">
                    <p>
                        <strong>Note:</strong> Contact information can be
                        updated for existing teachers. Please ensure phone
                        numbers are active.
                    </p>
                </div>
            )}
        </div>
    );
}
