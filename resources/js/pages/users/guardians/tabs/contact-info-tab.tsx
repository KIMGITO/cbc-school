// guardians/tabs/contact-info-tab.tsx
import FormField from '@/components/custom/form-field';

import { GuardianFormData, GuardianFormErrors } from '@/types/guardian';

export default function ContactInfoTab({
    data,
    onChange,
    errors,
}: {
    data: GuardianFormData;
    onChange: (field: keyof GuardianFormData, value: any) => void;
    errors?: GuardianFormErrors;
}) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                    name="phone_number"
                    label="Primary Phone Number"
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
                    label="Secondary Phone Number"
                    type="input"
                    value={data.phone_number_2}
                    onChange={onChange}
                    placeholder="e.g., 0700000000 (optional)"
                    inputType="tel"
                />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <FormField
                    name="email"
                    label="Email Address"
                    type="email"
                    value={data.email}
                    onChange={onChange}
                    placeholder="e.g., guardian@example.com"
                    error={errors?.email}
                />
            </div>
        </div>
    );
}
