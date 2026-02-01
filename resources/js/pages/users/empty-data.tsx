export const emptyStudentErrors = {
    first_name: null,
    other_names: null,
    sir_name: null,
    date_of_birth: null,
    gender: null,
    profile_photo: null,
    county: null,
    sub_county: null,
    ward: null,
    location: null,
    sub_location: null,
    upi_number: null,
    blood_group: null,
    allergies: null,
    special_medical_needs: null,
    stream_id: null,
    admission_date: null,
    enrollment_type: null,
    boarding_status: null,
};

export const emptyStudentData = {
    // Profile Info
    first_name: '',
    other_names: '',
    sir_name: '',
    date_of_birth: null,
    gender: '',
    profile_photo: null,
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
    admission_date: null,
    enrollment_type: '',
    boarding_status: '',
};

// guardians/empty-data.ts
import { GuardianFormData, GuardianFormErrors } from '@/types/guardian';

export const emptyGuardianData: GuardianFormData = {
    first_name: '',
    other_names: '',
    sir_name: '',
    gender: '',
    national_id: '',
    occupation: '',
    phone_number: '',
    phone_number_2: '',
    email: '',
    address: '',
    county: '',
    sub_county: '',
    ward: '',
    location: '',
    sub_location: '',
    student_id: '',
    relationship_type: 'parent',
    is_primary: true,
    can_pick_student: true,
    can_pay_fees: true,
};

export const emptyGuardianErrors: GuardianFormErrors = {
    first_name: '',
    last_name: '',
    national_id: '',
    phone_number: '',
    email: '',
    address: '',
    student_id: '',
    occupation: '',
    county: '',
    sub_county: '',
    ward: '',
    location: '',
    sub_location: '',
    can_pay_fees: '',
    can_pick_student: '',
};
