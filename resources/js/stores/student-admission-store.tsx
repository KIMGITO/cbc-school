// stores/student-admission-store.ts
import { StudentFormDataProps } from '@/types/student';
import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Match your existing StudentFormData interface

// Match your existing StudentFormErrors interface
export interface StudentFormDataErrorProps {
    [key: string]: string | undefined;
}

interface StudentAdmissionState {
    // form data
    formData: StudentFormDataProps;
    formDataErrors: StudentFormDataErrorProps;

    // UI state (matching Teacher store pattern)
    activeTab: string;
    searchQuery: string;
    isSearching: boolean;
    searchResults: any[];
    selectedStudent: any | null;
    showSearchResults: boolean;
    isSubmitting: boolean;

    // Actions for form data
    setFormData: (data: Partial<StudentFormDataProps>) => void;
    updateFormField: (field: keyof StudentFormDataProps, value: any) => void;
    setFormDataErrors: (errors: Partial<StudentFormDataErrorProps>) => void;
    clearFormFieldError: (field: keyof StudentFormDataErrorProps) => void;
    resetFormData: () => void;

    // Actions for UI state
    setActiveTab: (tab: string) => void;
    setSearchQuery: (query: string) => void;
    setIsSearching: (isSearching: boolean) => void;
    setSearchResults: (results: any[]) => void;
    setSelectedStudent: (student: any | null) => void;
    setShowSearchResults: (show: boolean) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;

    // Complex actions (matching Teacher store pattern)
    selectStudent: (student: any) => void;
    clearSelection: () => void;
    resetAll: () => void;
}

// Initial empty form data matching your emptyStudentData
const initialFormData: StudentFormDataProps = {
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
    adm_no: 'std 1161', // Your default value
    enrollment_type: '',
    boarding_status: '',
};

export const useStudentAdmissionStore = create<StudentAdmissionState>()(
    persist(
        (set) => ({
            // Initial state matching Teacher store
            formData: initialFormData,
            formDataErrors: {},
            activeTab: 'profile',
            searchQuery: '',
            isSearching: false,
            searchResults: [],
            selectedStudent: null,
            showSearchResults: false,
            isSubmitting: false,

            // Form data actions with immer (matching Teacher store)
            setFormData: (data) =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.formData = { ...state.formData, ...data };
                    }),
                ),

            updateFormField: (field, value) =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.formData[field] = value;
                        // Clear error for this field if it exists
                        if (state.formDataErrors[field]) {
                            delete state.formDataErrors[field];
                        }
                    }),
                ),

            setFormDataErrors: (errors) =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.formDataErrors = {
                            ...state.formDataErrors,
                            ...errors,
                        };
                    }),
                ),

            clearFormFieldError: (field) =>
                set(
                    produce((state: StudentAdmissionState) => {
                        delete state.formDataErrors[field];
                    }),
                ),

            resetFormData: () =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.formData = initialFormData;
                        state.formDataErrors = {};
                    }),
                ),

            // UI state actions with immer (matching Teacher store)
            setActiveTab: (tab) =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.activeTab = tab;
                    }),
                ),

            setSearchQuery: (query) =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.searchQuery = query;
                    }),
                ),

            setIsSearching: (isSearching) =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.isSearching = isSearching;
                    }),
                ),

            setSearchResults: (results) =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.searchResults = results;
                    }),
                ),

            setSelectedStudent: (student) =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.selectedStudent = student;
                    }),
                ),

            setShowSearchResults: (show) =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.showSearchResults = show;
                    }),
                ),

            setIsSubmitting: (isSubmitting) =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.isSubmitting = isSubmitting;
                    }),
                ),

            // Complex actions with immer (matching Teacher store pattern)
            selectStudent: (student) =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.selectedStudent = student;
                        state.showSearchResults = false;
                        state.searchQuery = '';

                        // Populate form data from selected student
                        state.formData = {
                            // Profile Info
                            first_name: student.first_name || '',
                            sir_name: student.sir_name || '',
                            other_names: student.other_names || '',
                            date_of_birth: student.date_of_birth || null,
                            gender: student.gender || '',
                            profile_photo: student.profile_photo || null,

                            // Address Info
                            county: student.county || '',
                            sub_county: student.sub_county || '',
                            ward: student.ward || '',
                            location: student.location || '',
                            sub_location: student.sub_location || '',
                            upi_number: student.upi_number || '',

                            // Medical Info
                            blood_group: student.blood_group || '',
                            allergies: student.allergies || '',
                            special_medical_needs:
                                student.special_medical_needs || '',

                            // School Data
                            stream_id: student.stream_id || '',
                            adm_no: student.adm_no || 'std 1161',
                            enrollment_type: student.enrollment_type || '',
                            boarding_status: student.boarding_status || '',
                        };
                    }),
                ),

            clearSelection: () =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.selectedStudent = null;
                        state.formData = initialFormData;
                        state.formDataErrors = {};
                        state.searchQuery = '';
                        state.searchResults = [];
                    }),
                ),

            resetAll: () =>
                set(
                    produce((state: StudentAdmissionState) => {
                        state.formData = initialFormData;
                        state.formDataErrors = {};
                        state.activeTab = 'profile';
                        state.searchQuery = '';
                        state.isSearching = false;
                        state.searchResults = [];
                        state.selectedStudent = null;
                        state.showSearchResults = false;
                        state.isSubmitting = false;
                    }),
                ),
        }),
        {
            name: 'student-admission-store',
            partialize: (state) => ({
                formData: state.formData,
                selectedStudent: state.selectedStudent,
            }),
        },
    ),
);
