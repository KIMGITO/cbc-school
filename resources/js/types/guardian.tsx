import { Student } from './student';

// types/guardian.ts
export interface GuardianFormData {
    // Personal Info
    user_id?: string;
    first_name: string;
    other_names: string;
    sir_name: string;
    gender: 'male' | 'female' | null;
    national_id: string;
    occupation: string;
    phone_number: string;
    phone_number_2: string;
    email: string;
    address: string;
    county: string;
    county_name:string,
    sub_county: string;
    sub_county_name: string;
    ward: string;
    ward_name: string;
    location: string;
    sub_location: string;
    student_id: string;
    relationship_type: string;
    is_primary: boolean;
    can_pick_student: boolean;
    can_pay_fees: boolean;
}

export interface GuardianFormErrors {
    first_name?: string;
    sir_name?: string;
    other_names?: string;
    national_id?: string;
    phone_number?: string;
    email?: string;
    address?: string;
    county?: string;
    sub_county?: string;
    ward?: string;
    location?: string;
    sub_location?: string;
    occupation?: string;
    student_id?: string;
    is_primary?: string;
    can_pick_student?: string;
    can_pay_fees?: string;
    [key: string]: string | undefined;
}

export interface GuardianFormProps {
    id: string;
    user_id: string;
    first_name: string;
    other_names: string;
    gender: 'male' | 'female';
    sir_name: string;
    national_id: string;
    phone_number: string;
    phone_number_2: string;
    email: string;
    occupation: string;
    address: string;
    county: string;
    sub_county: string;
    ward: string;
    location: string;
    sub_location: string;
    created_at: string;
    updated_at: string;
    is_primary: boolean;
    can_pick_student: boolean;
    can_pay_fees: boolean;
    students?: Student[];
}

// types/guardian.ts
export interface Guardian {
    id: string;
    user_id: string;
    first_name: string;
    sir_name: string;
    other_names?: string;
    email: string;
    gender: string;
    phone: string;
    phone_2?: string;
    national_id: string;
    relationship: string; // Father, Mother, Guardian, etc.
    occupation?: string;
    employer?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    
    // Computed
    name?: string;
    
    students?: Array<{
        id: string;
        name: string;
        adm_no: string;
    }>;
    
    students_count?: number;
    
    address?: {
        id: string;
        street: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
    };
}

export const RelationTypes = [
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'step_father', label: 'Step Father' },
    { value: 'step_mother', label: 'Step Mother' },
    { value: 'grand_father', label: 'Grand Father' },
    { value: 'grand_mother', label: 'Grand Mother' },
    { value: 'uncle', label: 'Uncle' },
    { value: 'aunt', label: 'Aunt' },
    { value: 'brother', label: 'Brother' },
    { value: 'sister', label: 'Sister' },
    { value: 'legal_guardian', label: 'Legal Guardian' },
    { value: 'foster_parent', label: 'Foster Parent' },
    { value: 'caretaker', label: 'Caretaker' },
    { value: 'sponsor', label: 'Sponsor' },
    { value: 'other', label: 'Other' },
];
