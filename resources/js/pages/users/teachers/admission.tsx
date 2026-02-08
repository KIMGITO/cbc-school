import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useTeacherAdmission } from '@/hooks/use-teacher-admission';
import AppLayout from '@/layouts/app-layout';
import { Save, Search, Send, Trash, UserCheck, UserPlus } from 'lucide-react';
import ContactInfoTab from './tabs/contact-info-tab';
import LocationInfoTab from './tabs/location-info-tab';
import PersonalInfoTab from './tabs/personal-info-tab';
import ProfessionalInfoTab from './tabs/professional-info-tab';

// Define props for each tab component
interface TabComponentProps {
    data: any;
    onChange: (field: string, value: any) => void;
    errors?: any;
    selectedTeacher?: any;
    onAddQualification?: (qualification: any) => void;
    onUpdateQualification?: (index: number, qualification: any) => void;
    onRemoveQualification?: (index: number) => void;
}

export default function TeacherAdmission() {
    const {
        // State
        formData,
        formDataErrors,
        activeTab,
        searchQuery,
        isSearching,
        searchResults,
        selectedTeacher,
        showSearchResults,
        isSubmitting,

        // Actions
        updateFormField,
        setActiveTab,
        setSearchQuery,
        setIsSearching,
        setShowSearchResults,
        selectTeacher,
        clearSelection,

        // Qualifications actions
        handleAddQualification,
        handleUpdateQualification,
        handleRemoveQualification,

        // Computed values and helpers
        sections,
        getTabErrors,
        hasTabErrors,
        getTabCompletionKey,
        isFormValid,
        validateCurrentTab,

        // Handlers
        handleSearchTeacher,
        handleSubmit,
        handleSaveDraft,
        handleClearDraft,
    } = useTeacherAdmission();

    // Map component to each tab
    const tabComponents = {
        personal: PersonalInfoTab,
        contact: ContactInfoTab,
        location: LocationInfoTab,
        professional: ProfessionalInfoTab,
    };

    // Get the active component
    const ActiveComponent =
        tabComponents[activeTab as keyof typeof tabComponents];

    return (
        <AppLayout>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Teacher Admission
                        </h1>
                        <p className="text-gray-600">
                            Register or update teacher information
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
                            Clear All
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleSaveDraft}
                            className="gap-2"
                        >
                            <Save className="h-4 w-4" />
                            Save Progress
                        </Button>
                        <Button
                            onClick={async () => {
                                // Validate current tab before proceeding
                                if (validateCurrentTab()) {
                                    await handleSubmit();
                                }
                            }}
                            disabled={isSubmitting || !isFormValid}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    {selectedTeacher
                                        ? 'Updating...'
                                        : 'Submitting...'}
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    {selectedTeacher
                                        ? 'Update Teacher'
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
                                formData[getTabCompletionKey(section.value)];
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
                                        {hasErrors && (
                                            <div className="absolute -top-2 -right-2">
                                                <Badge
                                                    variant="destructive"
                                                    className="h-6 w-6 rounded-full p-0 text-xs"
                                                >
                                                    {errorCount}
                                                </Badge>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Teacher Search Section */}
                <Card className="border-l-4 border-l-blue-500 p-0">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <CardTitle className="flex items-center text-lg">
                                <UserCheck className="mr-2 h-5 w-5" />
                                Find Existing Teacher
                            </CardTitle>
                            {selectedTeacher && (
                                <Badge className="bg-green-100 text-green-800">
                                    Existing Teacher Selected
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Search by name, TSC number, national ID, or phone..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' &&
                                            handleSearchTeacher()
                                        }
                                        className="w-full"
                                    />
                                </div>
                                <Button
                                    onClick={handleSearchTeacher}
                                    disabled={
                                        !searchQuery.trim() || isSearching
                                    }
                                    className="gap-2"
                                >
                                    <Search className="h-4 w-4" />
                                    {isSearching ? 'Searching...' : 'Search'}
                                </Button>
                                {selectedTeacher && (
                                    <Button
                                        variant="outline"
                                        onClick={clearSelection}
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
                                                teacher(s):
                                            </p>
                                            <div className="max-h-60 overflow-y-auto rounded-md border">
                                                {searchResults.map(
                                                    (teacher) => (
                                                        <div
                                                            key={teacher.id}
                                                            className={`flex cursor-pointer items-center justify-between p-3 hover:bg-gray-50 ${
                                                                selectedTeacher?.id ===
                                                                teacher.id
                                                                    ? 'border-l-4 border-l-blue-500 bg-blue-50'
                                                                    : ''
                                                            }`}
                                                            onClick={() =>
                                                                selectTeacher(
                                                                    teacher,
                                                                )
                                                            }
                                                        >
                                                            <div>
                                                                <p className="font-medium">
                                                                    {
                                                                        teacher.first_name
                                                                    }{' '}
                                                                    {
                                                                        teacher.sir_name
                                                                    }
                                                                </p>
                                                                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                                                                    {teacher.tsc_number && (
                                                                        <span className="rounded bg-blue-100 px-2 py-1 text-xs">
                                                                            TSC:{' '}
                                                                            {
                                                                                teacher.tsc_number
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    {teacher.national_id && (
                                                                        <span className="rounded bg-gray-100 px-2 py-1 text-xs">
                                                                            ID:{' '}
                                                                            {
                                                                                teacher.national_id
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    {teacher.phone_number && (
                                                                        <span className="rounded bg-green-100 px-2 py-1 text-xs">
                                                                            Phone:{' '}
                                                                            {
                                                                                teacher.phone_number
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    {teacher.email && (
                                                                        <span className="rounded bg-purple-100 px-2 py-1 text-xs">
                                                                            Email:{' '}
                                                                            {
                                                                                teacher.email
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <Button
                                                                size="sm"
                                                                variant={
                                                                    selectedTeacher?.id ===
                                                                    teacher.id
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                            >
                                                                {selectedTeacher?.id ===
                                                                teacher.id
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
                                                No existing teacher found.
                                                Please proceed to create a new
                                                teacher.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            )}

                            {selectedTeacher && (
                                <Alert className="border-green-200 bg-green-50">
                                    <AlertDescription className="text-green-800">
                                        ✓ Using existing teacher:{' '}
                                        <strong>
                                            {selectedTeacher.first_name}{' '}
                                            {selectedTeacher.sir_name}
                                        </strong>
                                        {selectedTeacher.tsc_number && (
                                            <>
                                                {' '}
                                                (TSC:{' '}
                                                {selectedTeacher.tsc_number})
                                            </>
                                        )}
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
                                    onChange={updateFormField}
                                    errors={formDataErrors}
                                    selectedTeacher={selectedTeacher}
                                    onAddQualification={handleAddQualification}
                                    onUpdateQualification={
                                        handleUpdateQualification
                                    }
                                    onRemoveQualification={
                                        handleRemoveQualification
                                    }
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
                                Progress Status
                            </h3>
                            <p className="text-sm text-gray-600">
                                {isFormValid ? (
                                    <span className="text-green-600">
                                        ✓ All required fields are completed.
                                        Ready to{' '}
                                        {selectedTeacher
                                            ? 'update'
                                            : 'register'}{' '}
                                        teacher.
                                    </span>
                                ) : (
                                    <span>
                                        Complete all sections to{' '}
                                        {selectedTeacher
                                            ? 'update'
                                            : 'register'}{' '}
                                        teacher.
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const prevIndex =
                                        sections.findIndex(
                                            (s) => s.value === activeTab,
                                        ) - 1;
                                    if (prevIndex >= 0) {
                                        setActiveTab(sections[prevIndex].value);
                                    }
                                }}
                                disabled={activeTab === sections[0].value}
                            >
                                ← Previous
                            </Button>
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
                                Next →
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Form Errors Summary */}
                {Object.keys(formDataErrors).length > 0 && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>
                            <div className="font-semibold">
                                Please fix the following errors:
                            </div>
                            <ul className="mt-2 list-inside list-disc">
                                {Object.entries(formDataErrors)
                                    .filter(
                                        ([key]) =>
                                            key !== '_general' && key !== '',
                                    )
                                    .map(([key, value]) => (
                                        <li key={key} className="text-sm">
                                            <span className="font-medium">
                                                {key.replace(/_/g, ' ')}:
                                            </span>{' '}
                                            {value}
                                        </li>
                                    ))}
                                {formDataErrors._general && (
                                    <li className="text-sm font-medium">
                                        {formDataErrors._general}
                                    </li>
                                )}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </AppLayout>
    );
}
