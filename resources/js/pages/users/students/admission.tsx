import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { Save, Send, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddressInfoTab from './tabs/address-info-tab';
import MedicalInfoTab from './tabs/medical-info-tab';
import ProfileInfoTab from './tabs/profile-info-tab';
import SchoolDataTab from './tabs/school-data-tab';

// Define the complete form data interface
export interface StudentFormData {
    // Profile Info
    first_name: string;
    other_names: string;
    sir_name: string;
    adm_no: string;
    date_of_birth: Date | null;
    gender: string;
    profile_photo: File | null;

    // Address Info
    county: string;
    sub_county: string;
    ward: string;
    location: string;
    sub_location: string;
    upi_number: string;

    // Medical Info
    blood_group: string;
    allergies: string;
    special_medical_needs: string;

    // School Data
    stream_id: string;
    admission_date: Date | null;
    enrollment_type: string;
    boarding_status: string;
}

// Define props for each tab component
interface TabComponentProps {
    data: StudentFormData;
    onChange: (field: keyof StudentFormData, value: any) => void;
}

export default function StudentAdmission() {
    const sections = [
        {
            label: 'Profile Info',
            value: 'profile',
            component: ProfileInfoTab,
        },
        {
            label: 'Address Info',
            value: 'address',
            component: AddressInfoTab,
        },
        {
            label: 'Medical Info',
            value: 'medical',
            component: MedicalInfoTab,
        },
        {
            label: 'School Data',
            value: 'school',
            component: SchoolDataTab,
        },
    ];

    const [activeTab, setActiveTab] = useState('profile');

    // Initialize form data state
    const [formData, setFormData] = useState<StudentFormData>({
        // Profile Info
        first_name: '',
        other_names: '',
        sir_name: '',
        date_of_birth: null,
        gender: '',
        profile_photo: null,

        // Address Info
        county: '',
        sub_county: '',
        ward: '',
        location: '',
        sub_location: '',
        upi_number: '',

        // Medical Info
        blood_group: '',
        allergies: '',
        special_medical_needs: '',

        // School Data
        stream_id: '',
        adm_no: 'std 1161',
        admission_date: null,
        enrollment_type: '',
        boarding_status: '',
    });

    // Handle field changes
    const handleFieldChange = (field: keyof StudentFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Optional: Log changes for debugging
        console.log(`Field ${field} changed to:`, value);
    };

    // Get the active component
    const ActiveComponent = sections.find(
        (section) => section.value === activeTab,
    )?.component;

    // Handle form submission
    const handleSubmit = () => {
        console.log('Form data to submit:', formData);

        // Here you would typically:
        // 1. Validate the form data
        // 2. Prepare the data for API submission
        // 3. Make API call
        // 4. Handle response

        // Example validation check
        

        // Prepare FormData for file upload
        const formDataToSend = new FormData();

        // Append all form fields
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (value instanceof Date) {
                    formDataToSend.append(key, value.toISOString());
                } else if (value instanceof File) {
                    formDataToSend.append(key, value);
                } else {
                    formDataToSend.append(key, String(value));
                }
            }
        });

        // Simulate API call
        console.log(
            'Submitting form data:',
            Object.fromEntries(formDataToSend),
        );
        alert('Form submitted successfully! (Check console for data)');
    };

    // Handle save as draft
    const handleSaveDraft = () => {
        console.log('Saving as draft:', formData);
        alert('Draft saved!');
        localStorage.setItem('studentAdmissionDraft', JSON.stringify(formData));
    };

    const handleClearDraft = () => {
        localStorage.removeItem('studentAdmissionDraft');
        setFormData({
            // Profile Info
            first_name: '',
            other_names: '',
            sir_name: '',
            date_of_birth: null,
            gender: '',
            profile_photo: null,

            // Address Info
            county: '',
            sub_county: '',
            ward: '',
            location: '',
            sub_location: '',
            upi_number: '',

            // Medical Info
            blood_group: '',
            allergies: '',
            special_medical_needs: '',

            // School Data
            stream_id: '',
            adm_no: 'std 1161',
            admission_date: null,
            enrollment_type: '',
            boarding_status: '',
        });
        alert('Draft cleared!');
    };

    // Load draft on component mount (optional)
    useEffect(() => {
        const savedDraft = localStorage.getItem('studentAdmissionDraft');
        if (savedDraft) {
            try {
                const parsedDraft = JSON.parse(savedDraft);
                // Convert date strings back to Date objects
                if (parsedDraft.date_of_birth) {
                    parsedDraft.date_of_birth = new Date(
                        parsedDraft.date_of_birth,
                    );
                }
                if (parsedDraft.admission_date) {
                    parsedDraft.admission_date = new Date(
                        parsedDraft.admission_date,
                    );
                }
                if (parsedDraft.profile_photo) {
                    parsedDraft.profile_photo = null;
                }
                setFormData(parsedDraft);
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }, []);

    return (
        <AppLayout>
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Student Admission</h1>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            type='reset'
                            onClick={handleClearDraft}
                            className="gap-2"
                        >
                            <Trash className="h-4 w-4" />
                            Clear Draft
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleSaveDraft}
                            className="gap-2"
                        >
                            <Save className="h-4 w-4" />
                            Save Draft
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                            <Send className="h-4 w-4" />
                            Submit Application
                        </Button>
                    </div>
                </div>

                <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-2">
                        {sections.map((section, index) => {
                            const isActive = activeTab === section.value;
                            return (
                                <Card
                                    key={section.value}
                                    className={`w-full min-w-[180px] cursor-pointer transition-all duration-200 hover:shadow-md ${
                                        isActive
                                            ? 'border-primary shadow-sm'
                                            : ''
                                    }`}
                                    onClick={() => setActiveTab(section.value)}
                                >
                                    <CardContent className="p-4">
                                        <CardTitle className="flex items-center text-lg">
                                            <Badge
                                                className={`me-3 rounded-full shadow ${
                                                    isActive
                                                        ? 'bg-primary'
                                                        : 'bg-gray-200 text-gray-700'
                                                }`}
                                            >
                                                {index + 1}
                                            </Badge>
                                            <span
                                                className={
                                                    isActive
                                                        ? 'text-primary'
                                                        : 'text-gray-600'
                                                }
                                            >
                                                {section.label}
                                            </span>
                                        </CardTitle>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <div className="mt-2">
                    <Card className="w-full border-t-4 border-t-primary shadow-lg">
                        <CardContent className="p-6">
                            {ActiveComponent && (
                                <ActiveComponent
                                    data={formData}
                                    onChange={handleFieldChange}
                                    // Add any additional props if needed
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Progress indicator */}
                <div className="mt-6 mb-6 rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-700">
                                Progress
                            </h3>
                            <p className="text-sm text-gray-600">
                                Complete all sections to submit for admission.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                const nextIndex =
                                    sections.findIndex(
                                        (s) => s.value === activeTab,
                                    ) + 1;
                                if (nextIndex < sections.length) {
                                    setActiveTab(sections[nextIndex].value);
                                }
                            }}
                            disabled={
                                activeTab ===
                                sections[sections.length - 1].value
                            }
                        >
                            Next Section →
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
