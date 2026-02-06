import { useGuardianAdmissionStore } from '@/stores/guardian-admission-store';
import axios from 'axios';

export const useGuardianAdmission = () => {
    const store = useGuardianAdmissionStore();

    // Tab sections configuration
    const sections = [
        {
            label: 'Personal Info',
            value: 'personal',
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
            errorFields: ['phone_number', 'email', 'phone_number_2'],
        },
        {
            label: 'Address Info',
            value: 'address',
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
            errorFields: [
                'student_id',
                'relationship_type',
                'is_primary',
                'can_pick_student',
                'can_pay_fees',
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

    // Search for existing guardian
    const handleSearchGuardian = async () => {
        if (!store.searchQuery.trim()) return;

        store.setIsSearching(true);
        try {
            const response = await axios.get('/api/guardians/search', {
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
        } finally {
            store.setIsSearching(false);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        store.setIsSubmitting(true);
        try {
            // Prepare data
            const formDataToSend = new FormData();
            Object.entries(store.formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formDataToSend.append(key, value.toString());
                }
            });

            console.log('Submitting data:', Object.fromEntries(formDataToSend));

            const endpoint = store.selectedGuardian
                ? `/guardians/${store.selectedGuardian.id}/update`
                : '/guardians';

            const method = store.selectedGuardian ? 'put' : 'post';

            console.log(formDataToSend);
            await axios[method](endpoint, formDataToSend);

            store.clearSelection();
        } catch (error: any) {
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
            }
            console.error('Submission error:', error);
        } finally {
            store.setIsSubmitting(false);
        }
    };

    // Handle save as draft (already handled by Zustand persist)
    const handleSaveDraft = () => {
        // Already persisted automatically by Zustand
        // Optional: Show a toast notification
        console.log('Draft saved automatically');
    };

    const handleClearDraft = () => {
        store.resetAll();
    };

    return {
        // State
        ...store,

        // Computed values
        sections,

        // Helper functions
        getTabErrors,
        hasTabErrors,

        // Actions
        handleSearchGuardian,
        handleSubmit,
        handleSaveDraft,
        handleClearDraft,

        // Helper function for tab completion
        getTabCompletionKey: (
            tabValue: string,
        ): keyof typeof store.formData => {
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
        },
    };
};
