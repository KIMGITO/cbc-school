export interface StudentFormData {
    // Profile Info
    first_name: string;
    other_names: string;
    sir_name: string;
    adm_no: string;
    date_of_birth: Date | null;
    gender: string;
    profile_photo: File | null;

    // Address Info
    county: string;
    sub_county: string;
    ward: string;
    location: string;
    sub_location: string;
    upi_number: string;

    // Medical Info
    blood_group: string;
    allergies: string;
    special_medical_needs: string;

    // School Data
    stream_id: string;
    admission_date: Date | null;
    enrollment_type: string;
    boarding_status: string;
}

export interface StudentFormErrors {
    // Profile Info
    first_name: string | null;
    other_names: string | null;
    sir_name: string | null;
    date_of_birth: string | null;
    gender: string | null;
    profile_photo: string | null;

    // Address Info
    county: string | null;
    sub_county: string | null;
    ward: string | null;
    location: string | null;
    sub_location: string | null;
    upi_number: string | null;

    // Medical Info
    blood_group: string | null;
    allergies: string | null;
    special_medical_needs: string | null;

    // School Data
    stream_id: string | null;
    admission_date: string | null;
    enrollment_type: string | null;
    boarding_status: string | null;
}

