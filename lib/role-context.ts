import { matchesPathPrefix } from "@/lib/access-control";
import { normalizeRole } from "@/lib/permissions";
import { ROLES } from "@/lib/roles";

export type DocenteContext = {
    docenteId: string;
    perfilId: string;
};

const DOCENTE_CONTEXT_ROUTE_PREFIXES = ["/perfil-docente", "/encuestas"] as const;

export function requiresDocenteContext(role: unknown): boolean {
    return normalizeRole(role) === ROLES.DOCENTE;
}

export function routeNeedsDocenteContext(pathname: string): boolean {
    return DOCENTE_CONTEXT_ROUTE_PREFIXES.some((prefix) => matchesPathPrefix(pathname, prefix));
}

export function hasCompleteDocenteContext(context: Partial<DocenteContext> | null | undefined): boolean {
    return Boolean(context?.docenteId && context?.perfilId);
}

export function requireDocenteContext({
    role,
    pathname,
    docenteId,
    perfilId,
}: {
    role: unknown;
    pathname: string;
    docenteId?: unknown;
    perfilId?: unknown;
}): boolean {
    if (!requiresDocenteContext(role)) return true;
    if (!routeNeedsDocenteContext(pathname)) return true;

    const dId = (typeof docenteId === "string" || typeof docenteId === "number") ? String(docenteId) : "";
    const pId = (typeof perfilId === "string" || typeof perfilId === "number") ? String(perfilId) : "";

    return hasCompleteDocenteContext({
        docenteId: dId,
        perfilId: pId,
    });
}
