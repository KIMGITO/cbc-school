import { emptyGuardianData, emptyGuardianErrors } from '@/pages/users/empty-data';
import { GuardianFormData, GuardianFormErrors } from '@/types/guardian';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GuardianAdmissionState {
    // Form data
    formData: GuardianFormData;
    formDataErrors: GuardianFormErrors;

    // UI state
    activeTab: string;
    searchQuery: string;
    isSearching: boolean;
    searchResults: any[];
    selectedGuardian: any | null;
    showSearchResults: boolean;
    isSubmitting: boolean;

    // Actions for form data
    setFormData: (data: Partial<GuardianFormData>) => void;
    updateFormField: (field: keyof GuardianFormData, value: any) => void;
    setFormDataErrors: (errors: Partial<GuardianFormErrors>) => void;
    clearFormFieldError: (field: keyof GuardianFormErrors) => void;
    resetFormData: () => void;

    // Actions for UI state
    setActiveTab: (tab: string) => void;
    setSearchQuery: (query: string) => void;
    setIsSearching: (isSearching: boolean) => void;
    setSearchResults: (results: any[]) => void;
    setSelectedGuardian: (guardian: any | null) => void;
    setShowSearchResults: (show: boolean) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;

    // Complex actions
    selectGuardian: (guardian: any) => void;
    clearSelection: () => void;
    resetAll: () => void;
}

export const useGuardianAdmissionStore = create<GuardianAdmissionState>()(
    persist(
        (set, get) => ({
            // Initial state
            formData: emptyGuardianData,
            formDataErrors: emptyGuardianErrors,
            activeTab: 'personal',
            searchQuery: '',
            isSearching: false,
            searchResults: [],
            selectedGuardian: null,
            showSearchResults: false,
            isSubmitting: false,

            // Form data actions
            setFormData: (data) =>
                set((state) => ({
                    formData: { ...state.formData, ...data },
                })),

            updateFormField: (field, value) =>
                set((state) => ({
                    formData: {
                        ...state.formData,
                        [field]: value,
                    },
                    // Clear error for this field
                    formDataErrors: state.formDataErrors[
                        field as keyof GuardianFormErrors
                    ]
                        ? { ...state.formDataErrors, [field]: undefined }
                        : state.formDataErrors,
                })),

            setFormDataErrors: (errors) =>
                set((state) => ({
                    formDataErrors: { ...state.formDataErrors, ...errors },
                })),

            clearFormFieldError: (field) =>
                set((state) => ({
                    formDataErrors: {
                        ...state.formDataErrors,
                        [field]: undefined,
                    },
                })),

            resetFormData: () =>
                set({
                    formData: emptyGuardianData,
                    formDataErrors: emptyGuardianErrors,
                }),

            // UI state actions
            setActiveTab: (tab) => set({ activeTab: tab }),
            setSearchQuery: (query) => set({ searchQuery: query }),
            setIsSearching: (isSearching) => set({ isSearching }),
            setSearchResults: (results) => set({ searchResults: results }),
            setSelectedGuardian: (guardian) =>
                set({ selectedGuardian: guardian }),
            setShowSearchResults: (show) => set({ showSearchResults: show }),
            setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

            // Complex actions
            selectGuardian: (guardian) => {
                set({
                    selectedGuardian: guardian,
                    showSearchResults: false,
                    searchQuery: '',
                    formData: {
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
                    },
                });
            },

            clearSelection: () => {
                set({
                    selectedGuardian: null,
                    formData: emptyGuardianData,
                    formDataErrors: emptyGuardianErrors,
                    searchQuery: '',
                    searchResults: [],
                });
            },

            resetAll: () => {
                set({
                    formData: emptyGuardianData,
                    formDataErrors: emptyGuardianErrors,
                    activeTab: 'personal',
                    searchQuery: '',
                    isSearching: false,
                    searchResults: [],
                    selectedGuardian: null,
                    showSearchResults: false,
                    isSubmitting: false,
                });
            },
        }),
        {
            name: 'guardian-admission-store',
            partialize: (state) => ({
                formData: state.formData,
                selectedGuardian: state.selectedGuardian,
            }),
        },
    ),
);
