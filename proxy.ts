import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);
export const proxy = auth;

// Opcional: Especificar en qué rutas debe NO correr el proxy para ahorrar recursos
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};