import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { MobileNavigationProvider } from '@/components/ui/bottombar';
import { useIsMobile } from '@/hooks/use-mobile';
import { type BreadcrumbItem } from '@/types';
import {
    BellIcon,
    FileTextIcon,
    HomeIcon,
    SettingsIcon,
    UserIcon,
} from 'lucide-react';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const navItems = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: <HomeIcon className="h-5 w-5" />,
            subLinks: [
                {
                    id: 'overview',
                    name: 'Overview',
                    path: '/dashboard',
                    icon: <FileTextIcon className="h-4 w-4" />,
                },
                {
                    id: 'analytics',
                    name: 'Analytics',
                    path: '/dashboard/analytics',
                    icon: <FileTextIcon className="h-4 w-4" />,
                },
                {
                    id: 'reports',
                    name: 'Reports',
                    path: '/dashboard/reports',
                    icon: <FileTextIcon className="h-4 w-4" />,
                },
            ],
        },
        {
            id: 'users',
            name: 'Users',
            icon: <UserIcon className="h-5 w-5" />,
            subLinks: [
                {
                    id: 'all-users',
                    name: 'All Users',
                    path: '/users',
                    icon: <UserIcon className="h-4 w-4" />,
                },
                {
                    id: 'admins',
                    name: 'Admins',
                    path: '/users/admins',
                    icon: <UserIcon className="h-4 w-4" />,
                },
                {
                    id: 'customers',
                    name: 'Customers',
                    path: '/users/customers',
                    icon: <UserIcon className="h-4 w-4" />,
                },
            ],
        },
        {
            id: 'settings',
            name: 'Settings',
            icon: <SettingsIcon className="h-5 w-5" />,
            subLinks: [
                {
                    id: 'general',
                    name: 'General',
                    path: '/settings',
                    icon: <SettingsIcon className="h-4 w-4" />,
                },
                {
                    id: 'security',
                    name: 'Security',
                    path: '/settings/security',
                    icon: <SettingsIcon className="h-4 w-4" />,
                },
                {
                    id: 'notifications',
                    name: 'Notifications',
                    path: '/settings/notifications',
                    icon: <BellIcon className="h-4 w-4" />,
                },
            ],
        },
    ];

    const isMobile = useIsMobile();
    return (
        <AppShell variant="sidebar">
            {isMobile ? (
                <MobileNavigationProvider navItems={navItems} />
            ) : (
                <AppSidebar />
            )}
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
