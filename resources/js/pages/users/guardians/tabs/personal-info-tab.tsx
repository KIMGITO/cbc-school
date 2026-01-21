// guardians/tabs/personal-info-tab.tsx
import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';

import { GuardianFormData, GuardianFormErrors } from '@/types/guardian';
import { User, User2Icon } from 'lucide-react';

interface PersonalInfoTabProps {
    data: GuardianFormData;
    onChange: (field: keyof GuardianFormData, value: any) => void;
    errors?: GuardianFormErrors;
    selectedGuardian?: any;
}

export default function PersonalInfoTab({
    data,
    onChange,
    errors,
    selectedGuardian,
}: PersonalInfoTabProps) {
    return (
        <div className="space-y-6">
            <FormSection
                title="Personal information"
                Icon={{ icon: User, color: 'green-500' }}
            >
                <FormSection
                    title="Identification Data"
                    border={false}
                >
                    <FormGrid cols={2}>
                        <FormField
                            name="first_name"
                            label="First Name"
                            type="input"
                            value={data.first_name}
                            onChange={onChange}
                            required
                            error={errors?.first_name}
                            disabled={!!selectedGuardian}
                            placeholder="Enter first name"
                        />

                        <FormField
                            name="middle_name"
                            label="Middle Name"
                            type="input"
                            value={data.middle_name}
                            onChange={onChange}
                            placeholder="Enter middle name"
                        />

                        <FormField
                            name="last_name"
                            label="Last Name"
                            type="input"
                            value={data.last_name}
                            onChange={onChange}
                            required
                            error={errors?.last_name}
                            disabled={!!selectedGuardian}
                            placeholder="Enter last name"
                        />
                        <FormField
                            name="national_id"
                            label="National ID / Passport"
                            type="input"
                            value={data.national_id}
                            onChange={onChange}
                            required
                            error={errors?.national_id}
                            disabled={!!selectedGuardian}
                            placeholder="e.g., 12345678"
                            inputType="number"
                        />
                    </FormGrid>
                </FormSection>
                <FormSection title="Income Data" border={false}>
                    <FormGrid cols={3} align="end">
                        <FormField
                            name="occupation"
                            label="Occupation"
                            type="input"
                            value={data.occupation}
                            onChange={onChange}
                            placeholder="e.g., Teacher, Doctor, Business"
                        />
                    </FormGrid>
                </FormSection>
            </FormSection>

            {selectedGuardian && (
                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                    <p>
                        <strong>Note:</strong> Personal information cannot be
                        changed for existing guardians. Contact the
                        administration for updates.
                    </p>
                </div>
            )}
        </div>
    );
}
