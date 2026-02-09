import { apiFetch, omit } from '@/services/api.service'

export enum Collection {
    Tiposolicitud = 'tipossolicitud',
    Facultades = 'facultades',
    Idiomas = 'idiomas',
    Salones = 'aulas',
    Escuelas = 'escuelas',
    Modulos = 'modulos',
    Ciclos = 'ciclos',
    Niveles = 'niveles'
}

export default class OpcionesService {
    static async fetchItems<T>(collection: string): Promise<T[]> {
        const data = await apiFetch<T[]>(collection, 'GET')
        return data
    }

    static async getItem<T>(collection: string, id: number): Promise<T> {
        const data = await apiFetch<T>(`${collection}/${id}`, 'GET')
        return data
    }

    static async updateItem<T extends { id?: number, isNew?: boolean }>(
        collection: string,
        item: T
    ): Promise<Omit<T, 'isNew' | 'id'>> {
        console.log(item)
        const { id } = item
        const rest = omit(item, ['isNew', 'id']);

        const data = await apiFetch<Omit<T, 'isNew' | 'id'>>(`${collection}/${id}`, 'PATCH', rest);
        return data;
    }

    static async newItem<T extends { id?: number, isNew?: boolean }>(
        collection: string,
        item: T
    ): Promise<Omit<T, 'isNew' | 'id'>> {
        const rest = omit(item, ['isNew', 'id']);
        const data = await apiFetch<Omit<T, 'isNew' | 'id'>>(collection, 'POST', rest)
        return data
    }

    static async deleteItem(collection: string, id: number): Promise<void> {
        const data = await apiFetch<void>(`${collection}/${id}`, 'DELETE')
        return data
    }

    static async getVisibleItems<T>(collection: string): Promise<T[]> {
        const data = await apiFetch<T[]>(`${collection}/visibles`, 'GET')
        return data
    }
}


