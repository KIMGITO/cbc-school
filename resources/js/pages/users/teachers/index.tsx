import { Column, DataTable } from '@/components/custom/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getDepartmentsOptions } from '@/helpers/selection-options';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse } from '@/types/pagination-interface';
import { Teacher } from '@/types/teacher';
import { formatDate } from '@/utils/date-formatter';
import { router } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    Download,
    Edit,
    Eye,
    GraduationCap,
    Plus,
    Search,
    Trash2,
    UserCheck,
    UserX,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface TeachersIndexInterface {
    teachers: PaginatedResponse<Teacher>;
    teacherCount: number;
}

export default function TeachersIndex({
    teachers: initialTeachers,
    teacherCount,
}: TeachersIndexInterface) {
    // Store the paginated response
    const [teachersResponse, setTeachersResponse] =
        useState<PaginatedResponse<Teacher>>(initialTeachers);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [departmentFilter, setDepartmentFilter] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);

    // Extract data and pagination info from response
    const teachers = teachersResponse?.data || [];
    const pagination = teachersResponse
        ? {
              currentPage: teachersResponse.current_page,
              totalPages: teachersResponse.last_page,
              totalItems: teachersResponse.total,
              onPageChange: handlePageChange,
              pageSize: teachersResponse.per_page,
          }
        : undefined;

    // Handle page change
    function handlePageChange(page: number) {
        setIsLoading(true);
        router.get(
            '/teachers',
            { page },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    setTeachersResponse(page.props.teachers);
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                },
            },
        );
    }

    const [departmentOptions, setDepartmentOptions] = useState([
        {
            value: '0',
            label: 'Loading...',
        },
    ]);

    useEffect(() => {
        async function fetchDepartments() {
            const departments = await getDepartmentsOptions()();
            setDepartmentOptions(departments);
        }
        fetchDepartments();
    }, []);

    // Filter teachers client-side (optional)
    const filteredTeachers = teachers.filter((teacher) => {
        const matchesSearch =
            search === '' ||
            teacher.name?.toLowerCase().includes(search.toLowerCase()) ||
            teacher.tsc_number?.toLowerCase().includes(search.toLowerCase()) ||
            teacher.phone_number?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            teacher.is_active === (statusFilter === 'active');

        const matchesDepartment =
            departmentFilter === 'all' ||
            teacher.department_id?.toString() === departmentFilter;

        return matchesSearch && matchesStatus && matchesDepartment;
    });

    // Columns definition
    const columns: Column<Teacher>[] = [
        {
            header: 'TSC No',
            accessor: 'tsc_number',
            className: 'font-medium',
        },
        {
            header: 'Full Name',
            accessor: (row) => row.name || `${row.first_name} ${row.sir_name}`,
        },
        {
            header: 'Department',
            accessor: (row) => row.department?.name || 'Not Assigned',
            cellClassName: (row) => (!row.department ? 'text-gray-400' : ''),
        },
        {
            header: 'Gender',
            accessor: 'gender',
            cell: (value) => (
                <Badge
                    variant={value === 'Male' ? 'default' : 'secondary'}
                    className={
                        value === 'Male'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-pink-100 text-pink-800'
                    }
                >
                    {value}
                </Badge>
            ),
        },
        {
            header: 'Email',
            accessor: 'email',
        },
        {
            header: 'Phone',
            accessor: 'phone_number',
        },
        {
            header: 'Status',
            accessor: 'is_active',
            cell: (value) => {
                if (value) {
                    return (
                        <Badge className="bg-green-100 text-green-800">
                            Active
                        </Badge>
                    );
                }
                return (
                    <Badge className="bg-gray-100 text-gray-800">
                        Inactive
                    </Badge>
                );
            },
        },
        {
            header: 'Employment Date',
            accessor: 'employment_date',
            cell: (value) => (
                <div className="flex items-center">
                    <Calendar className="mr-2 h-3 w-3 text-gray-400" />
                    {formatDate(value, 'medium')}
                </div>
            ),
        },
    ];

    // Actions for each row
    const actions = [
        {
            label: 'View Profile',
            onClick: (teacher: Teacher) =>
                router.get(`/teachers/${teacher.id}`),
            icon: <Eye className="h-4 w-4" />,
        },
        {
            label: 'Edit',
            onClick: (teacher: Teacher) =>
                router.get(`/teachers/${teacher.id}/edit`),
            icon: <Edit className="h-4 w-4" />,
        },
        {
            label: 'Delete',
            onClick: (teacher: Teacher) => {
                if (confirm('Are you sure you want to delete this teacher?')) {
                    router.delete(`/teachers/${teacher.id}`, {
                        onSuccess: () => {
                            router.reload();
                        },
                    });
                }
            },
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive' as const,
        },
    ];

    // Stats cards - use actual data
    const stats = [
        {
            label: 'Total Teachers',
            value: teacherCount.toLocaleString(),
            icon: UserCheck,
            color: 'bg-blue-500',
        },
        {
            label: 'Active Teachers',
            value: teachers.filter((t) => t.is_active).length.toLocaleString(),
            icon: BookOpen,
            color: 'bg-green-500',
        },
        {
            label: 'Departments',
            value: new Set(
                teachers.map((t) => t.department_id),
            ).size.toString(),
            icon: GraduationCap,
            color: 'bg-purple-500',
        },
        {
            label: 'Inactive',
            value: teachers.filter((t) => !t.is_active).length.toLocaleString(),
            icon: UserX,
            color: 'bg-amber-500',
        },
    ];

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.trim()) {
                router.get(
                    '/teachers',
                    { search },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: (page) => {
                            setTeachersResponse(page.props.teachers);
                        },
                    },
                );
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <AppLayout>
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Teacher Management
                        </h1>
                        <p className="text-gray-600">
                            Manage teacher records, employment, and profiles
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button
                            onClick={() => router.get('/teachers/create')}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4" />
                            New Teacher
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <ScrollArea className="w-full">
                    <div className="flex gap-4 pb-4">
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                className="min-w-[220px] flex-1 border-l-4 border-l-primary shadow-sm"
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                {stat.label}
                                            </p>
                                            <p className="mt-2 text-2xl font-bold">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div
                                            className={`rounded-lg p-3 ${stat.color}`}
                                        >
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Filters and Search */}
                <Card className="border shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-1 items-center gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search teachers by name, TSC number, phone"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Select
                                    value={statusFilter}
                                    onValueChange={(value) => {
                                        setStatusFilter(value);
                                        router.get(
                                            '/teachers',
                                            {
                                                status:
                                                    value !== 'all'
                                                        ? value
                                                        : undefined,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                                onSuccess: (page) => {
                                                    setTeachersResponse(
                                                        page.props.teachers,
                                                    );
                                                },
                                            },
                                        );
                                    }}
                                >
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={departmentFilter}
                                    onValueChange={(value) => {
                                        setDepartmentFilter(value);
                                        router.get(
                                            '/teachers',
                                            {
                                                department:
                                                    value !== 'all'
                                                        ? value
                                                        : undefined,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                                onSuccess: (page) => {
                                                    setTeachersResponse(
                                                        page.props.teachers,
                                                    );
                                                },
                                            },
                                        );
                                    }}
                                >
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Departments
                                        </SelectItem>
                                        {departmentOptions.map((dept) => (
                                            <SelectItem
                                                key={dept.value}
                                                value={dept.value}
                                            >
                                                {dept.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <DataTable
                    data={filteredTeachers}
                    columns={columns}
                    keyExtractor={(teacher) => teacher.id}
                    onRowClick={(teacher) =>
                        router.get(`/teachers/${teacher.id}`)
                    }
                    pagination={pagination}
                    actions={actions}
                    emptyMessage="No teachers found. Try adjusting your filters."
                    isLoading={isLoading}
                    rowClassName={(teacher) =>
                        !teacher.is_active ? 'bg-gray-50' : ''
                    }
                />
            </div>
        </AppLayout>
    );
}
