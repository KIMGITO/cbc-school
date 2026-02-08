import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import { TeacherFormDataProps } from '@/types/teacher';
import { User } from 'lucide-react';

interface PersonalInfoTabProps {
    data: TeacherFormDataProps;
    onChange: (field: keyof TeacherFormDataProps, value: any) => void;
    errors?: Record<string, string>;
    selectedTeacher?: any;
}

export default function PersonalInfoTab({
    data,
    onChange,
    errors,
    selectedTeacher,
}: PersonalInfoTabProps) {
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
                            value={data.sir_name}
                            onChange={onChange}
                            required
                            error={errors?.sir_name}
                            disabled={!!selectedTeacher}
                            placeholder="Enter surname"
                        />
                        <FormField
                            name="first_name"
                            label="First Name"
                            type="input"
                            value={data.first_name}
                            onChange={onChange}
                            required
                            error={errors?.first_name}
                            disabled={!!selectedTeacher}
                            placeholder="Enter first name"
                        />
                        <FormField
                            name="other_names"
                            label="Other Names"
                            type="input"
                            value={data.other_names}
                            onChange={onChange}
                            error={errors?.other_names}
                            disabled={!!selectedTeacher}
                            placeholder="Enter other names"
                        />
                    </FormGrid>

                    <FormGrid cols={3}>
                        <FormField
                            name="national_id"
                            label="National ID"
                            type="input"
                            value={data.national_id}
                            onChange={onChange}
                            required
                            error={errors?.national_id}
                            disabled={!!selectedTeacher}
                            placeholder="e.g., 12345678"
                            inputType="number"
                        />
                        <FormField
                            name="gender"
                            label="Gender"
                            type="select"
                            value={data.gender}
                            onChange={onChange}
                            required
                            placeholder="Select Gender"
                            error={errors?.gender}
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
