import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Collection } from '@/modules/estructura/services/opciones.service'

interface OpcionesState {
    data: Record<string, any[]>
    setData: (collection: Collection, items: any[]) => void
    clearData: (collection?: Collection) => void
}

export const useOpcionesStore = create<OpcionesState>()(
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
            name: 'opciones-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
