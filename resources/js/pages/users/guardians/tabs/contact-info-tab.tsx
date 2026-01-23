// guardians/tabs/contact-info-tab.tsx
import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';

import { GuardianFormData, GuardianFormErrors } from '@/types/guardian';
import { PhoneCall, PhoneForwarded } from 'lucide-react';

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
                <FormSection
                    title="Contact Information"
                    Icon={{ icon: PhoneCall, color: 'green-500' }}
                >
                    <FormGrid cols={2}>
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
                </FormGrid>
                
                <FormGrid cols={2}>
                    <FormField
                    name="email"
                    label="Email Address"
                    type="email"
                    value={data.email}
                    onChange={onChange}
                    placeholder="e.g., guardian@example.com"
                    error={errors?.email}
                /></FormGrid>
                </FormSection>

            
        </div>
    );
}
