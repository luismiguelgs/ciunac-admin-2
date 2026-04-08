import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthUser = {
    id?: string | number;
    rol?: string;
    permisos?: string[];
} & Record<string, unknown>;

interface AuthState {
    user: AuthUser | null;
    permisos: string[];
    hydrated: boolean;
    setAuthData: (user: AuthUser, permisos: string[]) => void;
    clearAuthData: () => void;
    setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            permisos: [],
            hydrated: false,
            setAuthData: (user, permisos) =>
                set({
                    user,
                    permisos,
                }),
            clearAuthData: () =>
                set({
                    user: null,
                    permisos: [],
                }),
            setHydrated: (hydrated) =>
                set({
                    hydrated,
                }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
        }
    )
);
