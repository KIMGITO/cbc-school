// pages/students/index.tsx
import { Column, DataTable } from '@/components/custom/data-tabsle';
import FormField from '@/components/custom/form-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getStreamsOptions } from '@/helpers/selection-options';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse } from '@/types/pagination-interface';
import { Student } from '@/types/student';
import { formatDate } from '@/utils/date-formatter';
import { router } from '@inertiajs/react';
import {
    Calendar,
    Download,
    Edit,
    Eye,
    Filter,
    Plus,
    Search,
    Trash2,
    UserCheck,
    UserX,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface StudentsIndexInterface {
    students: PaginatedResponse<Student>; // Changed from Students to students (lowercase)
    studentCount: number;
}

export default function StudentsIndex({
    students: initialStudents, // Renamed to avoid conflict
    studentCount,
}: StudentsIndexInterface) {
    console.log('Students count', studentCount);

    // Store the paginated response
    const [studentsResponse, setStudentsResponse] =
        useState<PaginatedResponse<Student>>(initialStudents);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [streamFilter, setStreamFilter] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);

    // Extract data and pagination info from response
    const students = studentsResponse?.data || [];
    const pagination = studentsResponse
        ? {
              currentPage: studentsResponse.current_page,
              totalPages: studentsResponse.last_page,
              totalItems: studentsResponse.total,
              onPageChange: handlePageChange,
              pageSize: studentsResponse.per_page,
          }
        : undefined;

    // Handle page change
    function handlePageChange(page: number) {
        setIsLoading(true);
        router.get(
            '/students',
            { page },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    setStudentsResponse(page.props.students);
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                },
            },
        );
    }

    const [streamOptions, setStreamOptions] = useState([{
        value: '0',
        label: 'streams'
    }]);
    useEffect(() => {
        async function fetchStreams() {
            const streams = await getStreamsOptions()();
            setStreamOptions(streams);
        }
        fetchStreams();
    },[])

    const getRowNumber = (index: number) => {
        if (
            !studentsResponse ||
            !studentsResponse.current_page ||
            !studentsResponse.per_page
        ) {
            return index + 1;
        }

        return (
            (studentsResponse.current_page - 1) * studentsResponse.per_page +
            index +
            1
        );
    };

    // Filter students client-side (optional - or do it server-side)
    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            search === '' ||
            student.name?.toLowerCase().includes(search.toLowerCase()) ||
            student.adm_no?.toLowerCase().includes(search.toLowerCase()) 

        const matchesStatus =
            statusFilter === 'all' || student.academic_status === statusFilter;

        const matchesStream =
            streamFilter === 'all' || student.stream?.id === streamFilter;

        return matchesSearch && matchesStatus && matchesStream;
    });

    // For server-side filtering, you would remove the above and pass filters to router.get

    // Columns definition
    const columns: Column<Student>[] = [
        // {
        //     header: '#',
        //     accessor: 'id',
        //     cell: ( index) => {

        //         return (
        //             <div className="w-8 text-center font-medium text-gray-500">
        //                 {index+1}
        //             </div>
        //         );
        //     },
        //     className: 'w-12',
        // },
        {
            header: 'Admission No',
            accessor: 'adm_no',
            className: 'font-medium',
        },
        {
            header: 'Full Name',
            accessor: (row) => row.name,
        },
        {
            header: 'Stream/Class',
            accessor: (row) => row.stream?.name || 'Not Assigned',
            cellClassName: (row) => (!row.stream ? 'text-gray-400' : ''),
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
            header: 'Status',
            accessor: 'academic_status', 
            cell: (value) => {
                const variants = {
                    active: {
                        bg: 'bg-green-100',
                        text: 'text-green-800',
                        label: 'Active',
                    },
                    inactive: {
                        bg: 'bg-gray-100',
                        text: 'text-gray-800',
                        label: 'Inactive',
                    },
                    transferred: {
                        bg: 'bg-blue-100',
                        text: 'text-blue-800',
                        label: 'Transferred',
                    },
                    graduated: {
                        bg: 'bg-purple-100',
                        text: 'text-purple-800',
                        label: 'Graduated',
                    },
                };

                const variant = variants[value as keyof typeof variants] || {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    label: value,
                };
                return (
                    <Badge className={`${variant.bg} ${variant.text}`}>
                        {variant.label}
                    </Badge>
                );
            },
        },

        {
            header: 'Admission Date',
            accessor: 'admission_date',
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
            onClick: (student: Student) =>
                router.get(`/students/${student.id}`),
            icon: <Eye className="h-4 w-4" />,
        },
        {
            label: 'Edit',
            onClick: (student: Student) =>
                router.get(`/students/${student.id}/edit`),
            icon: <Edit className="h-4 w-4" />,
        },
        
        {
            label: 'Delete',
            onClick: (student: Student) => {
                if (confirm('Are you sure you want to delete this student?')) {
                    console.log('Delete', student);
                }
            },
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive' as const,
        },
    ];

    // Stats cards - use actual data
    const stats = [
        {
            label: 'Total Students',
            value: studentCount.toLocaleString(),
            icon: UserCheck,
            color: 'bg-blue-500',
        },
        {
            label: 'Present Today',
            value: studentCount,
            icon: Calendar,
            color: 'bg-green-500',
        },
        {
            label: 'New This Year',
            value: '35', // You can calculate this from admission_date
            icon: Plus,
            color: 'bg-purple-500',
        },
        {
            label: 'Inactive',
            value: students
                .filter((s) => s.academic_status === 'inactive')
                .length.toLocaleString(),
            icon: UserX,
            color: 'bg-amber-500',
        },
    ];

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.trim()) {
                router.get(
                    '/students',
                    { search },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: (page) => {
                            // setStudentsResponse(page.props.students);
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
                            Student Management
                        </h1>
                        <p className="text-gray-600">
                            Manage student records, admissions, and profiles
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button
                            onClick={() => router.get('/students/create')}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4" />
                            New Admission
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
                                        placeholder="Search students by name, admission number"
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
                                            '/students',
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
                                                    setStudentsResponse(
                                                        page.props.students,
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
                                        <SelectItem value="graduated">
                                            Graduated
                                        </SelectItem>
                                        <SelectItem value="transferred">
                                            Transferred
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={streamFilter}
                                    onValueChange={(value) => {
                                        setStreamFilter(value);
                                        router.get(
                                            '/students',
                                            {
                                                stream:
                                                    value !== 'all'
                                                        ? value
                                                        : undefined,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                                onSuccess: (page) => {
                                                    setStudentsResponse(
                                                        page.props.students,
                                                    );
                                                },
                                            },
                                        );
                                    }}
                                >
                                    

                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Stream" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Streams
                                        </SelectItem>
                                        {streamOptions.map(stream => (
                                            <SelectItem key={stream.value} value={stream.value}>
                                                {stream.label}
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
                    data={filteredStudents} // Use filteredStudents for client-side filtering
                    columns={columns}
                    keyExtractor={(student) => student.id}
                    onRowClick={(student) =>
                        router.get(`/students/${student.id}`)
                    }
                    pagination={pagination}
                    actions={actions}
                    emptyMessage="No students found. Try adjusting your filters."
                    isLoading={isLoading}
                    rowClassName={(student) =>
                        student.academic_status === 'inactive'
                            ? 'bg-gray-50'
                            : ''
                    }
                />

                {/* Quick Actions */}
                {/* <Card className="border-t-4 border-t-primary">
                    <CardContent className="p-6">
                        <CardTitle className="mb-4 flex items-center text-lg">
                            <Badge className="me-3 rounded-full bg-primary shadow">
                                !
                            </Badge>
                            <span>Quick Actions</span>
                        </CardTitle>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline" className="gap-2">
                                <UserCheck className="h-4 w-4" />
                                Bulk Status Update
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Download className="h-4 w-4" />
                                Download Report
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Calendar className="h-4 w-4" />
                                Attendance Summary
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Edit className="h-4 w-4" />
                                Mass Edit
                            </Button>
                        </div>
                    </CardContent>
                </Card> */}
            </div>
        </AppLayout>
    );
}
