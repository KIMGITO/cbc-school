import { useTeacherAdmissionStore } from '@/stores/teacher-admission-store';
import axios from 'axios';

export const useTeacherAdmission = () => {
    const store = useTeacherAdmissionStore();

    // Tab sections configuration
    const sections = [
        {
            label: 'Personal Info',
            value: 'personal',
            errorFields: [
                'first_name',
                'sir_name',
                'other_names',
                'gender',
                'national_id',
                'date_of_birth',
            ],
        },
        {
            label: 'Contact Info',
            value: 'contact',
            errorFields: [
                'phone_number',
                'phone_number_2',
                'email',
            ],
        },
        {
            label: 'Location Info',
            value: 'location',
            errorFields: [
                'county',
                'sub_county',
                'ward',
                'location',
                'sub_location',
                'home_address',
                'residential_address'
            ],
        },
        {
            label: 'Professional Info',
            value: 'professional',
            errorFields: [
                'tsc_number',
                'kra_pin',
                'employee_number',
                'qualifications',
                'department_id',
            ],
        },
    ];

    // Check if a tab has errors
    const getTabErrors = (tabValue: string) => {
        const section = sections.find((s) => s.value === tabValue);
        if (!section) return [];

        return section.errorFields.filter(
            (field) =>
                store.formDataErrors[
                    field as keyof typeof store.formDataErrors
                ],
        );
    };

    // Check if tab has any errors
    const hasTabErrors = (tabValue: string) => {
        return getTabErrors(tabValue).length > 0;
    };

    // Check if tab is completed (has data)
    const isTabCompleted = (tabValue: string) => {
        const section = sections.find((s) => s.value === tabValue);
        if (!section) return false;

        // Check if any required field in the tab has data
        return section.errorFields.some((field) => {
            const value = store.formData[field as keyof typeof store.formData];
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === 'object') return Object.keys(value).length > 0;
            return Boolean(value);
        });
    };

    // Search for existing teacher
    const handleSearchTeacher = async () => {
        if (!store.searchQuery.trim()) return;

        store.setIsSearching(true);
        try {
            const response = await axios.get('/api/teachers/search', {
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
            errors.sir_name = 'Surname is required';
        }
        if (!store.formData.national_id?.trim()) {
            errors.national_id = 'National ID is required';
        }
        if (!store.formData.phone_number?.trim()) {
            errors.phone_number = 'Phone number is required';
        }
        if (!store.formData.tsc_number?.trim()) {
            errors.tsc_number = 'TSC number is required';
        }
        if (!store.formData.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.formData.email)) {
            errors.email = 'Invalid email format';
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
            return;
        }

        store.setIsSubmitting(true);
        try {
            // Prepare data
            const formDataToSend = new FormData();

            // Append all form fields
            Object.entries(store.formData).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    return;
                }

                if (key === 'qualifications' && Array.isArray(value)) {
                    // Handle qualifications array
                    formDataToSend.append(key, JSON.stringify(value));
                } else if (key === 'department' && typeof value === 'object') {
                    // Handle department object
                    formDataToSend.append(key, JSON.stringify(value));
                } else if (typeof value === 'boolean') {
                    formDataToSend.append(key, value ? '1' : '0');
                } else {
                    formDataToSend.append(key, value.toString());
                }
            });

            console.log(
                'Submitting teacher data:',
                Object.fromEntries(formDataToSend.entries()),
            );

            const endpoint = store.selectedTeacher
                ? `/api/teachers/${store.selectedTeacher.id}`
                : '/api/teachers';

            const method = store.selectedTeacher ? 'put' : 'post';

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

    // Handle save as draft (already handled by Zustand persist)
    const handleSaveDraft = () => {
        // Zustand persist automatically saves to localStorage
        console.log('Draft saved automatically');
    };

    const handleClearDraft = () => {
        store.resetAll();
    };

    // Qualifications helpers
    const handleAddQualification = (qualification: any) => {
        store.addQualification(qualification);
    };

    const handleUpdateQualification = (index: number, qualification: any) => {
        store.updateQualification(index, qualification);
    };

    const handleRemoveQualification = (index: number) => {
        store.removeQualification(index);
    };

    const handleClearQualifications = () => {
        store.clearQualifications();
    };

    // Validation helpers
    const validateField = (field: string, value: any): string | null => {
        switch (field) {
            case 'email':
                if (!value?.trim()) return 'Email is required';
               
                return null;
            case 'phone_number':
                if (!value?.trim()) return 'Phone number is required';
              
                return null;
            case 'national_id':
                if (!value?.trim()) return 'National ID is required';
                if (!/^\d{8,12}$/.test(value)) return 'Invalid National ID';
                return null;
            case 'tsc_number':
                if (!value?.trim()) return 'TSC number is required';
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
            store.formData.national_id?.trim() &&
            store.formData.phone_number?.trim() &&
            store.formData.email?.trim() &&
            store.formData.tsc_number?.trim() &&
            Object.keys(store.formDataErrors).length === 0
        );
    };

    return {
        // State
        ...store,

        // Computed values
        sections,
        isFormValid: isFormValid(),

        // Helper functions
        getTabErrors,
        hasTabErrors,
        isTabCompleted,
        validateField,

        // Actions
        handleSearchTeacher,
        handleSubmit,
        handleSaveDraft,
        handleClearDraft,

        // Qualifications actions
        handleAddQualification,
        handleUpdateQualification,
        handleRemoveQualification,
        handleClearQualifications,

        // Helper function for tab completion
        getTabCompletionKey: (
            tabValue: string,
        ): keyof typeof store.formData => {
            switch (tabValue) {
                case 'personal':
                    return 'first_name';
                case 'contact':
                    return 'phone_number';
                case 'location':
                    return 'county';
                case 'professional':
                    return 'tsc_number';
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

        // Quick validation for current tab
        validateCurrentTab: () => {
            const currentTab = store.activeTab;
            const section = sections.find((s) => s.value === currentTab);
            if (!section) return true;

            const errors: Record<string, string> = {};

            section.errorFields.forEach((field) => {
                const value =
                    store.formData[field as keyof typeof store.formData];
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
        },
    };
};
