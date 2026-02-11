import { useStudentAdmissionStore } from '@/stores/student-admission-store';
import axios from 'axios';

export const useStudentAdmission = () => {
    const store = useStudentAdmissionStore();

    // Tab sections configuration
    const sections = [
        {
            label: 'Profile Info',
            value: 'profile',
            errorFields: [
                'first_name',
                'sir_name',
                'other_names',
                'gender',
                'date_of_birth',
                'profile_photo',
            ],
        },
        {
            label: 'Address Info',
            value: 'address',
            errorFields: [
                'county_id',
                'county_name',
                'sub_county_id',
                'sub_county_name',
                'ward_id',
                'ward_name',
                'location',
                'sub_location',
                'upi_number',
            ],
        },
        {
            label: 'Medical Info',
            value: 'medical',
            errorFields: ['blood_group', 'allergies', 'special_medical_needs'],
        },
        {
            label: 'School Data',
            value: 'school',
            errorFields: [
                'stream_id',
                'adm_no',
                'enrollment_type',
                'boarding_status',
            ],
        },
    ];

    // SAFE helper to get value from formData
    const getSafeValue = (field: keyof typeof store.formData): any => {
        return store.formData[field] ?? null;
    };

    // Check if a tab has errors
    const getTabErrors = (tabValue: string) => {
        const section = sections.find((s) => s.value === tabValue);
        if (!section) return [];

        return section.errorFields.filter((field) => {
            const error =
                store.formDataErrors[
                    field as keyof typeof store.formDataErrors
                ];
            return (
                error && typeof error === 'string' && error.trim().length > 0
            );
        });
    };

    // Check if tab has any errors
    const hasTabErrors = (tabValue: string) => {
        return getTabErrors(tabValue).length > 0;
    };

    // Check if tab is completed (has data) - SAFE VERSION
    const isTabCompleted = (tabValue: string) => {
        const section = sections.find((s) => s.value === tabValue);
        if (!section) return false;

        // Check if any required field in the tab has data
        return section.errorFields.some((field) => {
            const value = getSafeValue(field as keyof typeof store.formData);

            // Handle null/undefined safely
            if (value === null || value === undefined) {
                return false;
            }

            // Handle different data types
            if (Array.isArray(value)) {
                return value.length > 0;
            }

            if (typeof value === 'object') {
                // Safely check if object has any properties
                try {
                    return Object.keys(value).length > 0;
                } catch (e) {
                    return false;
                }
            }

            if (typeof value === 'string') {
                return value.trim().length > 0;
            }

            if (typeof value === 'boolean') {
                return value;
            }

            if (typeof value === 'number') {
                return true;
            }

            // For files
            if (value instanceof File) {
                return true;
            }

            // For dates
            if (value instanceof Date) {
                return true;
            }

            return Boolean(value);
        });
    };

    // Search for existing student
    const handleSearchStudent = async () => {
        if (!store.searchQuery.trim()) return;

        store.setIsSearching(true);
        try {
            const response = await axios.get('/api/v1/students/search', {
                params: { q: store.searchQuery.trim() },
            });

            if (response.data.data && response.data.data.length > 0) {
                store.setSearchResults(response.data.data);
                store.setShowSearchResults(true);
            } else {
                store.setSearchResults([]);
                store.setShowSearchResults(true);
            }
        } catch (error) {
            console.error('Search error:', error);
            store.setSearchResults([]);
            store.setShowSearchResults(true);
        } finally {
            store.setIsSearching(false);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validate required fields
        const errors: Record<string, string> = {};

        // Basic validation
        if (!store.formData.first_name?.trim()) {
            errors.first_name = 'First name is required';
        }
        if (!store.formData.sir_name?.trim()) {
            errors.sir_name = 'Last name is required';
        }
        if (!store.formData.gender) {
            errors.gender = 'Gender is required';
        }
        if (!store.formData.date_of_birth) {
            errors.date_of_birth = 'Date of birth is required';
        }

        if (!store.formData.stream_id) {
            errors.stream_id = 'Stream/Class is required';
        }

        if (Object.keys(errors).length > 0) {
            store.setFormDataErrors(errors);
            // Scroll to first error tab
            const firstErrorSection = sections.find((section) =>
                section.errorFields.some((field) => errors[field]),
            );
            if (firstErrorSection) {
                store.setActiveTab(firstErrorSection.value);
            }
            return { success: false, errors };
        }

        store.setIsSubmitting(true);
        try {
            // Prepare FormData for file upload
            const formDataToSend = new FormData();

            // Append all form fields
            Object.entries(store.formData).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    return;
                }

                if (key === 'profile_photo' && value instanceof File) {
                    // Handle profile photo file
                    formDataToSend.append(key, value);
                } else if (key === 'date_of_birth' && value) {
                    // Handle date field
                    formDataToSend.append(key, value.toString());
                } else if (typeof value === 'boolean') {
                    formDataToSend.append(key, value ? '1' : '0');
                } else {
                    formDataToSend.append(key, value.toString());
                }
            });

            console.log(
                'Submitting student data:',
                Object.fromEntries(formDataToSend.entries()),
            );

            const endpoint = store.selectedStudent
                ? `/students/${store.selectedStudent.id}`
                : '/students';

            const method = store.selectedStudent ? 'put' : 'post';

            const response = await axios({
                method,
                url: endpoint,
                data: formDataToSend,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                // Reset form on success
                store.resetAll();
                return { success: true, data: response.data.data };
            } else {
                throw new Error(response.data.message || 'Submission failed');
            }
        } catch (error: any) {
            console.error('Submission error:', error);

            if (error.response?.data?.errors) {
                store.setFormDataErrors(error.response.data.errors);
                // Scroll to first error tab
                const firstErrorSection = sections.find((section) =>
                    section.errorFields.some(
                        (field) => error.response.data.errors[field],
                    ),
                );
                if (firstErrorSection) {
                    store.setActiveTab(firstErrorSection.value);
                }
            } else {
                // Generic error
                store.setFormDataErrors({
                    _general:
                        error.response?.data?.message ||
                        'An error occurred during submission',
                });
            }

            return { success: false, error: error.message };
        } finally {
            store.setIsSubmitting(false);
        }
    };

    // Handle save as draft
    const handleSaveDraft = () => {
        // Zustand persist automatically saves to localStorage
        console.log('Student draft saved automatically');
    };

    const handleClearDraft = () => {
        store.resetAll();
    };

    // Validation helpers
    const validateField = (field: string, value: any): string | null => {
        // Handle null/undefined safely
        if (value === null || value === undefined || value === '') {
            // Check if field is required
            const requiredFields = [
                'first_name',
                'sir_name',
                'gender',
                'date_of_birth',
                'adm_no',
                'stream_id',
                'county',
                'sub_county',
                'ward',
                'location',
                'sub_location',
            ];

            if (requiredFields.includes(field)) {
                return 'This field is required';
            }
            return null;
        }

        // Convert to string for validation if needed
        const stringValue = String(value).trim();

        switch (field) {
            case 'first_name':
            case 'sir_name':
                if (!stringValue) return 'This field is required';
                return null;
            case 'date_of_birth':
                try {
                    const birthDate = new Date(value);
                    if (isNaN(birthDate.getTime())) return 'Invalid date';
                    const today = new Date();
                    if (birthDate > today)
                        return 'Date cannot be in the future';
                } catch (e) {
                    return 'Invalid date format';
                }
                return null;
            case 'adm_no':
                if (!stringValue) return 'Admission number is required';
                return null;
            case 'upi_number':
                if (
                    stringValue &&
                    !/^\d{8,}$/.test(stringValue.replace(/\s/g, ''))
                ) {
                    return 'Invalid UPI number';
                }
                return null;
            default:
                return null;
        }
    };

    // Check if form is valid for submission
    const isFormValid = () => {
        return (
            store.formData.first_name?.trim() &&
            store.formData.sir_name?.trim() &&
            store.formData.gender &&
            store.formData.date_of_birth &&
            store.formData.adm_no?.trim() &&
            store.formData.stream_id &&
            Object.keys(store.formDataErrors).length === 0
        );
    };

    // Quick validation for current tab
    const validateCurrentTab = () => {
        const currentTab = store.activeTab;
        const section = sections.find((s) => s.value === currentTab);
        if (!section) return true;

        const errors: Record<string, string> = {};

        section.errorFields.forEach((field) => {
            const value = store.formData[field as keyof typeof store.formData];
            const error = validateField(field, value);
            if (error) {
                errors[field] = error;
            }
        });

        if (Object.keys(errors).length > 0) {
            store.setFormDataErrors(errors);
            return false;
        }

        return true;
    };

    return {
        // State
        ...store,

        // Computed values
        sections,
        isFormValid: true,

        // Helper functions
        getTabErrors,
        hasTabErrors,
        isTabCompleted,
        validateField,
        validateCurrentTab,

        // Actions
        handleSearchStudent,
        handleSubmit,
        handleSaveDraft,
        handleClearDraft,

        // Helper function for tab completion
        getTabCompletionKey: (
            tabValue: string,
        ): keyof typeof store.formData => {
            switch (tabValue) {
                case 'profile':
                    return 'first_name';
                case 'address':
                    return 'county';
                case 'medical':
                    return 'blood_group';
                case 'school':
                    return 'adm_no';
                default:
                    return 'first_name';
            }
        },

        // Check if form is dirty (has changes)
        isFormDirty: () => {
            const defaultFormData = store.formData;
            return Object.keys(defaultFormData).some((key) => {
                const defaultValue =
                    defaultFormData[key as keyof typeof defaultFormData];
                const currentValue =
                    store.formData[key as keyof typeof store.formData];
                return (
                    JSON.stringify(defaultValue) !==
                    JSON.stringify(currentValue)
                );
            });
        },

        // Navigation helpers
        goToNextTab: () => {
            const currentIndex = sections.findIndex(
                (s) => s.value === store.activeTab,
            );
            if (currentIndex < sections.length - 1) {
                store.setActiveTab(sections[currentIndex + 1].value);
                return true;
            }
            return false;
        },

        goToPreviousTab: () => {
            const currentIndex = sections.findIndex(
                (s) => s.value === store.activeTab,
            );
            if (currentIndex > 0) {
                store.setActiveTab(sections[currentIndex - 1].value);
                return true;
            }
            return false;
        },

        // Student selection
        handleSelectStudent: (student: any) => {
            store.selectStudent(student);
        },

        // Clear search results
        handleClearSearch: () => {
            store.setSearchResults([]);
            store.setShowSearchResults(false);
            store.setSearchQuery('');
        },
    };
};
