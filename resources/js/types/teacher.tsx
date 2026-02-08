
export interface QualificationsProps {
    name: string;
    institution: string;
    tsc_registered?: boolean;
    year_completed: string;
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
    home_address: string;
    residential_address: string;
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
}

export interface TeacherFormDataErrorProps {
    user_id?: string;
    first_name?: string;
    sir_name?: string;
    other_names?: string;
    gender?: string;
    national_id?: string;
    phone_number?: string;
    phone_number_2?: string;
    email?: string;
    home_address?: string;
    residential_address?: string;
    county?: string;
    county_name?: string;
    sub_county?: string;
    sub_county_name?: string;
    ward?: string;
    ward_name?: string;
    location?: string;
    sub_location?: string;
    tsc_number?: string;
    kra_pin?: string;
    qualifications?: string;
    department_id?: string;
}
