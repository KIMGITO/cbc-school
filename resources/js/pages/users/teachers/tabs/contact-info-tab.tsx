import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import { TeacherFormDataProps } from '@/types/teacher';
import { Phone } from 'lucide-react';

interface ContactInfoTabProps {
    data: TeacherFormDataProps;
    onChange: (field: keyof TeacherFormDataProps, value: any) => void;
    errors?: Record<string, string>;
    selectedTeacher?: any;
}

export default function ContactInfoTab({
    data,
    onChange,
    errors,
    selectedTeacher,
}: ContactInfoTabProps) {
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
                            value={data.phone_number}
                            onChange={onChange}
                            required
                            error={errors?.phone_number}
                            placeholder="e.g., 0712345678"
                            inputType="tel"
                        />
                        <FormField
                            name="phone_number_2"
                            label="Alternative Phone"
                            type="input"
                            value={data.phone_number_2}
                            onChange={onChange}
                            error={errors?.phone_number_2}
                            placeholder="e.g., 0723456789"
                            inputType="tel"
                        />
                        <FormField
                            name="email"
                            label="Email Address"
                            type="input"
                            value={data.email}
                            onChange={onChange}
                            required
                            error={errors?.email}
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
