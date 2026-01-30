import { apiFetch } from '@/lib/api.service';
import { IDocente } from './docente.interface';

export default class DocentesService {

    private static collection = 'docentes'

    static async fetchItems(): Promise<IDocente[]> {
        const data = await apiFetch<IDocente[]>(this.collection, 'GET')
        return data
    }

    public static async getItem(id: string): Promise<IDocente> {
        const data = await apiFetch<IDocente>(`${this.collection}/${id}`, 'GET')
        return data
    }

    public static async newItem(item: IDocente): Promise<IDocente> {
        const data = await apiFetch<IDocente>(this.collection, 'POST', item)
        return data
    }

    public static async updateItem(item: IDocente): Promise<IDocente> {
        const { id, ...rest } = item
        const data = await apiFetch<IDocente>(`${this.collection}/${id}`, 'PATCH', rest)
        return data
    }

    public static async deleteItem(id: string | undefined): Promise<void> {
        const data = await apiFetch<void>(`${this.collection}/${id}`, 'DELETE')
        return data
    }
}