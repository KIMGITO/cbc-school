import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import SearchAutocomplete from '@/components/custom/search-autocomplete';
import { useGuardianAdmissionStore } from '@/stores/guardian-admission-store';
import { School2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AddressInfoTab() {
    const {
        formData,
        formDataErrors,
        setFormData,
        updateFormField,
        selectedGuardian,
    } = useGuardianAdmissionStore();

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

    // Initialize local state from form data when component mounts or data changes
    useEffect(() => {
        if (formData.county) {
            setCounty({
                id: formData.county,
                name: formData.county_name,
            });
        }
        if (formData.sub_county) {
            setSubCounty({
                id: formData.sub_county,
                name: formData.sub_county,
            });
        }
        if (formData.ward) {
            setWard({
                id: formData.ward,
                name: formData.ward_name,
            });
        }
    }, [
        formData.county,
        formData.sub_county,
        formData.ward,
        formData.county_name,
        formData.ward_name,
    ]);

    // Handle county selection
    const handleCountyChange = (name: string, value: string, item: any) => {
        updateFormField('county', item?.id || '');
        updateFormField('county_name', item?.name || '');

        setCounty({ name: item?.name, id: item?.id });

        // Reset dependent fields
        setSubCounty(null);
        setWard(null);
        updateFormField('sub_county', '');
        updateFormField('ward', '');
    };

    // Handle sub-county selection
    const handleSubCountyChange = (name: string, value: string, item: any) => {
        updateFormField('sub_county', item?.id || '');
        updateFormField('sub_county_name', item?.name || '');
        setSubCounty({ id: item?.id, name: item?.name });

        // Reset dependent field
        setWard(null);
        updateFormField('ward', '');
    };

    // Handle ward selection
    const handleWardChange = (name: string, value: string, item: any) => {
        updateFormField('ward', item?.id || '');
        updateFormField('ward_name', item?.name || '');

        setWard({ id: item?.id, name: item?.name });
    };

    // Clear all address fields
    const handleClearAddress = () => {
        setCounty(null);
        setSubCounty(null);
        setWard(null);
        updateFormField('county', '');
        updateFormField('county_name', '');

        updateFormField('sub_county', '');
        updateFormField('sub_county_name', '');

        updateFormField('ward', '');
        updateFormField('ward_name', '');

        updateFormField('location', '');
        updateFormField('sub_location', '');
        updateFormField('address', '');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <FormSection
                    titleClassName="text-green-800"
                    title="Address Information"
                    Icon={{ icon: School2Icon, color: 'green-500' }}
                >
                    {selectedGuardian && (
                        <div className="text-sm text-gray-500">
                            Editing: {selectedGuardian.first_name}{' '}
                            {selectedGuardian.sir_name}
                        </div>
                    )}
                </FormSection>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <FormField
                    name="address"
                    label="Physical Address"
                    required
                    type="textarea"
                    value={`
COUNTY:\t\t\t\t\t\t${formData.county_name.toUpperCase() || ''}
CONSTITUENCY:\t${formData.sub_county.toUpperCase() || ''}
WARD:\t\t\t\t\t\t\t${formData.ward_name.toUpperCase() || ''}
LOCATION:\t\t\t\t${formData.location.toUpperCase() || ''}
SUB- LOCATION:\t${formData.sub_location.toUpperCase() || ''}`}
                    onChange={() => {}}
                    readOnly
                    placeholder="Enter full physical address"
                    rows={5}
                    error={formDataErrors?.address}
                />
            </div>

            <FormGrid cols={2}>
                <SearchAutocomplete
                    name="county"
                    onChange={handleCountyChange}
                    label="Search County"
                    value={''}
                    required
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
                        { key: 'name', label: 'Name', priority: 2 },
                    ]}
                    error={formDataErrors?.county}
                    type="generic"
                    showClearButton={true}
                    showSelectedInDropdown={false}
                    selectedFields={[
                        { label: 'id', key: 'ID', priority: 1 },
                        { label: 'name', key: 'name', priority: 2 },
                    ]}
                    url="/api/v1/address/search?"
                    inputClassName="bg-gray-700/20 border-2 border-blue-500"
                />

                <SearchAutocomplete
                    name="sub_county"
                    onChange={handleSubCountyChange}
                    value={''}
                    label="Search A Constituency"
                    required
                    placeholder="Search for a constituency ..."
                    noResultsMessage="No constituency found"
                    loadingMessage="Loading constituencies..."
                    searchFields={['name']}
                    resultFields={[{ key: 'name', label: 'Name' }]}
                    error={formDataErrors?.sub_county}
                    type="generic"
                    showClearButton={true}
                    selectedFields={[
                        { label: 'name', key: 'name', priority: 1 },
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
                    label="Search For Ward"
                    required
                    placeholder="Search for a ward ..."
                    noResultsMessage="No ward found"
                    loadingMessage="Loading wards..."
                    searchFields={['name']}
                    resultFields={[{ key: 'name', label: 'Name' }]}
                    error={formDataErrors?.ward}
                    type="generic"
                    showClearButton={true}
                    showSelectedInDropdown={false}
                    selectedFields={[
                        { label: 'name', key: 'name', priority: 1 },
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
                    error={formDataErrors?.location}
                    onChange={(name, value) =>
                        updateFormField('location', value)
                    }
                    placeholder="e.g., Kangemi"
                />

                <FormField
                    required
                    name="sub_location"
                    label="Sub-Location"
                    type="input"
                    value={formData.sub_location || ''}
                    error={formDataErrors?.sub_location}
                    onChange={(name, value) =>
                        updateFormField('sub_location', value)
                    }
                    placeholder="e.g., Kangemi"
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
    );
}
