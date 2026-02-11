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
import AppLayout from '@/layouts/app-layout';
import { Guardian, RelationTypes } from '@/types/guardian';
import { PaginatedResponse } from '@/types/pagination-interface';
import { router } from '@inertiajs/react';
import {
    Download,
    Edit,
    Eye,
    Mail,
    Phone,
    Plus,
    Search,
    Trash2,
    UserCheck,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface GuardiansIndexInterface {
    guardians: PaginatedResponse<Guardian>;
    guardianCount: number;
}

export default function GuardiansIndex({
    guardians: initialGuardians,
    guardianCount,
}: GuardiansIndexInterface) {
    // Store the paginated response
    const [guardiansResponse, setGuardiansResponse] =
        useState<PaginatedResponse<Guardian>>(initialGuardians);

    const [search, setSearch] = useState('');
    const [relationshipFilter, setRelationshipFilter] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);

    // Extract data and pagination info from response
    const guardians = guardiansResponse?.data || [];
    const pagination = guardiansResponse
        ? {
              currentPage: guardiansResponse.current_page,
              totalPages: guardiansResponse.last_page,
              totalItems: guardiansResponse.total,
              onPageChange: handlePageChange,
              pageSize: guardiansResponse.per_page,
          }
        : undefined;

    // Handle page change
    function handlePageChange(page: number) {
        setIsLoading(true);
        router.get(
            '/guardians',
            { page },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    setGuardiansResponse(page.props.guardians);
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                },
            },
        );
    }

    // Get unique relationships for filter
    const relationshipOptions = ['all', ...new Set(RelationTypes)];

    // Filter guardians client-side (optional)
    const filteredGuardians = guardians.filter((guardian) => {
        const matchesSearch =
            search === '' ||
            guardian.name?.toLowerCase().includes(search.toLowerCase()) ||
            guardian.phone?.toLowerCase().includes(search.toLowerCase()) ||
            guardian.email?.toLowerCase().includes(search.toLowerCase()) ||
            guardian.national_id?.toLowerCase().includes(search.toLowerCase());

        const matchesRelationship =
            relationshipFilter === 'all' ||
            guardian.relationship === relationshipFilter;

        return matchesSearch && matchesRelationship;
    });

    // Columns definition
    const columns: Column<Guardian>[] = [
        {
            header: 'Full Name',
            accessor: (row) => row.name || `${row.first_name} ${row.sir_name}`,
        },
       
        {
            header: 'National ID',
            accessor: 'national_id',
        },
        {
            header: 'Phone',
            accessor: 'phone',
            cell: (value) => (
                <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-gray-400" />
                    {value}
                </div>
            ),
        },
        {
            header: 'Email',
            accessor: 'email',
            cell: (value) => (
                <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-gray-400" />
                    {value}
                </div>
            ),
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
            header: 'Students',
            accessor: (row) => row.students_count || row.students?.length || 0,
            cell: (value) => (
                <Badge variant="secondary">
                    {value} student{value !== 1 ? 's' : ''}
                </Badge>
            ),
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
    ];

    // Actions for each row
    const actions = [
        {
            label: 'View Profile',
            onClick: (guardian: Guardian) =>
                router.get(`/guardians/${guardian.id}`),
            icon: <Eye className="h-4 w-4" />,
        },
        {
            label: 'Edit',
            onClick: (guardian: Guardian) =>
                router.get(`/guardians/${guardian.id}/edit`),
            icon: <Edit className="h-4 w-4" />,
        },
        {
            label: 'Delete',
            onClick: (guardian: Guardian) => {
                if (confirm('Are you sure you want to delete this guardian?')) {
                    router.delete(`/guardians/${guardian.id}`, {
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

    // Stats cards
    const stats = [
        {
            label: 'Total Guardians',
            value: guardianCount.toLocaleString(),
            icon: Users,
            color: 'bg-blue-500',
        },
        {
            label: 'Active Guardians',
            value: guardians.filter((g) => g.is_active).length.toLocaleString(),
            icon: UserCheck,
            color: 'bg-green-500',
        },
        {
            label: 'Fathers',
            value: guardians
                .filter((g) => g.relationship?.toLowerCase() === 'father')
                .length.toLocaleString(),
            icon: Users,
            color: 'bg-indigo-500',
        },
        {
            label: 'Mothers',
            value: guardians
                .filter((g) => g.relationship?.toLowerCase() === 'mother')
                .length.toLocaleString(),
            icon: Users,
            color: 'bg-pink-500',
        },
    ];

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.trim()) {
                router.get(
                    '/guardians',
                    { search },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: (page) => {
                            setGuardiansResponse(page.props.guardians);
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
                            Guardian Management
                        </h1>
                        <p className="text-gray-600">
                            Manage guardian records and student relationships
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button
                            onClick={() => router.get('/guardians/create')}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4" />
                            New Guardian
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
                                        placeholder="Search guardians by name, phone, email, or national ID"
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
                                    value={relationshipFilter}
                                    onValueChange={(value) => {
                                        setRelationshipFilter(value);
                                        router.get(
                                            '/guardians',
                                            {
                                                relationship:
                                                    value !== 'all'
                                                        ? value
                                                        : undefined,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                                onSuccess: (page) => {
                                                    setGuardiansResponse(
                                                        page.props.guardians,
                                                    );
                                                },
                                            },
                                        );
                                    }}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Relationship" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Relationships
                                        </SelectItem>
                                        {RelationTypes
                                            .filter((r) => r !== 'all')
                                            .map((relationship) => (
                                                <SelectItem
                                                    key={relationship.value}
                                                    value={relationship.value}
                                                    className="capitalize"
                                                >
                                                    {relationship.label}
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
                    data={filteredGuardians}
                    columns={columns}
                    keyExtractor={(guardian) => guardian.id}
                    onRowClick={(guardian) =>
                        router.get(`/guardians/${guardian.id}`)
                    }
                    pagination={pagination}
                    actions={actions}
                    emptyMessage="No guardians found. Try adjusting your filters."
                    isLoading={isLoading}
                    rowClassName={(guardian) =>
                        !guardian.is_active ? 'bg-gray-50' : ''
                    }
                />
            </div>
        </AppLayout>
    );
}
