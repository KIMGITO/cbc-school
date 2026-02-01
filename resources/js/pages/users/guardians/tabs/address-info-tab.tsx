// guardians/tabs/address-info-tab.tsx
import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';

import { GuardianFormData, GuardianFormErrors } from '@/types/guardian';
import { School2Icon } from 'lucide-react';

export default function AddressInfoTab({
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
                titleClassName="text-green-800"
                title="Address Information"
                Icon={{ icon: School2Icon, color: 'green-500' }}
            >
                <div className="grid grid-cols-1 gap-6">
                    <FormField
                        name="address"
                        label="Physical Address"
                        type="textarea"
                        value={data.address}
                        onChange={onChange}
                        placeholder="Enter full physical address"
                        rows={3}
                        error={errors?.address}
                    />
                </div>

                <FormGrid cols={2}>
                    <FormField
                        name="county"
                        label="County"
                        type="input"
                        value={data.county}
                        error={errors?.county}
                        onChange={onChange}
                        placeholder="e.g., Nairobi"
                    />

                    <FormField
                        name="sub_county"
                        label="Sub-County"
                        type="input"
                        value={data.sub_county}
                        error={errors?.sub_county}
                        onChange={onChange}
                        placeholder="e.g., Westlands"
                    />
                </FormGrid>

                <FormGrid cols={3}>
                    <FormField
                        name="ward"
                        label="Ward"
                        type="input"
                        value={data.ward}
                        error={errors?.ward}
                        onChange={onChange}
                        placeholder="e.g., Kangemi"
                    />

                    <FormField
                        name="location"
                        label="Location"
                        type="input"
                        value={data.location}
                        error={errors?.location}
                        onChange={onChange}
                        placeholder="e.g., Kangemi"
                    />

                    <FormField
                        name="sub_location"
                        label="Sub-Location"
                        type="input"
                        value={data.sub_location}
                        error={errors?.sub_location}
                        onChange={onChange}
                        placeholder="e.g., Kangemi"
                    />
                </FormGrid>
            </FormSection>
        </div>
    );
}
