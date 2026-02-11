import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import SearchAutocomplete from '@/components/custom/search-autocomplete';
import { Button } from '@/components/ui/button';
import { useStudentAdmission } from '@/hooks/use-student-admission';
import { LucideMapPinHouse } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AddressInfoTab() {
    const {
        formData,
        formDataErrors,
        updateFormField,
        clearFormFieldError,
        activeTab,
        goToNextTab,
        goToPreviousTab,
        validateCurrentTab,
    } = useStudentAdmission();

    // Address states
    const [county, setCounty] = useState<{
        name: string | undefined;
        id: string | number | undefined;
    } | null>(null);

    const [subCounty, setSubCounty] = useState<{
        name: string | undefined;
        id: string | number | undefined;
    } | null>(null);

    const [ward, setWard] = useState<{
        name: string | undefined;
        id: string | number | undefined;
    } | null>(null);

    // Initialize address states from form data
    useEffect(() => {
        if (formData.county_id && formData.county_name) {
            setCounty({
                id: formData.county_id,
                name: formData.county_name,
            });
        }
        if (formData.sub_county_id && formData.sub_county_name) {
            setSubCounty({
                id: formData.sub_county_id,
                name: formData.sub_county_name,
            });
        }
        if (formData.ward_id && formData.ward_name) {
            setWard({
                id: formData.ward_id,
                name: formData.ward_name,
            });
        }
    }, [
        formData.county_id,
        formData.county_name,
        formData.sub_county_id,
        formData.sub_county_name,
        formData.ward_id,
        formData.ward_name,
    ]);

    // Helper to get error message
    const getErrorMessage = (field: string): string => {
        const error = formDataErrors[field];
        return error || '';
    };

    // Address handlers
    const handleCountyChange = (name: string, value: string, item: any) => {
        updateFormField('county_name', item?.name || '');
        updateFormField('county_id', item?.id?.toString() || '');
        setCounty({ name: item?.name, id: item?.id });

        // Clear error for county field
        clearFormFieldError('county_name');
        clearFormFieldError('county_id');

        // Reset dependent fields
        setSubCounty(null);
        setWard(null);
        updateFormField('sub_county_name', '');
        updateFormField('sub_county_id', '');
        updateFormField('ward_name', '');
        updateFormField('ward_id', '');
    };

    const handleSubCountyChange = (name: string, value: string, item: any) => {
        updateFormField('sub_county_name', item?.name || '');
        updateFormField('sub_county_id', item?.id?.toString() || '');
        setSubCounty({ id: item?.id, name: item?.name });

        // Clear error
        clearFormFieldError('sub_county_name');
        clearFormFieldError('sub_county_id');

        // Reset dependent field
        setWard(null);
        updateFormField('ward_name', '');
        updateFormField('ward_id', '');
    };

    const handleWardChange = (name: string, value: string, item: any) => {
        updateFormField('ward_name', item?.name || '');
        updateFormField('ward_id', item?.id?.toString() || '');
        setWard({ id: item?.id, name: item?.name });

        // Clear error
        clearFormFieldError('ward_name');
        clearFormFieldError('ward_id');
    };

    // Clear address function
    const handleClearAddress = () => {
        setCounty(null);
        setSubCounty(null);
        setWard(null);

        updateFormField('county_name', '');
        updateFormField('county_id', '');
        updateFormField('sub_county_name', '');
        updateFormField('sub_county_id', '');
        updateFormField('ward_name', '');
        updateFormField('ward_id', '');
        updateFormField('location', '');
        updateFormField('sub_location', '');
        updateFormField('upi_number', '');

        // Clear all address-related errors
        const addressFields = [
            'county_name',
            'county_id',
            'sub_county_name',
            'sub_county_id',
            'ward_name',
            'ward_id',
            'location',
            'sub_location',
            'upi_number',
        ];
        addressFields.forEach((field) => clearFormFieldError(field));
    };

    // Handle location field changes
    const handleLocationChange = (field: string, value: string) => {
        clearFormFieldError(field);
        updateFormField(field, value);
    };

    const handleNext = () => {
        if (validateCurrentTab()) {
            goToNextTab();
        }
    };

    const handlePrevious = () => {
        goToPreviousTab();
    };

    return (
        <div className="space-y-6">
            <FormSection
                Icon={{ icon: LucideMapPinHouse, color: 'green-500' }}
                title="Student's Residential Address"
                description="Provide the student's current residential address"
                border={false}
                spacing="lg"
            >
                <div className="space-y-6">
                    {/* Address Summary Display */}
                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            name="address_summary"
                            label="Address Summary"
                            type="textarea"
                            value={`COUNTY:\t\t\t\t\t\t${formData.county_name?.toUpperCase() || ''}
SUB-COUNTY:\t\t\t${formData.sub_county_name?.toUpperCase() || ''}
WARD:\t\t\t\t\t\t\t${formData.ward_name?.toUpperCase() || ''}
LOCATION:\t\t\t\t${formData.location?.toUpperCase() || ''}
SUB-LOCATION:\t${formData.sub_location?.toUpperCase() || ''}
UPI:\t\t\t\t\t\t\t${formData.upi_number?.toUpperCase() || ''}`}
                            onChange={() => {}} // Read-only
                            required
                            placeholder="Address details will appear here..."
                            rows={6}
                            disabled
                        />
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h4 className="mb-4 font-medium text-gray-700">
                            Administrative Division
                        </h4>

                        <FormGrid cols={2}>
                            <SearchAutocomplete
                                name="county"
                                onChange={handleCountyChange}
                                label="County"
                                value={''}
                                required
                                autoSelectSingleResult
                                placeholder="Search for a county ..."
                                noResultsMessage="No county found"
                                loadingMessage="Loading counties..."
                                searchFields={['name']}
                                resultFields={[
                                    {
                                        key: 'id',
                                        label: 'ID',
                                        priority: 1,
                                        badgeStyle: true,
                                    },
                                    {
                                        key: 'name',
                                        label: 'Name',
                                        priority: 2,
                                    },
                                ]}
                                error={getErrorMessage('county_name')}
                                type="generic"
                                showClearButton={true}
                                showSelectedInDropdown={false}
                                selectedFields={[
                                    { label: 'id', key: 'ID', priority: 1 },
                                    {
                                        label: 'name',
                                        key: 'name',
                                        priority: 2,
                                    },
                                ]}
                                url="/api/v1/address/search?"
                                inputClassName="bg-gray-700/20 border-2 border-blue-500"
                            />

                            <SearchAutocomplete
                                name="sub_county"
                                onChange={handleSubCountyChange}
                                value={''}
                                label="Sub-County"
                                required
                                autoSelectSingleResult
                                placeholder="Search for a sub-county ..."
                                noResultsMessage="No sub-county found"
                                loadingMessage="Loading sub-counties..."
                                searchFields={['name']}
                                resultFields={[{ key: 'name', label: 'Name' }]}
                                error={getErrorMessage('sub_county_name')}
                                type="generic"
                                showClearButton={true}
                                selectedFields={[
                                    {
                                        label: 'name',
                                        key: 'name',
                                        priority: 1,
                                    },
                                ]}
                                disabled={!county?.id}
                                url={`/api/v1/address/search?county_id=${county?.id}`}
                                inputClassName="bg-gray-700/20 border-2 border-blue-500"
                            />
                        </FormGrid>

                        <FormGrid cols={3}>
                            <SearchAutocomplete
                                name="ward"
                                minChars={1}
                                onChange={handleWardChange}
                                value={''}
                                label="Ward"
                                required
                                autoSelectSingleResult
                                placeholder="Search for a ward ..."
                                noResultsMessage="No ward found"
                                loadingMessage="Loading wards..."
                                searchFields={['name']}
                                resultFields={[{ key: 'name', label: 'Name' }]}
                                error={getErrorMessage('ward_name')}
                                type="generic"
                                showClearButton={true}
                                showSelectedInDropdown={false}
                                selectedFields={[
                                    {
                                        label: 'name',
                                        key: 'name',
                                        priority: 1,
                                    },
                                ]}
                                disabled={!subCounty?.id}
                                url={`/api/v1/address/search?county_id=${county?.id}&constituency=${subCounty?.id}`}
                                inputClassName="bg-gray-700/20 border-2 border-blue-500"
                            />

                            <FormField
                                name="location"
                                label="Location"
                                required
                                type="input"
                                value={formData.location || ''}
                                error={getErrorMessage('location')}
                                onChange={(name, value) =>
                                    handleLocationChange('location', value)
                                }
                                placeholder="e.g., Kangemi"
                            />

                            <FormField
                                required
                                name="sub_location"
                                label="Sub-Location"
                                type="input"
                                value={formData.sub_location || ''}
                                error={getErrorMessage('sub_location')}
                                onChange={(name, value) =>
                                    handleLocationChange('sub_location', value)
                                }
                                placeholder="e.g., Kangemi Centre"
                            />
                        </FormGrid>

                        {/* UPI Number */}
                        <FormGrid cols={1}>
                            <FormField
                                name="upi_number"
                                label="UPI Number (Unique Personal Identifier)"
                                type="input"
                                value={formData.upi_number || ''}
                                error={getErrorMessage('upi_number')}
                                onChange={(name, value) =>
                                    handleLocationChange('upi_number', value)
                                }
                                placeholder="e.g., 123456789012"
                                description="Optional: Unique identifier for the student"
                            />
                        </FormGrid>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleClearAddress}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Clear all address fields
                            </button>
                        </div>
                    </div>
                </div>
            </FormSection>

            {/* Address Info Notice */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <h3 className="mb-2 font-medium text-blue-800">
                    Address Information Notice
                </h3>
                <ul className="space-y-1 text-sm text-blue-700">
                    <li>
                        • The address provided should be the current residential
                        address
                    </li>
                    <li>
                        • This information is used for emergency contact and
                        school communication
                    </li>
                    <li>
                        • UPI number is optional but recommended for record
                        keeping
                    </li>
                </ul>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between gap-4 border-t pt-4">
                <div>
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        size="lg"
                    >
                        ← Back to Profile Info
                    </Button>
                </div>
                <div>
                    <Button onClick={handleNext} size="lg" className="px-8">
                        Continue to Medical Info →
                    </Button>
                </div>
            </div>
        </div>
    );
}
