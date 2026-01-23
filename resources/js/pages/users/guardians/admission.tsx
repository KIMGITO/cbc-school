// pages/guardians/admission.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { Search, Save, Send, Trash, UserPlus, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { emptyGuardianData, emptyGuardianErrors } from '../empty-data';
// import { GuardianFormData, GuardianFormErrors } ;
import PersonalInfoTab from './tabs/personal-info-tab';
import ContactInfoTab from './tabs/contact-info-tab';
import AddressInfoTab from './tabs/address-info-tab';
import RelationshipTab from './tabs/relationship-tab';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GuardianFormData, GuardianFormErrors } from '@/types/guardian';

// Define props for each tab component
interface TabComponentProps {
    data: GuardianFormData;
    onChange: (field: keyof GuardianFormData, value: any) => void;
    errors?: GuardianFormErrors;
}

export default function GuardianAdmission() {
    const sections = [
        {
            label: 'Personal Info',
            value: 'personal',
            component: PersonalInfoTab,
        },
        {
            label: 'Contact Info',
            value: 'contact',
            component: ContactInfoTab,
        },
        {
            label: 'Address Info',
            value: 'address',
            component: AddressInfoTab,
        },
        {
            label: 'Relationship',
            value: 'relationship',
            component: RelationshipTab,
        },
    ];

    const [activeTab, setActiveTab] = useState('personal');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedGuardian, setSelectedGuardian] = useState<any>(null);
    const [showSearchResults, setShowSearchResults] = useState(false);

    // Initialize form data state
    const [formData, setFormData] = useState<GuardianFormData>(emptyGuardianData);
    const [formDataErrors, setFormDataErrors] = useState<GuardianFormErrors>(emptyGuardianErrors);

    // Handle field changes
    const handleFieldChange = (field: keyof GuardianFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Search for existing guardian
    const handleSearchGuardian = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await axios.get('/api/guardians/search', {
                params: { q: searchQuery.trim() }
            });
            
            if (response.data.data && response.data.data.length > 0) {
                setSearchResults(response.data.data);
                setShowSearchResults(true);
            } else {
                setSearchResults([]);
                setShowSearchResults(true);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle guardian selection from search results
    const handleSelectGuardian = (guardian: any) => {
        setSelectedGuardian(guardian);
        setShowSearchResults(false);
        setSearchQuery('');
        
        // Auto-fill form with guardian data
        setFormData({
            user_id: guardian.user_id || '',
            first_name: guardian.first_name || '',
            other_names: guardian.other_names || '',
            sir_name: guardian.sir_name || '',
            national_id: guardian.national_id || '',
            phone_number: guardian.phone_number || '',
            phone_number_2: guardian.phone_number_2 || '',
            email: guardian.email || '',
            occupation: guardian.occupation || '',
            address: guardian.address || '',
            county: guardian.county || '',
            sub_county: guardian.sub_county || '',
            ward: guardian.ward || '',
            location: guardian.location || '',
            sub_location: guardian.sub_location || '',
            // Relationship fields (if needed)
            relationship_type: '',
            student_id: '',
            is_primary: false,
        });
    };

    // Clear selected guardian and reset form
    const handleClearSelection = () => {
        setSelectedGuardian(null);
        setFormData(emptyGuardianData);
        setSearchQuery('');
        setSearchResults([]);
    };

    // Get the active component
    const ActiveComponent = sections.find(
        (section) => section.value === activeTab,
    )?.component;

    // Handle form submission
    const handleSubmit = async () => {
        // Validate form data
        const errors = validateFormData(formData);
        if (Object.keys(errors).length > 0) {
            setFormDataErrors(errors);
            return;
        }

        // Prepare data
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formDataToSend.append(key, value);
            }
        });

        try {
            const endpoint = selectedGuardian 
                ? `/guardians/${selectedGuardian.id}/update` 
                : '/guardians';
            
            const method = selectedGuardian ? 'put' : 'post';
            
            await axios[method](endpoint, formDataToSend);
            
            // Success handling
            
            
            // Reset form
            handleClearSelection();
            
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setFormDataErrors(error.response.data.errors);
            }
            console.error('Submission error:', error);
        }
    };

    // Handle save as draft
    const handleSaveDraft = () => {
        localStorage.setItem('guardianAdmissionDraft', JSON.stringify(formData));
    };

    const handleClearDraft = () => {
        localStorage.removeItem('guardianAdmissionDraft');
        setFormData(emptyGuardianData);
        handleClearSelection();
    };

    // Load draft on component mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('guardianAdmissionDraft');
        if (savedDraft) {
            try {
                const parsedDraft = JSON.parse(savedDraft);
                setFormData(parsedDraft);
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }, []);

    // Validate form data
    const validateFormData = (data: GuardianFormData): GuardianFormErrors => {
        const errors: any = {};
        
        if (!data.first_name?.trim()) errors.first_name = 'First name is required';
        if (!data.sir_name?.trim()) errors.sir_name = 'Last name is required';
        if (!data.national_id?.trim()) errors.national_id = 'National ID is required';
        if (!data.phone_number?.trim()) errors.phone_number = 'Phone number is required';
        if (!data.student_id) errors.student_id = 'Please select a student';
        
        return errors;
    };

    return (
        <AppLayout>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Guardian Admission
                        </h1>
                        <p className="text-gray-600">
                            Register or update guardian information
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            type="reset"
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
                            {selectedGuardian
                                ? 'Update Guardian'
                                : 'Submit Application'}
                        </Button>
                    </div>
                </div>

                {/* Progress Tabs */}
                <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-2">
                        {sections.map((section, index) => {
                            const isActive = activeTab === section.value;
                            const isComplete =
                                formData[getTabCompletionKey(section.value)] ||
                                (section.value === 'relationship' &&
                                    formData.student_id);

                            return (
                                <Card
                                    key={section.value}
                                    className={`w-full min-w-[180px] cursor-pointer transition-all duration-200 hover:shadow-md ${
                                        isActive
                                            ? 'border-primary shadow-sm'
                                            : ''
                                    } ${
                                        isComplete
                                            ? 'border-green-200 bg-green-50'
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
                                                        : isComplete
                                                          ? 'bg-green-500'
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
                                                {isComplete && (
                                                    <span className="ml-2 text-xs text-green-600">
                                                        ✓
                                                    </span>
                                                )}
                                            </span>
                                        </CardTitle>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Guardian Search Section */}
                <Card className="border-l-4 border-l-blue-500 p-0">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <CardTitle className="flex items-center text-lg">
                                <UserCheck className="mr-2 h-5 w-5 " />
                                Find Existing Guardian
                            </CardTitle>
                            {selectedGuardian && (
                                <Badge className="bg-green-100 text-green-800">
                                    Existing Guardian Selected
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Search by name, national ID, phone, or student admission number..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' &&
                                            handleSearchGuardian()
                                        }
                                        className="w-full"
                                    />
                                </div>
                                <Button
                                    onClick={handleSearchGuardian}
                                    disabled={
                                        !searchQuery.trim() || isSearching
                                    }
                                    className="gap-2"
                                >
                                    <Search className="h-4 w-4" />
                                    {isSearching ? 'Searching...' : 'Search'}
                                </Button>
                                {selectedGuardian && (
                                    <Button
                                        variant="outline"
                                        onClick={handleClearSelection}
                                        className="gap-2"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Add New Instead
                                    </Button>
                                )}
                            </div>

                            {showSearchResults && (
                                <div className="mt-4">
                                    {searchResults.length > 0 ? (
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-600">
                                                Found {searchResults.length}{' '}
                                                guardian(s):
                                            </p>
                                            <div className="max-h-60 overflow-y-auto rounded-md border">
                                                {searchResults.map(
                                                    (guardian) => (
                                                        <div
                                                            key={guardian.id}
                                                            className={`flex cursor-pointer items-center justify-between p-3 hover:bg-gray-50 ${
                                                                selectedGuardian?.id ===
                                                                guardian.id
                                                                    ? 'border-l-4 border-l-blue-500 bg-blue-50'
                                                                    : ''
                                                            }`}
                                                            onClick={() =>
                                                                handleSelectGuardian(
                                                                    guardian,
                                                                )
                                                            }
                                                        >
                                                            <div>
                                                                <p className="font-medium">
                                                                    {
                                                                        guardian.first_name
                                                                    }{' '}
                                                                    {
                                                                        guardian.sir_name
                                                                    }
                                                                </p>
                                                                <div className="flex gap-4 text-sm text-gray-600">
                                                                    <span>
                                                                        ID:{' '}
                                                                        {
                                                                            guardian.national_id
                                                                        }
                                                                    </span>
                                                                    <span>
                                                                        Phone:{' '}
                                                                        {
                                                                            guardian.phone_number
                                                                        }
                                                                    </span>
                                                                    {guardian.email && (
                                                                        <span>
                                                                            Email:{' '}
                                                                            {
                                                                                guardian.email
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <Button
                                                                size="sm"
                                                                variant={
                                                                    selectedGuardian?.id ===
                                                                    guardian.id
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                            >
                                                                {selectedGuardian?.id ===
                                                                guardian.id
                                                                    ? 'Selected'
                                                                    : 'Select'}
                                                            </Button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <Alert>
                                            <AlertDescription>
                                                No existing guardian found.
                                                Please proceed to create a new
                                                guardian.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            )}

                            {selectedGuardian && (
                                <Alert className="border-green-200 bg-green-50">
                                    <AlertDescription className="text-green-800">
                                        ✓ Using existing guardian:{' '}
                                        <strong>
                                            {selectedGuardian.first_name}{' '}
                                            {selectedGuardian.sir_name}
                                        </strong>
                                        . You can update their information
                                        below.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Active Tab Content */}
                <div className="mt-2">
                    <Card className="w-full border-t-4 border-t-primary shadow-lg">
                        <CardContent className="p-6">
                            {ActiveComponent && (
                                <ActiveComponent
                                    data={formData}
                                    onChange={handleFieldChange}
                                    errors={formDataErrors}
                                    selectedGuardian={selectedGuardian}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Progress indicator */}
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-700">
                                Progress
                            </h3>
                            <p className="text-sm text-gray-600">
                                Complete all sections to{' '}
                                {selectedGuardian ? 'update' : 'register'}{' '}
                                guardian.
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

// Helper function to check tab completion
function getTabCompletionKey(tabValue: string): keyof GuardianFormData {
    switch (tabValue) {
        case 'personal':
            return 'first_name';
        case 'contact':
            return 'phone_number';
        case 'address':
            return 'address';
        case 'relationship':
            return 'student_id';
        default:
            return 'first_name';
    }
}