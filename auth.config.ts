import type { NextAuthConfig } from "next-auth";
import { getRequiredPermissionForPath, isProtectedPath } from "@/lib/access-control";
import { canAccessRoute, normalizeRole } from "@/lib/permissions";
import { requireDocenteContext } from "@/lib/role-context";
import { ROLES } from "@/lib/roles";

type AuthUserToken = {
    id?: string | number;
    email?: string | null;
    name?: string | null;
    rol?: string;
    permisos?: string[];
    docenteId?: string;
    perfilId?: string;
    accessToken?: string;
};

type AuthSessionUser = {
    id?: string;
    email?: string | null;
    name?: string | null;
    rol?: string;
    permisos?: string[];
    docenteId?: string;
    perfilId?: string;
};

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/",
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const pathname = nextUrl.pathname;
            const isLoggedIn = Boolean(auth?.user);

            if (isProtectedPath(pathname) && !isLoggedIn) {
                return false;
            }

            if (isLoggedIn) {
                const sessionUser = (auth?.user ?? null) as AuthSessionUser | null;
                const requiredPermission = getRequiredPermissionForPath(pathname);

                const hasAccess = canAccessRoute({
                    role: sessionUser?.rol,
                    permissions: sessionUser?.permisos ?? [],
                    requiredPermission,
                });

                if (!hasAccess) {
                    return Response.redirect(new URL("/dashboard?error=unauthorized", nextUrl));
                }

                const hasDocenteContext = requireDocenteContext({
                    role: sessionUser?.rol,
                    pathname,
                    docenteId: sessionUser?.docenteId,
                    perfilId: sessionUser?.perfilId,
                });

                if (!hasDocenteContext) {
                    return Response.redirect(new URL("/dashboard?error=missing-docente-context", nextUrl));
                }
            }

            if (isLoggedIn && pathname === "/") {
                const sessionUser = (auth?.user ?? null) as AuthSessionUser | null;
                const userRole = normalizeRole(sessionUser?.rol);

                if (userRole === ROLES.DOCENTE) {
                    return Response.redirect(new URL("/perfil-docente/mis-resultados", nextUrl));
                }
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                const authUser = user as AuthUserToken;

                token.accessToken = authUser.accessToken;
                token.rol = authUser.rol;
                token.permisos = authUser.permisos ?? [];
                token.docenteId = authUser.docenteId;
                token.perfilId = authUser.perfilId;
                token.user = {
                    id: authUser.id,
                    email: authUser.email,
                    name: authUser.name,
                    rol: authUser.rol,
                    permisos: authUser.permisos ?? [],
                    docenteId: authUser.docenteId,
                    perfilId: authUser.perfilId,
                };
            }
            return token;
        },
        async session({ session, token }) {
            const mutableSession = session as typeof session & {
                accessToken?: string;
                user: (typeof session.user) & {
                    id?: string;
                    rol?: string;
                    permisos?: string[];
                    docenteId?: string;
                    perfilId?: string;
                };
            };

            if (token?.accessToken) {
                mutableSession.accessToken = token.accessToken as string;
            }

            if (token?.user) {
                const tokenUser = token.user as AuthUserToken;

                if (tokenUser.id !== undefined) {
                    mutableSession.user.id = String(tokenUser.id);
                }
                if (tokenUser.email !== undefined && tokenUser.email !== null) {
                    mutableSession.user.email = tokenUser.email;
                }
                if (tokenUser.name !== undefined) {
                    mutableSession.user.name = tokenUser.name;
                }
            }

            if (token?.rol !== undefined) {
                mutableSession.user.rol = String(token.rol);
            }

            mutableSession.user.permisos = Array.isArray(token?.permisos)
                ? token.permisos.filter((permiso): permiso is string => typeof permiso === "string")
                : [];

            mutableSession.user.docenteId = typeof token?.docenteId === "string" ? token.docenteId : undefined;
            mutableSession.user.perfilId = typeof token?.perfilId === "string" ? token.perfilId : undefined;

            return session;
        },
    },
} satisfies NextAuthConfig;
