// components/student-admission/student-admission.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useStudentAdmission } from '@/hooks/use-student-admission';
import AppLayout from '@/layouts/app-layout';
import { Save, Send, Trash } from 'lucide-react';
import AddressInfoTab from './tabs/address-info-tab';
import MedicalInfoTab from './tabs/medical-info-tab';
import ProfileInfoTab from './tabs/profile-info-tab';
import SchoolDataTab from './tabs/school-data-tab';

export default function StudentAdmission() {
    const {
        // State
        activeTab,
        isSubmitting,
        selectedStudent,

        // Actions
        handleSubmit,
        handleSaveDraft,
        handleClearDraft,

        // Computed values
        sections,
        isFormValid,
        hasTabErrors,
        isTabCompleted,

        // Search
        searchQuery,
        setSearchQuery,
        setActiveTab,
        searchResults,
        showSearchResults,
        isSearching,
        handleSearchStudent,
        handleSelectStudent,
        handleClearSearch,
    } = useStudentAdmission();

    // Get the active component
    const getActiveComponent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileInfoTab />;
            case 'address':
                return <AddressInfoTab />;
            case 'medical':
                return <MedicalInfoTab />;
            case 'school':
                return <SchoolDataTab />;
            default:
                return <ProfileInfoTab />;
        }
    };

    return (
        <AppLayout>
            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Student Admission
                        </h1>
                        <p className="text-gray-600">
                            {selectedStudent
                                ? 'Editing: ' + selectedStudent.name
                                : 'New Student Admission'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            onClick={handleClearDraft}
                            className="gap-2"
                            disabled={isSubmitting}
                        >
                            <Trash className="h-4 w-4" />
                            Clear All
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleSaveDraft}
                            className="gap-2"
                            disabled={isSubmitting}
                        >
                            <Save className="h-4 w-4" />
                            Save Draft
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                            disabled={isSubmitting || !isFormValid}
                        >
                            <Send className="h-4 w-4" />
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </div>

                {/* Existing Student Search */}
                {!selectedStudent && (
                    <Card className="border shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search existing student by name or admission number..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                            e.key === 'Enter' &&
                                            handleSearchStudent()
                                        }
                                        className="w-full rounded border px-3 py-2"
                                    />
                                </div>
                                <Button
                                    onClick={handleSearchStudent}
                                    disabled={
                                        isSearching || !searchQuery.trim()
                                    }
                                >
                                    {isSearching ? 'Searching...' : 'Search'}
                                </Button>
                            </div>

                            {showSearchResults && searchResults.length > 0 && (
                                <div className="mt-4 max-h-60 overflow-y-auto rounded border">
                                    {searchResults.map((student) => (
                                        <div
                                            key={student.id}
                                            className="flex cursor-pointer items-center justify-between border-b p-3 hover:bg-gray-50"
                                            onClick={() =>
                                                handleSelectStudent(student)
                                            }
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {student.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {student.adm_no}
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Select
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {showSearchResults &&
                                searchResults.length === 0 && (
                                    <p className="mt-4 text-gray-500">
                                        No students found
                                    </p>
                                )}
                        </CardContent>
                    </Card>
                )}

                {/* Progress Tabs */}
                <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-2">
                        {sections.map((section, index) => {
                            const isActive = activeTab === section.value;
                            const hasError = hasTabErrors(section.value);
                            const isComplete = isTabCompleted(section.value);

                            return (
                                <Card
                                    key={section.value}
                                    className={`w-full min-w-[180px] cursor-pointer transition-all duration-200 hover:shadow-md ${
                                        isActive
                                            ? 'border-primary shadow-sm'
                                            : hasError
                                              ? 'border-red-300 bg-red-50'
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
                                                        : hasError
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
                                                        : hasError
                                                          ? 'text-red-600'
                                                          : 'text-gray-600'
                                                }
                                            >
                                                {section.label}
                                                {hasError && ' ✗'}
                                                {isComplete &&
                                                    !hasError &&
                                                    ' ✓'}
                                            </span>
                                        </CardTitle>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Active Tab Content */}
                <div className="mt-2">
                    <Card className="w-full border-t-4 border-t-primary shadow-lg">
                        <CardContent className="p-6">
                            {getActiveComponent()}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
