import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import { Button } from '@/components/ui/button';
import { School } from 'lucide-react';

interface schoolDataInterface {
    stream_id?: string;
    admission_date?: Date | string;
    enrollment_type?: string;
    boarding_status?: string;
}
interface SchoolDataTabProps {
    data?: schoolDataInterface;
    errors?: schoolDataInterface;
    onChange?: (field: string, value: any) => void;
    onSubmit?: () => void;
}

export default function SchoolDataTab({
    data = {},
    errors = {},
    onChange,
    onSubmit,
}: SchoolDataTabProps) {
    const handleChange = (field: string, value: any) => {
        if (onChange) {
            onChange(field, value);
        }
    };

    // Define array for stream/class options for use in map
    const streamOptions = [
        { value: 'form1a', label: 'Form 1A' },
        { value: 'form1b', label: 'Form 1B' },
        { value: 'form1c', label: 'Form 1C' },
        { value: 'form2a', label: 'Form 2A' },
        { value: 'form2b', label: 'Form 2B' },
        { value: 'form3a', label: 'Form 3A' },
        { value: 'form3b', label: 'Form 3B' },
        { value: 'form4a', label: 'Form 4A' },
        { value: 'form4b', label: 'Form 4B' },
    ];

    const enrollmentTypes = [
        { value: 'new', label: 'New Student' },
        { value: 'transfer', label: 'Transferred' },
    ];

    const boardingOptions = [
        { value: 'day', label: 'Day Scholar' },
        { value: 'boarding', label: 'Boarding' },
    ];

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
                    error={errors.stream_id}
                    name="stream_id"
                    label="Stream / Class"
                    required
                    type="select"
                    value={data.stream_id || ''}
                    options={streamOptions}
                    onChange={handleChange}
                />

                <FormField
                    error={errors.admission_date?.toString()}
                    name="admission_date"
                    label="Admission Date"
                    type="calendar"
                    value={data.admission_date}
                    onChange={handleChange}
                    required={true}
                    placeholder="Select admission date"
                />
            </FormGrid>

            <FormGrid gap="lg" cols={2}>
                <FormField
                    error={errors.enrollment_type}
                    name="enrollment_type"
                    label="Enrollment Type"
                    required
                    type="select"
                    value={data.enrollment_type || ''}
                    options={enrollmentTypes}
                    onChange={handleChange}
                />

                <FormField
                    error={errors.boarding_status}
                    name="boarding_status"
                    label="Boarding Status"
                    required
                    type="select"
                    value={data.boarding_status || ''}
                    options={boardingOptions}
                    onChange={handleChange}
                />
            </FormGrid>

            <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <h3 className="mb-2 font-medium text-green-800">
                    Important Notes:
                </h3>
                <ul className="space-y-1 text-sm text-green-700">
                    <li>
                        • Admission number will be auto-generated upon
                        completion
                    </li>
                </ul>
            </div>

            {onSubmit && (
                <div className="flex justify-end gap-4 border-t pt-4">
                    <Button variant="outline" size="lg">
                        Save as Draft
                    </Button>
                    <Button onClick={onSubmit} size="lg" className="px-8">
                        Submit Admission
                    </Button>
                </div>
            )}
        </div>
    );
}
