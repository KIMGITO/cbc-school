import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import SearchAutocomplete from '@/components/custom/search-autocomplete';
import { useTeacherAdmissionStore } from '@/stores/teacher-admission-store';
import { Building, Home, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LocationInfoTab() {
    // Get data and actions from the store
    const {
        formData,
        formDataErrors,
        selectedTeacher,
        updateFormField,
        clearFormFieldError,
    } = useTeacherAdmissionStore();

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
        if (formData.home_county) {
            setHomeCounty({
                id: formData.home_county,
                name: formData.home_county_name,
            });
        }
        if (formData.home_sub_county) {
            setHomeSubCounty({
                id: formData.home_sub_county,
                name: formData.home_sub_county_name,
            });
        }
        if (formData.home_ward) {
            setHomeWard({
                id: formData.home_ward,
                name: formData.home_ward_name,
            });
        }
    }, [
        formData.home_county,
        formData.home_sub_county,
        formData.home_ward,
        formData.home_county_name,
        formData.home_ward_name,
        formData.home_sub_county_name,
    ]);

    // Initialize residential address states
    useEffect(() => {
        if (formData.residential_county) {
            setResidentialCounty({
                id: formData.residential_county,
                name: formData.residential_county_name,
            });
        }
        if (formData.residential_sub_county) {
            setResidentialSubCounty({
                id: formData.residential_sub_county,
                name: formData.residential_sub_county_name,
            });
        }
        if (formData.residential_ward) {
            setResidentialWard({
                id: formData.residential_ward,
                name: formData.residential_ward_name,
            });
        }
    }, [
        formData.residential_county,
        formData.residential_sub_county,
        formData.residential_ward,
        formData.residential_county_name,
        formData.residential_ward_name,
        formData.residential_sub_county_name,
    ]);

    // Helper to get error message
    const getErrorMessage = (field: string): string => {
        const error = formDataErrors[field];

        if (Array.isArray(error)) {
            return error[0] || '';
        }

        return error || '';
    };

    // Home address handlers
    const handleHomeCountyChange = (name: string, value: string, item: any) => {
        updateFormField('home_county', item?.id || '');
        updateFormField('home_county_name', item?.name || '');
        setHomeCounty({ name: item?.name, id: item?.id });

        // Clear errors for home county fields
        clearFormFieldError('home_county');
        clearFormFieldError('home_county_name');

        // Reset dependent fields
        setHomeSubCounty(null);
        setHomeWard(null);
        updateFormField('home_sub_county', '');
        updateFormField('home_sub_county_name', '');
        updateFormField('home_ward', '');
        updateFormField('home_ward_name', '');
    };

    const handleHomeSubCountyChange = (
        name: string,
        value: string,
        item: any,
    ) => {
        updateFormField('home_sub_county', item?.id || '');
        updateFormField('home_sub_county_name', item?.name || '');
        setHomeSubCounty({ id: item?.id, name: item?.name });

        // Clear errors
        clearFormFieldError('home_sub_county');
        clearFormFieldError('home_sub_county_name');

        // Reset dependent field
        setHomeWard(null);
        updateFormField('home_ward', '');
        updateFormField('home_ward_name', '');
    };

    const handleHomeWardChange = (name: string, value: string, item: any) => {
        updateFormField('home_ward', item?.id || '');
        updateFormField('home_ward_name', item?.name || '');
        setHomeWard({ id: item?.id, name: item?.name });

        // Clear errors
        clearFormFieldError('home_ward');
        clearFormFieldError('home_ward_name');
    };

    // Residential address handlers
    const handleResidentialCountyChange = (
        name: string,
        value: string,
        item: any,
    ) => {
        updateFormField('residential_county', item?.id || '');
        updateFormField('residential_county_name', item?.name || '');
        setResidentialCounty({ name: item?.name, id: item?.id });

        // Clear errors
        clearFormFieldError('residential_county');
        clearFormFieldError('residential_county_name');

        // Reset dependent fields
        setResidentialSubCounty(null);
        setResidentialWard(null);
        updateFormField('residential_sub_county', '');
        updateFormField('residential_sub_county_name', '');
        updateFormField('residential_ward', '');
        updateFormField('residential_ward_name', '');
    };

    const handleResidentialSubCountyChange = (
        name: string,
        value: string,
        item: any,
    ) => {
        updateFormField('residential_sub_county', item?.id || '');
        updateFormField('residential_sub_county_name', item?.name || '');
        setResidentialSubCounty({ id: item?.id, name: item?.name });

        // Clear errors
        clearFormFieldError('residential_sub_county');
        clearFormFieldError('residential_sub_county_name');

        // Reset dependent field
        setResidentialWard(null);
        updateFormField('residential_ward', '');
        updateFormField('residential_ward_name', '');
    };

    const handleResidentialWardChange = (
        name: string,
        value: string,
        item: any,
    ) => {
        updateFormField('residential_ward', item?.id || '');
        updateFormField('residential_ward_name', item?.name || '');
        setResidentialWard({ id: item?.id, name: item?.name });

        // Clear errors
        clearFormFieldError('residential_ward');
        clearFormFieldError('residential_ward_name');
    };

    // Clear functions
    const handleClearHomeAddress = () => {
        setHomeCounty(null);
        setHomeSubCounty(null);
        setHomeWard(null);

        updateFormField('home_county', '');
        updateFormField('home_county_name', '');
        updateFormField('home_sub_county', '');
        updateFormField('home_sub_county_name', '');
        updateFormField('home_ward', '');
        updateFormField('home_ward_name', '');
        updateFormField('home_location', '');
        updateFormField('home_sub_location', '');
        updateFormField('home_address', '');

        // Clear all home-related errors
        const homeFields = [
            'home_county',
            'home_county_name',
            'home_sub_county',
            'home_sub_county_name',
            'home_ward',
            'home_ward_name',
            'home_location',
            'home_sub_location',
            'home_address',
        ];
        homeFields.forEach((field) => clearFormFieldError(field));
    };

    const handleClearResidentialAddress = () => {
        setResidentialCounty(null);
        setResidentialSubCounty(null);
        setResidentialWard(null);

        updateFormField('residential_county', '');
        updateFormField('residential_county_name', '');
        updateFormField('residential_sub_county', '');
        updateFormField('residential_sub_county_name', '');
        updateFormField('residential_ward', '');
        updateFormField('residential_ward_name', '');
        updateFormField('residential_location', '');
        updateFormField('residential_sub_location', '');
        updateFormField('residential_address', '');

        // Clear all residential-related errors
        const residentialFields = [
            'residential_county',
            'residential_county_name',
            'residential_sub_county',
            'residential_sub_county_name',
            'residential_ward',
            'residential_ward_name',
            'residential_location',
            'residential_sub_location',
            'residential_address',
        ];
        residentialFields.forEach((field) => clearFormFieldError(field));
    };

    // Handle location field changes
    const handleHomeLocationChange = (field: string, value: string) => {
        clearFormFieldError(field);
        updateFormField(field, value);
    };

    const handleResidentialLocationChange = (field: string, value: string) => {
        clearFormFieldError(field);
        updateFormField(field, value);
    };

    return (
        <div className="space-y-6">
            <FormSection
                title="Location Information"
                Icon={{ icon: MapPin, color: 'purple-500' }}
                border={false}
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
                                value={`COUNTY:\t\t\t\t\t\t${formData.home_county_name?.toUpperCase() || ''}
CONSTITUENCY:\t${formData.home_sub_county?.toUpperCase() || ''}
WARD:\t\t\t\t\t\t\t${formData.home_ward_name?.toUpperCase() || ''}
LOCATION:\t\t\t\t${formData.home_location?.toUpperCase() || ''}
SUB-LOCATION:\t${formData.home_sub_location?.toUpperCase() || ''}`}
                                onChange={(field, value) =>
                                    handleHomeLocationChange(
                                        'home_address',
                                        value,
                                    )
                                }
                                required
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
                                    error={getErrorMessage('home_county')}
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
                                    autoSelectSingleResult
                                    placeholder="Search for a constituency ..."
                                    noResultsMessage="No constituency found"
                                    loadingMessage="Loading constituencies..."
                                    searchFields={['name']}
                                    resultFields={[
                                        { key: 'name', label: 'Name' },
                                    ]}
                                    error={getErrorMessage('home_sub_county')}
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
                                    autoSelectSingleResult
                                    placeholder="Search for a ward ..."
                                    noResultsMessage="No ward found"
                                    loadingMessage="Loading wards..."
                                    searchFields={['name']}
                                    resultFields={[
                                        { key: 'name', label: 'Name' },
                                    ]}
                                    error={getErrorMessage('home_ward')}
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
                                    name="home_location"
                                    label="Location"
                                    required
                                    type="input"
                                    value={formData.home_location || ''}
                                    error={getErrorMessage('home_location')}
                                    onChange={(name, value) =>
                                        handleHomeLocationChange(
                                            'home_location',
                                            value,
                                        )
                                    }
                                    placeholder="e.g., Kangemi"
                                />

                                <FormField
                                    required
                                    name="home_sub_location"
                                    label="Sub-Location"
                                    type="input"
                                    value={formData.home_sub_location || ''}
                                    error={getErrorMessage('home_sub_location')}
                                    onChange={(name, value) =>
                                        handleHomeLocationChange(
                                            'home_sub_location',
                                            value,
                                        )
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
                                value={`COUNTY:\t\t\t\t\t\t${formData.residential_county_name?.toUpperCase() || ''}
CONSTITUENCY:\t${formData.residential_sub_county?.toUpperCase() || ''}
WARD:\t\t\t\t\t\t\t${formData.residential_ward_name?.toUpperCase() || ''}
LOCATION:\t\t\t\t${formData.residential_location?.toUpperCase() || ''}
SUB- LOCATION:\t${formData.residential_sub_location?.toUpperCase() || ''}`}
                                onChange={(field, value) =>
                                    handleResidentialLocationChange(
                                        'residential_address',
                                        value,
                                    )
                                }
                                error={getErrorMessage('residential_address')}
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
                                    required
                                    autoSelectSingleResult
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
                                    error={getErrorMessage(
                                        'residential_county',
                                    )}
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
                                    required
                                    autoSelectSingleResult
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
                                    error={getErrorMessage(
                                        'residential_sub_county',
                                    )}
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

                            <FormSection border>
                                <FormGrid cols={3}>
                                    <SearchAutocomplete
                                        required
                                        autoSelectSingleResult
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
                                        error={getErrorMessage(
                                            'residential_ward',
                                        )}
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
                                        required
                                        value={
                                            formData.residential_location || ''
                                        }
                                        error={getErrorMessage(
                                            'residential_location',
                                        )}
                                        onChange={(name, value) =>
                                            handleResidentialLocationChange(
                                                'residential_location',
                                                value,
                                            )
                                        }
                                        placeholder="e.g., Westlands"
                                    />

                                    <FormField
                                        name="residential_sub_location"
                                        label="Sub-Location"
                                        type="input"
                                        required
                                        value={
                                            formData.residential_sub_location ||
                                            ''
                                        }
                                        error={getErrorMessage(
                                            'residential_sub_location',
                                        )}
                                        onChange={(name, value) =>
                                            handleResidentialLocationChange(
                                                'residential_sub_location',
                                                value,
                                            )
                                        }
                                        placeholder="e.g., Westlands Centre"
                                    />
                                </FormGrid>
                            </FormSection>

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
