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
    const normalizedPermissions = normalizePermissions(permissions).map((p) => p.trim().toLowerCase());
    return normalizedPermissions.includes(requiredPermission.trim().toLowerCase());
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

export function extractPermissionCodes(items: any[]): PermissionCode[] {
    if (!Array.isArray(items)) return [];
    
    return Array.from(
        new Set(
            items
                .map((item) => {
                    if (typeof item === "string") return item;
                    if (item?.permiso?.codigo) return item.permiso.codigo;
                    if (item?.descripcion) return item.descripcion;
                    if (item?.codigo) return item.codigo;
                    return "";
                })
                .filter((permission): permission is PermissionCode => typeof permission === "string" && Boolean(permission))
        )
    );
}
