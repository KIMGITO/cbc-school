import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import SearchAutocomplete from '@/components/custom/search-autocomplete';
import { GuardianFormData, GuardianFormErrors } from '@/types/guardian';
import axios from 'axios';
import { UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Student {
    id: string;
    adm_no: string;
    first_name: string;
    sir_name: string;
}

export default function RelationshipTab({
    data,
    onChange,
    errors,
}: {
    data: GuardianFormData;
    onChange: (field: keyof GuardianFormData, value: any) => void;
    errors?: GuardianFormErrors;
}) {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/v1/students');
            setStudents(response.data.data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <FormSection
                title="Relationship Data"
                Icon={{ icon: UsersRound, color: 'green-500' }}
            >
                <FormGrid cols={2}>
                    <SearchAutocomplete
                        required
                        label='Select Student'
                        placeholder='Search for a student ...'
                        name="student_id"
                        noResultsMessage='No students with the given search term found'
                        loadingMessage='Loading students...'
                        error={errors?.student_id}
                        type='student'
                        autoSelectSingleResult={false}
                        searchFields={['adm_no','first_name']}
                        value={data.student_id}
                        onChange={onChange}
                        showClearButton={true}
                        showSelectedInDropdown={false}
                        url="/api/v1/students"
                        inputClassName='bg-gray-700/20 border-2 border-blue-500 '
                    />

                    <FormField
                        name="relationship_type"
                        label="Relationship Type"
                        type="select"
                        value={data.relationship_type}
                        onChange={onChange}
                        options={[
                            { value: 'parent', label: 'Parent' },
                            { value: 'guardian', label: 'Guardian' },
                            { value: 'sibling', label: 'Sibling' },
                            { value: 'relative', label: 'Relative' },
                            { value: 'sponsor', label: 'Sponsor' },
                        ]}
                        placeholder="Select relationship"
                    />
                </FormGrid>

                <FormField
                    name="is_primary"
                    type="checkbox"
                    checkboxLabel="Set as primary guardian"
                    value={data.is_primary}
                    onChange={onChange}
                    required
                    error={errors?.is_primary}
                    // disabled={!!data.student_id}
                    checked={data.is_primary}
                />
            </FormSection>

            {data.student_id && (
                <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm text-green-800">
                        ✓ Guardian will be linked to selected student.
                    </p>
                </div>
            )}
        </div>
    );
}
