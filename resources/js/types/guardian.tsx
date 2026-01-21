// types/guardian.ts
export interface GuardianFormData {
    // Personal Info
    user_id?: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    national_id: string;
    occupation: string;

    // Contact Info
    phone_number: string;
    phone_number_2: string;
    email: string;

    // Address Info
    address: string;
    county: string;
    sub_county: string;
    ward: string;
    location: string;
    sub_location: string;

    // Relationship
    student_id: string;
    relationship_type: string;
    is_primary: boolean;
}

export interface GuardianFormErrors {
    first_name?: string;
    last_name?: string;
    national_id?: string;
    phone_number?: string;
    email?: string;
    address?: string;
    student_id?: string;
    [key: string]: string | undefined;
}

export interface Guardian {
    id: string;
    user_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
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
    students?: any[];
}
