import "next-auth";
import "next-auth/jwt";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: DefaultSession["user"] & {
            id?: string;
            rol?: string;
            permisos?: string[];
            docenteId?: string;
            perfilId?: string;
        };
    }

    interface User extends DefaultUser {
        id?: string | number;
        rol?: string;
        permisos?: string[];
        docenteId?: string;
        perfilId?: string;
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        rol?: string;
        permisos?: string[];
        docenteId?: string;
        perfilId?: string;
        user?: {
            id?: string | number;
            email?: string | null;
            name?: string | null;
            rol?: string;
            permisos?: string[];
            docenteId?: string;
            perfilId?: string;
        };
    }
}
