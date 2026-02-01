// pages/guardians/admission.tsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { GuardianFormData, GuardianFormErrors } from '@/types/guardian';
import axios from 'axios';
import { Save, Search, Send, Trash, UserCheck, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { emptyGuardianData, emptyGuardianErrors } from '../empty-data';
import AddressInfoTab from './tabs/address-info-tab';
import ContactInfoTab from './tabs/contact-info-tab';
import PersonalInfoTab from './tabs/personal-info-tab';
import RelationshipTab from './tabs/relationship-tab';

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
            errorFields: [
                'first_name',
                'sir_name',
                'national_id',
                'other_names',
            ],
        },
        {
            label: 'Contact Info',
            value: 'contact',
            component: ContactInfoTab,
            errorFields: ['phone_number', 'email', 'phone_number_2'],
        },
        {
            label: 'Address Info',
            value: 'address',
            component: AddressInfoTab,
            errorFields: [
                'address',
                'county',
                'sub_county',
                'ward',
                'location',
                'sub_location',
            ],
        },
        {
            label: 'Relationship',
            value: 'relationship',
            component: RelationshipTab,
            errorFields: [
                'student_id',
                'relationship_type',
                'is_primary',
                'can_pick_student',
                'can_pay_fees',
            ],
        },
    ];

    const [activeTab, setActiveTab] = useState('personal');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedGuardian, setSelectedGuardian] = useState<any>(null);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form data state
    const [formData, setFormData] =
        useState<GuardianFormData>(emptyGuardianData);
    const [formDataErrors, setFormDataErrors] =
        useState<GuardianFormErrors>(emptyGuardianErrors);

    // Check if a tab has errors
    const getTabErrors = (tabValue: string) => {
        const section = sections.find((s) => s.value === tabValue);
        if (!section) return [];

        return section.errorFields.filter(
            (field) => formDataErrors[field as keyof GuardianFormErrors],
        );
    };

    // Check if tab has any errors
    const hasTabErrors = (tabValue: string) => {
        return getTabErrors(tabValue).length > 0;
    };

    // Handle field changes
    const handleFieldChange = (field: keyof GuardianFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error for this field when user types
        if (formDataErrors[field as keyof GuardianFormErrors]) {
            setFormDataErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    // Search for existing guardian
    const handleSearchGuardian = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await axios.get('/api/guardians/search', {
                params: { q: searchQuery.trim() },
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
            gender: guardian.gender || null,
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
            
            relationship_type: guardian.relation_type || '',
            student_id: guardian.student_id || null,
            is_primary: guardian.is_primary || false,
            can_pick_student: guardian.can_pick_student || false,
            can_pay_fees: guardian.can_pay_fee || false,
        });
    };

    // Clear selected guardian and reset form
    const handleClearSelection = () => {
        setSelectedGuardian(null);
        setFormData(emptyGuardianData);
        setFormDataErrors(emptyGuardianErrors);
        setSearchQuery('');
        setSearchResults([]);
    };

    // Get the active component
    const ActiveComponent = sections.find(
        (section) => section.value === activeTab,
    )?.component;

    
    // Handle form submission
    const handleSubmit = async () => {
       
        try {
            // Prepare data
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formDataToSend.append(key, value);
                }
            });

            console.log('Submitting data:', Object.fromEntries(formDataToSend));

            const endpoint = selectedGuardian
                ? `/guardians/${selectedGuardian.id}/update`
                : '/guardians';

            const method = selectedGuardian ? 'put' : 'post';

            await axios[method](endpoint, formDataToSend);

            handleClearSelection();
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setFormDataErrors(error.response.data.errors);
                // Scroll to first error tab
                const firstErrorSection = sections.find((section) =>
                    section.errorFields.some(
                        (field) => error.response.data.errors[field],
                    ),
                );
                if (firstErrorSection) {
                    setActiveTab(firstErrorSection.value);
                }
            }
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle save as draft
    const handleSaveDraft = () => {
        localStorage.setItem(
            'guardianAdmissionDraft',
            JSON.stringify(formData),
        );
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
                            type="button"
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
                            disabled={isSubmitting}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    {selectedGuardian
                                        ? 'Updating...'
                                        : 'Submitting...'}
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    {selectedGuardian
                                        ? 'Update Guardian'
                                        : 'Submit Application'}
                                </>
                            )}
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
                            const hasErrors = hasTabErrors(section.value);
                            const errorCount = getTabErrors(
                                section.value,
                            ).length;

                            return (
                                <Card
                                    key={section.value}
                                    className={`w-full min-w-[180px] cursor-pointer transition-all duration-200 hover:shadow-md ${
                                        isActive
                                            ? 'border-primary shadow-sm'
                                            : ''
                                    } ${
                                        isComplete && !hasErrors
                                            ? 'border-green-200 bg-green-50'
                                            : ''
                                    } ${
                                        hasErrors
                                            ? 'border-red-300 bg-red-50'
                                            : ''
                                    }`}
                                    onClick={() => setActiveTab(section.value)}
                                >
                                    <CardContent className="relative p-4">
                                        
                                        <CardTitle className="flex items-center text-lg">
                                            <Badge
                                                className={`me-3 rounded-full shadow ${
                                                    isActive
                                                        ? 'bg-primary'
                                                        : hasErrors
                                                          ? 'bg-red-500'
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
                                                        : hasErrors
                                                          ? 'text-red-700'
                                                          : 'text-gray-600'
                                                }
                                            >
                                                {section.label}
                                                {isComplete && !hasErrors && (
                                                    <span className="ml-2 text-xs text-green-600">
                                                        ✓
                                                    </span>
                                                )}
                                                {hasErrors && (
                                                    <span className="ml-2 text-xs text-red-600">
                                                        ✗
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
                                <UserCheck className="mr-2 h-5 w-5" />
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
