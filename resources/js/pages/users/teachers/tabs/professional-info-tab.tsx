import FormField, { SelectOption } from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import { Button } from '@/components/ui/button';
import { QualificationsProps, TeacherFormDataProps } from '@/types/teacher';
import {
    BadgeCheck,
    Briefcase,
    GraduationCap,
    Plus,
    Trash2,
} from 'lucide-react';
import { useDepartmentStore } from '@/stores/department-store'; 
import { useEffect } from 'react';


interface ProfessionalInfoTabProps {
    data: TeacherFormDataProps;
    onChange: (field: keyof TeacherFormDataProps, value: any) => void;
    errors?: Record<string, string>;
    selectedTeacher?: any;
    onAddQualification?: (qualification: QualificationsProps) => void;
    onUpdateQualification?: (
        index: number,
        qualification: QualificationsProps,
    ) => void;
    onRemoveQualification?: (index: number) => void;
}

export default function ProfessionalInfoTab({
    data,
    onChange,
    errors,
    selectedTeacher,
    onAddQualification,
    onRemoveQualification,
}: ProfessionalInfoTabProps) {
    const handleAddNewQualification = () => {
        if (onAddQualification) {
            onAddQualification({
                name: '',
                institution: '',
                year_completed: '',
                tsc_registered: false,
            });
        }
    };

    const handleQualificationChange = (
        index: number,
        field: keyof QualificationsProps,
        value: any,
    ) => {
        if (data.qualifications && data.qualifications[index]) {
            const updatedQualifications = [...data.qualifications];
            updatedQualifications[index] = {
                ...updatedQualifications[index],
                [field]: value,
            };
            onChange('qualifications', updatedQualifications);
        }
    };

    

    const handleRemoveQualification = (index: number) => {
        if (onRemoveQualification) {
            onRemoveQualification(index);
        }
    };

  const { departments, fetchDepartments } = useDepartmentStore();

  useEffect(() => {
      fetchDepartments();
  }, [fetchDepartments]);
    

    return (
        <div className="space-y-6">
            <FormSection
                title="Professional Information"
                Icon={{ icon: Briefcase, color: 'orange-500' }}
            >
                <FormSection title="Official Details" border={false}>
                    <FormGrid cols={3}>
                        <FormField
                            name="tsc_number"
                            label="TSC Number"
                            type="input"
                            value={data.tsc_number}
                            onChange={onChange}
                            required
                            error={errors?.tsc_number}
                            placeholder="e.g., 1234567"
                        />
                        <FormField
                            name="kra_pin"
                            label="KRA PIN"
                            type="input"
                            value={data.kra_pin}
                            onChange={onChange}
                            required
                            error={errors?.kra_pin}
                            placeholder="e.g., A123456789A"
                        />
                        <FormField
                            name="department_id"
                            label="Department"
                            type="select"
                            value={data.department_id || ''}
                            emptyOption="Select Department"
                            options={departments}
                            onChange={onChange}
                            error={errors?.department_id}
                            placeholder="e.g., Mathematics Department"
                        />
                    </FormGrid>
                </FormSection>

                <FormSection
                    title="Qualifications"
                    border={false}
                    action={
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddNewQualification}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Qualification
                        </Button>
                    }
                >
                    <div className="space-y-4">
                        {data.qualifications &&
                        data.qualifications.length > 0 ? (
                            data.qualifications.map((qualification, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border bg-gray-50 p-4"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="h-5 w-5 text-gray-600" />
                                            <h4 className="font-medium">
                                                Qualification #{index + 1}
                                            </h4>
                                            {qualification.tsc_registered && (
                                                <BadgeCheck className="h-4 w-4 text-green-600" />
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleRemoveQualification(index)
                                            }
                                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <FormGrid cols={3}>
                                        <FormField
                                            name={`qualifications[${index}].name`}
                                            label="Qualification Name"
                                            type="input"
                                            value={qualification.name}
                                            onChange={(field, value) =>
                                                handleQualificationChange(
                                                    index,
                                                    'name',
                                                    value,
                                                )
                                            }
                                            placeholder="e.g., Bachelor of Education"
                                        />
                                        <FormField
                                            name={`qualifications[${index}].institution`}
                                            label="Institution"
                                            type="input"
                                            value={qualification.institution}
                                            onChange={(field, value) =>
                                                handleQualificationChange(
                                                    index,
                                                    'institution',
                                                    value,
                                                )
                                            }
                                            placeholder="e.g., University of Nairobi"
                                        />
                                        <FormField
                                            name={`qualifications[${index}].year_completed`}
                                            label="Year Completed"
                                            type="input"
                                            value={qualification.year_completed}
                                            onChange={(field, value) =>
                                                handleQualificationChange(
                                                    index,
                                                    'year_completed',
                                                    value,
                                                )
                                            }
                                            placeholder="e.g., 2020"
                                            inputType="number"
                                        />
                                    </FormGrid>

                                    <div className="mt-3">
                                        <FormField
                                            name={`qualifications[${index}].tsc_registered`}
                                            label="TSC Registered"
                                            type="checkbox"
                                            value={qualification.tsc_registered}
                                            onChange={(field, value) =>
                                                handleQualificationChange(
                                                    index,
                                                    'tsc_registered',
                                                    value,
                                                )
                                            }
                                            labelClassName="text-end"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                                <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                    No Qualifications Added
                                </h3>
                                <p className="mt-1 text-gray-600">
                                    Add at least one qualification to continue
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-4 gap-2"
                                    onClick={handleAddNewQualification}
                                >
                                    <Plus className="h-4 w-4" />
                                    Add First Qualification
                                </Button>
                            </div>
                        )}
                    </div>
                </FormSection>
            </FormSection>

            {selectedTeacher && (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                    <p>
                        <strong>Note:</strong> Professional details like TSC
                        number are official records. Ensure accuracy when
                        updating.
                    </p>
                </div>
            )}
        </div>
    );
}
