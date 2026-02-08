import { SelectOption } from '@/components/custom/form-field';
import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Department {
    id: string | number;
    name: string;
    is_active: boolean;
}

interface DepartmentState {
    departments: SelectOption[];
    fetchDepartments: () => Promise<void>;
}

export const useDepartmentStore = create<DepartmentState>()(
    persist(
        (set) => ({
            departments: [],
            fetchDepartments: async () => {
                try {
                    const response = await axios.get('/api/v1/departments');
                    const departments: Department[] = response.data.data || [];
                    console.log(departments);

                    const departmentOptions: SelectOption[] = departments.map(
                        (dept: Department) => ({
                            label: dept.name,
                            value: dept.id,
                            disabled: !dept.is_active,
                        }),
                    );

                    console.log('success', departmentOptions);
                    set({ departments: departmentOptions });
                } catch (error) {
                    set({ departments: [] });
                    console.error('Error fetching departments:', error);
                }
            },
        }),
        {
            name: 'department-store',
        },
    ),
);
