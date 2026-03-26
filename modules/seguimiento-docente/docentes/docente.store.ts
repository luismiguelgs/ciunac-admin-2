import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface DocenteState {
    docenteId: string | null;
    perfilId: string | null;
    isLoaded: boolean;
    hydrated: boolean;
    setDocenteContext: (docenteId: string, perfilId: string) => void;
    clearDocenteContext: () => void;
    setHydrated: (val: boolean) => void;
}

export const useDocenteStore = create<DocenteState>()(
    persist(
        (set) => ({
            docenteId: null,
            perfilId: null,
            isLoaded: false,
            hydrated: false,
            setDocenteContext: (docenteId, perfilId) =>
                set({
                    docenteId,
                    perfilId,
                    isLoaded: true,
                }),
            clearDocenteContext: () =>
                set({
                    docenteId: null,
                    perfilId: null,
                    isLoaded: false,
                }),
            setHydrated: (val) => set({ hydrated: val }),
        }),
        {
            name: "docente-storage",
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
        }
    )
);
