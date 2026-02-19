import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Collection } from '@/modules/seguimiento-docente/opciones/perfil-opciones.service'

interface PerfilOpcionesState {
    data: Record<string, any[]>
    setData: (collection: Collection, items: any[]) => void
    clearData: (collection?: Collection) => void
}

export const usePerfilOpcionesStore = create<PerfilOpcionesState>()(
    persist(
        (set) => ({
            data: {},
            setData: (collection, items) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        [collection]: items
                    }
                })),
            clearData: (collection) =>
                set((state) => {
                    if (collection) {
                        const newData = { ...state.data }
                        delete newData[collection]
                        return { data: newData }
                    }
                    return { data: {} }
                }),
        }),
        {
            name: 'perfil-opciones-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
