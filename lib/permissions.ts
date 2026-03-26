import { ROLES } from "@/lib/roles";
import type { PermissionCode } from "@/lib/access-control";

export function normalizeRole(role: unknown): string {
    if (typeof role !== "string") return "";
    return role.toUpperCase().replace(/[\s_-]/g, "");
}

export function isSuperAdminRole(role: unknown): boolean {
    return normalizeRole(role) === ROLES.SUPERADMIN;
}

export function normalizePermissions(permissions: unknown): PermissionCode[] {
    if (!Array.isArray(permissions)) return [];
    return permissions.filter((permission): permission is PermissionCode => typeof permission === "string" && Boolean(permission));
}

export function hasPermission(permissions: unknown, requiredPermission?: PermissionCode): boolean {
    if (!requiredPermission) return true;
    const normalizedPermissions = normalizePermissions(permissions);
    return normalizedPermissions.includes(requiredPermission);
}

export function canAccessRoute({
    role,
    permissions,
    requiredPermission,
}: {
    role: unknown;
    permissions: unknown;
    requiredPermission?: PermissionCode;
}): boolean {
    if (!requiredPermission) return true;
    if (isSuperAdminRole(role)) return true;
    return hasPermission(permissions, requiredPermission);
}

export function extractPermissionCodes(items: Array<{ permiso?: { codigo?: string }; descripcion?: string }>): PermissionCode[] {
    return Array.from(
        new Set(
            items
                .map((item) => item.permiso?.codigo || item.descripcion || "")
                .filter((permission): permission is PermissionCode => Boolean(permission))
        )
    );
}
