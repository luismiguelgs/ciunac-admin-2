"use client"

import * as React from "react"
import {
    ScanEye,
    Command,
    LifeBuoy,
    Medal,
    BookOpenText,
    Settings2,
    School,
    UsersRound,
    LayoutDashboard,
    Binoculars,
    MessageCircleQuestionMark,
    ListChecks,
    Settings,
    CirclePile,
    Users,
    Boxes,
    Download,
    Upload,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
//import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Perfil Docentes",
            url: "#",
            icon: ScanEye,
            items: [
                {
                    title: "Dashboard",
                    url: "/perfil-docente",
                    icon: LayoutDashboard
                },
                {
                    title: "Ranking Docentes",
                    url: "/perfil-docente/ranking-docentes",
                    icon: Medal
                },
                {
                    title: "Documentos",
                    url: "/perfil-docente/documentos",
                    icon: BookOpenText
                },
                {
                    title: "Académico administrativo",
                    url: "/perfil-docente/academico-administrativo",
                    icon: School
                },
                {
                    title: "Docentes",
                    url: "/perfil-docente/docentes",
                    icon: UsersRound
                },
            ],
        },
        {
            title: "Encuestas",
            url: "#",
            icon: Binoculars,
            items: [
                {
                    title: "Respuestas",
                    url: "/perfil-docente/encuestas",
                    icon: ListChecks
                },
                {
                    title: "Preguntas",
                    url: "/perfil-docente/encuestas/preguntas",
                    icon: MessageCircleQuestionMark
                },
                {
                    title: "Importar",
                    url: "/perfil-docente/encuestas/importar",
                    icon: Upload
                }
            ],
        },
        {
            title: "Opciones",
            url: "/perfil-docente/opciones",
            icon: Settings
        }
    ],

    navSecondary: [
        {
            title: "Estructuración",
            url: "/estructura",
            icon: Boxes,
        },
        {
            title: "Grupos",
            url: "/grupos",
            icon: CirclePile,
        },
        {
            title: "Usuarios",
            url: "/usuarios",
            icon: Users,
        },
    ],
    /*
    platform: [
        {
            name: "Configuración",
            url: "#",
            icon: Settings2,
        },
    ],*/
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/dashboard">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">CIUNAC</span>
                                    <span className="truncate text-xs">Universidad Nacional del Callao</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/*<NavProjects projects={data.platform} />*/}
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
