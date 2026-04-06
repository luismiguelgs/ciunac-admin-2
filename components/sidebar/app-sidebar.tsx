"use client"

import * as React from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
    ScanEye,
    Command,
    Medal,
    BookOpenText,
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
    Upload,
    GraduationCap,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
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
import { useAuthStore } from "@/modules/usuarios/store/auth.store"
import { useSession } from "next-auth/react"
import { canAccessRoute } from "@/lib/permissions"
import { getPermissionByExactPath, type PermissionCode } from "@/lib/access-control"

type SidebarSubItem = {
    title: string
    url: string
    icon: LucideIcon
    requiredPermission?: PermissionCode
}

type SidebarMainItem = {
    title: string
    url: string
    icon: LucideIcon
    requiredPermission?: PermissionCode
    items?: SidebarSubItem[]
}

type SidebarSecondaryItem = {
    title: string
    url: string
    icon: LucideIcon
    requiredPermission?: PermissionCode
}

const data: {
    navMain: SidebarMainItem[]
    navSolicitudes: SidebarMainItem[]
    navSecondary: SidebarSecondaryItem[]
} = {
    navMain: [
        {
            title: "Perfil Docentes",
            url: "#",
            icon: ScanEye,
            items: [
                {
                    title: "Dashboard",
                    url: "/perfil-docente",
                    icon: LayoutDashboard,
                    requiredPermission: getPermissionByExactPath("/perfil-docente"),
                },
                {
                    title: "Ranking Docentes",
                    url: "/perfil-docente/ranking-docentes",
                    icon: Medal,
                    requiredPermission: getPermissionByExactPath("/perfil-docente/ranking-docentes"),
                },
                {
                    title: "Documentos",
                    url: "/perfil-docente/documentos",
                    icon: BookOpenText,
                    requiredPermission: getPermissionByExactPath("/perfil-docente/documentos"),
                },
                {
                    title: "Academico administrativo",
                    url: "/perfil-docente/academico-administrativo",
                    icon: School,
                    requiredPermission: getPermissionByExactPath("/perfil-docente/academico-administrativo"),
                },
                {
                    title: "Docentes",
                    url: "/perfil-docente/docentes",
                    icon: UsersRound,
                    requiredPermission: getPermissionByExactPath("/perfil-docente/docentes"),
                },
                {
                    title: "Mis Resultados",
                    url: "/perfil-docente/mis-resultados",
                    icon: Medal,
                    requiredPermission: getPermissionByExactPath("/perfil-docente/mis-resultados"),
                },
                {
                    title: "Mi perfil",
                    url: "/perfil-docente/mi-perfil",
                    icon: BookOpenText,
                    requiredPermission: getPermissionByExactPath("/perfil-docente/mi-perfil"),
                }
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
                    icon: ListChecks,
                    requiredPermission: getPermissionByExactPath("/perfil-docente/encuestas"),
                },
                {
                    title: "Preguntas",
                    url: "/perfil-docente/encuestas/preguntas",
                    icon: MessageCircleQuestionMark,
                    requiredPermission: getPermissionByExactPath("/perfil-docente/encuestas/preguntas"),
                },
                {
                    title: "Importar",
                    url: "/perfil-docente/encuestas/importar",
                    icon: Upload,
                    requiredPermission: getPermissionByExactPath("/perfil-docente/encuestas/importar"),
                },
                {
                    title: "Mi Encuesta",
                    url: "/perfil-docente/encuestas/mi-encuesta",
                    icon: ListChecks,
                    requiredPermission: getPermissionByExactPath("/perfil-docente/encuestas/mi-encuesta"),
                }
            ],
        },
        {
            title: "Opciones",
            url: "/perfil-docente/opciones",
            icon: Settings,
            requiredPermission: getPermissionByExactPath("/perfil-docente/opciones"),
        },
    ],
    navSolicitudes: [
        {
            title: "Becas CIUNAC",
            url: "/perfil-docente/becas",
            icon: GraduationCap,
        },
    ],
    navSecondary: [
        {
            title: "Estructuracion",
            url: "/estructura",
            icon: Boxes,
            requiredPermission: getPermissionByExactPath("/estructura"),
        },
        {
            title: "Grupos",
            url: "/grupos",
            icon: CirclePile,
            requiredPermission: getPermissionByExactPath("/grupos"),
        },
        {
            title: "Usuarios",
            url: "/usuarios",
            icon: Users,
            requiredPermission: getPermissionByExactPath("/usuarios"),
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession()
    const storeUser = useAuthStore((state) => state.user)
    const storePermissions = useAuthStore((state) => state.permisos)

    const sessionUser = (session?.user ?? null) as Record<string, unknown> | null
    const sessionPermissions = Array.isArray(sessionUser?.permisos)
        ? sessionUser.permisos.filter((permission): permission is string => typeof permission === "string")
        : []

    const effectiveUser = storeUser ?? sessionUser
    const effectivePermissions = storePermissions.length ? storePermissions : sessionPermissions

    const hasAccess = React.useCallback(
        (requiredPermission?: PermissionCode) => {
            return canAccessRoute({
                role: effectiveUser?.rol,
                permissions: effectivePermissions,
                requiredPermission,
            })
        },
        [effectiveUser, effectivePermissions]
    )

    const navMain = React.useMemo(() => {
        return data.navMain
            .map((item) => {
                if (!item.items?.length) {
                    return hasAccess(item.requiredPermission) ? item : null
                }

                const filteredItems = item.items.filter((subItem) => hasAccess(subItem.requiredPermission))
                if (!filteredItems.length) return null

                return { ...item, items: filteredItems }
            })
            .filter((item): item is SidebarMainItem => Boolean(item))
    }, [hasAccess])

    const navSolicitudes = React.useMemo(() => {
        return data.navSolicitudes
            .map((item) => {
                if (!item.items?.length) {
                    return hasAccess(item.requiredPermission) ? item : null
                }

                const filteredItems = item.items.filter((subItem) => hasAccess(subItem.requiredPermission))
                if (!filteredItems.length) return null

                return { ...item, items: filteredItems }
            })
            .filter((item): item is SidebarMainItem => Boolean(item))
    }, [hasAccess])

    const navSecondary = React.useMemo(() => {
        return data.navSecondary.filter((item) => hasAccess(item.requiredPermission))
    }, [hasAccess])

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">CIUNAC</span>
                                    <span className="truncate text-xs">Universidad Nacional del Callao</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navSolicitudes} label="Solicitudes" />
                <NavMain items={navMain} label="Seguimiento Docente" />
                <NavSecondary items={navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
