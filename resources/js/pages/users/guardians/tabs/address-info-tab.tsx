// guardians/tabs/address-info-tab.tsx
import FormField from '@/components/custom/form-field';

import { GuardianFormData, GuardianFormErrors } from '@/types/guardian';

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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                    name="county"
                    label="County"
                    type="input"
                    value={data.county}
                    onChange={onChange}
                    placeholder="e.g., Nairobi"
                />

                <FormField
                    name="sub_county"
                    label="Sub-County"
                    type="input"
                    value={data.sub_county}
                    onChange={onChange}
                    placeholder="e.g., Westlands"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                    name="ward"
                    label="Ward"
                    type="input"
                    value={data.ward}
                    onChange={onChange}
                    placeholder="e.g., Kangemi"
                />

                <FormField
                    name="location"
                    label="Location"
                    type="input"
                    value={data.location}
                    onChange={onChange}
                    placeholder="e.g., Kangemi"
                />

                <FormField
                    name="sub_location"
                    label="Sub-Location"
                    type="input"
                    value={data.sub_location}
                    onChange={onChange}
                    placeholder="e.g., Kangemi"
                />
            </div>
        </div>
    );
}
