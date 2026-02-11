import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QualificationsProps {
    name: string;
    institution: string;
    tsc_registered?: boolean;
    year_completed: string;
}

export interface DepartmentProps {
    id: string;
    name: string;
}

export interface TeacherFormDataProps {
    user_id?: string;
    first_name: string;
    sir_name: string;
    other_names: string;
    gender: 'male' | 'female' | 'other' | null;
    national_id: string;
    phone_number: string;
    phone_number_2: string;
    email: string;
    home_county: string;
    home_county_name: string;
    home_sub_county: string;
    home_sub_county_name: string;
    home_ward: string;
    home_ward_name: string;
    home_location: string;
    home_sub_location: string;
    residential_county: string;
    residential_county_name: string;
    residential_sub_county: string;
    residential_sub_county_name: string;
    residential_ward: string;
    residential_ward_name: string;
    residential_location: string;
    residential_sub_location: string;
    tsc_number: string;
    kra_pin: string;
    qualifications: QualificationsProps[];
    department_id: string;
    employment_date: string;
}

export interface TeacherFormDataErrorProps {
    [key: string]: string | undefined;
}

interface TeacherAdmissionState {
    // form data
    formData: TeacherFormDataProps;
    formDataErrors: TeacherFormDataErrorProps;

    // UI state
    activeTab: string;
    searchQuery: string;
    isSearching: boolean;
    searchResults: any[];
    selectedTeacher: any | null;
    showSearchResults: boolean;
    isSubmitting: boolean;

    // Actions for form data
    setFormData: (data: Partial<TeacherFormDataProps>) => void;
    updateFormField: (field: keyof TeacherFormDataProps, value: any) => void;
    setFormDataErrors: (errors: Partial<TeacherFormDataErrorProps>) => void;
    clearFormFieldError: (field: keyof TeacherFormDataErrorProps) => void;
    resetFormData: () => void;

    // Actions for UI state
    setActiveTab: (tab: string) => void;
    setSearchQuery: (query: string) => void;
    setIsSearching: (isSearching: boolean) => void;
    setSearchResults: (results: any[]) => void;
    setSelectedTeacher: (teacher: any | null) => void;
    setShowSearchResults: (show: boolean) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;

    // Complex actions
    selectTeacher: (teacher: any) => void;
    clearSelection: () => void;
    resetAll: () => void;

    // Qualifications specific actions
    addQualification: (qualification: QualificationsProps) => void;
    updateQualification: (
        index: number,
        qualification: Partial<QualificationsProps>,
    ) => void;
    removeQualification: (index: number) => void;
    clearQualifications: () => void;
}

// Initial empty form data
const initialFormData: TeacherFormDataProps = {
    user_id: '',
    first_name: '',
    sir_name: '',
    other_names: '',
    gender: null,
    national_id: '',
    phone_number: '',
    phone_number_2: '',
    email: '',
    home_county: '',
    home_county_name: '',
    home_sub_county: '',
    home_sub_county_name: '',
    home_ward: '',
    home_ward_name: '',
    home_location: '',
    home_sub_location: '',
    residential_county: '',
    residential_county_name: '',
    residential_sub_county: '',
    residential_sub_county_name: '',
    residential_ward: '',
    residential_ward_name: '',
    residential_location: '',
    residential_sub_location: '',
    tsc_number: '',
    kra_pin: '',
    qualifications: [],
    department_id: '',
    employment_date:'',
};

export const useTeacherAdmissionStore = create<TeacherAdmissionState>()(
    persist(
        (set) => ({
            // Initial state
            formData: initialFormData,
            formDataErrors: {},
            activeTab: 'personal',
            searchQuery: '',
            isSearching: false,
            searchResults: [],
            selectedTeacher: null,
            showSearchResults: false,
            isSubmitting: false,

            // Form data actions with immer
            setFormData: (data) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.formData = { ...state.formData, ...data };
                    }),
                ),

            updateFormField: (field, value) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.formData[field] = value;
                        // Clear error for this field if it exists
                        if (state.formDataErrors[field]) {
                            delete state.formDataErrors[field];
                        }
                    }),
                ),

            setFormDataErrors: (errors) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.formDataErrors = {
                            ...state.formDataErrors,
                            ...errors,
                        };
                    }),
                ),

            clearFormFieldError: (field) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        delete state.formDataErrors[field];
                    }),
                ),

            resetFormData: () =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.formData = initialFormData;
                        state.formDataErrors = {};
                    }),
                ),

            // UI state actions with immer
            setActiveTab: (tab) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.activeTab = tab;
                    }),
                ),

            setSearchQuery: (query) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.searchQuery = query;
                    }),
                ),

            setIsSearching: (isSearching) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.isSearching = isSearching;
                    }),
                ),

            setSearchResults: (results) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.searchResults = results;
                    }),
                ),

            setSelectedTeacher: (teacher) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.selectedTeacher = teacher;
                    }),
                ),

            setShowSearchResults: (show) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.showSearchResults = show;
                    }),
                ),

            setIsSubmitting: (isSubmitting) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.isSubmitting = isSubmitting;
                    }),
                ),

            // Qualifications actions
            addQualification: (qualification) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.formData.qualifications.push(qualification);
                    }),
                ),

            updateQualification: (index, qualification) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        if (state.formData.qualifications[index]) {
                            state.formData.qualifications[index] = {
                                ...state.formData.qualifications[index],
                                ...qualification,
                            };
                        }
                    }),
                ),

            removeQualification: (index) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.formData.qualifications.splice(index, 1);
                    }),
                ),

            clearQualifications: () =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.formData.qualifications = [];
                    }),
                ),

            // Complex actions with immer
            selectTeacher: (teacher) =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.selectedTeacher = teacher;
                        state.showSearchResults = false;
                        state.searchQuery = '';

                        // Populate form data from selected teacher
                        state.formData = {
                            user_id: teacher.user_id || '',
                            first_name: teacher.first_name || '',
                            sir_name: teacher.sir_name || '',
                            other_names: teacher.other_names || '',
                            gender: teacher.gender || null,
                            national_id: teacher.national_id || '',
                            phone_number: teacher.phone_number || '',
                            phone_number_2: teacher.phone_number_2 || '',
                            email: teacher.email || '',
                           employment_date: teacher.employment_date || '',
                            tsc_number: teacher.tsc_number || '',
                            kra_pin: teacher.kra_pin || '',
                            qualifications: teacher.qualifications || [],
                            department_id: teacher.department_id,
                        };
                    }),
                ),

            clearSelection: () =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.selectedTeacher = null;
                        state.formData = initialFormData;
                        state.formDataErrors = {};
                        state.searchQuery = '';
                        state.searchResults = [];
                    }),
                ),

            resetAll: () =>
                set(
                    produce((state: TeacherAdmissionState) => {
                        state.formData = initialFormData;
                        state.formDataErrors = {};
                        state.activeTab = 'personal';
                        state.searchQuery = '';
                        state.isSearching = false;
                        state.searchResults = [];
                        state.selectedTeacher = null;
                        state.showSearchResults = false;
                        state.isSubmitting = false;
                    }),
                ),
        }),
        {
            name: 'teacher-admission-store',
            partialize: (state) => ({
                formData: state.formData,
                selectedTeacher: state.selectedTeacher,
            }),
        },
    ),
);
