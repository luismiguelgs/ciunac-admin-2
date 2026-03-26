import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { extractPermissionCodes, isSuperAdminRole, normalizeRole } from "@/lib/permissions";

type LoginResponse = {
    access_token?: string;
    user?: Record<string, unknown>;
};

import RolPermisoService from "@/modules/usuarios/services/rol-permiso.service";
import { ROLES } from "./lib/roles";

async function fetchDocenteContext(userId: string, accessToken: string): Promise<{ docenteId: string; perfilId: string } | null> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) return null;

    try {
        const response = await fetch(`${apiUrl}/docentes/usuario/${encodeURIComponent(userId)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) return null;

        const payload = await response.json();
        const data = payload?.data ?? payload;

        if (data?.id && data.perfil?.id) {
            return {
                docenteId: String(data.id),
                perfilId: String(data.perfil.id),
            };
        }

        return null;
    } catch {
        return null;
    }
}

async function fetchRolePermissions(role: string, accessToken: string): Promise<string[]> {
    try {
        const list = await RolPermisoService.getByRol(role, accessToken);
        return extractPermissionCodes(list);
    } catch {
        return [];
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Contrasena", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials;
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                if (!apiUrl || typeof email !== "string" || typeof password !== "string") {
                    return null;
                }

                const res = await fetch(`${apiUrl}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!res.ok) return null;

                const response = (await res.json()) as LoginResponse;
                if (!response?.user || !response.access_token) return null;

                const role = normalizeRole(response.user.rol ?? response.user.role);
                if (!role) return null;

                const permitsPromise = isSuperAdminRole(role)
                    ? Promise.resolve([])
                    : fetchRolePermissions(role, response.access_token);

                const userId = String(response.user.id ?? response.user.userId ?? response.user.usuarioId ?? response.user.usuario_id ?? "");

                const contextPromise = normalizeRole(role) === ROLES.DOCENTE && userId
                    ? fetchDocenteContext(userId, response.access_token)
                    : Promise.resolve(null);

                const [permisos, context] = await Promise.all([permitsPromise, contextPromise]);

                return {
                    ...response.user,
                    id: userId,
                    accessToken: response.access_token,
                    rol: role,
                    permisos,
                    docenteId: context?.docenteId ?? undefined,
                    perfilId: context?.perfilId ?? undefined,
                };
            },
        }),
    ],
});
