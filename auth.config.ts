import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/',
    },
    providers: [],
    callbacks: {
        // Este callback intercepta cada petición gracias a proxy.ts
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')

            if (isOnDashboard) {
                if (isLoggedIn) {
                    return true
                }
                return false // Si no está logueado, redirige automáticamente a login
            } else if (isLoggedIn && nextUrl.pathname === '/') {
                // Si ya está logueado y entra al login, lo enviamos al dashboard
                return Response.redirect(new URL('/dashboard', nextUrl))
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.accessToken) {
                (session as any).accessToken = token.accessToken;
            }
            return session;
        }
    },
} satisfies NextAuthConfig;
