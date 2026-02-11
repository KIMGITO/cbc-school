import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import { Button } from '@/components/ui/button';
import { getStreamsOptions } from '@/helpers/selection-options';
import { useStudentAdmission } from '@/hooks/use-student-admission';
import { School } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StreamProps {
    value: string;
    label: string;
}

export default function SchoolDataTab() {
    const {
        formData,
        formDataErrors,
        updateFormField,
        handleSubmit,
        handleSaveDraft,
        activeTab,
        validateCurrentTab,
        goToNextTab,
        goToPreviousTab,
        isSubmitting,
        isFormValid,
    } = useStudentAdmission();

    const handleChange = (field: string, value: any) => {
        updateFormField(field as keyof typeof formData, value);
    };

    const [streamOptions, setStreamOptions] = useState<StreamProps[]>([
        {
            value: '0',
            label: 'Select Streams',
        },
    ]);

    useEffect(() => {
        async function fetchStreams() {
            const streams = await getStreamsOptions()();
            setStreamOptions(streams);
        }
        fetchStreams();
    }, []);

    const enrollmentTypes = [
        { value: 'new', label: 'New Student' },
        { value: 'transfer', label: 'Transferred' },
    ];

    const boardingOptions = [
        { value: 'day', label: 'Day Scholar' },
        { value: 'boarding', label: 'Boarding' },
    ];

    const handleLocalSubmit = () => {
        if (validateCurrentTab()) {
            // If this is the last tab, submit the form
            if (activeTab === 'school') {
                handleSubmit();
            } else {
                goToNextTab();
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <div className="flex items-center gap-3">
                    <School className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold">
                        School & Admission Details
                    </h2>
                </div>
            </div>

            <FormGrid gap="lg" cols={2}>
                <FormField
                    error={formDataErrors.stream_id}
                    name="stream_id"
                    label="Stream / Class"
                    required
                    type="select"
                    value={formData.stream_id || ''}
                    options={streamOptions}
                    emptyOption="Select Streams"
                    onChange={handleChange}
                />

                <FormField
                    error={formDataErrors.admission_date?.toString()}
                    name="admission_date"
                    label="Admission Date"
                    type="calendar-enhanced"
                    disabledDays={[0, 6]}
                    value={formData.admission_date}
                    onChange={handleChange}
                    required={true}
                    placeholder="Select admission date"
                />
            </FormGrid>

            <FormGrid gap="lg" cols={2}>
                <FormField
                    error={formDataErrors.enrollment_type}
                    name="enrollment_type"
                    label="Enrollment Type"
                    required
                    type="select"
                    value={formData.enrollment_type || ''}
                    options={enrollmentTypes}
                    onChange={handleChange}
                />

                <FormField
                    error={formDataErrors.boarding_status}
                    name="boarding_status"
                    label="Boarding Status"
                    required
                    type="select"
                    value={formData.boarding_status || ''}
                    options={boardingOptions}
                    onChange={handleChange}
                />
            </FormGrid>

            {/* Auto-generated admission number field */}
            <FormGrid gap="lg" cols={1}>
                <FormField
                    error={formDataErrors.adm_no}
                    name="adm_no"
                    label="Admission Number"
                    type="text"
                    value={formData.adm_no}
                    onChange={handleChange}
                    required={true}
                    placeholder="Auto-generated or enter manually"
                    description="Leave blank to auto-generate"
                />
            </FormGrid>

            <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <h3 className="mb-2 font-medium text-green-800">
                    Important Notes:
                </h3>
                <ul className="space-y-1 text-sm text-green-700">
                    <li>
                        • Admission number will be auto-generated if left blank
                    </li>
                    <li>• Admission date cannot be in the future</li>
                    <li>• Stream assignment determines the student's class</li>
                </ul>
            </div>

            <div className="flex justify-between gap-4 border-t pt-4">
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleSaveDraft}
                        disabled={isSubmitting}
                    >
                        Save as Draft
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={goToPreviousTab}
                        disabled={activeTab === 'profile' || isSubmitting}
                    >
                        ← Previous
                    </Button>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={goToNextTab}
                        disabled={activeTab === 'school' || isSubmitting}
                    >
                        Next →
                    </Button>
                    <Button
                        onClick={handleLocalSubmit}
                        size="lg"
                        className="bg-green-600 px-8 hover:bg-green-700"
                        disabled={isSubmitting || !isFormValid}
                    >
                        {isSubmitting
                            ? 'Submitting...'
                            : activeTab === 'school'
                              ? 'Submit Admission'
                              : 'Continue'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
