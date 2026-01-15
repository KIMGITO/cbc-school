import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import { LucideMapPinHouse } from 'lucide-react';

interface AddressInfoTabProps {
    data?: {
        county?: string;
        sub_county?: string;
        ward?: string;
        location?: string;
        sub_location?: string;
        upi_number?: string;
    };
    onChange?: (field: string, value: string) => void;
}

export default function AddressInfoTab({
    data = {},
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
                        label="County"
                        required
                        name="county"
                        placeholder="Enter County"
                        value={data.county || ''}
                        onChange={(value) => handleChange('county', value)}
                    />
                    <FormField
                        label="Sub-County"
                        required
                        name="sub_county"
                        placeholder="Enter Sub-County"
                        value={data.sub_county || ''}
                        onChange={(value) => handleChange('sub_county', value)}
                    />
                </FormGrid>

                <FormGrid cols={2} gap="md">
                    <FormField
                        label="Ward"
                        required
                        name="ward"
                        placeholder="Enter ward"
                        value={data.ward || ''}
                        onChange={(value) => handleChange('ward', value)}
                    />
                    <FormField
                        label="Location"
                        required
                        name="location"
                        placeholder="Enter location"
                        value={data.location || ''}
                        onChange={(value) => handleChange('location', value)}
                    />
                </FormGrid>

                <FormGrid cols={2} gap="md">
                    <FormField
                        label="Sub-Location"
                        required
                        name="sub_location"
                        placeholder="Enter sub-location"
                        value={data.sub_location || ''}
                        onChange={(value) =>
                            handleChange('sub_location', value)
                        }
                    />
                    <FormField
                        label="UPI Number"
                        required={false}
                        name="upi_number"
                        placeholder="Enter UPI number"
                        value={data.upi_number || ''}
                        onChange={(value) => handleChange('upi_number', value)}
                    />
                </FormGrid>
            </FormSection>
        </div>
    );
}
