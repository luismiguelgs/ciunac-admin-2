"use client"

import {
    MoreHorizontal,
    UsersRound,
    Medal,
    BookOpenText,
    type LucideIcon,
    School,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function NavProjects({ projects
}: {
    projects: {
        name: string
        url: string
        icon: LucideIcon
    }[],
}) {
    const { isMobile } = useSidebar()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover>
                                    <MoreHorizontal />
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-48"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem>
                                    <Medal className="text-muted-foreground" />
                                    <span>Ranking Docentes</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <BookOpenText className="text-muted-foreground" />
                                    <span>Documentos</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <School className="text-muted-foreground" />
                                    <span>Académico administrativo</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <UsersRound className="text-muted-foreground" />
                                    <span>Docentes</span>
                                </DropdownMenuItem>


                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        <MoreHorizontal />
                        <span>More</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
