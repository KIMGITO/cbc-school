import { PaginatedResponse } from './pagination-interface';

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
