import { apiFetch } from "@/services/api.service";

// Interfaz mínima para que el update funcione (necesita saber que hay un ID)
interface IEntity {
    id?: number | undefined;
}

export abstract class BaseService {
    // Definimos la propiedad, pero debe ser sobreescrita por el hijo
    protected static collection: string;

    static async fetchItems<T>(): Promise<T[]> {
        return await apiFetch<T[]>(this.collection, 'GET');
    }

    static async getItem<T>(id: number): Promise<T> {
        return await apiFetch<T>(`${this.collection}/${id}`, 'GET');
    }

    static async updateItem<T extends IEntity>(item: T): Promise<T> {
        const { id, ...rest } = item; // TypeScript sabe que id existe por la interfaz IEntity
        return await apiFetch<T>(`${this.collection}/${id}`, 'PATCH', rest);
    }

    static async deleteItem(id: number): Promise<void> {
        return await apiFetch<void>(`${this.collection}/${id}`, 'DELETE');
    }

    static async newItem<T>(item: Partial<T>): Promise<T> {
        return await apiFetch<T>(this.collection, 'POST', item);
    }
}