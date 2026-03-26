"use client"

import { useEffect } from "react"
import { SessionProvider, useSession } from "next-auth/react"
import { useAuthStore } from "@/modules/usuarios/store/auth.store"
import { useDocenteStore } from "@/modules/seguimiento-docente/docentes/docente.store"

function AuthSessionSync() {
    const { data: session, status } = useSession()
    const setAuthData = useAuthStore((state) => state.setAuthData)
    const clearAuthData = useAuthStore((state) => state.clearAuthData)
    const clearDocenteContext = useDocenteStore((state) => state.clearDocenteContext)

    useEffect(() => {
        if (status === "loading") return

        const sessionUser = (session?.user ?? null) as Record<string, unknown> | null
        if (!sessionUser) {
            clearAuthData()
            clearDocenteContext()
            return
        }

        const sessionPermissions = Array.isArray(sessionUser.permisos)
            ? sessionUser.permisos.filter((permission): permission is string => typeof permission === "string")
            : []

        setAuthData(sessionUser, sessionPermissions)
    }, [session, status, setAuthData, clearAuthData, clearDocenteContext])

    return null
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthSessionSync />
            {children}
        </SessionProvider>
    )
}
