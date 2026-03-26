import { normalizeRole } from "@/lib/permissions";

export const ROLES = {
    SUPERADMIN: "SUPERADMIN",
    ADMINISTRATIVO: "ADMINISTRATIVO",
    DOCENTE: "DOCENTE",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

/**
 * Compara un rol contra un valor esperado, normalizando ambos.
 */
export function isRole(role: unknown, expected: RoleName): boolean {
    return normalizeRole(role) === expected;
}
