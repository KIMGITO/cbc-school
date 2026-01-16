import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import { LucideMapPinHouse } from 'lucide-react';

interface addressDataInterface {
    county?: string;
    sub_county?: string;
    ward?: string;
    location?: string;
    sub_location?: string;
    upi_number?: string;
}
interface AddressInfoTabProps {
    data?: addressDataInterface;
    errors?: addressDataInterface;
    onChange?: (field: string, value: string) => void;
}

export default function AddressInfoTab({
    data = {},
    errors = {},
    onChange,
}: AddressInfoTabProps) {
    const handleChange = (field: string, value: string) => {
        if (onChange) {
            onChange(field, value);
        }
    };

    return (
        <div className="space-y-6">
            <FormSection
                Icon={{ icon: LucideMapPinHouse, color: 'green-500' }}
                title="Residential Address"
                border={false}
            >
                <FormGrid cols={2} gap="md">
                    <FormField
                        error={errors.county}
                        label="County"
                        required
                        name="county"
                        placeholder="Enter County"
                        value={data.county || ''}
                        onChange={handleChange}
                    />
                    <FormField
                        error={errors.sub_county}
                        label="Sub-County"
                        required
                        name="sub_county"
                        placeholder="Enter Sub-County"
                        value={data.sub_county || ''}
                        onChange={handleChange}
                    />
                </FormGrid>

                <FormGrid cols={2} gap="md">
                    <FormField
                        error={errors.ward}
                        label="Ward"
                        required
                        name="ward"
                        placeholder="Enter ward"
                        value={data.ward || ''}
                        onChange={handleChange}
                    />
                    <FormField
                        error={errors.location}
                        label="Location"
                        required
                        name="location"
                        placeholder="Enter location"
                        value={data.location || ''}
                        onChange={handleChange}
                    />
                </FormGrid>

                <FormGrid cols={2} gap="md">
                    <FormField
                        error={errors.sub_location}
                        label="Sub-Location"
                        required
                        name="sub_location"
                        placeholder="Enter sub-location"
                        value={data.sub_location || ''}
                        onChange={handleChange}
                    />
                    <FormField
                        error={errors.upi_number}
                        label="UPI Number"
                        required={false}
                        name="upi_number"
                        placeholder="Enter UPI number"
                        value={data.upi_number || ''}
                        onChange={handleChange}
                    />
                </FormGrid>
            </FormSection>
        </div>
    );
}
