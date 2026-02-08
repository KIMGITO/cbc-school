import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import SearchAutocomplete from '@/components/custom/search-autocomplete';
import { TeacherFormDataProps } from '@/types/teacher';
import { Building, Home, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LocationInfoTabProps {
    data: TeacherFormDataProps;
    onChange: (field: keyof TeacherFormDataProps, value: any) => void;
    errors?: Record<string, string>;
    selectedTeacher?: any;
}

export default function LocationInfoTab({
    data,
    onChange,
    errors,
    selectedTeacher,
}: LocationInfoTabProps) {
    // Home address states
    const [homeCounty, setHomeCounty] = useState<{
        name: string | undefined;
        id: string | number | undefined;
    } | null>(null);

    const [homeSubCounty, setHomeSubCounty] = useState<{
        name: string | undefined;
        id: string | number | undefined;
    } | null>(null);

    const [homeWard, setHomeWard] = useState<{
        name: string | undefined;
        id: string | number | undefined;
    } | null>(null);

    // Residential address states
    const [residentialCounty, setResidentialCounty] = useState<{
        name: string | undefined;
        id: string | number | undefined;
    } | null>(null);

    const [residentialSubCounty, setResidentialSubCounty] = useState<{
        name: string | undefined;
        id: string | number | undefined;
    } | null>(null);

    const [residentialWard, setResidentialWard] = useState<{
        name: string | undefined;
        id: string | number | undefined;
    } | null>(null);

    // Initialize home address states
    useEffect(() => {
        if (data.home_county) {
            setHomeCounty({
                id: data.home_county,
                name: data.home_county_name,
            });
        }
        if (data.home_sub_county) {
            setHomeSubCounty({
                id: data.home_sub_county,
                name: data.home_sub_county_name,
            });
        }
        if (data.home_ward) {
            setHomeWard({
                id: data.home_ward,
                name: data.home_ward_name,
            });
        }
    }, [
        data.home_county,
        data.home_sub_county,
        data.home_ward,
        data.home_county_name,
        data.home_ward_name,
        data.home_sub_county_name,
    ]);

    // Initialize residential address states (you'll need to add these fields to your TeacherFormDataProps)
    useEffect(() => {
        if (data.residential_county) {
            setResidentialCounty({
                id: data.residential_county,
                name: data.residential_county_name,
            });
        }
        if (data.residential_sub_county) {
            setResidentialSubCounty({
                id: data.residential_sub_county,
                name: data.residential_sub_county_name,
            });
        }
        if (data.residential_ward) {
            setResidentialWard({
                id: data.residential_ward,
                name: data.residential_ward_name,
            });
        }
    }, [
        data.residential_county,
        data.residential_sub_county,
        data.residential_ward,
        data.residential_county_name,
        data.residential_ward_name,
        data.residential_sub_county_name,
    ]);

    // Home address handlers
    const handleHomeCountyChange = (name: string, value: string, item: any) => {
        onChange('home_county', item?.id || '');
        onChange('home_county_name', item?.name || '');
        setHomeCounty({ name: item?.name, id: item?.id });
        // Reset dependent fields
        setHomeSubCounty(null);
        setHomeWard(null);
        onChange('home_sub_county', '');
        onChange('home_sub_county_name', '');
        onChange('home_ward', '');
        onChange('home_ward_name', '');
    };

    const handleHomeSubCountyChange = (
        name: string,
        value: string,
        item: any,
    ) => {
        onChange('home_sub_county', item?.id || '');
        onChange('home_sub_county_name', item?.name || '');
        setHomeSubCounty({ id: item?.id, name: item?.name });

        setHomeWard(null);
        onChange('home_ward', '');
        onChange('home_ward_name', '');
    };

    const handleHomeWardChange = (name: string, value: string, item: any) => {
        onChange('home_ward', item?.id || '');
        onChange('home_ward_name', item?.name || '');
        setHomeWard({ id: item?.id, name: item?.name });
    };

    // Residential address handlers (you'll need to add these fields to your TeacherFormDataProps)
    const handleResidentialCountyChange = (
        name: string,
        value: string,
        item: any,
    ) => {
        onChange('residential_county', item?.id || '');
        onChange('residential_county_name', item?.name || '');
        setResidentialCounty({ name: item?.name, id: item?.id });
        setResidentialSubCounty(null);
        setResidentialWard(null);
        onChange('residential_sub_county', '');
        onChange('residential_sub_county_name', '');
        onChange('residential_ward', '');
        onChange('residential_ward_name', '');
    };

    const handleResidentialSubCountyChange = (
        name: string,
        value: string,
        item: any,
    ) => {
        onChange('residential_sub_county', item?.id || '');
        onChange('residential_sub_county_name', item?.name || '');
        setResidentialSubCounty({ id: item?.id, name: item?.name });

        setResidentialWard(null);
        onChange('residential_ward', '');
        onChange('residential_ward_name', '');
    };

    const handleResidentialWardChange = (
        name: string,
        value: string,
        item: any,
    ) => {
        onChange('residential_ward', item?.id || '');
        onChange('residential_ward_name', item?.name || '');
        setResidentialWard({ id: item?.id, name: item?.name });
    };

    // Clear functions
    const handleClearHomeAddress = () => {
        setHomeCounty(null);
        setHomeSubCounty(null);
        setHomeWard(null);

        onChange('home_county', '');
        onChange('home_county_name', '');
        onChange('home_sub_county', '');
        onChange('home_sub_county_name', '');
        onChange('home_ward', '');
        onChange('home_ward_name', '');
        onChange('home_location', '');
        onChange('home_sub_location', '');
        onChange('home_address', '');
    };

    const handleClearResidentialAddress = () => {
        setResidentialCounty(null);
        setResidentialSubCounty(null);
        setResidentialWard(null);

        onChange('residential_county', '');
        onChange('residential_county_name', '');
        onChange('residential_sub_county', '');
        onChange('residential_sub_county_name', '');
        onChange('residential_ward', '');
        onChange('residential_ward_name', '');
        onChange('residential_location', '');
        onChange('residential_sub_location', '');
        onChange('residential_address', '');
    };

    return (
        <div className="space-y-6">
            <FormSection
                title="Location Information"
                Icon={{ icon: MapPin, color: 'purple-500' }}
            >
                {/* Home Address Section */}
                <FormSection
                    title="Home Address (Permanent)"
                    border={false}
                    Icon={{ icon: Home, color: 'blue-500' }}
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                name="home_address"
                                label="Home Address Details"
                                type="textarea"
                                value={`COUNTY:\t\t\t\t\t\t${data.home_county_name.toUpperCase() || ''}
CONSTITUENCY:\t${data.home_sub_county.toUpperCase() || ''}
WARD:\t\t\t\t\t\t\t${data.home_ward_name.toUpperCase() || ''}
LOCATION:\t\t\t\t${data.home_location.toUpperCase() || ''}
SUB-LOCATION:\t${data.home_sub_location.toUpperCase() || ''}`}
                                onChange={(field, value) =>
                                    onChange('home_address', value)
                                }
                                required
                                error={errors?.home_address}
                                placeholder="Enter detailed permanent home address..."
                                rows={5}
                                disabled
                            />
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <h4 className="mb-4 font-medium text-gray-700">
                                Administrative Division
                            </h4>

                            <FormGrid cols={2}>
                                <SearchAutocomplete
                                    name="home_county"
                                    onChange={handleHomeCountyChange}
                                    label="County"
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
                                        {
                                            key: 'name',
                                            label: 'Name',
                                            priority: 2,
                                        },
                                    ]}
                                    error={errors?.county}
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
                                    name="home_sub_county"
                                    onChange={handleHomeSubCountyChange}
                                    value={''}
                                    label="Constituency"
                                    required
                                    placeholder="Search for a constituency ..."
                                    noResultsMessage="No constituency found"
                                    loadingMessage="Loading constituencies..."
                                    searchFields={['name']}
                                    resultFields={[
                                        { key: 'name', label: 'Name' },
                                    ]}
                                    error={errors?.sub_county}
                                    type="generic"
                                    showClearButton={true}
                                    selectedFields={[
                                        {
                                            label: 'name',
                                            key: 'name',
                                            priority: 1,
                                        },
                                    ]}
                                    disabled={!homeCounty?.id}
                                    url={`/api/v1/address/search?county_id=${homeCounty?.id}`}
                                    inputClassName="bg-gray-700/20 border-2 border-blue-500"
                                />
                            </FormGrid>

                            <FormGrid cols={3}>
                                <SearchAutocomplete
                                    name="home_ward"
                                    minChars={1}
                                    onChange={handleHomeWardChange}
                                    value={''}
                                    label="Ward"
                                    required
                                    placeholder="Search for a ward ..."
                                    noResultsMessage="No ward found"
                                    loadingMessage="Loading wards..."
                                    searchFields={['name']}
                                    resultFields={[
                                        { key: 'name', label: 'Name' },
                                    ]}
                                    error={errors?.ward}
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
                                    disabled={!homeSubCounty?.id}
                                    url={`/api/v1/address/search?county_id=${homeCounty?.id}&constituency=${homeSubCounty?.id}`}
                                    inputClassName="bg-gray-700/20 border-2 border-blue-500"
                                />

                                <FormField
                                    name="location"
                                    label="Location"
                                    required
                                    type="input"
                                    value={data.home_location || ''}
                                    error={errors?.home_location}
                                    onChange={(name, value) =>
                                        onChange('home_location', value)
                                    }
                                    placeholder="e.g., Kangemi"
                                />

                                <FormField
                                    required
                                    name="sub_location"
                                    label="Sub-Location"
                                    type="input"
                                    value={data.home_sub_location || ''}
                                    error={errors?.home_sub_location}
                                    onChange={(name, value) =>
                                        onChange('home_sub_location', value)
                                    }
                                    placeholder="e.g., Kangemi Centre"
                                />
                            </FormGrid>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleClearHomeAddress}
                                    className="text-sm text-red-600 hover:text-red-800"
                                >
                                    Clear home address fields
                                </button>
                            </div>
                        </div>
                    </div>
                </FormSection>

                {/* Residential Address Section */}
                <FormSection
                    title="Residential Address (Current)"
                    border={false}
                    Icon={{ icon: Building, color: 'green-500' }}
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                name="residential_address"
                                label="Residential Address Details"
                                type="textarea"
                                readOnly
                                value={`COUNTY:\t\t\t\t\t\t${data.residential_county_name.toUpperCase() || ''}
CONSTITUENCY:\t${data.residential_sub_county.toUpperCase() || ''}
WARD:\t\t\t\t\t\t\t${data.residential_ward_name.toUpperCase() || ''}
LOCATION:\t\t\t\t${data.residential_location.toUpperCase() || ''}
SUB- LOCATION:\t${data.residential_sub_location.toUpperCase() || ''}`}
                                onChange={(field, value) =>
                                    onChange('residential_address', value)
                                }
                                error={errors?.residential_address}
                                placeholder="Enter current residential address..."
                                rows={5}
                                disabled
                            />
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <h4 className="mb-4 font-medium text-gray-700">
                                Administrative Division
                            </h4>

                            <FormGrid cols={2}>
                                <SearchAutocomplete
                                    name="residential_county"
                                    onChange={handleResidentialCountyChange}
                                    label="County"
                                    value={''}
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
                                    error={errors?.residential_county}
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
                                    inputClassName="bg-gray-700/20 border-2 border-green-500"
                                />

                                <SearchAutocomplete
                                    name="residential_sub_county"
                                    onChange={handleResidentialSubCountyChange}
                                    value={''}
                                    label="Constituency"
                                    placeholder="Search for a constituency ..."
                                    noResultsMessage="No constituency found"
                                    loadingMessage="Loading constituencies..."
                                    searchFields={['name']}
                                    resultFields={[
                                        { key: 'name', label: 'Name' },
                                    ]}
                                    error={errors?.residential_sub_county}
                                    type="generic"
                                    showClearButton={true}
                                    selectedFields={[
                                        {
                                            label: 'name',
                                            key: 'name',
                                            priority: 1,
                                        },
                                    ]}
                                    disabled={!residentialCounty?.id}
                                    url={`/api/v1/address/search?county_id=${residentialCounty?.id}`}
                                    inputClassName="bg-gray-700/20 border-2 border-green-500"
                                />
                            </FormGrid>

                            <FormGrid cols={3}>
                                <SearchAutocomplete
                                    name="residential_ward"
                                    minChars={1}
                                    onChange={handleResidentialWardChange}
                                    value={''}
                                    label="Ward"
                                    placeholder="Search for a ward ..."
                                    noResultsMessage="No ward found"
                                    loadingMessage="Loading wards..."
                                    searchFields={['name']}
                                    resultFields={[
                                        { key: 'name', label: 'Name' },
                                    ]}
                                    error={errors?.residential_ward}
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
                                    disabled={!residentialSubCounty?.id}
                                    url={`/api/v1/address/search?county_id=${residentialCounty?.id}&constituency=${residentialSubCounty?.id}`}
                                    inputClassName="bg-gray-700/20 border-2 border-green-500"
                                />

                                <FormField
                                    name="residential_location"
                                    label="Location"
                                    type="input"
                                    value={data.residential_location || ''}
                                    error={errors?.residential_location}
                                    onChange={(name, value) =>
                                        onChange('residential_location', value)
                                    }
                                    placeholder="e.g., Westlands"
                                />

                                <FormField
                                    name="residential_sub_location"
                                    label="Sub-Location"
                                    type="input"
                                    value={data.residential_sub_location || ''}
                                    error={errors?.residential_sub_location}
                                    onChange={(name, value) =>
                                        onChange(
                                            'residential_sub_location',
                                            value,
                                        )
                                    }
                                    placeholder="e.g., Westlands Centre"
                                />
                            </FormGrid>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleClearResidentialAddress}
                                    className="text-sm text-red-600 hover:text-red-800"
                                >
                                    Clear residential address fields
                                </button>
                            </div>
                        </div>
                    </div>
                </FormSection>
            </FormSection>

            {selectedTeacher && (
                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                    <p>
                        <strong>Note:</strong> Home address is required and
                        should be your permanent address. Residential address is
                        your current living address (optional).
                    </p>
                </div>
            )}
        </div>
    );
}
