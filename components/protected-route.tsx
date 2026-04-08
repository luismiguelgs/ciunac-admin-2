"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/modules/usuarios/store/auth.store";
import { useDocenteStore } from "@/modules/seguimiento-docente/docentes/docente.store";
import { canAccessRoute } from "@/lib/permissions";
import { getRequiredPermissionForPath, type PermissionCode } from "@/lib/access-control";
import { requireDocenteContext } from "@/lib/role-context";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredPermission?: PermissionCode;
    autoByPath?: boolean;
}

export default function ProtectedRoute({
    children,
    requiredPermission,
    autoByPath = true,
}: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const storeUser = useAuthStore((state) => state.user);
    const storePermissions = useAuthStore((state) => state.permisos);
    const hydrated = useAuthStore((state) => state.hydrated);
    const docenteId = useDocenteStore((state) => state.docenteId);
    const perfilId = useDocenteStore((state) => state.perfilId);
    const setAuthData = useAuthStore((state) => state.setAuthData);
    const setDocenteContext = useDocenteStore((state) => state.setDocenteContext);

    const sessionUser = (session?.user ?? null) as Record<string, unknown> | null;

    const effectiveUser = storeUser ?? sessionUser;
    const sessionPermissions = Array.isArray(sessionUser?.permisos)
        ? sessionUser.permisos.filter((permission): permission is string => typeof permission === "string")
        : [];
    const effectivePermissions = storePermissions.length ? storePermissions : sessionPermissions;

    // Usar docente store primero, fallback a sesión
    const effectiveDocenteId = docenteId ?? (sessionUser?.docenteId ? String(sessionUser.docenteId) : null);
    const effectivePerfilId = perfilId ?? (sessionUser?.perfilId ? String(sessionUser.perfilId) : null);

    const resolvedPermission = useMemo(() => {
        if (requiredPermission) return requiredPermission;
        if (!autoByPath || !pathname) return undefined;
        return getRequiredPermissionForPath(pathname);
    }, [requiredPermission, autoByPath, pathname]);

    const canAccess = canAccessRoute({
        role: effectiveUser?.rol,
        permissions: effectivePermissions,
        requiredPermission: resolvedPermission,
    });
    const hasDocenteContext = requireDocenteContext({
        role: effectiveUser?.rol,
        pathname: pathname ?? "",
        docenteId: effectiveDocenteId ?? undefined,
        perfilId: effectivePerfilId ?? undefined,
    });

    const docenteStoreHydrated = useDocenteStore((state) => state.hydrated);

    useEffect(() => {
        if (!hydrated || !docenteStoreHydrated || status === "loading" || !sessionUser) return;

        // Sincronizar Auth Store si está vacío
        if (!storeUser) {
            setAuthData(sessionUser, sessionPermissions);
        }

        // Sincronizar Docente Store si está vacío
        if (!docenteId && sessionUser.docenteId && sessionUser.perfilId) {
            setDocenteContext(String(sessionUser.docenteId), String(sessionUser.perfilId));
        }
    }, [hydrated, docenteStoreHydrated, status, sessionUser, storeUser, docenteId, sessionPermissions, setAuthData, setDocenteContext]);

    useEffect(() => {
        if (!hydrated || !docenteStoreHydrated || status === "loading") return;

        if (!effectiveUser) {
            router.replace("/");
            return;
        }

        if (!canAccess) {
            router.replace("/dashboard?error=unauthorized");
            return;
        }

        if (!hasDocenteContext) {
            router.replace("/dashboard?error=missing-docente-context");
        }
    }, [hydrated, docenteStoreHydrated, status, effectiveUser, canAccess, hasDocenteContext, router]);

    if (!hydrated || status === "loading") {
        return <div className="p-8 text-center text-gray-500">Verificando accesos...</div>;
    }

    if (!effectiveUser || !canAccess || !hasDocenteContext) {
        return null;
    }

    return <>{children}</>;
}
