import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import {
    BarChart,
    GraduationCap,
    LayoutGrid,
    Settings,
    ShieldIcon,
    UserPlus2Icon,
    Users,
    Users2,
} from 'lucide-react';
import AppLogo from './app-logo';
import { NavMainGroup } from './nav-main-group';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Student Admission Form.',
        href: '/students/create',
        icon: UserPlus2Icon,
    },
];

const navGroups = [
    {
        title: 'Dashboard',
        items: [
            { title: 'Overview', href: '/', icon: BarChart },
            {
                title: 'Analytics',
                href: '/analytics',
                icon: BarChart,
                badge: '5',
            },
        ],
        icon: BarChart,
        defaultOpen: false,
    },
    {
        title: 'Students',
        items: [
            {
                title: 'All Students',
                href: '/students',
                icon: GraduationCap,
                badge: '0', 
            },
            // {
            //     title: 'Admissions',
            //     href: '/admissions',
            //     icon: Users,
            //     badge: '12',
            // },
        ],
        icon: Users,
        defaultOpen: false,
        showAddButton: true,
        addUrl: '/students/create',
        badge: 154,
    },
    {
        title: 'Parent/Guardian',
        icon: Users2,
        defaultOpen: false,
        showAddButton: true,
        addUrl: '/guardian/create',
        badge: 100,
        items: [],
    },
];
const footerNavItems = [
    {
        title: 'Administration',
        items: [
            {
                title: 'Settings',
                href: '/system/config/levels',
                icon: Settings,
            },
            // { title: 'Users', href: '/users', icon: Users },
        ],
        icon: ShieldIcon,
        defaultOpen: false,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* <NavMain items={mainNavItems} /> */}
                {navGroups.map((group) => (
                    <NavMainGroup
                        key={group.title}
                        title={group.title}
                        items={group.items}
                        defaultOpen={group.defaultOpen}
                        showAddButton={group.showAddButton}
                        onAddClick={() => {
                            router.get(`${group.addUrl}`);
                        }}
                        icon={group.icon}
                        badge={group.badge}
                        groupClassName="border-t border-gray-200 dark:border-gray-800 pt-2 first:border-t-0 first:pt-0"
                    />
                ))}
            </SidebarContent>

            <SidebarFooter>
                {footerNavItems.map((group) => (
                    <NavMainGroup
                        key={group.title}
                        title={group.title}
                        items={group.items}
                        defaultOpen={group.defaultOpen}
                        icon={group.icon}
                        badge={'0'}
                        groupClassName="border-t border-gray-200 dark:border-gray-800 pt-2 first:border-t-0 first:pt-0"
                    />
                ))}

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
