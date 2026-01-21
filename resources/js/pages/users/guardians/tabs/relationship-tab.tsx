import FormField from '@/components/custom/form-field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { GuardianFormData, GuardianFormErrors } from '@/types/guardian';
import axios from 'axios';
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
            const response = await axios.get('/api/students/active');
            setStudents(response.data.data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Select Student <span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={data.student_id}
                        onValueChange={(value) => onChange('student_id', value)}
                        disabled={isLoading}
                    >
                        <SelectTrigger
                            className={
                                errors?.student_id ? 'border-red-500' : ''
                            }
                        >
                            <SelectValue
                                placeholder={
                                    isLoading
                                        ? 'Loading students...'
                                        : 'Select a student'
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {students.map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                    {student.adm_no} - {student.first_name}{' '}
                                    {student.sir_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors?.student_id && (
                        <p className="text-sm text-red-500">
                            {errors.student_id}
                        </p>
                    )}
                </div>

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
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="is_primary"
                    checked={data.is_primary}
                    onChange={(e) => onChange('is_primary', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="is_primary" className="text-sm font-medium">
                    Set as primary guardian
                </label>
            </div>

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
