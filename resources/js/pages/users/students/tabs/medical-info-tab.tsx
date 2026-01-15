import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';

interface MedicalInfoTabProps {
    data?: {
        blood_group?: string;
        allergies?: string;
        special_medical_needs?: string;
    };
    onChange?: (field: string, value: string) => void;
}

export default function MedicalInfoTab({
    data = {},
    onChange,
}: MedicalInfoTabProps) {
    const handleChange = (field: string, value: string) => {
        if (onChange) {
            onChange(field, value);
        }
    };

    // Array of blood groups for rendering SelectItem with map
    const bloodGroups = [
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' },
        { value: 'unknown', label: 'Unknown' },
    ];
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <h2 className="text-xl font-semibold">
                    Medical & Safety Information
                </h2>
            </div>
            <p className="text-sm text-gray-600">
                This information is crucial for emergency situations and will be
                kept confidential.
            </p>

            <FormGrid gap="lg" cols={3}>
                <FormField
                    name="blood_group"
                    label="Blood Group"
                    type="select"
                    value={data.blood_group || ''}
                    onChange={handleChange}
                    options={bloodGroups}
                />
            </FormGrid>

            <FormGrid gap="lg" cols={2}>
                
                <FormField
                    label="Allergies"
                    name="allergies"
                    type="textarea"
                    value={data.allergies || ''}
                    onChange={(value) => handleChange('allergies', value)}
                    rows={4}
                    description="Specify allergens and reactions e.g (Eggs, Meat, Beans)"
                />

                <FormField
                    label="Special Medical Needs/Conditions"
                    name="special_medical_needs"
                    type="textarea"
                    value={data.special_medical_needs || ''}
                    onChange={(value) =>
                        handleChange('special_medical_needs', value)
                    }
                    placeholder="Describe any chronic conditions, disabilities, or special needs"
                    rows={4}
                    description="Include conditions like asthma, diabetes, physical disabilities, etc."
                />
                </FormGrid>

                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <h3 className="mb-2 font-medium text-blue-800">
                        Medical Information Notice
                    </h3>
                    <p className="text-sm text-blue-700">
                        This information will only be accessible to authorized
                        school medical staff and will be used solely for the
                        student's health and safety. Please ensure all
                        information is accurate and up-to-date.
                    </p>
                </div>
            </div>
    
    );
}
