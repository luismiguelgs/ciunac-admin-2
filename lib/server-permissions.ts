import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getRequiredPermissionForPath, type PermissionCode } from "@/lib/access-control";
import { canAccessRoute } from "@/lib/permissions";
import { requireDocenteContext } from "@/lib/role-context";

type SessionUser = {
    rol?: string;
    permisos?: string[];
    docenteId?: string;
    perfilId?: string;
};

export async function ensureServerPermission(pathname: string, requiredPermission?: PermissionCode): Promise<void> {
    const session = await auth();
    const sessionUser = (session?.user ?? null) as SessionUser | null;

    if (!sessionUser) {
        redirect("/");
    }

    const resolvedPermission = requiredPermission ?? getRequiredPermissionForPath(pathname);
    const allowed = canAccessRoute({
        role: sessionUser.rol,
        permissions: sessionUser.permisos ?? [],
        requiredPermission: resolvedPermission,
    });

    if (!allowed) {
        redirect("/dashboard?error=unauthorized");
    }

    const hasDocenteContext = requireDocenteContext({
        role: sessionUser.rol,
        pathname,
        docenteId: sessionUser.docenteId,
        perfilId: sessionUser.perfilId,
    });

    if (!hasDocenteContext) {
        redirect("/dashboard?error=missing-docente-context");
    }
}
