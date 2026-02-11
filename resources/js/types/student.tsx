import { PaginatedResponse } from './pagination-interface';

export interface StudentFormDataProps {
    // Profile Info (from ProfileInfoTab)
    first_name: string;
    sir_name: string;
    other_names: string;
    date_of_birth: string | null;
    gender: 'male' | 'female' | '' | null;
    profile_photo: File | null;

    // Address Info (from AddressInfoTab)
    county_name: string;
    county_id: string;
    sub_county_name: string;
    sub_county_id: string;
    ward_id: string;
    ward_name: string;
    location: string;
    sub_location: string;
    upi_number: string;

    // Medical Info (from MedicalInfoTab)
    blood_group: string;
    allergies: string;
    special_medical_needs: string;

    // School Data (from SchoolDataTab)
    stream_id: string;
    adm_no: string;
    enrollment_type: string;
    boarding_status: string;
}



export interface Student {
   
    id: string;
    adm_no: string;
    name: string;
    stream: {
        name: string;
        id: string;
    } | null;
    gender: string;
    academic_status: 'active' | 'inactive' | 'transferred' | 'graduated';
    admission_date: string;
    profile_photo:string;
}

export type PaginatedStudentsProps = PaginatedResponse<Student>;
