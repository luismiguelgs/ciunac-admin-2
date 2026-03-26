import { apiFetch, omit } from "@/services/api.service";

export default class UsuariosService {

    static collection = 'usuarios'

    static async fetchItems<T>(): Promise<T[]> {
        const data = await apiFetch<T[]>(this.collection, 'GET')
        return data
    }

    static async getItem<T>(id: number): Promise<T> {
        const data = await apiFetch<T>(`${this.collection}/${id}`, 'GET')
        return data
    }

    static async updateItem<T extends { id?: number, isNew?: boolean }>(
        item: T
    ): Promise<Omit<T, 'isNew' | 'id'>> {
        const { id } = item
        const rest = omit(item, ['isNew', 'id']);

        const data = await apiFetch<Omit<T, 'isNew' | 'id'>>(`${this.collection}/${id}`, 'PATCH', rest);
        return data;
    }

    static async newItem<T extends Record<string, any>>(
        item: T
    ): Promise<any> {
        const rest = omit(item, ['isNew', 'id']);
        const data = await apiFetch<Omit<T, 'isNew' | 'id'>>('auth/register', 'POST', rest)
        return data
    }

    static async deleteItem(id: number): Promise<void> {
        const data = await apiFetch<void>(`${this.collection}/${id}`, 'DELETE')
        return data
    }
}