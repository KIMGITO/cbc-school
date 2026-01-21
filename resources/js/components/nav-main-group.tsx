import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuGroupButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useActiveUrl } from '@/hooks/use-active-url';
import { type NavItem } from '@/types';
import { router } from '@inertiajs/react';

interface NavGroupProps {
    title: string;
    items?: NavItem[];
    defaultOpen?: boolean;
    showAddButton?: boolean;
    addUrl?: string;
    onAddClick?: () => void;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    groupClassName?: string;
}

export function NavMainGroup({
    title,
    items = [],
    defaultOpen = false,
    showAddButton = false,
    addUrl = '',
    onAddClick,
    icon: Icon,
    badge,
    groupClassName,
}: NavGroupProps) {
    const { urlIsActive } = useActiveUrl();

    // Check if any item in the group is active
    const hasActiveItem = items.some((item) => urlIsActive(item.href));

    const handleLinkClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        e.stopPropagation(); // Stop event from bubbling to parent

        // Only navigate if it's a new URL
        if (window.location.pathname !== href) {
            router.get(href);
        }
    };

    return (
        <SidebarGroup className={groupClassName}>
            <SidebarMenuGroupButton
                title={title}
                icon={Icon}
                badge={badge}
                defaultOpen={defaultOpen || hasActiveItem} // Auto-open if has active item
                isActive={hasActiveItem}
                showAddButton={showAddButton}
                onAddClick={onAddClick}
                className="group data-[state=open]:bg-blue-50 dark:data-[state=open]:bg-blue-950/20"
            >
                <SidebarMenu className="overflow-hidden pl-6">
                    {items.map((item) => {
                        const isActive = urlIsActive(item.href);

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    className={`relative ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700 before:absolute before:top-1/2 before:left-0 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-blue-600 dark:bg-blue-950/30 dark:text-blue-300'
                                            : 'hover:bg-blue-50/50 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:text-blue-300'
                                    }`}
                                    tooltip={{ children: item.title }}
                                >
                                    <a
                                        href={item.href}
                                        onClick={(e) =>
                                            handleLinkClick(e, item.href)
                                        }
                                        className="flex w-full items-center gap-2 px-2 py-1.5 text-sm"
                                    >
                                        {item.icon && (
                                            <item.icon
                                                className={`h-4 w-4 ${
                                                    isActive
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-500 group-hover:text-blue-500 dark:text-gray-400'
                                                }`}
                                            />
                                        )}
                                        <span
                                            className={`flex-1 ${
                                                isActive
                                                    ? 'font-medium'
                                                    : 'font-normal'
                                            }`}
                                        >
                                            {item.title}
                                        </span>
                                        {item.badge && (
                                            <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                                {item.badge}
                                            </span>
                                        )}
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarMenuGroupButton>
        </SidebarGroup>
    );
}
